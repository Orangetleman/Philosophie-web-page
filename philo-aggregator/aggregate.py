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


def cmd_pull(args):
    """
    Récupère les propositions empilées dans la boîte aux lettres en ligne,
    les ingère dans la base locale, puis confirme leur réception (`ack`)
    pour que la boîte ne les renvoie pas au prochain pull.

    Déroulé :
      1. GET /api/pull (secret) → liste d'items {id, body, …}.
      2. Pour chaque item : ingest_text(body) → insertion en base, ou
         sauvegarde en quarantaine si le corps est mal formé (rare : la
         boîte exige déjà les marqueurs avant d'accepter un dépôt).
      3. POST /api/ack avec TOUS les ids récupérés. On confirme même les
         items mis en quarantaine : ils sont déjà sauvegardés sur le
         disque, inutile de les re-télécharger à chaque fois.

    `pipeline` (et, à travers lui, `mailbox_client`) n'est importé qu'ici
    (import local) : `pull` est la seule commande à parler au réseau, on
    évite donc de charger ces modules pour les commandes hors-ligne.
    """
    import pipeline

    s = pipeline.pull_and_ingest(limit=args.limit)
    if s["items"] == 0:
        print("(boîte vide : rien à récupérer)")
        return

    # Détail par item (même rendu OK/KO que la commande `ingest`).
    for d in s["details"]:
        box_id, kind = d[0], d[1]
        if kind == "ok":
            n_boxes, n_dupes = d[2], d[3]
            extra = (f" ({n_dupes} doublon(s) probable(s))" if n_dupes else "")
            print(f"  OK   pull#{box_id} -> {n_boxes} boîte(s){extra}")
        else:
            print(f"  KO   pull#{box_id} -> quarantaine : {d[2]}")

    print()
    print(f"Récupération terminée : {s['ok']} OK, {s['quarantine']} en quarantaine.")
    print(f"Boîtes ajoutées : {s['boxes']} (dont {s['dupes']} doublon(s) probable(s)).")
    print(f"Confirmées auprès de la boîte (ack) : {s['acked']}.")


def cmd_pull_cloud(args):
    """
    Récupère les contributions « en_attente » depuis Supabase (comptes des
    visiteurs connectés) et les ingère en base locale.

    À la différence de `pull` (boîte PythonAnywhere), rien n'est « consommé »
    en ligne : la contribution reste « en_attente » côté Supabase jusqu'à ce
    qu'on la traite et qu'on renvoie son statut (commande `push`). Le pull
    est rejouable : une contribution déjà en base est simplement ignorée
    (dédoublonnage sur l'UUID Supabase).

    `pipeline` (et `supabase_client`) ne sont importés qu'ici : seules les
    commandes en ligne parlent au réseau.
    """
    import pipeline

    s = pipeline.pull_cloud_and_ingest(limit=args.limit)
    if s["items"] == 0:
        print("(aucune contribution en attente sur Supabase)")
        return

    for d in s["details"]:
        rid, kind = d[0], d[1]
        short = str(rid)[:8]
        if kind == "ok":
            n_boxes, n_dupes = d[2], d[3]
            extra = (f" ({n_dupes} doublon(s) probable(s))" if n_dupes else "")
            print(f"  OK   {short} -> {n_boxes} boîte(s){extra}")
        elif kind == "skip":
            print(f"  ··   {short} -> déjà en base (ignorée)")
        else:
            print(f"  KO   {short} -> quarantaine : {d[2]}")

    print()
    print(f"Récupération Supabase : {s['ok']} OK, {s['skipped']} ignorée(s), "
          f"{s['quarantine']} en quarantaine.")
    print(f"Boîtes ajoutées : {s['boxes']} (dont {s['dupes']} doublon(s) probable(s)).")


def cmd_sync(args):
    """
    Synchronise l'état de travail avec Supabase dans les DEUX sens (phase 6).

    Récupère TOUTES les contributions en ligne (pas seulement « en_attente ») :
    ingère celles inconnues ici et restaure leur état miroité (statut/note/IA
    par boîte), met à jour celles que l'autre machine a tranchées après nous,
    et pousse vers le cloud celles que NOUS avons modifiées en dernier
    (arbitrage « dernière écriture gagne » par horodatage). C'est ce qui rend
    le tableau de bord cohérent et complet sur N'IMPORTE QUELLE machine.
    """
    import pipeline

    s = pipeline.sync_cloud(limit=args.limit)
    if s["items"] == 0:
        print("(aucune contribution sur Supabase)")
        return
    for d in s["details"]:
        rid, kind = d[0], d[1]
        short = str(rid)[:8]
        print(f"  {short} -> {kind}" + (f" : {d[2]}" if len(d) > 2 and d[2] else ""))
    print()
    print(f"Synchro : {s['items']} contribution(s) — "
          f"{s['ingested']} ajoutée(s) ici (dont {s['restored']} avec état restauré), "
          f"{s['pulled']} tirée(s) du cloud, {s['pushed']} poussée(s) vers le cloud, "
          f"{s['skipped']} inchangée(s), {s['quarantine']} en quarantaine.")


def cmd_push(args):
    """
    Renvoie vers Supabase le statut des contributions concernées, pour que
    leurs auteurs voient l'avancement dans « Mes propositions » du site.

    On passe des ids de BOÎTE (comme partout dans l'outil) ; chaque boîte
    est résolue vers SA contribution (une contribution = une soumission =
    plusieurs boîtes). On dédoublonne : une contribution n'est poussée
    qu'une fois, avec le statut déduit de l'ensemble de ses boîtes
    (intégrée > retenue > rejetée > en attente).

    Le typique : après avoir marqué des boîtes (`mark … --as integree`),
    on `push` pour propager. Une explication facultative (`--explication`)
    est jointe (utile pour un refus : « doublon de la fiche X »).
    """
    import pipeline

    # Résoudre chaque id de boîte vers sa soumission (en préservant l'ordre,
    # sans doublon : on ne pousse chaque contribution qu'une fois).
    sub_ids = []
    with db.connect() as conn:
        for bid in args.ids:
            row = conn.execute(
                "SELECT submission_id FROM boxes WHERE id = ?", (bid,)
            ).fetchone()
            if row is None:
                print(f"  (aucune boîte #{bid})")
            elif row["submission_id"] not in sub_ids:
                sub_ids.append(row["submission_id"])

    pushed = 0
    for sid in sub_ids:
        r = pipeline.push_contribution_status(sid, explication=args.explication)
        if r["pushed"]:
            print(f"  contribution (soumission #{sid}) -> {r['statut']}")
            pushed += 1
        else:
            print(f"  soumission #{sid} : non poussée ({r['reason']})")
    print()
    print(f"{pushed} contribution(s) mise(s) à jour sur Supabase.")


def cmd_review(args):
    """
    Lance la pré-vérification IA (Gemini) des boîtes en attente.

    `review` est importé localement : il ne sert qu'ici et tire la
    dépendance google-generativeai, qu'on ne veut pas charger pour les
    commandes hors-ligne.
    """
    import review
    review.run(limit=args.limit, redo=args.redo, status=args.status)


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


def cmd_dashboard(args):
    """
    Démarre le tableau de bord local (Flask) pour trier/valider les
    propositions dans le navigateur. Import local : Flask n'est tiré que
    si l'on lance vraiment le dashboard.
    """
    import dashboard
    dashboard.run(port=args.port)


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

    # ── pull ──
    p = sub.add_parser("pull",
                       help="Récupérer les propositions de la boîte en ligne.")
    p.add_argument("--limit", type=int, default=200,
                   help="Nombre maxi à récupérer en une fois (défaut : 200).")
    p.set_defaults(func=cmd_pull)

    # ── pull-cloud ──
    p = sub.add_parser("pull-cloud",
                       help="Récupérer les contributions Supabase (comptes).")
    p.add_argument("--limit", type=int, default=200,
                   help="Nombre maxi à récupérer en une fois (défaut : 200).")
    p.set_defaults(func=cmd_pull_cloud)

    # ── sync ──
    p = sub.add_parser("sync",
                       help="Synchroniser l'état de travail avec Supabase "
                            "(2 sens : récupère TOUT + arbitre par horodatage).")
    p.add_argument("--limit", type=int, default=1000,
                   help="Nombre maxi de contributions à parcourir (défaut : 1000).")
    p.set_defaults(func=cmd_sync)

    # ── push ──
    p = sub.add_parser("push",
                       help="Renvoyer le statut des contributions vers Supabase.")
    p.add_argument("ids", nargs="+", type=int, metavar="id",
                   help="Un ou plusieurs ids de boîte (résolus en contribution).")
    p.add_argument("--explication", default=None,
                   help="Explication facultative jointe (ex. motif d'un refus).")
    p.set_defaults(func=cmd_push)

    # ── review ──
    p = sub.add_parser("review",
                       help="Pré-vérifier les boîtes en attente avec Gemini.")
    p.add_argument("--limit", type=int, default=None,
                   help="Nombre maxi de boîtes à relire (ménage le quota).")
    p.add_argument("--redo", action="store_true",
                   help="Re-relire même les boîtes ayant déjà un verdict IA.")
    p.add_argument("--status", default="en_attente",
                   choices=list(db.STATUSES),
                   help="Statut des boîtes à relire (défaut : en_attente).")
    p.set_defaults(func=cmd_review)

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

    # ── dashboard ──
    p = sub.add_parser("dashboard",
                       help="Lancer le tableau de bord local (navigateur).")
    p.add_argument("--port", type=int, default=None,
                   help="Port d'écoute local (défaut : DASHBOARD_PORT ou 5002).")
    p.set_defaults(func=cmd_dashboard)

    return parser


def main(argv=None):
    parser = build_parser()
    args = parser.parse_args(argv)
    db.init_db()
    args.func(args)


if __name__ == "__main__":
    main()
