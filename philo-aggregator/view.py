"""
view.py — affichage formaté en terminal.

Commandes couvertes :
  - list   : liste groupée des boîtes, par section (NOTIONS / AUTEURS /
             CONCEPTS), puis sous-groupée et triée.
  - show   : détail complet d'une boîte (tous ses champs, signatures
             jumelles, note éventuelle).
  - dupes  : doublons exacts (signature partagée) + proches (similarité
             calculée avec difflib).

Convention pour les sections : on suit la structure du site qui a trois
onglets — Notions / Auteurs / Concepts. Chaque boîte appartient à une
seule section, déterminée par sa `cible` (cf. `BUCKETS`).
"""

import json
import difflib

import db
from ingest import normalize


# ────────── Mapping cible → section ──────────

# Trois sections, calquées sur les onglets du site.
BUCKETS = {
    "notion":       "NOTIONS",
    "texte":        "NOTIONS",
    "axe":          "NOTIONS",
    "exemple":      "NOTIONS",
    "dissertation": "NOTIONS",
    "auteur":       "AUTEURS",
    "concept":      "CONCEPTS",
}

SECTION_ORDER = ("NOTIONS", "AUTEURS", "CONCEPTS")


def bucket_of(cible):
    """Section d'une boîte d'après sa cible."""
    return BUCKETS.get(cible, "AUTRES")


def sub_key_of(row):
    """
    Sous-clé de regroupement intra-section.

    - NOTIONS  : groupé par notion d'attache (row['notion']).
    - AUTEURS  : groupé par nom de l'auteur (row['key_term']).
    - CONCEPTS : groupé par terme du concept (row['key_term']).

    Ce qu'on remonte ici est utilisé pour l'affichage ET pour l'export.
    """
    b = bucket_of(row["cible"])
    if b == "NOTIONS":
        return row["notion"] or "(notion non précisée)"
    return row["key_term"] or "(sans titre)"


# ────────── Petits utilitaires d'affichage ──────────

def short_date(iso):
    """ISO complet → 'YYYY-MM-DD' (les 10 premiers caractères)."""
    return (iso or "")[:10] or "?"


def main_text_field(row):
    """
    Renvoie le champ texte le plus important d'une boîte, selon sa cible.
    Sert pour la prévisualisation dans `list` et pour le fuzzy matching
    dans `dupes` / `export`.

    Quand le type est 'remarque', le champ est toujours `remtexte`,
    indépendamment de la cible. En 'correction', on prend le champ
    « principal » de la cible si présent, sinon `cibleref`.
    """
    f = json.loads(row["fields_json"]) if row["fields_json"] else {}
    t = row["type"]
    c = row["cible"]
    if t == "remarque":
        return f.get("remtexte") or ""
    # Le champ "contenu" principal par cible.
    by_cible = {
        "notion":       "notiondef",
        "auteur":       "idee",
        "texte":        "contenu",
        "axe":          "axepb",
        "exemple":      "excorps",
        "dissertation": "question",
        "concept":      "cdef",
    }
    return f.get(by_cible.get(c, "")) or ""


def truncate(s, n=80):
    """Compacte les espaces et tronque à n caractères, avec une ellipse."""
    s = " ".join((s or "").split())
    return s if len(s) <= n else s[: n - 1] + "…"


def status_marker(status):
    """Petit marqueur 1-caractère pour le statut dans les listes."""
    return {
        "en_attente": ".",
        "integree":   "✓",
        "rejetee":    "✗",
        "archivee":   "▪",
    }.get(status, "?")


# ────────── list ──────────

def cmd_list(status="en_attente", cible=None, notion=None, preview=True):
    """
    Affiche les boîtes filtrées, groupées par section (3 onglets du
    site) puis sous-groupées (notion / auteur / concept).

    Quand `preview` est vrai, on imprime aussi un extrait du champ
    principal sous chaque ligne — utile pour voir d'un coup d'œil ce
    dont parle la boîte sans devoir faire `show`.
    """
    with db.connect() as conn:
        rows = db.get_boxes(conn, status=status, cible=cible, notion=notion)

    if not rows:
        flt = []
        if status: flt.append(f"statut={status}")
        if cible:  flt.append(f"cible={cible}")
        if notion: flt.append(f"notion={notion}")
        suffix = f" ({', '.join(flt)})" if flt else ""
        print(f"(aucune boîte{suffix})")
        return

    # Précalcul : signature → liste d'ids triés. Sert à afficher
    # « doublon de #X » sur les boîtes dont la signature est partagée
    # par une autre boîte d'id plus petit (la « première » occurrence).
    sig_to_ids = {}
    for r in rows:
        sig_to_ids.setdefault(r["signature"], []).append(r["id"])

    # Regroupement : section → sous-clé → liste de boîtes.
    sections = {}
    for r in rows:
        sec = bucket_of(r["cible"])
        sk = sub_key_of(r)
        sections.setdefault(sec, {}).setdefault(sk, []).append(r)

    # En-tête.
    flt = []
    if status: flt.append(f"statut={status}")
    if cible:  flt.append(f"cible={cible}")
    if notion: flt.append(f"notion={notion}")
    print(f"Propositions ({len(rows)} boîte{'s' if len(rows) > 1 else ''})"
          + (f"  [{', '.join(flt)}]" if flt else ""))
    print()

    for sec in SECTION_ORDER:
        sub = sections.get(sec)
        if not sub:
            continue
        total = sum(len(v) for v in sub.values())
        print(f"──── {sec} ──── ({total})")
        for key in sorted(sub.keys(), key=lambda s: s.lower()):
            items = sub[key]
            # Pour les CONCEPTS, on rappelle les notions liées.
            extra_notes = ""
            if sec == "CONCEPTS":
                ex = items[0]["extra_notions"]
                notions_liees = [items[0]["notion"]] if items[0]["notion"] else []
                if ex:
                    try:
                        notions_liees += json.loads(ex)
                    except json.JSONDecodeError:
                        pass
                notions_liees = [n for n in notions_liees if n]
                if notions_liees:
                    extra_notes = f"  — notions liées : {', '.join(notions_liees)}"
            elif sec == "AUTEURS":
                # Liste des notions distinctes pour lesquelles cet auteur
                # est proposé (souvent une seule, mais peut varier).
                ns = sorted({r["notion"] for r in items if r["notion"]})
                if ns:
                    extra_notes = f"  — notion(s) : {', '.join(ns)}"

            print(f"  ▼ {key}  ({len(items)}){extra_notes}")
            for r in items:
                first_dup_id = next(
                    (i for i in sig_to_ids[r["signature"]] if i < r["id"]),
                    None,
                )
                tags = []
                if first_dup_id:
                    tags.append(f"⚠ doublon de #{first_dup_id}")
                if r["note"]:
                    tags.append("✎ note")
                tagstr = ("  " + "  ".join(tags)) if tags else ""
                print(
                    f"    [#{r['id']:>3}] {status_marker(r['status'])} "
                    f"{r['type']:<10} • {r['cible']:<13} "
                    f"{r['contributor']:<20} {short_date(r['received_at'])}"
                    f"{tagstr}"
                )
                if preview:
                    txt = truncate(main_text_field(r), 90)
                    if txt:
                        print(f"            {txt}")
        print()


# ────────── show ──────────

def cmd_show(box_id):
    """Affiche tous les champs d'une boîte + les boîtes jumelles."""
    with db.connect() as conn:
        r = db.get_box(conn, box_id)
        if not r:
            print(f"Aucune boîte #{box_id}.")
            return
        related = db.get_boxes_by_signature(conn, r["signature"], exclude_id=r["id"])

    fields = json.loads(r["fields_json"]) if r["fields_json"] else {}
    extras = []
    if r["extra_notions"]:
        try:
            extras = json.loads(r["extra_notions"])
        except json.JSONDecodeError:
            extras = []

    print(f"═══ Boîte #{r['id']} ═══")
    print(f"  Type        : {r['type']}")
    print(f"  Cible       : {r['cible']}")
    print(f"  Statut      : {r['status']}  (changé : {short_date(r['status_changed_at'])})")
    if r["notion"]:
        print(f"  Notion      : {r['notion']}"
              + (f"  (+ {', '.join(extras)})" if extras else ""))
    print(f"  Key term    : {r['key_term']}")
    print(f"  Signature   : {r['signature']}")
    print(f"  Soumission  : #{r['submission_id']} — {r['contributor']} "
          f"le {short_date(r['received_at'])}")
    print(f"  Source      : {r['source_file']}")
    if r["note"]:
        print(f"  Note        : {r['note']}")

    print()
    print("  ─── Champs ───")
    for k, v in fields.items():
        if isinstance(v, list):
            v = ", ".join(str(x) for x in v)
        v = str(v)
        # Champ court : sur une ligne. Champ long : indenté en bloc.
        if "\n" in v or len(v) > 100:
            print(f"    {k}:")
            for line in v.splitlines() or [v]:
                print(f"      {line}")
        else:
            print(f"    {k}: {v}")

    if related:
        print()
        print(f"  ─── Boîtes avec même signature ({len(related)}) ───")
        for rb in related:
            print(f"    #{rb['id']}  {rb['type']} • {rb['cible']} «{rb['key_term']}»  "
                  f"({rb['contributor']}, {short_date(rb['received_at'])}, {rb['status']})")


# ────────── dupes ──────────

def cmd_dupes(threshold=0.80, status="en_attente"):
    """
    Rapport des doublons :
      1. Doublons exacts (signature partagée).
      2. Rapprochements probables : difflib.SequenceMatcher.ratio() sur
         le couple (key_term, champ texte principal) entre boîtes de la
         même section ET même sous-clé naturelle. Seuil : `threshold`.

    Pour les NOMS (auteur/concept), on rajoute une heuristique de
    « contenance » : si la version normalisée d'un nom est strictement
    incluse dans l'autre (et ≥ 4 caractères), on flag aussi — difflib
    rate les inclusions courtes type "sartre" ⊂ "jean-paul sartre".
    """
    with db.connect() as conn:
        # 1) Exacts (par signature).
        sig_groups = db.get_signature_groups(conn, min_count=2, status=status)
        sig_blocks = []
        for g in sig_groups:
            boxes = db.get_boxes_by_signature(conn, g["signature"])
            boxes = [b for b in boxes if b["status"] == status]
            if len(boxes) >= 2:
                sig_blocks.append(boxes)
        rows = db.get_boxes(conn, status=status)

    print(f"══ Doublons (statut : {status}) ══")
    print()

    if sig_blocks:
        print(f"▶ Exacts (même signature) — {len(sig_blocks)} groupe(s)")
        print()
        for boxes in sig_blocks:
            first = boxes[0]
            print(f"  [{first['cible']} «{first['key_term']}» / notion={first['notion']}]")
            for b in boxes:
                print(f"    #{b['id']:>3}  {b['contributor']:<20}  {short_date(b['received_at'])}")
            print()
    else:
        print("▶ Exacts : aucun.")
        print()

    # 2) Rapprochements fuzzy par (section, sous-clé naturelle).
    # On groupe par cible + notion d'attache (cf. logique d'export).
    groups = {}
    for r in rows:
        sec = bucket_of(r["cible"])
        # Pour AUTEURS/CONCEPTS la comparaison se fait sur la même notion
        # (deux Sartre proposés pour la même notion sont des candidats),
        # mais aussi tous-Sartre confondus (on veut détecter un Sartre
        # proposé sur deux notions). On groupe donc par (section,) puis
        # on compare tout à tout — c'est petit, OK.
        groups.setdefault(sec, []).append(r)

    rapprochements = []
    for sec, items in groups.items():
        for i in range(len(items)):
            for j in range(i + 1, len(items)):
                a, b = items[i], items[j]
                if a["signature"] == b["signature"]:
                    continue  # déjà vu dans les exacts
                ratio, kind = _similarity(a, b)
                if ratio >= threshold or kind == "contains":
                    rapprochements.append((ratio, kind, sec, a, b))

    print(f"▶ Proches (seuil {threshold:.0%} + inclusion de noms)")
    print()
    if not rapprochements:
        print("  (aucun rapprochement)")
        return

    rapprochements.sort(key=lambda x: (-x[0], x[2]))
    for ratio, kind, sec, a, b in rapprochements:
        mark = "incl." if kind == "contains" else f"{ratio:.0%}"
        print(f"  [{sec}]  #{a['id']:>3} ⟷ #{b['id']:>3}  ({mark})")
        print(f"          «{a['key_term']}» ({a['cible']}/{a['notion']})")
        print(f"          «{b['key_term']}» ({b['cible']}/{b['notion']})")
    print()


def _similarity(a, b):
    """
    Renvoie (ratio, kind) :
      kind = 'contains' si l'un des key_term est inclus dans l'autre
      (cas typique : « sartre » ⊂ « jean-paul sartre »).
      Sinon kind = 'ratio' avec le score difflib sur (key_term, texte).
    """
    ka = normalize(a["key_term"] or "")
    kb = normalize(b["key_term"] or "")
    if len(ka) >= 4 and len(kb) >= 4 and (ka in kb or kb in ka) and ka != kb:
        return (1.0, "contains")
    str_a = f"{a['key_term'] or ''} | {main_text_field(a)}"
    str_b = f"{b['key_term'] or ''} | {main_text_field(b)}"
    return (difflib.SequenceMatcher(None, str_a, str_b).ratio(), "ratio")


# ────────── stats ──────────

def cmd_stats():
    """Compteurs : total, par statut, par cible (en_attente uniquement)."""
    with db.connect() as conn:
        s = db.get_stats(conn)
    print(f"Total boîtes en base : {s['total']}")
    print()
    print("Par statut :")
    for st in db.STATUSES:
        n = s["par_statut"].get(st, 0)
        print(f"  {st:<12} {n}")
    print()
    print("Par cible (en attente uniquement) :")
    for c in db.CIBLES:
        n = s["par_cible"].get(c, 0)
        if n:
            print(f"  {c:<14} {n}")
