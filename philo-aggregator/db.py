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
CATEGORIES = ("notion", "auteur", "concept")

# Les sous-cibles possibles (box.cible), telles que définies par le site.
# v3 a introduit le menu à 2 niveaux : la plupart des cibles existaient déjà
# (rétro-compat v1/v2), on y a ajouté les sous-cibles auteur (citation /
# dialogue / bio) et concept (relation). 'axe' reste pour les anciens .txt.
CIBLES = (
    "notion", "texte", "plan", "axe", "exemple", "dissertation",
    "auteur", "auteur-citation", "auteur-dialogue", "auteur-bio",
    "concept", "concept-relation",
)

# Les trois types de boîte.
TYPES = ("ajout", "correction", "remarque")


# Verdicts possibles de la pré-vérification par IA (Gemini), stockés dans
# la colonne boxes.ai_verdict. None (NULL) = pas encore vérifiée par l'IA.
#   valide  : l'IA n'a rien relevé de bloquant.
#   douteux : à regarder de près (erreur factuelle possible, doublon, flou).
#   rejet   : manifestement hors-sujet / faux / spam.
AI_VERDICTS = ("valide", "douteux", "rejet")


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
    ingested_at     TEXT NOT NULL
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
    ai_verdict          TEXT,
    ai_review           TEXT,
    ai_reviewed_at      TEXT
);

CREATE INDEX IF NOT EXISTS idx_boxes_status
    ON boxes(status);
CREATE INDEX IF NOT EXISTS idx_boxes_cible_notion
    ON boxes(cible, notion);
CREATE INDEX IF NOT EXISTS idx_boxes_signature
    ON boxes(signature);
"""


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


def init_db():
    """
    Crée les tables et index si besoin, puis applique les migrations de
    colonnes (idempotent). Sûr à appeler à chaque démarrage.
    """
    with connect() as conn:
        conn.executescript(SCHEMA)
        _migrate_boxes(conn)   # ajoute les colonnes IA aux bases anciennes


def now_iso():
    """
    Horodatage UTC au format ISO 8601, ex : '2026-05-20T14:32:11+00:00'.
    UTC plutôt que l'heure locale pour qu'il n'y ait aucune ambiguïté
    sur les dates stockées en base.
    """
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


# ────────── Insertion ──────────

def insert_submission(conn, received_at, contributor, source_file,
                      raw_text, raw_json):
    """
    Insère une soumission et renvoie son id.

    `conn.execute(...)` retourne un curseur ; `lastrowid` donne l'id
    AUTOINCREMENT que SQLite vient d'attribuer.
    """
    cur = conn.execute(
        """
        INSERT INTO submissions
            (received_at, contributor, source_file, raw_text,
             raw_json, ingested_at)
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        (received_at, contributor, source_file, raw_text,
         raw_json, now_iso()),
    )
    return cur.lastrowid


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
        b.ai_verdict, b.ai_review, b.ai_reviewed_at
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
    Renvoie les boîtes au statut donné que l'IA n'a PAS encore relues
    (colonne `ai_verdict` à NULL). C'est la file d'attente de la commande
    `review` : on ne re-soumet pas à Gemini ce qui a déjà un verdict
    (sauf demande explicite de re-relecture, gérée côté review.py).

    `limit` (optionnel) borne le nombre de boîtes renvoyées — utile pour
    ménager le quota gratuit de l'API en traitant par petits lots.
    """
    q = BOX_SELECT + " WHERE b.status = ? AND b.ai_verdict IS NULL ORDER BY b.id"
    params = [status]
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

    `executemany` exécute la même requête N fois avec des paramètres
    différents — c'est plus rapide qu'une boucle Python.
    """
    if new_status not in STATUSES:
        raise ValueError(
            f"Statut inconnu : {new_status!r}. Attendu : {STATUSES}."
        )
    ts = now_iso()
    cur = conn.executemany(
        "UPDATE boxes SET status = ?, status_changed_at = ? WHERE id = ?",
        [(new_status, ts, bid) for bid in box_ids],
    )
    return cur.rowcount


def update_note(conn, box_id, note):
    """Pose ou efface (note=None / '') l'annotation d'une boîte."""
    note = (note or "").strip() or None
    cur = conn.execute(
        "UPDATE boxes SET note = ? WHERE id = ?",
        (note, box_id),
    )
    return cur.rowcount


def set_ai_review(conn, box_id, verdict, review):
    """
    Enregistre le résultat de la pré-vérification IA d'une boîte : le
    `verdict` (valide / douteux / rejet) et le texte d'explication
    `review`. Met aussi à jour l'horodatage `ai_reviewed_at`.

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
    cur = conn.execute(
        "UPDATE boxes SET ai_verdict = ?, ai_review = ?, ai_reviewed_at = ? "
        "WHERE id = ?",
        (verdict, review, now_iso(), box_id),
    )
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
