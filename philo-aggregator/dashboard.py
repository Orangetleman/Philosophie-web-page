"""
dashboard.py — tableau de bord LOCAL de curation des propositions (cockpit).

Une application Flask qui tourne UNIQUEMENT sur ta machine
(http://127.0.0.1:5002 par défaut). Elle affiche les propositions stockées
dans `proposals.db`, avec l'avis de l'IA (verdict Gemini), et regroupe en
boutons toutes les commandes de l'outil — plus besoin du terminal.

Trier une boîte d'un clic (statut local) :
  - Valider   → « validee »  (retenue, en cours d'intégration)
  - Intégrer  → « integree » (effectivement recopiée dans le site)
  - Rejeter   → « rejetee »
  - Archiver  → « archivee »
  - En attente → « en_attente »

ÉCRITURE-RETOUR vers Supabase (phase 4) : pour une boîte issue d'un compte
(elle porte un `remote_id`), changer son statut local POUSSE aussi le statut
« contributeur » vers Supabase — l'auteur le voit dans « Mes propositions » :
  Valider → « en cours d'intégration », Intégrer → « intégrée »,
  Rejeter → « refusée » (avec une explication facultative jointe).
Les boîtes anonymes (boîte PythonAnywhere ou .txt) n'ont pas de pendant en
ligne : rien n'est poussé pour elles.

Barre d'outils (actions globales) :
  - ☁ Récupérer (Supabase) : pull-cloud → ingestion.
  - ⬇ Récupérer (anonyme)  : pull de la boîte PythonAnywhere → ingestion + ack.
  - 🤖 Relire (IA)          : soumet à Gemini les boîtes pas encore relues.
  - 📤 Exporter (.txt)      : génère le review_*.txt pour une session Claude.
  - 🗄 Archiver intégrées   : integree → archivee.
  - 🗑 Purger archivées     : suppression définitive (confirmation requise).

⚠ Volontairement SANS authentification : le serveur n'écoute que sur
127.0.0.1 (la machine locale), il n'est donc pas accessible de
l'extérieur. Ne jamais l'exposer sur un vrai réseau tel quel.

Comme partout dans le projet, rien n'est intégré à data.js ici : « intégrer »
ne fait que marquer la boîte « integree » en base. La recopie finale dans le
site (index.html / data.js) reste une étape manuelle séparée.
"""

import html
import threading

from flask import Flask, request, redirect, jsonify

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


# ── État partagé de la relecture IA (pour la barre de progression) ──────────
# La relecture peut être LONGUE (appels réseau + pauses anti-quota), donc on
# la lance dans un THREAD de fond et on suit son avancement ici. La page
# interroge /review-progress (JSON) en boucle et met à jour une barre, au lieu
# de laisser l'onglet « charger » sans retour. Accès protégé par un verrou
# (le thread écrit, les requêtes /review-progress lisent).
_review_lock = threading.Lock()
_review_state = {
    "running": False,   # une relecture est-elle en cours ?
    "total": 0,         # nombre de boîtes du lot
    "done": 0,          # relues avec verdict enregistré
    "skipped": 0,       # en échec (quota/réseau) — à retenter
    "valide": 0, "douteux": 0, "rejet": 0,
    "current": "",      # repère de la boîte en cours (ex. « #41 »)
    "waiting_until": 0, # epoch de reprise pendant une pause anti-quota (0 sinon)
    "message": "",      # récap final (affiché en bandeau au rechargement)
}


def _run_review_thread():
    """
    Exécuté dans un thread de fond : lance review.run() sur tout le pipeline
    (en_attente + validées non relues) et reflète l'avancement dans
    `_review_state`. Toute erreur est capturée et transformée en message :
    le thread ne doit jamais planter silencieusement.
    """
    import review

    def cb(info):
        # Appelé par review.run après chaque boîte : on recopie l'avancement.
        with _review_lock:
            _review_state.update(info)
            _review_state["running"] = True

    try:
        s = review.run(limit=REVIEW_BATCH, redo=False, status=None, on_progress=cb)
        msg = (f"Relecture IA : {s['done']} relue(s) "
               f"(✓{s['valide']} ?{s['douteux']} ✗{s['rejet']})"
               + (f", {s['skipped']} en échec" if s['skipped'] else "") + ".")
    except SystemExit as e:
        # localenv.require lève SystemExit si GEMINI_API_KEY manque.
        msg = str(e)
    except Exception as e:                      # noqa: BLE001
        msg = f"Relecture interrompue : {e}"
    with _review_lock:
        _review_state["running"] = False
        _review_state["message"] = msg


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


# Explications proposées par défaut quand on change un statut « poussable »
# vers Supabase. L'utilisateur peut les remplacer via le champ de la carte.
# 'en_attente' : None = ne pas écraser l'explication existante côté Supabase.
DEFAULT_EXPL = {
    "validee":    "Proposition retenue — en cours d'intégration au site.",
    "integree":   "Intégrée au site. Merci pour ta contribution !",
    "rejetee":    "Proposition non retenue.",
    "archivee":   None,
    "en_attente": None,
}

# Statuts dont le changement déclenche une écriture-retour vers Supabase
# (seulement pour les boîtes issues d'un compte, c.-à-d. avec un remote_id).
# 'archivee' est un rangement interne : on ne pousse rien.
PUSHABLE_STATUSES = ("validee", "integree", "rejetee", "en_attente")


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


def source_pill(row):
    """
    Pastille de PROVENANCE de la boîte, pour distinguer d'un coup d'œil les
    trois canaux d'arrivée (le statut n'est renvoyé à l'auteur QUE pour le
    canal « compte ») :
      - compte Supabase  → ☁ compte  (remote_id présent ; statut renvoyé) ;
      - boîte anonyme     → ⬇ anonyme (source_file « pull#… » ; pas de suivi) ;
      - fichier .txt local→ 📄 fichier (dépôt manuel dans inbox/).
    """
    if row["remote_id"]:
        return pill("#8e7cc3", "☁ compte")
    src = row["source_file"] or ""
    if src.startswith("pull#"):
        return pill("#5d8aa8", "⬇ anonyme")
    return pill("#6b7280", "📄 fichier")


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
/* Message IA destiné au contributeur (ton « élève ») : liseré vert pour le
   distinguer de l'avis relecteur ; c'est lui qui part dans le canal avis_ia. */
.usermsg { margin:6px 0; padding:6px 10px; border-left:3px solid #2ecc71;
           background:#0f1115; font-size:13px; color:#bfe8cf; }
.note { margin:6px 0; color:#e0c170; font-size:13px; }
details { margin:6px 0; }
details pre { white-space:pre-wrap; background:#0f1115; padding:10px;
              border-radius:6px; font-size:12px; color:#c0c0c0; overflow:auto; }
.actions { display:flex; flex-wrap:wrap; gap:6px; margin-top:8px;
           align-items:center; }
.actions button { border:none; border-radius:6px; padding:6px 10px;
                  cursor:pointer; font-size:12px; color:#10131a; font-weight:600; }
.b-val { background:#2ecc71; } .b-int { background:#27ae60; color:#ecfff4; }
.b-rej { background:#e74c3c; }
.b-arc { background:#7f8c8d; } .b-att { background:#5dade2; }
/* Champ « explication » envoyé au contributeur (boîtes issues d'un compte). */
.expl { flex:1 1 200px; background:#0f1115; border:1px solid #3a3f4b;
        color:#e6e6e6; border-radius:6px; padding:6px 8px; font-size:12px; }
.noteform { margin-top:6px; display:flex; gap:6px; }
.noteform input { flex:1; background:#0f1115; border:1px solid #3a3f4b;
                  color:#e6e6e6; border-radius:6px; padding:6px 8px; font-size:12px; }
.empty { color:#8a909c; padding:30px 0; text-align:center; }
/* Pastille « compte » (boîte issue de Supabase, statut renvoyé à l'auteur). */
.pill-cloud { background:#8e7cc3; }
/* Bouton d'action globale destructeur (purge). */
.toolbtn.danger { border-color:#e74c3c; color:#ffd9d4; }
.toolbtn.danger:hover { background:#3a2630; }
/* Panneau de statistiques (compteurs par statut) dans l'en-tête. */
.stats { margin-top:6px; font-size:12px; color:#8a909c; }
.stats b { color:#cbd; }
/* Barre de progression de la relecture IA (alimentée par /review-progress). */
.revbar { margin:10px 20px 0; }
.revbar-label { font-size:12px; color:#cbd; margin-bottom:4px; }
.revbar-track { height:10px; background:#0f1115; border:1px solid #2a2e38;
                border-radius:6px; overflow:hidden; }
.revbar-fill { height:100%; width:0; border-radius:6px;
               background:linear-gradient(90deg,#5dade2,#8e7cc3);
               transition:width .4s ease; }
/* Avancement inconnu (total pas encore connu) : barre qui glisse. */
.revbar-fill.indeterminate { width:35% !important; transition:none;
               animation:revslide 1.1s ease-in-out infinite; }
@keyframes revslide { 0%{margin-left:-35%} 100%{margin-left:100%} }
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

    # Une boîte issue d'un compte (Supabase) porte un remote_id : son statut
    # est renvoyé à l'auteur. On le signale par une pastille « ☁ compte ».
    is_cloud = bool(row["remote_id"])

    # En-tête : id, pastilles, type • cible « titre ».
    parts.append('<div class="head">')
    parts.append(f'<strong>#{bid}</strong>')
    parts.append(status_pill(row["status"]))
    # Provenance (compte / anonyme / fichier) : rend visible que seul le
    # canal « compte » reçoit un renvoi de statut.
    parts.append(source_pill(row))
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

    # Avis de l'IA (si relue) : ligne « relecteur » (jargon permis).
    if row["ai_review"]:
        parts.append(f'<div class="review">🤖 {esc(row["ai_review"])}</div>')

    # Message rédigé par l'IA POUR le contributeur (élève, pas dev) : ton
    # bienveillant, sans jargon. Il part dans SON PROPRE canal « avis_ia »
    # (distinct de l'explication du relecteur) lors d'un changement de statut
    # poussable. Affiché ici pour que le relecteur voie ce qui sera renvoyé.
    if row["ai_user_message"]:
        parts.append('<div class="usermsg">🤖 Avis IA envoyé à l\'auteur : '
                     f'{esc(row["ai_user_message"])}</div>')

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
    # « Intégrer » n'apparaît QUE pour une boîte déjà validée : on n'intègre
    # rien qui n'ait d'abord été retenu (en_attente → validee → integree).
    if row["status"] == "validee":
        parts.append('<button class="b-int" name="to" value="integree">⤓ Intégrer</button>')
    if row["status"] != "rejetee":
        parts.append('<button class="b-rej" name="to" value="rejetee">✗ Rejeter</button>')
    if row["status"] != "archivee":
        parts.append('<button class="b-arc" name="to" value="archivee">▪ Archiver</button>')
    if row["status"] != "en_attente":
        parts.append('<button class="b-att" name="to" value="en_attente">↺ En attente</button>')
    # Boîte issue d'un compte : un champ « explication » (facultatif) part
    # avec le changement de statut vers Supabase (vu par l'auteur). Pour les
    # boîtes anonymes, ce champ est inutile (rien n'est poussé) : on l'omet.
    if is_cloud:
        # Ce champ = TON mot de relecteur (humain), distinct de l'avis IA qui
        # part dans son propre canal « avis_ia ». Laissé vide par défaut : à
        # remplir seulement si tu veux ajouter un mot personnel au contributeur.
        parts.append('<input class="expl" name="expl" '
                     'placeholder="Mot du relecteur pour l\'auteur (facultatif)…">')
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


def _stats_panel():
    """Construit le panneau de compteurs (par statut) affiché dans l'en-tête."""
    with db.connect() as conn:
        st = db.get_stats(conn)
    parts = [f'<b>{st["total"]}</b> boîte(s) au total']
    for key in ("en_attente", "validee", "integree", "rejetee", "archivee"):
        n = st["par_statut"].get(key, 0)
        if n:
            _, label = STATUS_STYLE.get(key, ("", key))
            parts.append(f'{label} : <b>{n}</b>')
    return '<div class="stats">' + " &nbsp;·&nbsp; ".join(parts) + "</div>"


# Script de suivi de la relecture IA : interroge /review-progress en boucle,
# révèle la barre tant qu'un lot tourne, puis recharge la page (pour afficher
# les verdicts fraîchement écrits) en posant le récap en bandeau. `sawRunning`
# évite toute boucle de rechargement : on ne recharge QUE si l'on a vu un lot
# actif pendant la vie de cette page.
PROGRESS_JS = """
<script>
(function(){
  var bar=document.getElementById('revbar');
  if(!bar) return;
  var fill=document.getElementById('revbar-fill');
  var label=document.getElementById('revbar-label');
  var last=null, sawRunning=false, tick=null;
  // Formate un nombre de secondes en « M min SS s » (ou « SS s » sous 1 min).
  function fmt(sec){
    sec=Math.max(0, Math.round(sec));
    var m=Math.floor(sec/60), s=sec%60;
    return m>0 ? (m+' min '+(s<10?'0':'')+s+' s') : (s+' s');
  }
  // Construit le libellé depuis le dernier état connu. Appelée à chaque
  // sondage ET toutes les 0,5 s (pour faire défiler le compte à rebours
  // entre deux sondages, l'horloge étant locale = celle du serveur).
  function render(){
    if(!last) return;
    var s=last;
    var total=s.total||0, done=(s.done||0)+(s.skipped||0);
    fill.classList.toggle('indeterminate', total<=0);
    if(total>0) fill.style.width=Math.round(done/total*100)+'%';
    var txt='Relecture IA : '+done+(total?(' / '+total):'')+' boîte(s)';
    txt+=' — ✓'+(s.valide||0)+' ?'+(s.douteux||0)+' ✗'+(s.rejet||0);
    var wu=s.waiting_until||0, rem=wu ? (wu - Date.now()/1000) : 0;
    if(wu && rem>0){
      txt+=' · ⏳ quota atteint, reprise dans '+fmt(rem);
    } else if(wu){
      txt+=' · ⏳ reprise en cours…';
    } else {
      if(s.skipped) txt+=' · '+s.skipped+' en attente (quota)';
      if(s.current) txt+=' · '+s.current;
    }
    label.textContent=txt;
  }
  function poll(){
    fetch('/review-progress',{cache:'no-store'})
      .then(function(r){return r.json();})
      .then(function(s){
        if(s.running){
          sawRunning=true; bar.hidden=false; last=s; render();
          if(!tick) tick=setInterval(render, 500);   // défilement du compte à rebours
          setTimeout(poll,1200);
        } else if(sawRunning){
          if(tick){ clearInterval(tick); tick=null; }
          fill.classList.remove('indeterminate'); fill.style.width='100%';
          label.textContent=s.message||'Relecture terminée.';
          var u=new URL(window.location.href);
          u.searchParams.delete('reviewing');
          if(s.message) u.searchParams.set('msg', s.message);
          setTimeout(function(){ window.location.replace(u.toString()); }, 800);
        } else {
          bar.hidden=true;
        }
      })
      .catch(function(){ if(sawRunning) setTimeout(poll,2000); });
  }
  poll();
})();
</script>
"""


def _page(status, verdict_filter, rows, flash=None):
    """Assemble la page HTML complète."""
    # Champs cachés (statut/verdict courants) communs aux formulaires de la
    # barre d'outils : ils permettent de revenir au même filtre après l'action.
    keep = (f'<input type="hidden" name="status" value="{esc(status)}">'
            f'<input type="hidden" name="verdict" value="{esc(verdict_filter)}">')
    # En-tête + barre d'outils (cockpit : toutes les commandes) + stats + filtres.
    head = [
        "<!doctype html><html lang='fr'><head><meta charset='utf-8'>",
        "<meta name='viewport' content='width=device-width, initial-scale=1'>",
        # Favicon engrenage (SVG inline en data-URI : aucun fichier externe).
        "<link rel='icon' href=\"data:image/svg+xml,"
        "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E"
        "%3Cpath fill='%237c5cff' d='M19.14 12.94a7.5 7.5 0 0 0 .05-1.88l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.6-.22l-2.39.96a7 7 0 0 0-1.62-.94l-.36-2.54a.5.5 0 0 0-.5-.42h-3.84a.5.5 0 0 0-.5.42l-.36 2.54c-.59.24-1.13.56-1.62.94l-2.39-.96a.5.5 0 0 0-.6.22L2.6 8.84a.5.5 0 0 0 .12.64l2.03 1.58a7.5 7.5 0 0 0 0 1.88l-2.03 1.58a.5.5 0 0 0-.12.64l1.92 3.32a.5.5 0 0 0 .6.22l2.39-.96c.49.38 1.03.7 1.62.94l.36 2.54a.5.5 0 0 0 .5.42h3.84a.5.5 0 0 0 .5-.42l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96a.5.5 0 0 0 .6-.22l1.92-3.32a.5.5 0 0 0-.12-.64ZM12 15.5A3.5 3.5 0 1 1 12 8.5a3.5 3.5 0 0 1 0 7Z'/%3E"
        "%3C/svg%3E\">",
        "<title>Curation des propositions</title>",
        f"<style>{CSS}</style></head><body>",
        "<header>",
        "<h1>🧠 Curation des propositions — Graphe Philosophie</h1>",
        '<div class="bar">',
        # Récupération : Supabase (comptes) puis boîte anonyme (PythonAnywhere).
        f'<form method="post" action="/pull-cloud">'
        f'<button class="toolbtn" type="submit">☁ Récupérer (Supabase)</button></form>',
        # Synchro cross-plateforme : récupère TOUT (états validés ailleurs inclus)
        # et arbitre local/cloud par horodatage (phase 6).
        f'<form method="post" action="/sync">'
        f'<button class="toolbtn" type="submit">🔄 Synchroniser (cloud)</button></form>',
        '<form method="post" action="/pull">'
        '<button class="toolbtn" type="submit">⬇ Récupérer (anonyme)</button></form>',
        # Relecture IA (par lot borné).
        f'<form method="post" action="/review">{keep}'
        f'<button class="toolbtn" type="submit">🤖 Relire (IA) — {REVIEW_BATCH} max</button></form>',
        # Export .txt pour Claude (sur le statut filtré courant).
        f'<form method="post" action="/export">{keep}'
        f'<button class="toolbtn" type="submit">📤 Exporter (.txt)</button></form>',
        # Rangement : archiver les intégrées.
        f'<form method="post" action="/archive">{keep}'
        f'<button class="toolbtn" type="submit">🗄 Archiver intégrées</button></form>',
        # Purge destructrice (confirmation via onsubmit côté navigateur).
        f'<form method="post" action="/purge" '
        f'onsubmit="return confirm(\'Supprimer DÉFINITIVEMENT toutes les boîtes archivées ?\');">'
        f'{keep}<input type="hidden" name="confirm" value="yes">'
        f'<button class="toolbtn danger" type="submit">🗑 Purger archivées</button></form>',
        '</div>',
        _stats_panel(),
        _filter_links(status, verdict_filter),
        "</header>",
    ]
    # Barre de progression de la relecture IA. Cachée par défaut ; le script
    # de bas de page la révèle dès que /review-progress signale un lot en cours.
    head.append(
        '<div id="revbar" class="revbar" hidden>'
        '<div class="revbar-label" id="revbar-label">Relecture IA…</div>'
        '<div class="revbar-track"><div class="revbar-fill" id="revbar-fill"></div></div>'
        '</div>'
    )
    if flash:
        head.append(f'<div class="flash">{esc(flash)}</div>')
    head.append("<main>")

    if not rows:
        head.append('<div class="empty">(aucune proposition pour ce filtre)</div>')
        head.append("</main>" + PROGRESS_JS + "</body></html>")
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

    head.append("</main>" + PROGRESS_JS + "</body></html>")
    return "".join(head)


# ── Routes ─────────────────────────────────────────────────────────────────

def _redirect_back(status, verdict_filter, msg=None):
    """Redirige vers la liste en conservant les filtres (motif PRG)."""
    import urllib.parse
    q = {"status": status, "verdict": verdict_filter}
    if msg:
        q["msg"] = msg
    return redirect("/?" + urllib.parse.urlencode(q))


def _mirror_state(submission_id):
    """
    Pousse l'état de travail de la soumission vers Supabase (synchro
    cross-plateforme), en silence et sans jamais planter la page : toute
    erreur (réseau, config absente…) est avalée — le statut local, lui, est
    déjà enregistré, et la synchro explicite « ☁ Synchroniser » rattrapera.
    """
    try:
        import pipeline
        pipeline.push_aggregator_state(submission_id)
    except Exception:
        pass


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
    """
    Change le statut local d'une boîte (valider / intégrer / rejeter /
    archiver / en attente) ET, si la boîte vient d'un compte (remote_id),
    POUSSE le statut « contributeur » vers Supabase pour que l'auteur le
    voie dans « Mes propositions ».

    L'écriture-retour passe par `pipeline.push_contribution_status`, qui
    raisonne au niveau de la SOUMISSION (une contribution = plusieurs
    boîtes triées séparément) : il déduit le statut le plus avancé parmi
    toutes les boîtes de la soumission, puis le publie. On lui transmet
    l'explication saisie sur la carte (ou, à défaut, un texte par défaut).
    """
    status = request.form.get("status", "en_attente")
    verdict_filter = request.form.get("verdict", "all")
    box_id = request.form.get("id", type=int)
    to = request.form.get("to", "")
    expl = (request.form.get("expl", "") or "").strip()
    if box_id is None or to not in db.STATUSES:
        return _redirect_back(status, verdict_filter, "Action invalide.")

    # 1. Changement de statut local.
    with db.connect() as conn:
        n = db.update_status(conn, [box_id], to)
        # Boîte issue d'un compte ? On résout sa soumission pour l'écriture-
        # retour (push raisonne par soumission, pas par boîte). On lit aussi
        # l'avis IA destiné au contributeur (ai_user_message) APRÈS le
        # changement de statut : ainsi, pour un retour « en_attente » (qui
        # efface l'avis local), on récupère bien NULL → on ne renvoie pas
        # d'avis périmé.
        remote_id = db.get_remote_id_for_box(conn, box_id)
        sub_row = conn.execute(
            "SELECT submission_id, ai_user_message FROM boxes WHERE id = ?",
            (box_id,)
        ).fetchone()
    if not n:
        return _redirect_back(status, verdict_filter, f"Boîte #{box_id} introuvable.")

    msg = f"Boîte #{box_id} → {to}."

    # 2. Écriture-retour vers Supabase (uniquement boîtes de compte + statut
    #    publiable). On n'interrompt pas l'action locale si le push échoue :
    #    on l'indique simplement dans le message. On renvoie DEUX champs
    #    distincts : l'explication (mot du relecteur, humain) et l'avis IA
    #    (automatique, reformulé pour l'usager, affiché à part côté site).
    if remote_id and to in PUSHABLE_STATUSES and sub_row:
        import pipeline
        explication = expl or DEFAULT_EXPL.get(to)
        avis_ia = sub_row["ai_user_message"] or None
        try:
            res = pipeline.push_contribution_status(
                sub_row["submission_id"], explication=explication,
                avis_ia=avis_ia)
            if res.get("pushed"):
                msg += f" ☁ Auteur prévenu (« {res['statut']} »)."
            else:
                msg += f" (pas d'envoi : {res.get('reason', '?')})"
        except SystemExit as e:
            msg += f" (envoi Supabase impossible : {e})"
        except Exception as e:  # réseau coupé, etc. : ne pas planter la page.
            msg += f" (erreur d'envoi : {e})"

    # 3. Miroir de l'état de travail vers Supabase (synchro cross-plateforme).
    #    Best-effort : on n'altère pas le message principal en cas d'échec.
    if remote_id and sub_row:
        _mirror_state(sub_row["submission_id"])

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
        sub_row = conn.execute(
            "SELECT s.id AS sid, s.remote_id FROM boxes b "
            "JOIN submissions s ON b.submission_id = s.id WHERE b.id = ?",
            (box_id,)).fetchone()
    # Miroir de l'état vers Supabase (uniquement si la boîte vient d'un compte).
    if sub_row and sub_row["remote_id"]:
        _mirror_state(sub_row["sid"])
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
    """
    Lance la relecture IA EN ARRIÈRE-PLAN (thread) et redirige aussitôt vers
    la page, qui suit l'avancement via /review-progress (barre de progression).
    On ne bloque plus la requête le temps des appels Gemini (parfois longs à
    cause des pauses anti-quota), d'où la fin de l'onglet qui « charge » sans fin.

    status=None côté review → relit tout le « pipeline » (en attente + validées),
    pas seulement « en attente » : une boîte arrivée déjà « validée » via la sync
    cross-plateforme n'aurait sinon jamais été relue.
    """
    status = request.form.get("status", "en_attente")
    verdict_filter = request.form.get("verdict", "all")

    # Déjà un lot en cours ? On n'en démarre pas un second.
    with _review_lock:
        if _review_state["running"]:
            return _redirect_back(status, verdict_filter,
                                  "Une relecture IA est déjà en cours…")

    # Y a-t-il quelque chose à relire ? Si non, message immédiat (pas de thread,
    # pas de config Gemini inutile).
    with db.connect() as conn:
        todo = db.get_unreviewed_boxes(conn, status=None, limit=REVIEW_BATCH)
    if not todo:
        return _redirect_back(status, verdict_filter,
                              "Relecture IA : aucune boîte à relire.")

    # Initialiser l'état partagé puis lancer le thread de fond.
    with _review_lock:
        _review_state.update({
            "running": True, "total": len(todo), "done": 0, "skipped": 0,
            "valide": 0, "douteux": 0, "rejet": 0,
            "current": "démarrage…", "waiting_until": 0, "message": "",
        })
    threading.Thread(target=_run_review_thread, daemon=True).start()

    # Rediriger avec le drapeau de suivi : la page affichera la barre et
    # interrogera /review-progress jusqu'à la fin.
    import urllib.parse
    q = urllib.parse.urlencode({"status": status, "verdict": verdict_filter,
                                "reviewing": "1"})
    return redirect("/?" + q)


@app.route("/review-progress")
def review_progress():
    """État courant de la relecture IA (JSON), interrogé par la barre."""
    with _review_lock:
        return jsonify(dict(_review_state))


@app.route("/pull-cloud", methods=["POST"])
def pull_cloud_route():
    """
    Récupère les contributions des comptes depuis Supabase et les ingère.
    Rejouable : on dédoublonne sur le remote_id (rien n'est « consommé »
    en ligne, contrairement à la boîte anonyme).
    """
    import pipeline
    try:
        s = pipeline.pull_cloud_and_ingest(limit=200)
    except SystemExit as e:
        # localenv/supabase_client lèvent SystemExit si la config manque
        # (SUPABASE_URL / SUPABASE_SERVICE_KEY absents du .env).
        return _redirect_back("en_attente", "all", str(e))
    msg = (f"Supabase : {s['items']} contribution(s) reçue(s), "
           f"{s['ok']} ingérée(s) ({s['boxes']} boîte(s)), "
           f"{s['skipped']} déjà connue(s), {s['quarantine']} en quarantaine.")
    return _redirect_back("en_attente", "all", msg)


@app.route("/sync", methods=["POST"])
def sync_route():
    """
    Synchronise l'état de travail avec Supabase dans les DEUX sens (phase 6) :
    récupère TOUTES les contributions (pas seulement « en_attente »), ingère
    les inconnues, restaure leur état miroité, et arbitre par horodatage avec
    celles déjà connues (dernière écriture gagne). Permet de retrouver, sur
    cette machine, les contributions déjà validées AILLEURS.
    """
    import pipeline
    try:
        s = pipeline.sync_cloud(limit=1000)
    except SystemExit as e:
        return _redirect_back("en_attente", "all", str(e))
    msg = (f"Synchro ☁ : {s['items']} contribution(s) — "
           f"{s['ingested']} ajoutée(s) ici (dont {s['restored']} avec état restauré), "
           f"{s['pulled']} mise(s) à jour depuis le cloud, "
           f"{s['pushed']} poussée(s) vers le cloud, "
           f"{s['skipped']} inchangée(s)"
           + (f", {s['quarantine']} en quarantaine" if s['quarantine'] else "") + ".")
    return _redirect_back("en_attente", "all", msg)


@app.route("/export", methods=["POST"])
def export_route():
    """Génère le .txt de synthèse (review_*.txt) pour une session Claude."""
    import export
    status = request.form.get("status", "en_attente")
    verdict_filter = request.form.get("verdict", "all")
    # On exporte le statut filtré courant (ou en_attente si 'all', car
    # exporter « tout » mélangerait l'archivé et n'a pas de sens pour Claude).
    exp_status = status if status in db.STATUSES else "en_attente"
    path = export.cmd_export(status=exp_status)
    if path:
        msg = f"Export écrit : {path}"
    else:
        msg = f"Rien à exporter au statut « {exp_status} »."
    return _redirect_back(status, verdict_filter, msg)


@app.route("/archive", methods=["POST"])
def archive_route():
    """Range les boîtes intégrées : integree → archivee."""
    status = request.form.get("status", "en_attente")
    verdict_filter = request.form.get("verdict", "all")
    with db.connect() as conn:
        ids = [r["id"] for r in db.get_boxes(conn, status="integree")]
        n = db.update_status(conn, ids, "archivee") if ids else 0
    msg = (f"{n} boîte(s) intégrée(s) archivée(s)." if n
           else "Aucune boîte intégrée à archiver.")
    return _redirect_back(status, verdict_filter, msg)


@app.route("/purge", methods=["POST"])
def purge_route():
    """
    Supprime DÉFINITIVEMENT les boîtes archivées. Destructeur : on exige
    une case de confirmation (champ caché « confirm=yes ») envoyée par le
    bouton, sinon on refuse.
    """
    status = request.form.get("status", "en_attente")
    verdict_filter = request.form.get("verdict", "all")
    if request.form.get("confirm") != "yes":
        return _redirect_back(status, verdict_filter, "Purge annulée (non confirmée).")
    with db.connect() as conn:
        n = db.delete_archived(conn)
    return _redirect_back(status, verdict_filter,
                          f"{n} boîte(s) archivée(s) supprimée(s) définitivement.")


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
