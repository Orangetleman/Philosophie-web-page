"""
app.py — boîte aux lettres publique (à déployer sur PythonAnywhere).

Rôle unique : recevoir les propositions envoyées par le site et les
empiler, puis laisser le « cerveau » local (sur ton PC) les récupérer via
une URL protégée par un secret. La boîte ne lit pas, ne juge pas et ne fait
PAS appel à Gemini (l'offre gratuite de PythonAnywhere bloque de toute
façon les appels sortants) : toute l'intelligence reste en local.

Quatre routes :
  GET  /api/health     — vérifier que le service tourne.
  POST /api/proposals  — public. Le site y poste une proposition.
  GET  /api/pull       — privé (secret). Le cerveau local récupère les
                         propositions pas encore traitées.
  POST /api/ack        — privé (secret). Le cerveau confirme la réception
                         (marque les soumissions comme récupérées).

Configuration par variables d'environnement (jamais en dur dans le code) :
  MAILBOX_SECRET   — secret partagé pour /api/pull et /api/ack (OBLIGATOIRE).
  ALLOWED_ORIGIN   — origine autorisée pour le CORS (défaut « * »).
  MAX_BODY_BYTES   — taille maxi d'une proposition (défaut 65536 = 64 Kio).
  RATE_MAX         — nb maxi de POST par IP et par fenêtre (défaut 20).
  RATE_WINDOW_S    — durée de la fenêtre anti-spam en secondes (défaut 600).
"""

import os
import json

from flask import Flask, request, jsonify

import store
import util


app = Flask(__name__)

# ── Configuration (lue dans l'environnement au démarrage) ────────────────
SECRET = os.environ.get("MAILBOX_SECRET", "")
ALLOWED_ORIGIN = os.environ.get("ALLOWED_ORIGIN", "*")
MAX_BODY_BYTES = int(os.environ.get("MAX_BODY_BYTES", "65536"))
RATE_MAX = int(os.environ.get("RATE_MAX", "20"))
RATE_WINDOW_S = int(os.environ.get("RATE_WINDOW_S", "600"))

# Flask refuse lui-même un corps plus gros que cette taille (erreur 413),
# AVANT même de le lire entièrement en mémoire — première barrière.
app.config["MAX_CONTENT_LENGTH"] = MAX_BODY_BYTES

# Limiteur de débit partagé (en mémoire) pour l'endpoint public.
limiter = util.RateLimiter(RATE_MAX, RATE_WINDOW_S)

# La table est créée au démarrage si elle n'existe pas encore.
store.init_db()


# ── CORS : autoriser le site (autre domaine) à appeler l'API ─────────────
# Par sécurité, le navigateur bloque les requêtes JS vers un AUTRE domaine
# (« same-origin policy »). Ces en-têtes disent « j'autorise telle origine
# à m'appeler ». On les ajoute à CHAQUE réponse (succès comme erreur).
@app.after_request
def add_cors_headers(resp):
    resp.headers["Access-Control-Allow-Origin"] = ALLOWED_ORIGIN
    resp.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    resp.headers["Access-Control-Allow-Headers"] = "Content-Type, X-Mailbox-Secret"
    return resp


def _check_secret():
    """
    Vrai si la requête présente le bon secret (en-tête X-Mailbox-Secret
    ou paramètre ?key=). On refuse aussi quand AUCUN secret n'est configuré
    côté serveur : pas de secret = endpoint privé fermé (jamais ouvert par
    défaut).
    """
    if not SECRET:
        return False
    given = request.headers.get("X-Mailbox-Secret") or request.args.get("key", "")
    return given == SECRET


# ── Routes ───────────────────────────────────────────────────────────────

@app.route("/api/health", methods=["GET"])
@app.route("/", methods=["GET"])
def health():
    """Vérifie d'un coup d'œil que le service tourne (public, sans détail)."""
    return jsonify(ok=True, service="philo-mailbox")


@app.route("/api/proposals", methods=["POST", "OPTIONS"])
def receive_proposal():
    """
    Reçoit une proposition du site (public).

    La requête OPTIONS est le « préflight » CORS : le navigateur l'envoie
    automatiquement avant un POST « non simple », juste pour demander la
    permission. On y répond vide (204). Pour un vrai POST : on lit le
    corps, on applique les garde-fous (taille, anti-spam, débit) puis on
    stocke.

    Le corps accepté est soit du texte brut, soit du JSON {"body": "..."}.
    """
    if request.method == "OPTIONS":
        return ("", 204)

    raw = request.get_data(cache=False)
    if len(raw) > MAX_BODY_BYTES:           # double barrière (cf. MAX_CONTENT_LENGTH)
        return jsonify(ok=False, error="Proposition trop volumineuse."), 413
    body = raw.decode("utf-8", errors="replace")

    # Si le site a envoyé du JSON {"body": "..."} on en extrait le texte.
    if "application/json" in request.headers.get("Content-Type", ""):
        try:
            body = (json.loads(body) or {}).get("body", "") or ""
        except ValueError:
            return jsonify(ok=False, error="JSON invalide."), 400

    # Anti-spam le moins cher : il faut les marqueurs du site.
    if not util.looks_like_proposal(body):
        return jsonify(ok=False, error="Format non reconnu."), 400

    # Limite de débit par IP (anti-flood).
    ip = util.client_ip(
        request.headers.get("X-Forwarded-For"),
        request.headers.get("X-Real-IP"),
        request.remote_addr,
    )
    if not limiter.allow(ip):
        return jsonify(ok=False, error="Trop de requêtes, réessaie plus tard."), 429

    new_id = store.add_incoming(body, ip)
    return jsonify(ok=True, id=new_id), 201


@app.route("/api/pull", methods=["GET"])
def pull():
    """Récupère les propositions non traitées (privé, secret requis)."""
    if not _check_secret():
        return jsonify(ok=False, error="Non autorisé."), 401
    # `limit` borné à [1, 1000] pour éviter une réponse démesurée.
    try:
        limit = max(1, min(1000, int(request.args.get("limit", "200"))))
    except ValueError:
        limit = 200
    return jsonify(ok=True, items=store.get_unpulled(limit))


@app.route("/api/ack", methods=["POST", "OPTIONS"])
def ack():
    """Confirme la réception : marque des soumissions comme récupérées (privé)."""
    if request.method == "OPTIONS":
        return ("", 204)
    if not _check_secret():
        return jsonify(ok=False, error="Non autorisé."), 401
    try:
        payload = request.get_json(force=True, silent=False) or {}
    except Exception:
        return jsonify(ok=False, error="JSON invalide."), 400
    ids = payload.get("ids") or []
    if not isinstance(ids, list):
        return jsonify(ok=False, error="'ids' doit être une liste."), 400
    return jsonify(ok=True, acked=store.mark_pulled(ids))


# PythonAnywhere (et la plupart des hébergeurs WSGI) cherchent une variable
# nommée `application`. On la fait pointer sur notre app Flask.
application = app


if __name__ == "__main__":
    # Lancement local pour tester (http://127.0.0.1:5001). En production,
    # c'est le serveur WSGI de l'hébergeur qui sert `application` ; ce bloc
    # n'est PAS utilisé là-bas.
    app.run(host="127.0.0.1", port=5001, debug=False)
