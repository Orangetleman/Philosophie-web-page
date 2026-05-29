"""
store.py — stockage minimal de la boîte aux lettres (PythonAnywhere).

La boîte aux lettres est volontairement « bête » : elle ne comprend pas le
contenu des propositions, elle se contente de les empiler telles quelles
(le texte brut, marqueurs JSON compris). C'est le « cerveau » local, sur
ton PC, qui les récupérera ensuite, les fera relire par Gemini, puis les
rangera dans la vraie base de propositions (proposals.db, côté
philo-aggregator).

Une seule table, `incoming` :
  - body    : le texte brut reçu du site (il contient le bloc JSON).
  - pulled  : 0 tant que le cerveau local ne l'a pas récupérée, 1 ensuite.

Stdlib uniquement : aucune dépendance, pour rester déployable partout.
"""

import sqlite3
import pathlib
from datetime import datetime, timezone


# Dossier de ce fichier ; la base vit juste à côté. Résoudre les chemins
# relativement au script permet de lancer le programme depuis n'importe où.
SCRIPT_DIR = pathlib.Path(__file__).resolve().parent
DB_PATH = SCRIPT_DIR / "mailbox.db"


# `IF NOT EXISTS` → création idempotente (rejouable sans risque).
SCHEMA = """
CREATE TABLE IF NOT EXISTS incoming (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    received_at TEXT NOT NULL,
    remote_ip   TEXT,
    body        TEXT NOT NULL,
    pulled      INTEGER NOT NULL DEFAULT 0,
    pulled_at   TEXT
);
CREATE INDEX IF NOT EXISTS idx_incoming_pulled ON incoming(pulled);
"""


def now_iso():
    """Horodatage UTC ISO 8601 (sans ambiguïté de fuseau horaire)."""
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def connect():
    """Ouvre une connexion SQLite (accès aux colonnes par nom)."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    """Crée la table et son index si besoin (idempotent)."""
    with connect() as conn:
        conn.executescript(SCHEMA)


def add_incoming(body, remote_ip=None):
    """
    Range une proposition brute reçue. Renvoie l'id attribué.
    `body` est le texte tel que reçu (marqueurs JSON inclus).
    """
    with connect() as conn:
        cur = conn.execute(
            "INSERT INTO incoming (received_at, remote_ip, body) "
            "VALUES (?, ?, ?)",
            (now_iso(), remote_ip, body),
        )
        return cur.lastrowid


def get_unpulled(limit=200):
    """
    Renvoie les soumissions pas encore récupérées (pulled = 0), les plus
    anciennes d'abord, sous forme de liste de dictionnaires simples
    (faciles à sérialiser en JSON pour la réponse HTTP).
    """
    with connect() as conn:
        rows = conn.execute(
            "SELECT id, received_at, remote_ip, body FROM incoming "
            "WHERE pulled = 0 ORDER BY id ASC LIMIT ?",
            (int(limit),),
        ).fetchall()
    return [dict(r) for r in rows]


def mark_pulled(ids):
    """
    Marque comme récupérées (pulled = 1) les soumissions dont l'id figure
    dans `ids`. Renvoie le nombre de lignes effectivement modifiées.

    On ne supprime PAS : garder une trace permet de re-récupérer en cas de
    pépin côté cerveau local. La clause `AND pulled = 0` rend l'opération
    sûre si on rejoue le même ack deux fois (rien n'est compté en double).
    """
    ids = [int(i) for i in ids]
    if not ids:
        return 0
    ts = now_iso()
    with connect() as conn:
        cur = conn.executemany(
            "UPDATE incoming SET pulled = 1, pulled_at = ? "
            "WHERE id = ? AND pulled = 0",
            [(ts, i) for i in ids],
        )
        return cur.rowcount
