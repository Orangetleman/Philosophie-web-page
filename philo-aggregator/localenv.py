"""
localenv.py — chargement minimal d'un fichier `.env` (sans dépendance).

Le « cerveau » local a besoin de quelques secrets qui NE DOIVENT JAMAIS
finir sur Git :
  - MAILBOX_URL    : l'adresse de la boîte aux lettres en ligne.
  - MAILBOX_SECRET : le secret partagé pour `pull` / `ack`.
  - GEMINI_API_KEY : la clé de l'API Gemini (relecture IA).

On les range dans un fichier `.env` (ignoré par `.gitignore`) au format
« CLE=valeur », une par ligne. Ce module lit ce fichier et renvoie les
valeurs — inutile d'installer la bibliothèque tierce `python-dotenv`,
quelques lignes de bibliothèque standard suffisent.

Ordre de priorité d'une valeur de config :
  1. variable d'environnement réelle du système (si définie) ;
  2. sinon, valeur trouvée dans `.env` ;
  3. sinon, le défaut passé à `get()`.
Cet ordre permet, par exemple, de surcharger ponctuellement une valeur
depuis le terminal sans toucher au fichier.
"""

import os
import pathlib


# Le `.env` est cherché à côté de ce fichier (= dossier philo-aggregator).
SCRIPT_DIR = pathlib.Path(__file__).resolve().parent
ENV_PATH = SCRIPT_DIR / ".env"


def load_env(path=ENV_PATH):
    """
    Lit le fichier `.env` et renvoie un dico {CLE: valeur}.

    Règles de parsing (volontairement simples) :
      - les lignes vides et celles commençant par « # » sont ignorées ;
      - une ligne valide contient un « = » : la partie avant est la clé,
        la partie après est la valeur ;
      - les espaces autour de la clé et de la valeur sont retirés ;
      - si la valeur est entourée de guillemets (simples ou doubles),
        on les retire (pratique si le secret contient des espaces).

    Si le fichier n'existe pas, on renvoie un dico vide (pas d'erreur :
    l'appelant décidera si telle ou telle clé est obligatoire).
    """
    data = {}
    p = pathlib.Path(path)
    if not p.exists():
        return data
    for raw in p.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#"):
            continue
        if "=" not in line:
            continue
        key, val = line.split("=", 1)   # split sur le 1er « = » seulement
        key = key.strip()
        val = val.strip()
        # Retirer une éventuelle paire de guillemets entourants.
        if len(val) >= 2 and val[0] == val[-1] and val[0] in ("'", '"'):
            val = val[1:-1]
        if key:
            data[key] = val
    return data


# Cache du `.env` : on ne relit le fichier qu'une fois par exécution.
_CACHE = None


def get(key, default=None):
    """
    Renvoie la valeur de config `key` selon l'ordre de priorité décrit
    en tête de module (environnement réel, puis `.env`, puis `default`).
    """
    global _CACHE
    if key in os.environ:           # 1) variable d'environnement réelle
        return os.environ[key]
    if _CACHE is None:              # 2) .env (chargé paresseusement, une fois)
        _CACHE = load_env()
    return _CACHE.get(key, default)


def require(key):
    """
    Comme `get()`, mais lève une erreur claire (et arrête le programme)
    si la clé est absente ou vide. À utiliser pour les secrets sans
    lesquels la commande ne peut pas fonctionner.

    `SystemExit` affiche le message et termine proprement avec le code 2,
    sans la longue trace d'exception Python qui ferait peur pour une
    simple config manquante.
    """
    val = get(key)
    if not val:
        raise SystemExit(
            f"Configuration manquante : {key!r}.\n"
            f"Ajoute une ligne « {key}=... » dans le fichier :\n"
            f"  {ENV_PATH}\n"
            f"(modèle disponible dans .env.example)."
        )
    return val
