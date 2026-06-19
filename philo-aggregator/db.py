"""
db.py — couche d'accès à la base SQLite `proposals.db`.

Tout le code qui parle à la base passe par ce module. Si on doit changer
le schéma (ajouter une colonne, un index…), c'est ici et nulle part ailleurs.

La base contient deux tables :
  - submissions : une ligne par fichier .txt ingéré
  - boxes       : une ligne par boîte (une soumission peut contenir
                  plusieurs boîtes ; chacune a son propre statut)
"""

import sqlite3
import pathlib
from datetime import datetime, timezone


# Le dossier où ce fichier db.py se trouve. `__file__` est le chemin du
# script en cours d'exécution ; on remonte au dossier parent. Tout le
# reste du projet est résolu relativement à ce dossier, comme ça le
# programme marche peu importe d'où on le lance.
SCRIPT_DIR = pathlib.Path(__file__).resolve().parent
DB_PATH = SCRIPT_DIR / "proposals.db"


# Les cinq statuts possibles d'une boîte. Stockés en TEXT dans SQLite
# (SQLite n'a pas de type ENUM ; on contrôle côté Python).
#   en_attente : fraîchement ingérée, pas encore triée.
#   validee    : retenue par le mainteneur dans le dashboard — prête à être
#                recopiée plus tard dans data.js (étape manuelle, à part).
#   integree   : effectivement intégrée à data.js (fin du parcours).
#   rejetee    : écartée (hors-sujet, fausse, spam…).
#   archivee   : mise de côté, candidate à la purge.
STATUSES = ("en_attente", "validee", "integree", "rejetee", "archivee")


# Catégories principales (niveau 1 du menu, schéma v3).
# 'site' : retours sur l'outil lui-même (bug / fonctionnalité), pas sur le
# contenu philosophique. Ces boîtes ne sont PAS destinées à data.js.
CATEGORIES = ("notion", "auteur", "concept", "site")

# Les sous-cibles possibles (box.cible), telles que définies par le site.
# v3 a introduit le menu à 2 niveaux : la plupart des cibles existaient déjà
# (rétro-compat v1/v2), on y a ajouté les sous-cibles auteur (citation /
# dialogue / bio) et concept (relation). 'axe' reste pour les anciens .txt.
# site-bug / site-fonction : retours sur le site (ajout ultérieur).
CIBLES = (
    "notion", "texte", "plan", "axe", "exemple", "accroche", "dissertation",
    "auteur", "auteur-citation", "auteur-dialogue", "auteur-bio",
    "concept", "concept-relation",
    "site-bug", "site-fonction",
)

# Cibles « retour sur le site » : ni du contenu philosophique, ni destinées
# à data.js. Elles sont exclues de la relecture Gemini (rien à corriger) —
# cf. get_unreviewed_boxes et review.py.
SITE_CIBLES = ("site-bug", "site-fonction")

# Catégorie (niveau 1 du menu de proposition du site) déduite de la cible
# (niveau 2). Sert au FILTRAGE groupé du dashboard et du triage mobile, calqué
# sur le formulaire de proposition (Catégorie → cible).
CATEGORIES = ("notion", "auteur", "concept", "site")
CIBLE_CAT = {
    "notion": "notion", "texte": "notion", "plan": "notion", "axe": "notion",
    "exemple": "notion", "accroche": "notion", "dissertation": "notion",
    "auteur": "auteur", "auteur-citation": "auteur",
    "auteur-dialogue": "auteur", "auteur-bio": "auteur",
    "concept": "concept", "concept-relation": "concept",
    "site-bug": "site", "site-fonction": "site",
}


def cible_cat(cible):
    """Catégorie (niveau 1) d'une cible, ou 'notion' par défaut (rétro-compat)."""
    return CIBLE_CAT.get(cible, "notion")

# Les trois types de boîte.
TYPES = ("ajout", "correction", "remarque")


# Verdicts possibles de la pré-vérification par IA (Gemini), stockés dans
# la colonne boxes.ai_verdict. None (NULL) = pas encore vérifiée par l'IA.
#   valide  : l'IA n'a rien relevé de bloquant.
#   douteux : à regarder de près (erreur factuelle possible, doublon, flou).
#   rejet   : manifestement hors-sujet / faux / spam.
AI_VERDICTS = ("valide", "douteux", "rejet")

# Statuts « encore dans le pipeline » sur lesquels une relecture IA a du sens :
# « en attente » (pas encore triée) ET « validée » (retenue mais pas encore
# intégrée). On EXCLUT « integree » (déjà au site), « rejetee » et « archivee »
# (mises de côté) : inutile d'y dépenser le quota Gemini. Sert au bouton
# « Relire » du dashboard, qui passe status=None à get_unreviewed_boxes pour
# rattraper aussi les boîtes arrivées déjà « validée » (sync cross-plateforme,
# sans passer par « en attente »).
REVIEWABLE_STATUSES = ("en_attente", "validee")


# Schéma SQL exécuté à chaque démarrage. Les `IF NOT EXISTS` rendent
# l'opération idempotente : si les tables existent déjà, rien ne change.
SCHEMA = """
CREATE TABLE IF NOT EXISTS submissions (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    received_at     TEXT NOT NULL,
    contributor     TEXT NOT NULL,
    source_file     TEXT NOT NULL,
    raw_text        TEXT NOT NULL,
    raw_json        TEXT NOT NULL,
    ingested_at     TEXT NOT NULL,
    -- UUID de la contribution côté Supabase (phase 4). NULL pour les
    -- soumissions venues d'un .txt ou de la boîte PythonAnywhere : elles
    -- n'ont pas de pendant en ligne où renvoyer le statut. Ajoutée par
    -- migration sur les bases déjà créées (voir _migrate_submissions).
    remote_id       TEXT
);

CREATE TABLE IF NOT EXISTS boxes (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    submission_id       INTEGER NOT NULL
                        REFERENCES submissions(id) ON DELETE CASCADE,
    position            INTEGER NOT NULL,
    type                TEXT NOT NULL,
    cible               TEXT NOT NULL,
    notion              TEXT,
    extra_notions       TEXT,
    key_term            TEXT,
    fields_json         TEXT NOT NULL,
    signature           TEXT NOT NULL,
    status              TEXT NOT NULL DEFAULT 'en_attente',
    status_changed_at   TEXT,
    note                TEXT,
    -- Pré-vérification IA. Ajoutées par migration sur les bases déjà
    -- créées (voir _migrate_boxes) ; NULL tant que la boîte n'a pas été
    -- vérifiée par l'IA.
    --   ai_verdict      : valide / douteux / rejet (aide au tri, mainteneur).
    --   ai_review       : explication DESTINÉE AU MAINTENEUR (peut contenir
    --                     du jargon : « doublon probable », « à vérifier »…).
    --   ai_user_message : reformulation DESTINÉE AU CONTRIBUTEUR (usager, pas
    --                     dev) — renvoyée telle quelle dans « Mes propositions »
    --                     via le champ `explication` (cf. dashboard/pipeline).
    ai_verdict          TEXT,
    ai_review           TEXT,
    ai_reviewed_at      TEXT,
    ai_user_message     TEXT
);

CREATE INDEX IF NOT EXISTS idx_boxes_status
    ON boxes(status);
CREATE INDEX IF NOT EXISTS idx_boxes_cible_notion
    ON boxes(cible, notion);
CREATE INDEX IF NOT EXISTS idx_boxes_signature
    ON boxes(signature);
"""


# Index UNIQUE partiel créé À PART (après les migrations de colonnes) : sur
# une base ancienne, la colonne `remote_id` n'existe qu'une fois la
# migration passée, donc on ne peut poser cet index qu'ensuite — pas dans
# le SCHEMA ci-dessus. Deux soumissions ne peuvent pas partager le même
# remote_id (on n'ingère donc qu'une fois chaque contribution Supabase,
# même si on relance le pull). Le « WHERE remote_id IS NOT NULL » rend
# l'index PARTIEL : les NULL (soumissions locales sans pendant en ligne)
# échappent à la contrainte d'unicité — on peut en avoir autant qu'on veut.
REMOTE_INDEX_SQL = (
    "CREATE UNIQUE INDEX IF NOT EXISTS idx_submissions_remote "
    "ON submissions(remote_id) WHERE remote_id IS NOT NULL"
)


def connect():
    """
    Ouvre une connexion à la base. À utiliser dans un bloc `with` :

        with db.connect() as conn:
            conn.execute("...")

    Le `with` ferme la connexion proprement à la fin (et commit/rollback
    automatiquement selon qu'une exception est levée ou non). C'est le
    « context manager » de Python — l'équivalent du try/finally.

    `row_factory = sqlite3.Row` permet d'accéder aux colonnes par nom
    (`row["notion"]`) au lieu de par index (`row[3]`), beaucoup plus
    lisible quand on a beaucoup de colonnes.
    """
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    # `PRAGMA foreign_keys = ON` active la vérification des clés
    # étrangères. SQLite la désactive par défaut pour des raisons
    # historiques ; on la veut active pour que `ON DELETE CASCADE`
    # marche (si on supprime une submission, ses boxes disparaissent).
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


# Colonnes ajoutées après coup à la table `boxes` (pré-vérification IA).
# On les liste ici pour pouvoir migrer les bases déjà créées : un
# CREATE TABLE IF NOT EXISTS ne modifie pas une table existante, donc on
# ajoute les colonnes manquantes à la main (voir _migrate_boxes).
_BOXES_ADDED_COLUMNS = (
    ("ai_verdict", "TEXT"),
    ("ai_review", "TEXT"),
    ("ai_reviewed_at", "TEXT"),
    # Message reformulé pour le contributeur (usager) — ajouté après les
    # colonnes IA initiales ; NULL sur les bases déjà relues avant cet ajout.
    ("ai_user_message", "TEXT"),
)


def _migrate_boxes(conn):
    """
    Ajoute à `boxes` les colonnes manquantes — idempotent.

    SQLite ne connaît pas « ADD COLUMN IF NOT EXISTS » : on lit donc les
    colonnes existantes via `PRAGMA table_info(boxes)` (qui renvoie une
    ligne par colonne, avec son nom dans le champ `name`), et on n'ALTER
    que ce qui manque. Sans valeur par défaut, les lignes déjà présentes
    auront NULL sur ces colonnes — c'est exactement « pas encore vérifié
    par l'IA ».
    """
    existing = {row["name"] for row in conn.execute("PRAGMA table_info(boxes)")}
    for col, col_type in _BOXES_ADDED_COLUMNS:
        if col not in existing:
            conn.execute(f"ALTER TABLE boxes ADD COLUMN {col} {col_type}")


# Colonnes ajoutées après coup à la table `submissions` (lien Supabase,
# phase 4). Même logique que _BOXES_ADDED_COLUMNS.
#   remote_id        : UUID de la contribution Supabase (phase 4).
#   state_updated_at : horodatage de la DERNIÈRE modification de l'état de
#                      travail de la soumission (statut/note/IA d'une de ses
#                      boîtes). Sert à la SYNCHRO CROSS-PLATEFORME (phase 6) :
#                      on le compare à `aggregator_updated_at` côté Supabase
#                      pour savoir qui, du local ou du cloud, est le plus
#                      récent. NULL = jamais modifié localement (le cloud
#                      l'emporte alors d'office).
_SUBMISSIONS_ADDED_COLUMNS = (
    ("remote_id", "TEXT"),
    ("state_updated_at", "TEXT"),
)


def _migrate_submissions(conn):
    """
    Ajoute à `submissions` les colonnes manquantes — idempotent.
    Même technique que `_migrate_boxes` (PRAGMA table_info + ALTER ciblé).
    """
    existing = {row["name"] for row in conn.execute("PRAGMA table_info(submissions)")}
    for col, col_type in _SUBMISSIONS_ADDED_COLUMNS:
        if col not in existing:
            conn.execute(f"ALTER TABLE submissions ADD COLUMN {col} {col_type}")


def init_db():
    """
    Crée les tables et index si besoin, puis applique les migrations de
    colonnes (idempotent). Sûr à appeler à chaque démarrage.
    """
    with connect() as conn:
        # 1) Créer les tables et index « simples » (idempotent).
        conn.executescript(SCHEMA)
        # 2) Migrer les bases anciennes : ajouter les colonnes manquantes.
        _migrate_submissions(conn)  # ajoute remote_id (lien Supabase)
        _migrate_boxes(conn)        # ajoute les colonnes IA
        # 3) Une fois remote_id garantie présente, poser son index unique.
        conn.execute(REMOTE_INDEX_SQL)


def now_iso():
    """
    Horodatage UTC au format ISO 8601, ex : '2026-05-20T14:32:11+00:00'.
    UTC plutôt que l'heure locale pour qu'il n'y ait aucune ambiguïté
    sur les dates stockées en base.
    """
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


# ────────── Insertion ──────────

def insert_submission(conn, received_at, contributor, source_file,
                      raw_text, raw_json, remote_id=None):
    """
    Insère une soumission et renvoie son id.

    `remote_id` (facultatif) est l'UUID de la contribution côté Supabase,
    pour les soumissions venues du pull en ligne (phase 4). NULL pour les
    .txt et la boîte PythonAnywhere : aucun pendant en ligne à mettre à jour.

    `conn.execute(...)` retourne un curseur ; `lastrowid` donne l'id
    AUTOINCREMENT que SQLite vient d'attribuer.
    """
    cur = conn.execute(
        """
        INSERT INTO submissions
            (received_at, contributor, source_file, raw_text,
             raw_json, ingested_at, remote_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """,
        (received_at, contributor, source_file, raw_text,
         raw_json, now_iso(), remote_id),
    )
    return cur.lastrowid


def remote_exists(conn, remote_id):
    """
    Vrai si une soumission portant ce `remote_id` est déjà en base.
    Sert au pull Supabase à NE PAS ré-ingérer une contribution déjà
    récupérée (le pull est rejouable ; côté Supabase la ligne reste
    « en_attente » tant que le mainteneur n'a pas tranché).
    """
    if not remote_id:
        return False
    row = conn.execute(
        "SELECT 1 FROM submissions WHERE remote_id = ? LIMIT 1",
        (remote_id,),
    ).fetchone()
    return row is not None


def get_remote_id_for_box(conn, box_id):
    """
    Renvoie le `remote_id` (UUID Supabase) de la contribution dont relève
    la boîte donnée, ou None si la boîte est locale (sans pendant en ligne)
    ou n'existe pas. Sert à l'écriture-retour du statut.
    """
    row = conn.execute(
        "SELECT s.remote_id FROM boxes b "
        "JOIN submissions s ON b.submission_id = s.id "
        "WHERE b.id = ?",
        (box_id,),
    ).fetchone()
    return row["remote_id"] if row else None


def get_submission_box_statuses(conn, submission_id):
    """
    Renvoie la liste des statuts des boîtes d'une soumission. Sert à
    déduire le statut « contributeur » d'une contribution (une contribution
    Supabase = une soumission locale = plusieurs boîtes, chacune triée
    indépendamment).
    """
    return [r["status"] for r in conn.execute(
        "SELECT status FROM boxes WHERE submission_id = ?",
        (submission_id,),
    )]


def get_box_ids_for_submission(conn, submission_id):
    """Renvoie la liste des id des boîtes d'une soumission (ordre position)."""
    return [r["id"] for r in conn.execute(
        "SELECT id FROM boxes WHERE submission_id = ? ORDER BY position",
        (submission_id,),
    )]


def insert_box(conn, submission_id, position, type_, cible, notion,
               extra_notions, key_term, fields_json, signature):
    """
    Insère une boîte rattachée à une submission. Retourne l'id de la boîte.

    `extra_notions` est un texte JSON (liste sérialisée) ou None.
    `fields_json` est un texte JSON (objet sérialisé).
    Les listes/objets ne sont jamais stockés tels quels dans SQLite —
    on les sérialise toujours.
    """
    cur = conn.execute(
        """
        INSERT INTO boxes
            (submission_id, position, type, cible, notion,
             extra_notions, key_term, fields_json, signature,
             status, status_changed_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'en_attente', ?)
        """,
        (submission_id, position, type_, cible, notion,
         extra_notions, key_term, fields_json, signature,
         now_iso()),
    )
    return cur.lastrowid


# ────────── Lectures simples (utiles pour `ingest`) ──────────

def count_boxes_with_signature(conn, signature):
    """
    Combien de boîtes ont déjà cette signature ? Utile pour annoter à
    l'ingestion (« doublon probable d'une boîte existante »).
    """
    row = conn.execute(
        "SELECT COUNT(*) AS n FROM boxes WHERE signature = ?",
        (signature,),
    ).fetchone()
    return row["n"]


# ────────── Lectures pour la consultation (list, show, export…) ──────────

# Requête de base : on joint `submissions` pour pouvoir afficher le
# contributeur, la date reçue, le fichier source — sans devoir requêter
# deux fois.
BOX_SELECT = """
    SELECT
        b.id, b.submission_id, b.position, b.type, b.cible,
        b.notion, b.extra_notions, b.key_term, b.fields_json,
        b.signature, b.status, b.status_changed_at, b.note,
        s.contributor, s.received_at, s.source_file, s.ingested_at,
        s.remote_id,
        b.ai_verdict, b.ai_review, b.ai_reviewed_at, b.ai_user_message
    FROM boxes b
    JOIN submissions s ON b.submission_id = s.id
"""


def get_boxes(conn, status=None, cible=None, notion=None):
    """
    Renvoie une liste de Rows (boîtes + métadonnées de soumission) selon
    les filtres optionnels passés. Ordre : par cible, puis par notion,
    puis par key_term — c'est l'ordre naturel pour l'affichage groupé.

    Construction dynamique du WHERE : on accumule les clauses et les
    paramètres dans deux listes parallèles. Sans condition, on renvoie
    tout. C'est un pattern courant pour gérer N filtres optionnels.
    """
    clauses = []
    params = []
    if status is not None:
        clauses.append("b.status = ?")
        params.append(status)
    if cible is not None:
        clauses.append("b.cible = ?")
        params.append(cible)
    if notion is not None:
        clauses.append("b.notion = ?")
        params.append(notion)
    where = (" WHERE " + " AND ".join(clauses)) if clauses else ""
    order = " ORDER BY b.cible, COALESCE(b.notion, ''), COALESCE(b.key_term, ''), b.id"
    return list(conn.execute(BOX_SELECT + where + order, params))


def get_box(conn, box_id):
    """Renvoie une boîte (avec métadonnées de submission) ou None."""
    return conn.execute(
        BOX_SELECT + " WHERE b.id = ?",
        (box_id,),
    ).fetchone()


def get_unreviewed_boxes(conn, status="en_attente", limit=None):
    """
    Renvoie les boîtes que l'IA n'a PAS encore relues (colonne `ai_verdict`
    à NULL). C'est la file d'attente de la commande `review` : on ne
    re-soumet pas à Gemini ce qui a déjà un verdict (sauf demande explicite
    de re-relecture, gérée côté review.py).

    `status` cible les boîtes à relire :
      • une chaîne (ex. "en_attente") → ce statut précis ;
      • None → tous les statuts « encore dans le pipeline »
        (REVIEWABLE_STATUSES = en_attente + validee). Indispensable au
        bouton « Relire » du dashboard : une boîte peut arriver déjà
        « validée » (restaurée depuis Supabase lors d'une sync
        cross-plateforme) sans jamais transiter par « en attente », et
        rester donc « non relue » à vie si l'on ne regardait qu'en_attente.

    `limit` (optionnel) borne le nombre de boîtes renvoyées — utile pour
    ménager le quota gratuit de l'API en traitant par petits lots.

    Les retours sur le site (SITE_CIBLES) sont EXCLUS : ce ne sont pas des
    contenus à corriger. Les inclure les ferait stagner en tête de file
    (verdict toujours NULL) et bloquerait la relecture des vraies boîtes.
    """
    # Clause de statut : un seul (= ?) ou la liste « pipeline » (IN (…)).
    if status is None:
        st_ph = ", ".join("?" for _ in REVIEWABLE_STATUSES)
        status_clause = f"b.status IN ({st_ph})"
        status_params = list(REVIEWABLE_STATUSES)
    else:
        status_clause = "b.status = ?"
        status_params = [status]
    # Clause d'exclusion des cibles « site » (valeurs constantes, pas de
    # risque d'injection — on génère juste les placeholders).
    site_ph = ", ".join("?" for _ in SITE_CIBLES)
    q = (BOX_SELECT + f" WHERE {status_clause} AND b.ai_verdict IS NULL "
         f"AND b.cible NOT IN ({site_ph}) ORDER BY b.id")
    params = [*status_params, *SITE_CIBLES]
    if limit:
        q += " LIMIT ?"
        params.append(int(limit))
    return list(conn.execute(q, params))


def get_boxes_by_signature(conn, signature, exclude_id=None):
    """Toutes les boîtes ayant cette signature, sauf éventuellement une."""
    q = BOX_SELECT + " WHERE b.signature = ?"
    params = [signature]
    if exclude_id is not None:
        q += " AND b.id != ?"
        params.append(exclude_id)
    q += " ORDER BY b.id"
    return list(conn.execute(q, params))


def get_signature_groups(conn, min_count=2, status=None):
    """
    Renvoie les signatures partagées par ≥ `min_count` boîtes : c'est
    la liste des doublons exacts. Pratique pour la commande `dupes`.

    `GROUP BY` + `HAVING` : on regroupe par signature et on ne garde
    que les paquets de taille ≥ min_count.
    """
    where = ""
    params = [min_count]
    if status is not None:
        where = "WHERE status = ? "
        params = [status, min_count]
    rows = conn.execute(
        f"""SELECT signature, COUNT(*) AS n
            FROM boxes {where}
            GROUP BY signature
            HAVING n >= ?
            ORDER BY n DESC, signature""",
        params,
    ).fetchall()
    return rows


def update_status(conn, box_ids, new_status):
    """
    Passe une ou plusieurs boîtes au nouveau statut. Renvoie le nombre
    de lignes effectivement modifiées.

    Cas particulier — RENVOI EN FILE D'ATTENTE : si `new_status` vaut
    'en_attente' (bouton « ↺ En attente » du dashboard, ou `mark --as
    en_attente`), on EFFACE en même temps la pré-vérification IA de la
    boîte (ai_verdict / ai_review / ai_reviewed_at / ai_user_message →
    NULL). Pourquoi : la file de relecture (`get_unreviewed_boxes`) ne
    reprend que les boîtes SANS verdict ; sans cet effacement, une boîte
    remise en attente gardait son ancien verdict et n'était JAMAIS
    réanalysée. En lui retirant le marqueur « analysée par IA », le
    prochain « Relire (IA) » la traite de nouveau (avec le contenu à jour).

    `executemany` exécute la même requête N fois avec des paramètres
    différents — c'est plus rapide qu'une boucle Python.
    """
    if new_status not in STATUSES:
        raise ValueError(
            f"Statut inconnu : {new_status!r}. Attendu : {STATUSES}."
        )
    ts = now_iso()
    if new_status == "en_attente":
        # Remise en file : on réinitialise aussi la pré-vérification IA.
        sql = ("UPDATE boxes SET status = ?, status_changed_at = ?, "
               "ai_verdict = NULL, ai_review = NULL, ai_reviewed_at = NULL, "
               "ai_user_message = NULL WHERE id = ?")
    else:
        sql = "UPDATE boxes SET status = ?, status_changed_at = ? WHERE id = ?"
    cur = conn.executemany(sql, [(new_status, ts, bid) for bid in box_ids])
    _touch_submission_state(conn, box_ids)   # synchro cross-plateforme
    return cur.rowcount


def update_note(conn, box_id, note):
    """Pose ou efface (note=None / '') l'annotation d'une boîte."""
    note = (note or "").strip() or None
    cur = conn.execute(
        "UPDATE boxes SET note = ? WHERE id = ?",
        (note, box_id),
    )
    _touch_submission_state(conn, [box_id])   # synchro cross-plateforme
    return cur.rowcount


def set_ai_review(conn, box_id, verdict, review, user_message=None):
    """
    Enregistre le résultat de la pré-vérification IA d'une boîte : le
    `verdict` (valide / douteux / rejet), le texte d'explication `review`
    (destiné au MAINTENEUR) et, facultativement, `user_message` — la même
    appréciation REFORMULÉE pour le CONTRIBUTEUR (usager). Met aussi à jour
    l'horodatage `ai_reviewed_at`.

    `verdict` doit appartenir à AI_VERDICTS (ou None pour effacer la
    vérification). On valide comme dans update_status : mieux vaut lever
    une erreur ici que de stocker un verdict que le dashboard ne saurait
    pas afficher. Renvoie le nombre de lignes modifiées (0 si l'id
    n'existe pas).
    """
    if verdict is not None and verdict not in AI_VERDICTS:
        raise ValueError(
            f"Verdict IA inconnu : {verdict!r}. "
            f"Attendu : {AI_VERDICTS} (ou None)."
        )
    review = (review or "").strip() or None
    user_message = (user_message or "").strip() or None
    cur = conn.execute(
        "UPDATE boxes SET ai_verdict = ?, ai_review = ?, ai_reviewed_at = ?, "
        "ai_user_message = ? WHERE id = ?",
        (verdict, review, now_iso(), user_message, box_id),
    )
    _touch_submission_state(conn, [box_id])   # synchro cross-plateforme
    return cur.rowcount


def get_stats(conn):
    """
    Renvoie un dico {clé: compte} pour l'affichage rapide :
    par statut, par cible, et total.
    """
    out = {"total": 0, "par_statut": {}, "par_cible": {}}
    for r in conn.execute(
        "SELECT status, COUNT(*) AS n FROM boxes GROUP BY status"
    ):
        out["par_statut"][r["status"]] = r["n"]
        out["total"] += r["n"]
    for r in conn.execute(
        "SELECT cible, COUNT(*) AS n FROM boxes "
        "WHERE status = 'en_attente' GROUP BY cible"
    ):
        out["par_cible"][r["cible"]] = r["n"]
    return out


def delete_archived(conn, before_iso=None):
    """
    Supprime physiquement les boîtes au statut 'archivee'.
    Si `before_iso` est fourni, ne supprime que celles dont
    `status_changed_at < before_iso`. Renvoie le nombre supprimé.

    Les `submissions` orphelines (plus aucune boîte) sont supprimées
    derrière, pour ne pas accumuler des soumissions vides.
    """
    if before_iso:
        cur = conn.execute(
            "DELETE FROM boxes WHERE status = 'archivee' "
            "AND status_changed_at < ?",
            (before_iso,),
        )
    else:
        cur = conn.execute("DELETE FROM boxes WHERE status = 'archivee'")
    n_boxes = cur.rowcount
    # Nettoyage des submissions orphelines.
    conn.execute(
        "DELETE FROM submissions WHERE id NOT IN "
        "(SELECT DISTINCT submission_id FROM boxes)"
    )
    return n_boxes


# ────────── Synchro cross-plateforme (état de travail ↔ Supabase) ──────────
# L'état de travail du mainteneur (statut, note, pré-vérif IA de chaque boîte)
# vivait UNIQUEMENT dans ce SQLite local — donc invisible depuis une autre
# machine. La phase 6 le miroite dans Supabase (colonne `aggregator_state`
# JSONB de la table `contributions`) pour qu'il soit consultable et
# récupérable partout. Ces helpers (dé)sérialisent l'état d'UNE soumission et
# datent sa dernière modification locale (arbitrage local/cloud).


def _touch_submission_state(conn, box_ids):
    """
    Met à jour `state_updated_at = maintenant` sur les SOUMISSIONS parentes
    des boîtes données. Appelé après toute mutation de boîte (statut / note /
    IA) pour dater l'état → permet, à la synchro, de savoir si le local est
    plus récent que le cloud. `box_ids` peut être vide (no-op).
    """
    ids = [b for b in (box_ids or [])]
    if not ids:
        return
    ph = ", ".join("?" for _ in ids)
    conn.execute(
        f"UPDATE submissions SET state_updated_at = ? "
        f"WHERE id IN (SELECT DISTINCT submission_id FROM boxes WHERE id IN ({ph}))",
        (now_iso(), *ids),
    )


def get_submission_id_by_remote(conn, remote_id):
    """Renvoie l'id local de la soumission portant ce remote_id, ou None."""
    if not remote_id:
        return None
    row = conn.execute(
        "SELECT id FROM submissions WHERE remote_id = ? LIMIT 1",
        (remote_id,),
    ).fetchone()
    return row["id"] if row else None


def get_state_updated_at(conn, submission_id):
    """Renvoie l'horodatage de dernière modif locale de l'état, ou None."""
    row = conn.execute(
        "SELECT state_updated_at FROM submissions WHERE id = ?",
        (submission_id,),
    ).fetchone()
    return row["state_updated_at"] if row else None


def serialize_submission_state(conn, submission_id):
    """
    Sérialise l'état de travail d'UNE soumission en un dico prêt à pousser
    dans Supabase (colonne `aggregator_state`). Forme :

        {
          "v": 1,
          "updated_at": "<state_updated_at local>",
          "boxes": [
            {"position": 0, "status": "validee", "note": "...",
             "ai_verdict": "valide", "ai_review": "...",
             "ai_user_message": "..."},
            ...
          ]
        }

    Les boîtes sont rangées par `position` — la MÊME clé stable que l'ingestion
    réutilise (position = index de la boîte dans payload.boxes). C'est ce qui
    permet, sur une autre machine, de ré-appliquer l'état à la bonne boîte
    après avoir reconstruit les boîtes depuis le payload.
    """
    rows = conn.execute(
        "SELECT position, status, note, ai_verdict, ai_review, ai_user_message "
        "FROM boxes WHERE submission_id = ? ORDER BY position",
        (submission_id,),
    ).fetchall()
    boxes = [{
        "position": r["position"],
        "status": r["status"],
        "note": r["note"],
        "ai_verdict": r["ai_verdict"],
        "ai_review": r["ai_review"],
        "ai_user_message": r["ai_user_message"],
    } for r in rows]
    return {
        "v": 1,
        "updated_at": get_state_updated_at(conn, submission_id),
        "boxes": boxes,
    }


def apply_submission_state(conn, submission_id, state):
    """
    Applique un état `state` (forme ci-dessus, venu de Supabase) aux boîtes
    locales de la soumission, en faisant correspondre par `position`. Écrit
    DIRECTEMENT les colonnes (statut, note, pré-vérif IA) — sans passer par
    update_status (qui, lui, EFFACERAIT l'IA sur un retour 'en_attente') :
    ici on RESTAURE l'état exact tel qu'il était sur l'autre machine.

    Recopie aussi `state["updated_at"]` dans `submissions.state_updated_at`
    pour que le local et le cloud portent le même horodatage après restauration
    (sinon la prochaine synchro les croirait désynchronisés).

    Renvoie le nombre de boîtes mises à jour.
    """
    by_pos = {b.get("position"): b for b in (state or {}).get("boxes", [])
              if isinstance(b, dict)}
    if not by_pos:
        return 0
    local = conn.execute(
        "SELECT id, position FROM boxes WHERE submission_id = ?",
        (submission_id,),
    ).fetchall()
    n = 0
    for r in local:
        b = by_pos.get(r["position"])
        if not b:
            continue
        status = b.get("status")
        if status not in STATUSES:
            continue  # statut illisible : on ne touche pas à cette boîte
        conn.execute(
            "UPDATE boxes SET status = ?, status_changed_at = ?, note = ?, "
            "ai_verdict = ?, ai_review = ?, ai_reviewed_at = ?, "
            "ai_user_message = ? WHERE id = ?",
            (status, now_iso(),
             (b.get("note") or None),
             (b.get("ai_verdict") or None),
             (b.get("ai_review") or None),
             (now_iso() if b.get("ai_verdict") else None),
             (b.get("ai_user_message") or None),
             r["id"]),
        )
        n += 1
    # Aligne l'horodatage local sur celui du cloud (état restauré = à jour).
    if state and state.get("updated_at"):
        conn.execute(
            "UPDATE submissions SET state_updated_at = ? WHERE id = ?",
            (state["updated_at"], submission_id),
        )
    return n
