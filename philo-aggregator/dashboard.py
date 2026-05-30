"""
dashboard.py — mini tableau de bord LOCAL de curation des propositions.

Une petite application Flask qui tourne UNIQUEMENT sur ta machine
(http://127.0.0.1:5002 par défaut). Elle affiche les propositions
stockées dans `proposals.db`, avec l'avis de l'IA (verdict Gemini), et
te laisse les trier d'un clic :
  - Valider  → statut « validee »  (retenue, à agréger plus tard)
  - Rejeter  → statut « rejetee »
  - Archiver → statut « archivee »
  - Remettre « en attente »

Deux boutons d'action en haut :
  - « Récupérer » : va chercher les nouvelles propositions dans la boîte
    en ligne (pull + ingestion), via pipeline.pull_and_ingest.
  - « Relire (IA) » : soumet à Gemini les boîtes pas encore relues.

⚠ Volontairement SANS authentification : le serveur n'écoute que sur
127.0.0.1 (la machine locale), il n'est donc pas accessible de
l'extérieur. Ne jamais l'exposer sur un vrai réseau tel quel.

Comme partout dans le projet, rien n'est intégré à data.js ici :
« valider » ne fait que marquer la boîte « validee » en base. La recopie
finale dans le site reste une étape manuelle séparée (comme l'usage
actuel de philo-aggregator).
"""

import html

from flask import Flask, request, redirect

import db
import localenv
from view import bucket_of, sub_key_of, SECTION_ORDER, main_text_field, truncate, short_date
from export import render_box, CIBLE_LABELS, TYPE_LABELS


app = Flask(__name__)

# Port d'écoute local (surchargé par DASHBOARD_PORT dans .env si besoin).
PORT = int(localenv.get("DASHBOARD_PORT", "5002"))

# Combien de boîtes Gemini relit-il au clic sur « Relire (IA) ». On borne
# pour ne pas bloquer la page trop longtemps ni épuiser le quota gratuit.
REVIEW_BATCH = int(localenv.get("DASHBOARD_REVIEW_BATCH", "20"))


# ── Petits utilitaires de rendu ──────────────────────────────────────────

def esc(s):
    """Échappe le HTML (évite qu'un texte de proposition casse la page)."""
    return html.escape(str(s if s is not None else ""))


# Couleur associée à chaque verdict IA, pour la pastille.
VERDICT_STYLE = {
    "valide":  ("#2ecc71", "✓ valide"),
    "douteux": ("#f1c40f", "? douteux"),
    "rejet":   ("#e74c3c", "✗ rejet"),
}

# Couleur associée à chaque statut, pour la pastille.
STATUS_STYLE = {
    "en_attente": ("#5dade2", "en attente"),
    "validee":    ("#2ecc71", "validée"),
    "integree":   ("#27ae60", "intégrée"),
    "rejetee":    ("#e74c3c", "rejetée"),
    "archivee":   ("#7f8c8d", "archivée"),
}


def pill(color, label):
    """Renvoie le HTML d'une pastille colorée (badge)."""
    return (f'<span class="pill" style="background:{color}">'
            f'{esc(label)}</span>')


def verdict_pill(verdict):
    """Pastille du verdict IA (ou « non relue » si NULL)."""
    if not verdict:
        return pill("#444", "IA : non relue")
    color, label = VERDICT_STYLE.get(verdict, ("#444", verdict))
    return pill(color, f"IA : {label}")


def status_pill(status):
    """Pastille du statut courant."""
    color, label = STATUS_STYLE.get(status, ("#444", status))
    return pill(color, label)


# ── Feuille de style (chaîne simple : surtout pas d'f-string ici, les
#    accolades CSS entreraient en conflit avec la syntaxe f-string) ────────

CSS = """
* { box-sizing: border-box; }
body { margin:0; font-family:'Inter',system-ui,Arial,sans-serif;
       background:#15171c; color:#e6e6e6; }
a { color:#5dade2; }
header { position:sticky; top:0; background:#1c1f26; padding:14px 20px;
         border-bottom:1px solid #2a2e38; z-index:10; }
header h1 { margin:0 0 8px; font-size:18px; }
.bar { display:flex; flex-wrap:wrap; gap:10px; align-items:center; }
.bar form { display:inline; }
.toolbtn { background:#2a2e38; color:#e6e6e6; border:1px solid #3a3f4b;
           padding:7px 12px; border-radius:6px; cursor:pointer; font-size:13px; }
.toolbtn:hover { background:#343a46; }
.flash { margin:10px 20px 0; padding:10px 14px; background:#243b2e;
         border:1px solid #2ecc71; border-radius:6px; color:#cdedd8; }
.filters { margin-top:6px; font-size:13px; color:#aab; }
.filters a { margin-right:8px; text-decoration:none; }
.filters a.on { font-weight:700; text-decoration:underline; }
main { padding:16px 20px 60px; max-width:1000px; margin:0 auto; }
.section { margin:22px 0 8px; font-size:15px; letter-spacing:1px;
           color:#9aa; border-bottom:1px solid #2a2e38; padding-bottom:4px; }
.subgroup { margin:14px 0 4px; font-size:13px; color:#cbd; }
.card { background:#1c1f26; border:1px solid #2a2e38; border-radius:8px;
        padding:12px 14px; margin:8px 0; }
.card .head { display:flex; flex-wrap:wrap; gap:8px; align-items:center;
              margin-bottom:6px; }
.card .meta { color:#8a909c; font-size:12px; }
.pill { display:inline-block; padding:2px 8px; border-radius:10px;
        font-size:11px; color:#10131a; font-weight:600; }
.preview { margin:6px 0; color:#d6d6d6; font-size:14px; }
.review { margin:6px 0; padding:6px 10px; border-left:3px solid #555;
          background:#0f1115; font-size:13px; color:#c6c6c6; }
.note { margin:6px 0; color:#e0c170; font-size:13px; }
details { margin:6px 0; }
details pre { white-space:pre-wrap; background:#0f1115; padding:10px;
              border-radius:6px; font-size:12px; color:#c0c0c0; overflow:auto; }
.actions { display:flex; flex-wrap:wrap; gap:6px; margin-top:8px; }
.actions button { border:none; border-radius:6px; padding:6px 10px;
                  cursor:pointer; font-size:12px; color:#10131a; font-weight:600; }
.b-val { background:#2ecc71; } .b-rej { background:#e74c3c; }
.b-arc { background:#7f8c8d; } .b-att { background:#5dade2; }
.noteform { margin-top:6px; display:flex; gap:6px; }
.noteform input { flex:1; background:#0f1115; border:1px solid #3a3f4b;
                  color:#e6e6e6; border-radius:6px; padding:6px 8px; font-size:12px; }
.empty { color:#8a909c; padding:30px 0; text-align:center; }
"""


# ── Construction de la page ───────────────────────────────────────────────

# Filtres de verdict proposés (clé technique → libellé affiché).
VERDICT_FILTERS = [
    ("all", "tous"), ("valide", "valides"), ("douteux", "douteux"),
    ("rejet", "rejets"), ("none", "non relues"),
]


def _filter_links(current_status, current_verdict):
    """
    Construit la barre de filtres (liens) pour statut et verdict. Chaque
    lien recharge la page avec les paramètres voulus ; le filtre actif est
    souligné (classe « on »).
    """
    out = ['<div class="filters">Statut : ']
    statuses = [("en_attente", "en attente"), ("validee", "validées"),
                ("rejetee", "rejetées"), ("archivee", "archivées"),
                ("all", "tous")]
    for key, label in statuses:
        cls = "on" if key == current_status else ""
        out.append(f'<a class="{cls}" href="/?status={key}&verdict={current_verdict}">{esc(label)}</a>')
    out.append(' &nbsp;|&nbsp; Verdict IA : ')
    for key, label in VERDICT_FILTERS:
        cls = "on" if key == current_verdict else ""
        out.append(f'<a class="{cls}" href="/?status={current_status}&verdict={key}">{esc(label)}</a>')
    out.append("</div>")
    return "".join(out)


def _card(row, status, verdict_filter):
    """Rend une boîte sous forme de carte HTML (infos + actions)."""
    bid = row["id"]
    type_lbl = TYPE_LABELS.get(row["type"], row["type"])
    cible_lbl = CIBLE_LABELS.get(row["cible"], row["cible"])
    key_term = row["key_term"] or "(sans titre)"

    parts = ['<div class="card">']

    # En-tête : id, pastilles, type • cible « titre ».
    parts.append('<div class="head">')
    parts.append(f'<strong>#{bid}</strong>')
    parts.append(status_pill(row["status"]))
    parts.append(verdict_pill(row["ai_verdict"]))
    parts.append(f'<span>{esc(type_lbl)} • {esc(cible_lbl)} '
                 f'« {esc(key_term)} »</span>')
    parts.append("</div>")

    # Méta : contributeur, date, notion.
    meta = [f"par {esc(row['contributor'])}",
            f"reçu le {esc(short_date(row['received_at']))}"]
    if row["notion"] and row["cible"] != "concept":
        meta.append(f"notion = {esc(row['notion'])}")
    parts.append(f'<div class="meta">{" • ".join(meta)}</div>')

    # Aperçu du champ principal.
    preview = truncate(main_text_field(row), 220)
    if preview:
        parts.append(f'<div class="preview">{esc(preview)}</div>')

    # Avis de l'IA (si relue).
    if row["ai_review"]:
        parts.append(f'<div class="review">🤖 {esc(row["ai_review"])}</div>')

    # Note humaine éventuelle.
    if row["note"]:
        parts.append(f'<div class="note">✎ {esc(row["note"])}</div>')

    # Détails repliés : tous les champs (rendu identique à l'export).
    parts.append('<details><summary>Détails complets</summary>'
                 f'<pre>{esc(render_box(row))}</pre></details>')

    # Boutons d'action : un formulaire POST avec plusieurs boutons submit
    # (name="to") ; le bouton cliqué transmet sa valeur. On garde le
    # statut/verdict courants en champs cachés pour revenir au même filtre.
    parts.append('<form class="actions" method="post" action="/action">')
    parts.append(f'<input type="hidden" name="id" value="{bid}">')
    parts.append(f'<input type="hidden" name="status" value="{esc(status)}">')
    parts.append(f'<input type="hidden" name="verdict" value="{esc(verdict_filter)}">')
    # On masque le bouton correspondant au statut actuel (inutile).
    if row["status"] != "validee":
        parts.append('<button class="b-val" name="to" value="validee">✓ Valider</button>')
    if row["status"] != "rejetee":
        parts.append('<button class="b-rej" name="to" value="rejetee">✗ Rejeter</button>')
    if row["status"] != "archivee":
        parts.append('<button class="b-arc" name="to" value="archivee">▪ Archiver</button>')
    if row["status"] != "en_attente":
        parts.append('<button class="b-att" name="to" value="en_attente">↺ En attente</button>')
    parts.append("</form>")

    # Formulaire de note (pose / remplace la note libre).
    parts.append('<form class="noteform" method="post" action="/note">')
    parts.append(f'<input type="hidden" name="id" value="{bid}">')
    parts.append(f'<input type="hidden" name="status" value="{esc(status)}">')
    parts.append(f'<input type="hidden" name="verdict" value="{esc(verdict_filter)}">')
    parts.append(f'<input name="note" placeholder="Ajouter une note…" '
                 f'value="{esc(row["note"] or "")}">')
    parts.append('<button class="toolbtn" type="submit">Noter</button>')
    parts.append("</form>")

    parts.append("</div>")  # .card
    return "".join(parts)


def _page(status, verdict_filter, rows, flash=None):
    """Assemble la page HTML complète."""
    # En-tête + barre d'outils (récupérer / relire) + filtres.
    head = [
        "<!doctype html><html lang='fr'><head><meta charset='utf-8'>",
        "<meta name='viewport' content='width=device-width, initial-scale=1'>",
        "<title>Curation des propositions</title>",
        f"<style>{CSS}</style></head><body>",
        "<header>",
        "<h1>🧠 Curation des propositions — Graphe Philosophie</h1>",
        '<div class="bar">',
        # Boutons d'action globale.
        '<form method="post" action="/pull">'
        '<button class="toolbtn" type="submit">⬇ Récupérer (pull)</button></form>',
        f'<form method="post" action="/review">'
        f'<input type="hidden" name="status" value="{esc(status)}">'
        f'<input type="hidden" name="verdict" value="{esc(verdict_filter)}">'
        f'<button class="toolbtn" type="submit">🤖 Relire (IA) — {REVIEW_BATCH} max</button></form>',
        '</div>',
        _filter_links(status, verdict_filter),
        "</header>",
    ]
    if flash:
        head.append(f'<div class="flash">{esc(flash)}</div>')
    head.append("<main>")

    if not rows:
        head.append('<div class="empty">(aucune proposition pour ce filtre)</div>')
        head.append("</main></body></html>")
        return "".join(head)

    # Regroupement section → sous-clé → liste (même logique que list/export).
    sections = {}
    for r in rows:
        sec = bucket_of(r["cible"])
        sk = sub_key_of(r)
        sections.setdefault(sec, {}).setdefault(sk, []).append(r)

    head.append(f'<p class="meta">{len(rows)} proposition(s) affichée(s).</p>')
    for sec in SECTION_ORDER:
        sub = sections.get(sec)
        if not sub:
            continue
        total = sum(len(v) for v in sub.values())
        head.append(f'<div class="section">{esc(sec)} ({total})</div>')
        for key in sorted(sub.keys(), key=lambda s: s.lower()):
            items = sub[key]
            head.append(f'<div class="subgroup">▼ {esc(key)} ({len(items)})</div>')
            for r in items:
                head.append(_card(r, status, verdict_filter))

    head.append("</main></body></html>")
    return "".join(head)


# ── Routes ─────────────────────────────────────────────────────────────────

def _redirect_back(status, verdict_filter, msg=None):
    """Redirige vers la liste en conservant les filtres (motif PRG)."""
    import urllib.parse
    q = {"status": status, "verdict": verdict_filter}
    if msg:
        q["msg"] = msg
    return redirect("/?" + urllib.parse.urlencode(q))


@app.route("/")
def index():
    """Page principale : liste filtrée des propositions."""
    status = request.args.get("status", "en_attente")
    verdict_filter = request.args.get("verdict", "all")
    flash = request.args.get("msg")

    # Statut : 'all' → pas de filtre SQL.
    sql_status = None if status == "all" else status
    with db.connect() as conn:
        rows = db.get_boxes(conn, status=sql_status)

    # Filtre verdict IA (en Python : get_boxes ne le gère pas).
    if verdict_filter == "none":
        rows = [r for r in rows if not r["ai_verdict"]]
    elif verdict_filter in ("valide", "douteux", "rejet"):
        rows = [r for r in rows if r["ai_verdict"] == verdict_filter]

    return _page(status, verdict_filter, rows, flash=flash)


@app.route("/action", methods=["POST"])
def action():
    """Change le statut d'une boîte (valider / rejeter / archiver / attente)."""
    status = request.form.get("status", "en_attente")
    verdict_filter = request.form.get("verdict", "all")
    box_id = request.form.get("id", type=int)
    to = request.form.get("to", "")
    if box_id is None or to not in db.STATUSES:
        return _redirect_back(status, verdict_filter, "Action invalide.")
    with db.connect() as conn:
        n = db.update_status(conn, [box_id], to)
    msg = (f"Boîte #{box_id} → {to}." if n else f"Boîte #{box_id} introuvable.")
    return _redirect_back(status, verdict_filter, msg)


@app.route("/note", methods=["POST"])
def note():
    """Pose / remplace / efface (texte vide) la note d'une boîte."""
    status = request.form.get("status", "en_attente")
    verdict_filter = request.form.get("verdict", "all")
    box_id = request.form.get("id", type=int)
    text = request.form.get("note", "")
    if box_id is None:
        return _redirect_back(status, verdict_filter, "Note : id manquant.")
    with db.connect() as conn:
        db.update_note(conn, box_id, text)
    return _redirect_back(status, verdict_filter, f"Note enregistrée sur #{box_id}.")


@app.route("/pull", methods=["POST"])
def pull():
    """Va chercher les nouvelles propositions dans la boîte en ligne."""
    import pipeline
    try:
        s = pipeline.pull_and_ingest(limit=200)
    except SystemExit as e:
        # localenv/mailbox_client lèvent SystemExit avec un message clair
        # (config manquante, secret refusé…). On l'affiche au lieu de
        # planter le serveur.
        return _redirect_back("en_attente", "all", str(e))
    msg = (f"Récupéré : {s['items']} item(s), {s['boxes']} boîte(s) ajoutée(s), "
           f"{s['quarantine']} en quarantaine, {s['acked']} confirmée(s).")
    return _redirect_back("en_attente", "all", msg)


@app.route("/review", methods=["POST"])
def review_route():
    """Soumet à Gemini les boîtes pas encore relues (par petit lot)."""
    import review
    status = request.form.get("status", "en_attente")
    verdict_filter = request.form.get("verdict", "all")
    try:
        s = review.run(limit=REVIEW_BATCH, redo=False, status="en_attente")
    except SystemExit as e:
        return _redirect_back(status, verdict_filter, str(e))
    msg = (f"Relecture IA : {s['done']} relue(s) "
           f"(✓{s['valide']} ?{s['douteux']} ✗{s['rejet']})"
           + (f", {s['skipped']} en échec" if s['skipped'] else "") + ".")
    return _redirect_back(status, verdict_filter, msg)


def run(port=None, open_browser=True):
    """
    Démarre le serveur local (127.0.0.1 uniquement).

    open_browser=True : ouvre automatiquement le navigateur sur le
    tableau de bord, peu après le démarrage. Pratique pour le raccourci
    (.bat) : un double-clic lance le serveur ET ouvre la page. On utilise
    un threading.Timer pour différer l'ouverture d'une seconde, car
    app.run() est bloquant : il faut programmer l'ouverture AVANT, pour
    qu'elle se déclenche une fois le serveur prêt à répondre.
    """
    db.init_db()
    p = port or PORT
    url = f"http://127.0.0.1:{p}"
    print(f"Dashboard local : {url}  (Ctrl+C pour arrêter)")
    if open_browser:
        import threading
        import webbrowser
        # 1 s de délai : laisse à Flask le temps de se lier au port.
        threading.Timer(1.0, lambda: webbrowser.open(url)).start()
    # debug=False : pas de rechargement auto ni de page d'erreur publique.
    app.run(host="127.0.0.1", port=p, debug=False)


if __name__ == "__main__":
    run()
