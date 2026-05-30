"""
export.py — génère un gros fichier .txt contenant toutes les propositions
en attente, mises en forme pour être copiées dans une session Claude.

Organisation du fichier généré :
  1. Un en-tête (date, compteurs, brève consigne pour Claude).
  2. Section NOTIONS  — boîtes 'notion', 'texte', 'axe', 'exemple',
     'dissertation' groupées par notion d'attache.
  3. Section AUTEURS  — boîtes 'auteur' groupées par nom d'auteur.
  4. Section CONCEPTS — boîtes 'concept' groupées par terme.

Chaque boîte est rendue avec tous ses champs (pas de troncature),
préfixée par un marqueur [BOX <id>] pour permettre la traçabilité :
après revue, on retrouve les ids dans la base et on les passe à `mark`.
"""

import json
import pathlib
from datetime import date as _date

import db
from view import (
    BUCKETS, SECTION_ORDER, bucket_of, sub_key_of,
    short_date,
)


# ────────── Libellés des champs ──────────

# Repris à l'identique du site (PROPOSAL_FIELDS dans index.html) pour
# que Claude voie les mêmes intitulés que ceux affichés au contributeur.
FIELD_LABELS = {
    # méta (correction / remarque)
    "cibleref":   "Élément ciblé",
    "remelement": "Élément concerné",
    "remtexte":   "Remarque",
    # notion
    "notion":     "Notion (clé)",
    "notiondef":  "Définition / approfondissement proposé",
    # auteur — fiche dans la notion
    "nom":        "Nom de l'auteur",
    "notion":     "Notion (clé)",
    "oeuvre":     "Œuvre",
    "date":       "Date de l'œuvre",
    "idee":       "Idée maîtresse",
    "citation":   "Citation",
    "citations":  "Citations",
    "rattach":    "Rattacher à une idée existante",
    "concepts":   "Termes à lier aux concepts",
    "justif":     "Justification du retrait",
    "remove":     "À retirer",
    # auteur — dialogue (AM[nom].dialogues[])
    "dialdir":    "Type de relation",
    "dialauteur": "Auteur en relation",
    "dialsujet":  "Sujet de la relation",
    "dialdesc":   "Description du dialogue",
    # auteur — fiche top-level AM (nouvel auteur)
    "a_bio":      "Biographie (top-level AM)",
    "a_courant":  "Courant philosophique",
    "a_periode":  "Période / siècle",
    "a_themes":   "Thèmes clés",
    # texte
    "titre":      "Titre / source du texte",
    "contenu":    "Contenu de l'extrait",
    # plan de dissertation (nouveau format)
    "plan_q":     "Sujet de dissertation",
    "plan_intro": "Problématisation",
    "plan_pb":    "Problématique",
    "plan_a1t":   "Axe I — titre",
    "plan_a1c":   "Axe I — arguments / sous-parties",
    "plan_a1l":   "Axe I — limite (transition)",
    "plan_a2t":   "Axe II — titre",
    "plan_a2c":   "Axe II — arguments / sous-parties",
    "plan_a2l":   "Axe II — limite (transition)",
    "plan_a3t":   "Axe III — titre",
    "plan_a3c":   "Axe III — arguments / sous-parties",
    "plan_a3l":   "Axe III — limite / ouverture",
    # axe (ancien format, conservé pour les anciens .txt)
    "axenom":     "Nom de l'axe",
    "axepb":      "Problématique de l'axe",
    "spa":        "Sous-partie A",
    "spar":       "Référence (sous-partie A)",
    "spb":        "Sous-partie B",
    "spbr":       "Référence (sous-partie B)",
    "spc":        "Sous-partie C",
    "spcr":       "Référence (sous-partie C)",
    # exemple
    "excat":      "Catégorie",
    "excatautre": "Catégorie (autre, libre)",
    "extitre":    "Titre de l'exemple",
    "excorps":    "Description de l'exemple",
    "exlien":     "Auteurs / idées associés",
    # dissertation
    "question":   "Question de dissertation",
    # concept
    "cnotions":   "Notions liées",
    "cterme":     "Terme / concept concerné",
    "ccat":       "Catégorie",
    "cdef":       "Définition",
    "ctensions":  "Tensions / distinctions",
    "clien":      "Lien avec la / les notion(s)",
    "crelations": "Liens avec d'autres concepts",
    # concept — relation (CONCEPTS[x].relations[])
    "reltype":    "Type de relation",
    "relcible":   "Concept / terme en relation",
    "reldesc":    "Description du lien",
    # retours sur le site — bug
    "bugou":       "Où dans le site",
    "bugdesc":     "Problème",
    "bugrepro":    "Étapes pour reproduire",
    "bugappareil": "Appareil / navigateur",
    # retours sur le site — fonctionnalité
    "fonctitre":  "Idée (en une phrase)",
    "foncdesc":   "Description de la fonctionnalité",
    "foncusage":  "Besoin / usage",
}

TYPE_LABELS = {
    "ajout":      "Ajout",
    "correction": "Correction",
    "remarque":   "Remarque",
}

CIBLE_LABELS = {
    "notion":            "notion (définition)",
    "auteur":            "auteur (idée/œuvre)",
    "auteur-citation":   "auteur (citation)",
    "auteur-dialogue":   "auteur (dialogue)",
    "auteur-bio":        "auteur (biographie)",
    "texte":             "texte",
    "plan":              "plan de dissertation",
    "axe":               "axe",
    "exemple":           "exemple",
    "dissertation":      "sujet de dissertation",
    "concept":           "concept (définition)",
    "concept-relation":  "concept (relation)",
    "site-bug":          "site — bug / erreur",
    "site-fonction":     "site — fonctionnalité",
}


# ────────── Rendu d'une boîte ──────────

def _format_value(value):
    """
    Convertit la valeur d'un champ en chaîne lisible.
    Une liste → éléments séparés par virgules.
    Un nombre, un booléen, etc. → str().
    """
    if value is None:
        return ""
    if isinstance(value, list):
        return ", ".join(str(x) for x in value)
    return str(value)


def render_box(row, dup_first_id=None):
    """
    Rend une boîte (Row SQLite) en bloc texte prêt à imprimer.
    `dup_first_id` : si non-None, on rappelle « doublon de #X ».
    """
    fields = json.loads(row["fields_json"]) if row["fields_json"] else {}
    extras = []
    if row["extra_notions"]:
        try:
            extras = json.loads(row["extra_notions"])
        except json.JSONDecodeError:
            extras = []

    lines = []
    head = (f"[BOX {row['id']}] {TYPE_LABELS.get(row['type'], row['type'])} • "
            f"{CIBLE_LABELS.get(row['cible'], row['cible'])}")
    if dup_first_id is not None:
        head += f"  ⚠ doublon (signature) de [BOX {dup_first_id}]"
    lines.append(head)

    meta_bits = [
        f"par {row['contributor']}",
        f"reçu le {short_date(row['received_at'])}",
    ]
    # Notion d'attache : pertinent pour tout sauf 'concept' (qui a cnotions[]).
    if row["cible"] != "concept" and row["notion"]:
        meta_bits.append(f"notion = {row['notion']}")
    if row["note"]:
        meta_bits.append(f"note = {row['note']!r}")
    lines.append("   " + " • ".join(meta_bits))

    # Pour un concept, on met cnotions en première ligne après le méta.
    if row["cible"] == "concept":
        notions_liees = [row["notion"]] if row["notion"] else []
        notions_liees += extras
        notions_liees = [n for n in notions_liees if n]
        if notions_liees:
            lines.append(f"   Notions liées : {', '.join(notions_liees)}")

    # Champs : on ordonne pour mettre les méta-champs (cibleref, remelement,
    # remtexte) en premier quand ils existent ; le reste suit dans l'ordre
    # naturel du JSON (qui correspond à l'ordre du formulaire).
    PRIO = ("cibleref", "remelement", "remtexte")
    ordered_keys = (
        [k for k in PRIO if k in fields]
        + [k for k in fields.keys() if k not in PRIO and k != "notion"
           and k != "cnotions"]
    )

    if ordered_keys:
        lines.append("")  # ligne vide visuelle
    for k in ordered_keys:
        # Cas particulier auteur v2 : 'ideas' est un tableau d'objets,
        # chacun avec ses propres champs (oeuvre/date/idee/citation/concepts).
        # On le rend en bloc structuré « Idée n » → champs indentés.
        if k == "ideas" and isinstance(fields.get(k), list):
            for j, it in enumerate(fields[k]):
                lines.append(f"   Idée {j+1} :")
                if not isinstance(it, dict):
                    lines.append(f"     {it}")
                    continue
                for ik, iv in it.items():
                    ilbl = FIELD_LABELS.get(ik, ik)
                    ival = _format_value(iv)
                    if not ival.strip():
                        continue
                    if "\n" in ival or len(ival) > 80:
                        lines.append(f"     {ilbl} :")
                        for ln in ival.splitlines() or [ival]:
                            lines.append(f"       {ln}")
                    else:
                        lines.append(f"     {ilbl} : {ival}")
            continue
        label = FIELD_LABELS.get(k, k)
        val = _format_value(fields[k])
        if not val.strip():
            continue
        # Champ court (sur une ligne) vs long (en bloc indenté).
        if "\n" in val or len(val) > 80:
            lines.append(f"   {label} :")
            for ln in val.splitlines() or [val]:
                lines.append(f"     {ln}")
        else:
            lines.append(f"   {label} : {val}")

    return "\n".join(lines)


# ────────── Génération du fichier ──────────

HEADER_TEMPLATE = """\
═══════════════════════════════════════════════════════════════
 PROPOSITIONS EN ATTENTE — Graphe Philosophie Terminale
 Généré le {today}  •  {n_boxes} boîte(s)  •  {n_contribs} contributeur(s)
═══════════════════════════════════════════════════════════════

CONSIGNE — Voici les propositions qui attendent intégration. Pour chacune :
  1. Vérifier la qualité (formulation, exactitude, niveau Terminale).
  2. Vérifier la pertinence (en cohérence avec le contenu existant
     de index.html, sans doublon avec ce qui existe déjà).
  3. Signaler les doublons et fusions possibles (les ⚠ déjà repérés
     côté programme sont indiqués par des marqueurs).
  4. Proposer une intégration au format des structures D / AM / CONCEPTS
     décrites dans CLAUDE.md, en marquant tout ajout/modif avec `new:true`
     ou `modified:true`.

Référence : chaque boîte est préfixée par un marqueur [BOX <id>]. Une fois
revue et intégrée, l'id sert à marquer la boîte en base via :
   python aggregate.py mark <id1> <id2> ... integree

"""


def cmd_export(output_path=None, status="en_attente"):
    """
    Écrit le fichier de synthèse. Renvoie le chemin écrit.

    output_path : chemin du fichier de sortie. Par défaut, un fichier
                  daté `review_YYYYMMDD.txt` dans le dossier du programme.
    status      : filtre sur le statut (par défaut, 'en_attente').
    """
    with db.connect() as conn:
        rows = db.get_boxes(conn, status=status)

    if not rows:
        print(f"(aucune boîte au statut '{status}', rien à exporter)")
        return None

    # Signature → premier id (pour annoter les doublons).
    sig_first_id = {}
    for r in rows:
        s = r["signature"]
        if s not in sig_first_id or r["id"] < sig_first_id[s]:
            sig_first_id[s] = r["id"]

    # Regroupement section → sous-clé → liste de boîtes.
    sections = {}
    for r in rows:
        sec = bucket_of(r["cible"])
        sk = sub_key_of(r)
        sections.setdefault(sec, {}).setdefault(sk, []).append(r)

    # En-tête.
    contribs = {r["contributor"] for r in rows}
    out = HEADER_TEMPLATE.format(
        today=_date.today().isoformat(),
        n_boxes=len(rows),
        n_contribs=len(contribs),
    )

    # Trois sections, dans l'ordre des onglets du site.
    for sec in SECTION_ORDER:
        sub = sections.get(sec)
        if not sub:
            continue
        total = sum(len(v) for v in sub.values())
        out += "\n"
        out += "═══════════════════════════════════════════════════════════════\n"
        out += f"  {sec}  ({total} boîte{'s' if total > 1 else ''})\n"
        out += "═══════════════════════════════════════════════════════════════\n"

        for key in sorted(sub.keys(), key=lambda s: s.lower()):
            items = sub[key]
            out += "\n"
            out += f"──── {key} ──── ({len(items)} boîte{'s' if len(items) > 1 else ''})\n"
            out += "\n"
            for r in items:
                first = sig_first_id.get(r["signature"])
                dup_id = first if (first is not None and first != r["id"]) else None
                out += render_box(r, dup_first_id=dup_id)
                out += "\n\n"

    # Choix du chemin de sortie.
    if output_path is None:
        output_path = (db.SCRIPT_DIR
                       / f"review_{_date.today().strftime('%Y%m%d')}.txt")
    else:
        output_path = pathlib.Path(output_path)

    output_path.write_text(out, encoding="utf-8")
    print(f"Écrit : {output_path}  ({len(rows)} boîte(s))")
    return output_path
