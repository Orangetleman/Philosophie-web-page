"""
mailbox_client.py — petit client HTTP de la boîte aux lettres en ligne.

Le cerveau local parle à la boîte (déployée sur PythonAnywhere) via deux
routes protégées par le secret partagé :
  - GET  /api/pull  : récupérer les propositions pas encore traitées ;
  - POST /api/ack   : confirmer la réception (la boîte les marque alors
                      « récupérées » et ne les renverra plus).

On utilise `urllib` de la bibliothèque standard plutôt que la dépendance
`requests` : nos besoins sont simples (un GET, un POST JSON), et garder
zéro dépendance pour cette partie rend l'installation plus légère.

L'URL de la boîte et le secret sont lus dans le `.env` local (jamais en
dur, jamais sur Git) via le module `localenv`.
"""

import json
import urllib.request
import urllib.error
import urllib.parse

import localenv


# Délai maxi (secondes) d'attente d'une réponse de la boîte. PythonAnywhere
# en offre gratuite peut être lent à « se réveiller » : on laisse 30 s.
TIMEOUT_S = 30


def _base_url():
    """URL de la boîte sans le « / » final (pour concaténer les routes)."""
    return localenv.require("MAILBOX_URL").rstrip("/")


def _headers(extra=None):
    """En-têtes communs : le secret partagé, plus d'éventuels ajouts."""
    h = {"X-Mailbox-Secret": localenv.require("MAILBOX_SECRET")}
    if extra:
        h.update(extra)
    return h


def _read_json(req):
    """
    Exécute la requête `req` et renvoie le JSON de la réponse (dico).

    Traduit les erreurs réseau / HTTP en messages clairs en français :
      - 401  → secret refusé (le plus probable si on s'est trompé) ;
      - autre code HTTP → on remonte le code et le corps ;
      - pas de réseau / DNS → message explicite.
    """
    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT_S) as resp:
            payload = json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        if e.code == 401:
            raise SystemExit(
                "Secret refusé par la boîte (401). Vérifie que "
                "MAILBOX_SECRET dans .env correspond EXACTEMENT à celui "
                "posé dans le fichier WSGI sur PythonAnywhere."
            )
        body = e.read().decode("utf-8", errors="replace")
        raise SystemExit(f"Erreur HTTP {e.code} de la boîte : {body}")
    except urllib.error.URLError as e:
        raise SystemExit(
            f"Impossible de joindre la boîte ({_base_url()}). "
            f"Connexion internet ? URL correcte ? Détail : {e.reason}"
        )
    if not payload.get("ok"):
        raise SystemExit(f"La boîte a répondu une erreur : {payload}")
    return payload


def pull(limit=200):
    """
    Récupère jusqu'à `limit` propositions non encore traitées.

    Renvoie la liste des items, chacun étant un dico
    {id, received_at, remote_ip, body} (`id` = identifiant CÔTÉ BOÎTE,
    nécessaire pour l'`ack` qui suivra ; à ne pas confondre avec l'id de
    submission/boîte côté base locale).
    """
    q = urllib.parse.urlencode({"limit": int(limit)})
    req = urllib.request.Request(
        f"{_base_url()}/api/pull?{q}",
        headers=_headers(),
        method="GET",
    )
    return _read_json(req).get("items", [])


def ack(ids):
    """
    Confirme la réception des items dont les ids (CÔTÉ BOÎTE) sont donnés.
    La boîte les marque « récupérés » : ils ne reviendront plus au pull.

    Renvoie le nombre d'items effectivement marqués. Si `ids` est vide,
    on n'appelle même pas le réseau (rien à confirmer).
    """
    ids = [i for i in (ids or [])]
    if not ids:
        return 0
    body = json.dumps({"ids": ids}).encode("utf-8")
    req = urllib.request.Request(
        f"{_base_url()}/api/ack",
        data=body,
        headers=_headers({"Content-Type": "application/json"}),
        method="POST",
    )
    return _read_json(req).get("acked", 0)
