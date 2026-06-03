"""
supabase_client.py — client HTTP de la base de comptes Supabase.

Depuis la « phase 4 », les visiteurs CONNECTÉS n'envoient plus leur
proposition vers la boîte aux lettres PythonAnywhere : elle est écrite
directement dans la table `contributions` de Supabase, rattachée à leur
compte. Ce module est le pendant local de `mailbox_client.py` : il permet
au cerveau local (sur ton PC) de :

  - LIRE les contributions au statut « en_attente » (pull) ;
  - ÉCRIRE en retour le statut + une explication (set_status), pour que le
    contributeur voie l'avancement de sa proposition dans « Mes propositions ».

Supabase expose une API REST automatique appelée **PostgREST** : chaque
table devient une URL sous `/rest/v1/<table>`, et on filtre/trie via des
paramètres d'URL (ex. `?statut=eq.en_attente`). Pas de SQL à écrire côté
client : on parle HTTP.

Deux clés existent côté Supabase :
  - la clé **publishable / anon** : publique, posée dans le site (le
    navigateur la voit) ; elle ne peut faire QUE ce que les règles RLS
    autorisent (un visiteur ne lit que SES lignes).
  - la clé **service_role** : TOUTE-PUISSANTE, elle ignore le RLS et peut
    tout lire / tout modifier. Elle ne doit JAMAIS quitter ton PC :
    surtout pas dans le site, pas sur GitHub. On la range dans le `.env`
    local (ignoré par Git), exactement comme le secret de la boîte.

Comme `mailbox_client`, on n'utilise que `urllib` (bibliothèque standard) :
nos besoins sont un GET et un PATCH JSON, pas besoin d'une dépendance.
"""

import json
import urllib.request
import urllib.error
import urllib.parse
from datetime import datetime, timezone

import localenv


# Délai maxi (secondes) d'attente d'une réponse de Supabase.
TIMEOUT_S = 30

# Nom de la table côté Supabase.
TABLE = "contributions"


# ── Correspondance des statuts (local ↔ Supabase) ────────────────────────
# Le cerveau local manipule des statuts PAR BOÎTE (db.STATUSES). La table
# Supabase, elle, porte un statut PAR CONTRIBUTION, avec un vocabulaire
# pensé pour le contributeur (ce qu'il lit dans « Mes propositions ») :
#   en_attente        — reçue, pas encore triée.
#   validee_en_cours  — retenue, en cours d'intégration au site.
#   validee_integree  — effectivement intégrée au site.
#   refusee           — écartée (hors-sujet, doublon, erreur…).
#
# On traduit le statut local en statut « contributeur ». 'archivee' n'a pas
# d'équivalent visible : on le laisse de côté (None = ne rien pousser).
LOCAL_TO_REMOTE = {
    "en_attente": "en_attente",
    "validee": "validee_en_cours",
    "integree": "validee_integree",
    "rejetee": "refusee",
    "archivee": None,
}


def remote_status_for(local_status):
    """
    Renvoie le statut Supabase correspondant à un statut local, ou None si
    ce statut local ne doit pas être publié (cas 'archivee', ou inconnu).
    """
    return LOCAL_TO_REMOTE.get(local_status)


# Inverse de LOCAL_TO_REMOTE — sert à la SYNCHRO (cloud → local) pour les
# contributions SANS `aggregator_state` (legacy, triées avant cette phase) :
# on retombe alors sur le statut « contributeur » pour deviner un statut local
# de repli, appliqué à toutes les boîtes de la contribution.
REMOTE_TO_LOCAL = {
    "en_attente": "en_attente",
    "validee_en_cours": "validee",
    "validee_integree": "integree",
    "refusee": "rejetee",
}


def local_status_for_remote(remote_status):
    """Statut local de repli pour un statut « contributeur », ou None."""
    return REMOTE_TO_LOCAL.get(remote_status)


def _base_url():
    """URL REST de Supabase sans « / » final (pour concaténer les routes)."""
    return localenv.require("SUPABASE_URL").rstrip("/") + "/rest/v1"


def _headers(extra=None):
    """
    En-têtes communs à tous les appels Supabase.

    PostgREST réclame DEUX en-têtes d'authentification (historiquement
    distincts) : `apikey` et `Authorization: Bearer …`. On y met la même
    clé service_role dans les deux.
    """
    key = localenv.require("SUPABASE_SERVICE_KEY")
    h = {
        "apikey": key,
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
    }
    if extra:
        h.update(extra)
    return h


def _read(req):
    """
    Exécute la requête `req` et renvoie (code_http, corps_décodé).

    Traduit les erreurs réseau / HTTP en messages clairs en français,
    comme `mailbox_client._read_json` :
      - 401/403 → clé refusée (mauvaise service_role, ou RLS) ;
      - autre code → on remonte le code et le corps ;
      - pas de réseau / DNS → message explicite.

    On renvoie le corps texte tel quel : l'appelant décide s'il faut le
    parser en JSON (un PATCH « return=minimal » répond un corps vide).
    """
    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT_S) as resp:
            return resp.status, resp.read().decode("utf-8")
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")
        if e.code in (401, 403):
            raise SystemExit(
                "Supabase a refusé la clé (HTTP %d). Vérifie que "
                "SUPABASE_SERVICE_KEY dans .env est bien la clé "
                "« service_role » (et pas la clé publique). Détail : %s"
                % (e.code, body)
            )
        raise SystemExit(f"Erreur HTTP {e.code} de Supabase : {body}")
    except urllib.error.URLError as e:
        raise SystemExit(
            f"Impossible de joindre Supabase ({_base_url()}). "
            f"Connexion internet ? SUPABASE_URL correcte ? Détail : {e.reason}"
        )


def pull_pending(limit=200):
    """
    Récupère les contributions au statut « en_attente », des plus anciennes
    aux plus récentes (pour traiter dans l'ordre d'arrivée).

    Renvoie une liste de dicos, chacun :
        {id, user_id, payload, created_at}
    où `payload` est l'objet JSON de la proposition (schéma
    `philo-proposal/v3`, le même que les .txt). `id` est l'UUID de la
    contribution CÔTÉ SUPABASE — c'est lui qu'on stockera en base locale
    (colonne submissions.remote_id) pour pouvoir écrire le statut en retour.

    Contrairement à la boîte PythonAnywhere, on ne « consomme » rien ici :
    la ligne reste « en_attente » côté Supabase tant que le mainteneur n'a
    pas tranché. Le pull est donc rejouable sans risque — la base locale
    dédoublonne sur `remote_id` (voir pipeline.pull_cloud_and_ingest).
    """
    params = urllib.parse.urlencode({
        "statut": "eq.en_attente",
        "select": "id,user_id,payload,created_at",
        "order": "created_at.asc",
        "limit": int(limit),
    })
    req = urllib.request.Request(
        f"{_base_url()}/{TABLE}?{params}",
        headers=_headers(),
        method="GET",
    )
    _, body = _read(req)
    return json.loads(body)


def pull_all(limit=1000):
    """
    Récupère TOUTES les contributions (quel que soit leur statut), des plus
    anciennes aux plus récentes, avec en plus l'état de travail miroité
    (`aggregator_state`, `aggregator_updated_at`). Sert à la SYNCHRO
    cross-plateforme : sur une autre machine (ou après réinstallation), on
    reconstruit le tableau de bord complet — y compris les contributions
    déjà triées ailleurs (que `pull_pending`, filtré sur « en_attente »,
    ne renvoie jamais).

    Renvoie une liste de dicos :
        {id, user_id, payload, statut, created_at,
         aggregator_state, aggregator_updated_at}
    `aggregator_state` est l'objet JSON (ou None si jamais poussé).
    """
    params = urllib.parse.urlencode({
        "select": ("id,user_id,payload,statut,created_at,"
                   "aggregator_state,aggregator_updated_at"),
        "order": "created_at.asc",
        "limit": int(limit),
    })
    req = urllib.request.Request(
        f"{_base_url()}/{TABLE}?{params}",
        headers=_headers(),
        method="GET",
    )
    _, body = _read(req)
    return json.loads(body)


def set_aggregator_state(contrib_id, state_obj, updated_at):
    """
    Pousse vers Supabase l'état de travail complet d'UNE contribution
    (colonne `aggregator_state` JSONB) + l'horodatage `aggregator_updated_at`.
    C'est le miroir en ligne du SQLite local : il rend l'état consultable et
    récupérable depuis n'importe quelle machine.

    ⚠ Les colonnes doivent exister côté Supabase (migration à lancer UNE fois
    dans l'éditeur SQL — voir migrations/2026_aggregator_state.sql) :
        ALTER TABLE contributions ADD COLUMN aggregator_state jsonb;
        ALTER TABLE contributions ADD COLUMN aggregator_updated_at timestamptz;
    et, pour ne pas exposer les notes internes aux contributeurs :
        REVOKE SELECT (aggregator_state) ON contributions FROM anon, authenticated;

    Renvoie True si l'écriture a réussi (200/204).
    """
    payload = {
        "aggregator_state": state_obj,          # sérialisé en JSON par json.dumps
        "aggregator_updated_at": updated_at,
    }
    params = urllib.parse.urlencode({"id": f"eq.{contrib_id}"})
    req = urllib.request.Request(
        f"{_base_url()}/{TABLE}?{params}",
        data=json.dumps(payload).encode("utf-8"),
        headers=_headers({"Prefer": "return=minimal"}),
        method="PATCH",
    )
    code, _ = _read(req)
    return code in (200, 204)


def set_status(contrib_id, statut, explication=None, avis_ia=None):
    """
    Écrit en retour le statut (et, facultativement, une explication et/ou
    l'avis IA) d'UNE contribution identifiée par son UUID Supabase.

    `statut` doit être l'une des valeurs du vocabulaire « contributeur »
    (cf. LOCAL_TO_REMOTE / l'enum côté Supabase). On met aussi à jour
    `updated_at` pour que le tri « plus récent » côté site reflète l'action.

    Deux champs texte DISTINCTS sont renvoyés au contributeur :
      - `explication` : le mot du RELECTEUR (humain) ;
      - `avis_ia`     : l'appréciation AUTOMATIQUE (Gemini), reformulée pour
                        l'usager, affichée à part côté site (étiquetée « IA »).
    Chacun n'est écrit que si on le fournit (None = ne pas toucher au champ
    existant), pour ne pas écraser par mégarde une valeur déjà en place.

    ⚠ La colonne `avis_ia` doit exister côté Supabase. Si elle manque, ajoute-la
    une fois pour toutes dans l'éditeur SQL Supabase :
        ALTER TABLE contributions ADD COLUMN avis_ia text;

    PATCH = mise à jour partielle (on n'envoie que les champs à changer).
    Le filtre `?id=eq.<uuid>` cible la seule ligne concernée. L'en-tête
    `Prefer: return=minimal` demande à Supabase de ne rien renvoyer (204) :
    inutile de rapatrier la ligne entière, on veut juste écrire.

    Renvoie True si l'écriture a réussi.
    """
    now = datetime.now(timezone.utc).isoformat(timespec="seconds")
    payload = {"statut": statut, "updated_at": now}
    # On n'écrase un champ texte que si on en fournit une valeur (None = ne
    # pas toucher au champ existant côté Supabase).
    if explication is not None:
        payload["explication"] = explication
    if avis_ia is not None:
        payload["avis_ia"] = avis_ia

    params = urllib.parse.urlencode({"id": f"eq.{contrib_id}"})
    req = urllib.request.Request(
        f"{_base_url()}/{TABLE}?{params}",
        data=json.dumps(payload).encode("utf-8"),
        headers=_headers({"Prefer": "return=minimal"}),
        method="PATCH",
    )
    code, _ = _read(req)
    return code in (200, 204)
