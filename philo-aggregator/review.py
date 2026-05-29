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
import time

import db
import localenv
from export import render_box


# Modèle Gemini par défaut : « flash » est le plus rapide et largement
# suffisant pour un avis de tri ; il est disponible en offre gratuite.
# Surchargé par la variable GEMINI_MODEL dans .env si besoin.
DEFAULT_MODEL = "gemini-1.5-flash"

# Pause (secondes) entre deux appels, pour rester sous la limite de débit
# du palier gratuit (quelques requêtes par minute). Surchargée par
# GEMINI_SLEEP_S dans .env.
DEFAULT_SLEEP_S = 1.0


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
{"verdict": "valide|douteux|rejet", "review": "une à trois phrases"}

- "valide" : rien de bloquant, intégrable tel quel ou presque.
- "douteux" : à vérifier de près (erreur possible, doublon probable,
  formulation floue, hors niveau).
- "rejet" : manifestement faux, hors-sujet ou spam.
Le champ "review" explique brièvement le verdict, en français.
"""


def _configure_model():
    """
    Importe et configure le client Gemini, puis renvoie un objet modèle
    prêt à `generate_content`. Import paresseux : si le paquet n'est pas
    installé, on donne un message d'installation clair au lieu d'un
    ImportError brut.
    """
    try:
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
    Extrait {verdict, review} de la réponse brute de Gemini.

    Gemini renvoie normalement du JSON pur (on le lui a demandé), mais il
    arrive qu'il l'entoure de ``` ou de ```json. On retire donc ces
    clôtures de code éventuelles avant de parser. En dernier recours, si
    le parsing échoue, on renvoie un verdict « douteux » avec la réponse
    brute en explication : mieux vaut signaler à l'humain que planter.
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
        if verdict not in db.AI_VERDICTS:
            # Verdict inattendu : on le rétrograde en « douteux » plutôt
            # que de lever une erreur (db.set_ai_review refuserait sinon).
            return ("douteux", f"Verdict IA non reconnu ({verdict!r}). "
                               f"Réponse : {review}")
        return (verdict, review)
    except (ValueError, AttributeError):
        return ("douteux", f"Réponse IA non parsable : {text!r}")


def review_box(model, row):
    """
    Soumet une boîte à Gemini et renvoie (verdict, review).

    On enveloppe l'appel réseau dans un try/except large : une panne
    ponctuelle (quota dépassé, coupure) ne doit pas interrompre tout le
    lot. On renvoie alors (None, message) — None signifie « pas de
    verdict », l'appelant n'enregistre rien et la boîte sera retentée
    au prochain `review`.
    """
    prompt = (
        "Voici la proposition à évaluer :\n\n"
        + render_box(row)
        + "\n\nDonne ton verdict au format JSON demandé."
    )
    try:
        resp = model.generate_content(prompt)
        return parse_verdict(resp.text)
    except Exception as e:                      # noqa: BLE001 (on veut tout attraper)
        return (None, f"Appel Gemini échoué : {e}")


def run(limit=None, redo=False, status="en_attente"):
    """
    Relit par l'IA les boîtes au statut donné.

    `redo=False` (défaut) : seulement celles pas encore relues
        (ai_verdict NULL). `redo=True` : toutes (re-soumet même celles
        déjà relues — utile après avoir changé le modèle ou la consigne).
    `limit` : nombre maxi de boîtes à traiter (ménage le quota gratuit).

    On enregistre chaque verdict immédiatement (une transaction par boîte)
    pour ne rien perdre si l'on interrompt le lot en cours.

    Renvoie un dico récapitulatif {done, skipped, valide, douteux, rejet}
    (utilisé par le bouton « Relire » du dashboard ; le CLI, lui, se sert
    surtout de l'affichage ligne à ligne).
    """
    with db.connect() as conn:
        if redo:
            rows = db.get_boxes(conn, status=status)
            if limit:
                rows = rows[:int(limit)]
        else:
            rows = db.get_unreviewed_boxes(conn, status=status, limit=limit)

    if not rows:
        print(f"(aucune boîte à relire au statut '{status}')")
        return {"done": 0, "skipped": 0, "valide": 0, "douteux": 0, "rejet": 0}

    model = _configure_model()
    sleep_s = float(localenv.get("GEMINI_SLEEP_S", DEFAULT_SLEEP_S))

    n_done = n_skipped = 0
    counts = {"valide": 0, "douteux": 0, "rejet": 0}
    print(f"Relecture IA de {len(rows)} boîte(s)…\n")
    for i, row in enumerate(rows):
        verdict, review = review_box(model, row)
        if verdict is None:
            # Échec d'appel : on n'enregistre rien, on signale et continue.
            n_skipped += 1
            print(f"  #{row['id']:>3}  ⏭  {review}")
        else:
            with db.connect() as conn:
                db.set_ai_review(conn, row["id"], verdict, review)
            n_done += 1
            counts[verdict] += 1
            mark = {"valide": "✓", "douteux": "?", "rejet": "✗"}[verdict]
            print(f"  #{row['id']:>3}  {mark} {verdict:<8} {review}")
        # Pause entre deux appels, sauf après le dernier.
        if sleep_s > 0 and i < len(rows) - 1:
            time.sleep(sleep_s)

    print()
    print(f"Relecture terminée : {n_done} enregistrée(s)"
          + (f", {n_skipped} en échec (à retenter)" if n_skipped else "") + ".")
    print(f"  valide : {counts['valide']}   "
          f"douteux : {counts['douteux']}   rejet : {counts['rejet']}")

    return {"done": n_done, "skipped": n_skipped, **counts}
