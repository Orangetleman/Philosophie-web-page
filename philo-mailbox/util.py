"""
util.py — petits utilitaires SANS dépendance pour la boîte aux lettres :
  - looks_like_proposal : « ça ressemble à une vraie proposition du site ? »
  - client_ip           : retrouver l'IP réelle du visiteur derrière le proxy
  - RateLimiter         : limite de débit par IP (anti-spam basique)

Séparés d'app.py exprès : aucune dépendance à Flask, donc testables seuls
(et réutilisables si l'on change un jour de cadre web).
"""

import time
import threading
from collections import deque


# Marqueurs que le site insère toujours autour du bloc JSON machine. Si le
# corps reçu ne les contient pas, ce n'est pas une proposition issue de
# notre site : on rejette. C'est le filtre anti-spam le moins cher possible.
MARKER_START = "[PHILO-PROPOSAL-JSON-START]"
MARKER_END = "[PHILO-PROPOSAL-JSON-END]"


def looks_like_proposal(body):
    """Vrai si `body` contient les deux marqueurs, dans le bon ordre."""
    if not body:
        return False
    i = body.find(MARKER_START)
    j = body.find(MARKER_END)
    return i != -1 and j != -1 and i < j


def client_ip(forwarded_for, real_ip, remote_addr):
    """
    Devine l'IP réelle du client.

    Derrière un proxy (cas de PythonAnywhere), `remote_addr` est l'IP du
    proxy, pas celle du visiteur : la vraie IP est en tête de l'en-tête
    `X-Forwarded-For` (liste « client, proxy1, proxy2 »), sinon dans
    `X-Real-IP`. On retombe sur `remote_addr` en dernier recours.
    """
    if forwarded_for:
        # Le premier élément de la liste est le client d'origine.
        return forwarded_for.split(",")[0].strip()
    if real_ip:
        return real_ip.strip()
    return remote_addr or "?"


class RateLimiter:
    """
    Limiteur de débit en mémoire, par clé (ici l'IP) : au plus `max_hits`
    requêtes par fenêtre glissante de `window_s` secondes.

    « En mémoire » = remis à zéro si le serveur redémarre ; c'est assez
    pour freiner un robot, pas une sécurité forte. `threading.Lock` protège
    l'accès concurrent (plusieurs requêtes peuvent arriver en même temps).

    Pour chaque clé on garde une file (deque) des horodatages récents ; à
    chaque appel on jette ceux sortis de la fenêtre, puis on compte.
    """

    def __init__(self, max_hits, window_s):
        self.max_hits = max_hits
        self.window_s = window_s
        self._hits = {}            # clé -> deque[timestamps]
        self._lock = threading.Lock()

    def allow(self, key, now=None):
        """
        Enregistre un appel pour `key` ; renvoie False si la limite est
        déjà atteinte (l'appel est alors refusé et NON compté).
        `now` injectable pour les tests (sinon l'heure courante).
        """
        now = time.time() if now is None else now
        with self._lock:
            dq = self._hits.get(key)
            if dq is None:
                dq = deque()
                self._hits[key] = dq
            # Purge des horodatages trop vieux (sortis de la fenêtre).
            cutoff = now - self.window_s
            while dq and dq[0] < cutoff:
                dq.popleft()
            if len(dq) >= self.max_hits:
                return False
            dq.append(now)
            return True
