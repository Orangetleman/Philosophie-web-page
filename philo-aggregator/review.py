"""
review.py — pré-vérification des propositions par l'IA (Google Gemini).

Pour chaque boîte en attente, on demande à Gemini un avis rapide :
  - le contenu est-il exact, pertinent, de niveau Terminale ?
  - y a-t-il une erreur factuelle manifeste, un hors-sujet, un spam ?
Gemini renvoie un VERDICT (valide / douteux / rejet) accompagné d'une
courte explication. On range les deux en base (colonnes `ai_verdict` et
`ai_review`, cf. db.set_ai_review).

⚠ Cet avis n'est qu'une AIDE au tri. La décision finale reste 100 %
humaine, dans le dashboard : l'IA peut se tromper, surtout sur les
nuances philosophiques. Le verdict sert juste à faire remonter en
priorité ce qui mérite un coup d'œil.

Choix techniques :
  - La clé API est lue dans .env (GEMINI_API_KEY) — jamais en dur.
  - Le module `google.generativeai` est importé PARESSEUSEMENT (au moment
    de l'appel), pour que les commandes hors-ligne (list, show, export…)
    continuent de marcher même si cette dépendance n'est pas installée.
  - On réutilise `export.render_box` pour décrire la boîte à Gemini : le
    contributeur et l'IA voient ainsi exactement le même rendu lisible.
"""

import json
import re
import sys
import time

import db
import localenv
from export import render_box


# Modèle Gemini par défaut : « flash » est le plus rapide et largement
# suffisant pour un avis de tri ; il est disponible en offre gratuite.
# On vise l'ALIAS « -latest » plutôt qu'une version datée (gemini-1.5-flash,
# gemini-2.0-flash…) : Google retire régulièrement les versions datées
# (erreur 404 « model is not found »), alors que l'alias suit toujours le
# flash courant. Surchargé par la variable GEMINI_MODEL dans .env si besoin.
DEFAULT_MODEL = "gemini-flash-latest"

# Pause (secondes) entre deux appels, pour rester sous la limite de débit
# du palier gratuit (quelques requêtes par minute). Surchargée par
# GEMINI_SLEEP_S dans .env.
DEFAULT_SLEEP_S = 1.0


def _say(msg):
    """
    print() robuste à l'encodage de la console. Sous Windows, une console en
    cp1252 ne sait pas afficher ✓ ✗ ⏳ … (hors de son jeu de caractères) et
    print() lèverait alors UnicodeEncodeError — ce qui, dans le thread de
    relecture du dashboard, avorterait TOUT le lot. On retombe ici sur un
    rendu « au mieux » (caractères inconnus remplacés) au lieu de planter.
    """
    try:
        print(msg)
    except UnicodeEncodeError:
        enc = getattr(sys.stdout, "encoding", None) or "ascii"
        print(msg.encode(enc, "replace").decode(enc, "replace"))


# Consigne « système » donnée à Gemini : son rôle et le format EXACT de
# réponse attendu. On exige du JSON pur pour pouvoir le parser sans
# ambiguïté (cf. parse_verdict).
SYSTEM_INSTRUCTION = """\
Tu es correcteur de philosophie pour des élèves de Terminale (France).
On te soumet une proposition de contribution à un site de révision
(ajout, correction ou remarque sur une notion, un auteur, un texte, un
concept ou une dissertation).

Évalue-la sur trois critères :
  1. Exactitude : pas d'erreur factuelle ou d'attribution fausse.
  2. Pertinence : en lien avec le programme de philosophie de Terminale.
  3. Clarté : formulation compréhensible, niveau lycée.

Réponds UNIQUEMENT par un objet JSON valide, sans texte autour, de la
forme exacte :
{"verdict": "valide|douteux|rejet", "review": "une à trois phrases",
 "message_contributeur": "une à deux phrases"}

- "verdict" : "valide" (rien de bloquant, intégrable tel quel ou presque),
  "douteux" (à vérifier de près : erreur possible, doublon probable,
  formulation floue, hors niveau) ou "rejet" (manifestement faux,
  hors-sujet ou spam).
- "review" : explique brièvement le verdict, en français, pour le
  RELECTEUR du site (langage technique permis : « doublon probable »,
  « attribution à vérifier »…).
- "message_contributeur" : la MÊME appréciation, mais rédigée pour la
  personne qui a fait la proposition — un élève, pas un développeur.
  Règles : tutoiement, ton bienveillant et encourageant, français simple,
  AUCUN jargon (ne dis jamais « verdict », « valide/douteux/rejet »,
  « doublon », « base de données »). Remercie pour la contribution, puis,
  si besoin, indique avec tact le point à revoir. Reste FACTUEL : ne
  promets pas que la proposition sera publiée (un humain tranche ensuite).
"""


def _configure_model():
    """
    Importe et configure le client Gemini, puis renvoie un objet modèle
    prêt à `generate_content`. Import paresseux : si le paquet n'est pas
    installé, on donne un message d'installation clair au lieu d'un
    ImportError brut.
    """
    try:
        # Le paquet google.generativeai émet un FutureWarning bruyant à
        # l'import (Google le marque « déprécié » au profit de google.genai).
        # Il reste fonctionnel ; on masque juste l'avertissement le temps de
        # l'import pour garder une sortie lisible.
        import warnings
        with warnings.catch_warnings():
            warnings.simplefilter("ignore", FutureWarning)
            import google.generativeai as genai
    except ImportError:
        raise SystemExit(
            "Le paquet 'google-generativeai' n'est pas installé.\n"
            "Installe les dépendances du cerveau local avec :\n"
            "  pip install -r requirements.txt"
        )
    genai.configure(api_key=localenv.require("GEMINI_API_KEY"))
    model_name = localenv.get("GEMINI_MODEL", DEFAULT_MODEL)
    return genai.GenerativeModel(
        model_name,
        system_instruction=SYSTEM_INSTRUCTION,
    )


def parse_verdict(text):
    """
    Extrait (verdict, review, message_contributeur) de la réponse brute.

    Gemini renvoie normalement du JSON pur (on le lui a demandé), mais il
    arrive qu'il l'entoure de ``` ou de ```json. On retire donc ces
    clôtures de code éventuelles avant de parser. En dernier recours, si
    le parsing échoue, on renvoie un verdict « douteux » avec la réponse
    brute en explication : mieux vaut signaler à l'humain que planter.

    Trois valeurs renvoyées :
      - verdict : "valide" | "douteux" | "rejet" (pour le tri du relecteur) ;
      - review  : explication courte pour le RELECTEUR (jargon permis) ;
      - user_message : la MÊME appréciation rédigée pour le CONTRIBUTEUR
        (élève, pas développeur). Vide ("") si le modèle ne l'a pas fournie
        — c'est facultatif côté pipeline, le relecteur tranche de toute façon.
    """
    raw = (text or "").strip()
    # Retirer une clôture Markdown ```...``` si présente.
    if raw.startswith("```"):
        raw = raw.strip("`")
        # Après avoir retiré les backticks, une étiquette de langage
        # (« json ») peut subsister en tête de ligne : on la coupe.
        if raw[:4].lower() == "json":
            raw = raw[4:]
        raw = raw.strip()
    try:
        obj = json.loads(raw)
        verdict = obj.get("verdict")
        review = obj.get("review") or ""
        # Message destiné au contributeur ; absent des anciennes réponses
        # (avant l'ajout du 3e champ) → on tolère l'absence avec "".
        user_message = obj.get("message_contributeur") or ""
        if verdict not in db.AI_VERDICTS:
            # Verdict inattendu : on le rétrograde en « douteux » plutôt
            # que de lever une erreur (db.set_ai_review refuserait sinon).
            return ("douteux", f"Verdict IA non reconnu ({verdict!r}). "
                               f"Réponse : {review}", user_message)
        return (verdict, review, user_message)
    except (ValueError, AttributeError):
        return ("douteux", f"Réponse IA non parsable : {text!r}", "")


# Plafond de la pause d'attente sur 429 : on ne dort jamais plus longtemps que
# ça, même si Google suggérait davantage (évite de bloquer le dashboard une
# minute entière). La fenêtre « par minute » du palier gratuit se purge vite.
MAX_BACKOFF_S = 65.0
# Nombre de re-tentatives sur un 429 (quota par minute) avant d'abandonner.
RATE_LIMIT_RETRIES = 3


def _is_rate_limit(err):
    """Vrai si l'exception ressemble à un dépassement de quota / débit (429)."""
    s = str(err).lower()
    return ("429" in s or "quota" in s or "rate" in s
            or "resourceexhausted" in s or "exceeded" in s)


def _retry_after_seconds(err_text, default=20.0):
    """
    Extrait le délai d'attente suggéré par Google dans le message d'erreur
    (« retry in 26.5s », ou le bloc « retry_delay { seconds: 26 } »). Renvoie
    `default` si rien n'est trouvé. On ajoute 1 s de marge et on borne au
    plafond MAX_BACKOFF_S.
    """
    m = re.search(r"retry(?:_delay)?[^0-9]*?(\d+(?:\.\d+)?)\s*s", err_text, re.I)
    if not m:
        m = re.search(r"seconds:\s*(\d+)", err_text)
    try:
        wait = float(m.group(1)) + 1.0 if m else default
    except (TypeError, ValueError):
        wait = default
    return min(wait, MAX_BACKOFF_S)


def review_box(model, row, on_wait=None):
    """
    Soumet une boîte à Gemini et renvoie (verdict, review, user_message).

    On enveloppe l'appel réseau dans un try/except large : une panne
    ponctuelle (coupure) ne doit pas interrompre tout le lot. On renvoie
    alors (None, message, "") — None signifie « pas de verdict », l'appelant
    n'enregistre rien et la boîte sera retentée au prochain `review`.

    Cas particulier du 429 (quota « par minute » du palier gratuit dépassé) :
    plutôt que d'abandonner tout de suite, on PATIENTE le délai indiqué par
    Google puis on re-tente (jusqu'à RATE_LIMIT_RETRIES fois). La fenêtre se
    purgeant en quelques dizaines de secondes, le lot finit par passer au lieu
    d'échouer en bloc.

    `on_wait` : callback optionnel appelé `on_wait(resume_ts)` au début d'une
    pause anti-quota (resume_ts = horodatage epoch de reprise prévue), puis
    `on_wait(0)` à la reprise. Sert au compte à rebours de la barre de
    progression du dashboard.
    """
    prompt = (
        "Voici la proposition à évaluer :\n\n"
        + render_box(row)
        + "\n\nDonne ton verdict au format JSON demandé."
    )
    for attempt in range(RATE_LIMIT_RETRIES + 1):
        try:
            resp = model.generate_content(prompt)
            return parse_verdict(resp.text)
        except Exception as e:                  # noqa: BLE001 (on veut tout attraper)
            # 429 et il reste des tentatives → on attend puis on recommence.
            if _is_rate_limit(e) and attempt < RATE_LIMIT_RETRIES:
                wait = _retry_after_seconds(str(e))
                _say(f"     ⏳ quota atteint, pause {wait:.0f}s "
                     f"(tentative {attempt + 1}/{RATE_LIMIT_RETRIES})…")
                # Épingle l'heure de reprise (pour le compte à rebours), patiente,
                # puis lève le drapeau d'attente.
                if on_wait:
                    on_wait(time.time() + wait)
                time.sleep(wait)
                if on_wait:
                    on_wait(0)
                continue
            return (None, f"Appel Gemini échoué : {e}", "")


def run(limit=None, redo=False, status="en_attente", on_progress=None):
    """
    Relit par l'IA les boîtes au statut donné.

    `status` : un statut précis (ex. "en_attente"), ou None pour couvrir
        tous les statuts « encore dans le pipeline » (en_attente + validee,
        cf. db.REVIEWABLE_STATUSES). None est utilisé par le bouton
        « Relire » du dashboard, pour rattraper les boîtes arrivées déjà
        « validée » (sync cross-plateforme) sans transiter par « en attente ».
    `redo=False` (défaut) : seulement celles pas encore relues
        (ai_verdict NULL). `redo=True` : toutes (re-soumet même celles
        déjà relues — utile après avoir changé le modèle ou la consigne).
    `limit` : nombre maxi de boîtes à traiter (ménage le quota gratuit).
    `on_progress` : callback optionnel appelé au démarrage puis après CHAQUE
        boîte, avec un dico {done, skipped, total, valide, douteux, rejet,
        current}. Sert à la barre de progression du dashboard (le travail
        tournant dans un thread de fond ; cf. dashboard._run_review_thread).

    On enregistre chaque verdict immédiatement (une transaction par boîte)
    pour ne rien perdre si l'on interrompt le lot en cours.

    Renvoie un dico récapitulatif {done, skipped, valide, douteux, rejet}
    (utilisé par le bouton « Relire » du dashboard ; le CLI, lui, se sert
    surtout de l'affichage ligne à ligne).
    """
    with db.connect() as conn:
        if redo:
            # status=None → on re-relit tout le « pipeline » (en_attente +
            # validee) ; sinon le statut demandé. get_boxes(status=None)
            # renverrait TOUTES les boîtes (y compris intégrées/archivées),
            # ce qu'on ne veut pas dépenser en quota.
            statuses = db.REVIEWABLE_STATUSES if status is None else (status,)
            rows = [r for s in statuses for r in db.get_boxes(conn, status=s)]
            # Les retours sur le site ne sont pas du contenu philosophique :
            # Gemini n'a rien à y vérifier. get_unreviewed_boxes les exclut
            # déjà côté SQL ; pour le chemin --redo (get_boxes = tout), on
            # les écarte ici afin que la consigne reste cohérente.
            rows = [r for r in rows if r["cible"] not in db.SITE_CIBLES]
            if limit:
                rows = rows[:int(limit)]
        else:
            rows = db.get_unreviewed_boxes(conn, status=status, limit=limit)

    if not rows:
        label = status if status is not None else "à trier (en attente / validées)"
        _say(f"(aucune boîte à relire au statut '{label}')")
        return {"done": 0, "skipped": 0, "valide": 0, "douteux": 0, "rejet": 0}

    model = _configure_model()
    sleep_s = float(localenv.get("GEMINI_SLEEP_S", DEFAULT_SLEEP_S))

    total = len(rows)
    n_done = n_skipped = 0
    counts = {"valide": 0, "douteux": 0, "rejet": 0}

    def _emit(current="", waiting_until=0):
        """Pousse l'avancement courant au callback (no-op si absent).

        `waiting_until` (epoch, 0 si pas d'attente) alimente le compte à
        rebours pendant une pause anti-quota côté dashboard."""
        if on_progress:
            on_progress({"done": n_done, "skipped": n_skipped, "total": total,
                         "valide": counts["valide"], "douteux": counts["douteux"],
                         "rejet": counts["rejet"], "current": current,
                         "waiting_until": waiting_until})

    _say(f"Relecture IA de {total} boîte(s)…\n")
    _emit("démarrage…")
    for i, row in enumerate(rows):
        # Notifie une éventuelle pause anti-quota (pour le compte à rebours) ;
        # _rid capture l'id de la boîte courante.
        def _on_wait(resume_ts, _rid=row["id"]):
            _emit(current=f"#{_rid}", waiting_until=resume_ts)
        verdict, review, user_message = review_box(model, row, on_wait=_on_wait)
        if verdict is None:
            # Échec d'appel : on n'enregistre rien, on signale et continue.
            n_skipped += 1
            _say(f"  #{row['id']:>3}  ⏭  {review}")
        else:
            with db.connect() as conn:
                # On enregistre l'avis relecteur ET le message contributeur :
                # ce dernier alimentera le champ « explication » renvoyé à
                # l'élève (cf. dashboard, pré-rempli mais validé par l'humain).
                db.set_ai_review(conn, row["id"], verdict, review,
                                 user_message)
            n_done += 1
            counts[verdict] += 1
            mark = {"valide": "✓", "douteux": "?", "rejet": "✗"}[verdict]
            _say(f"  #{row['id']:>3}  {mark} {verdict:<8} {review}")
        _emit(f"#{row['id']}")
        # Pause entre deux appels, sauf après le dernier.
        if sleep_s > 0 and i < total - 1:
            time.sleep(sleep_s)

    _say("")
    _say(f"Relecture terminée : {n_done} enregistrée(s)"
         + (f", {n_skipped} en échec (à retenter)" if n_skipped else "") + ".")
    _say(f"  valide : {counts['valide']}   "
         f"douteux : {counts['douteux']}   rejet : {counts['rejet']}")

    return {"done": n_done, "skipped": n_skipped, **counts}
