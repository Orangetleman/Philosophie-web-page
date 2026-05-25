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


# Les quatre statuts possibles d'une boîte. Stockés en TEXT dans SQLite
# (SQLite n'a pas de type ENUM ; on contrôle côté Python).
STATUSES = ("en_attente", "integree", "rejetee", "archivee")


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
    note                TEXT
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


def init_db():
    """Crée les tables et index si la base n'existe pas encore."""
    with connect() as conn:
        conn.executescript(SCHEMA)


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
        s.contributor, s.received_at, s.source_file, s.ingested_at
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
