"""
aggregate.py — point d'entrée en ligne de commande.

Lancement :
    python aggregate.py ingest [--dir D]
    python aggregate.py list   [--status S] [--cible C] [--notion N] [--no-preview]
    python aggregate.py show   <id>
    python aggregate.py dupes  [--threshold 0.80] [--status S]
    python aggregate.py export [-o fichier.txt] [--status S]
    python aggregate.py mark   <id> [<id> ...] --as <statut>
    python aggregate.py note   <id> "texte"  |  --clear
    python aggregate.py archive [--before YYYY-MM-DD] [--yes]
    python aggregate.py purge   [--before YYYY-MM-DD] [--yes]
    python aggregate.py stats

L'organisation : on déclare les sous-commandes avec `argparse`, chacune
associée à une fonction `cmd_xxx(args)` via `set_defaults`. Le `main()`
dispatche en appelant `args.func(args)` — pas de gros if/elif.
"""

import argparse
import pathlib
import sys

# Forcer la sortie en UTF-8 (PowerShell sur Windows utilise cp1252
# par défaut, ce qui casse les accents à l'affichage).
try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")
except (AttributeError, OSError):
    pass

import db
import ingest
import view
import export


# ────────── Handlers des sous-commandes ──────────

def cmd_ingest(args):
    ingest.run(args.dir)


def cmd_list(args):
    # `--status all` → pas de filtre (None).
    status = None if args.status == "all" else args.status
    view.cmd_list(
        status=status,
        cible=args.cible,
        notion=args.notion,
        preview=not args.no_preview,
    )


def cmd_show(args):
    view.cmd_show(args.id)


def cmd_dupes(args):
    status = None if args.status == "all" else args.status
    view.cmd_dupes(threshold=args.threshold, status=status)


def cmd_export(args):
    status = None if args.status == "all" else args.status
    export.cmd_export(output_path=args.output, status=status)


def cmd_mark(args):
    """
    Marque une ou plusieurs boîtes au statut donné.
    L'`--as` est obligatoire — éviter qu'on tape `mark 42` par erreur
    sans préciser et que la commande fasse quelque chose qu'on n'attend pas.
    """
    with db.connect() as conn:
        n = db.update_status(conn, args.ids, args.as_status)
    print(f"{n} boîte(s) marquée(s) {args.as_status!r}.")


def cmd_note(args):
    """
    Pose une note sur une boîte, ou l'efface avec --clear.
    La note est libre — utile pour « citation à vérifier », « à fusionner
    avec #12 », etc. Visible en `list` (✎) et `show`.
    """
    if not args.clear and not args.text:
        print("Erreur : spécifier un texte de note ou utiliser --clear.",
              file=sys.stderr)
        sys.exit(2)
    text = None if args.clear else args.text
    with db.connect() as conn:
        n = db.update_note(conn, args.id, text)
    if n == 0:
        print(f"Aucune boîte #{args.id}.")
    else:
        print("Note effacée." if args.clear else f"Note posée sur #{args.id}.")


def cmd_archive(args):
    """
    Bascule les boîtes 'integree' → 'archivee'. Avec --before, ne traite
    que celles intégrées avant cette date (utile pour ne pas archiver une
    intégration toute récente).
    """
    where = ["status = 'integree'"]
    params = []
    if args.before:
        where.append("status_changed_at < ?")
        params.append(args.before + "T00:00:00+00:00")
    sql_where = " AND ".join(where)

    with db.connect() as conn:
        ids = [r["id"] for r in conn.execute(
            f"SELECT id FROM boxes WHERE {sql_where}", params)]
    if not ids:
        print("(aucune boîte 'integree' à archiver)")
        return
    if not args.yes:
        reponse = input(f"Archiver {len(ids)} boîte(s) ? [o/N] ").strip().lower()
        if reponse not in ("o", "oui", "y", "yes"):
            print("Annulé.")
            return
    with db.connect() as conn:
        n = db.update_status(conn, ids, "archivee")
    print(f"{n} boîte(s) archivée(s).")


def cmd_purge(args):
    """
    Supprime PHYSIQUEMENT les boîtes au statut 'archivee'. Avec --before,
    ne purge que celles archivées avant cette date.

    Action destructive : demande confirmation sauf si --yes.
    """
    before_iso = (args.before + "T00:00:00+00:00") if args.before else None

    # On compte d'abord pour pouvoir afficher un nombre à confirmer.
    with db.connect() as conn:
        if before_iso:
            n = conn.execute(
                "SELECT COUNT(*) FROM boxes WHERE status = 'archivee' "
                "AND status_changed_at < ?", (before_iso,)).fetchone()[0]
        else:
            n = conn.execute(
                "SELECT COUNT(*) FROM boxes WHERE status = 'archivee'"
            ).fetchone()[0]
    if n == 0:
        print("(aucune boîte 'archivee' à purger)")
        return
    if not args.yes:
        reponse = input(
            f"Supprimer DÉFINITIVEMENT {n} boîte(s) ? [o/N] "
        ).strip().lower()
        if reponse not in ("o", "oui", "y", "yes"):
            print("Annulé.")
            return
    with db.connect() as conn:
        deleted = db.delete_archived(conn, before_iso=before_iso)
    print(f"{deleted} boîte(s) supprimée(s).")


def cmd_stats(args):
    view.cmd_stats()


# ────────── Construction du parseur CLI ──────────

def build_parser():
    parser = argparse.ArgumentParser(
        prog="aggregate",
        description="Agrégateur des propositions Graphe Philosophie.",
    )
    sub = parser.add_subparsers(dest="cmd", required=True,
                                metavar="<commande>")

    # ── ingest ──
    p = sub.add_parser("ingest", help="Importer les .txt de inbox/.")
    p.add_argument("--dir", type=pathlib.Path, default=None,
                   help="Dossier d'entrée alternatif (défaut : ./inbox).")
    p.set_defaults(func=cmd_ingest)

    # ── list ──
    p = sub.add_parser("list", help="Lister les boîtes (groupé par section).")
    p.add_argument("--status", default="en_attente",
                   choices=list(db.STATUSES) + ["all"],
                   help="Filtrer par statut (défaut : en_attente, ou 'all').")
    p.add_argument("--cible", choices=db.CIBLES, default=None,
                   help="Filtrer par cible.")
    p.add_argument("--notion", default=None,
                   help="Filtrer par notion (clé exacte).")
    p.add_argument("--no-preview", action="store_true",
                   help="Ne pas afficher l'extrait sous chaque ligne.")
    p.set_defaults(func=cmd_list)

    # ── show ──
    p = sub.add_parser("show", help="Détail d'une boîte.")
    p.add_argument("id", type=int)
    p.set_defaults(func=cmd_show)

    # ── dupes ──
    p = sub.add_parser("dupes", help="Rapport des doublons (exacts + proches).")
    p.add_argument("--threshold", type=float, default=0.80,
                   help="Seuil de similarité pour le fuzzy (défaut : 0.80).")
    p.add_argument("--status", default="en_attente",
                   choices=list(db.STATUSES) + ["all"])
    p.set_defaults(func=cmd_dupes)

    # ── export ──
    p = sub.add_parser("export", help="Générer le .txt de revue pour Claude.")
    p.add_argument("-o", "--output", type=pathlib.Path, default=None,
                   help="Chemin de sortie (défaut : review_YYYYMMDD.txt).")
    p.add_argument("--status", default="en_attente",
                   choices=list(db.STATUSES) + ["all"])
    p.set_defaults(func=cmd_export)

    # ── mark ──
    p = sub.add_parser("mark", help="Changer le statut d'une ou plusieurs boîtes.")
    p.add_argument("ids", nargs="+", type=int, metavar="id",
                   help="Un ou plusieurs ids de boîte.")
    # `dest="as_status"` car `as` est un mot-clé Python.
    p.add_argument("--as", dest="as_status", required=True,
                   choices=db.STATUSES,
                   help="Nouveau statut.")
    p.set_defaults(func=cmd_mark)

    # ── note ──
    p = sub.add_parser("note", help="Poser/supprimer une note sur une boîte.")
    p.add_argument("id", type=int)
    p.add_argument("text", nargs="?", default=None,
                   help="Texte de la note (entre guillemets).")
    p.add_argument("--clear", action="store_true",
                   help="Supprimer la note existante.")
    p.set_defaults(func=cmd_note)

    # ── archive ──
    p = sub.add_parser("archive",
                       help="Passer les boîtes 'integree' à 'archivee'.")
    p.add_argument("--before", default=None,
                   help="Date YYYY-MM-DD : n'archiver que les boîtes "
                        "intégrées avant cette date.")
    p.add_argument("--yes", action="store_true",
                   help="Ne pas demander confirmation.")
    p.set_defaults(func=cmd_archive)

    # ── purge ──
    p = sub.add_parser("purge",
                       help="Supprimer DÉFINITIVEMENT les 'archivee'.")
    p.add_argument("--before", default=None,
                   help="Date YYYY-MM-DD.")
    p.add_argument("--yes", action="store_true",
                   help="Ne pas demander confirmation.")
    p.set_defaults(func=cmd_purge)

    # ── stats ──
    p = sub.add_parser("stats", help="Compteurs globaux.")
    p.set_defaults(func=cmd_stats)

    return parser


def main(argv=None):
    parser = build_parser()
    args = parser.parse_args(argv)
    db.init_db()
    args.func(args)


if __name__ == "__main__":
    main()
