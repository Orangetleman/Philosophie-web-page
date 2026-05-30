# philo-mailbox — boîte aux lettres des propositions

Petit serveur **Flask** dont le seul rôle est de **recevoir** les
propositions envoyées par le site et de les **empiler**, en attendant que
le « cerveau » local (sur ton PC, dossier `philo-aggregator/`) vienne les
récupérer.

Cette boîte est **volontairement bête** : elle ne lit pas le contenu, ne
juge rien et n'appelle pas Gemini. Toute l'intelligence (relecture IA,
dashboard, validation) reste **en local**, pour deux raisons :

1. L'offre gratuite de PythonAnywhere **bloque les appels sortants** vers
   des services non listés → impossible d'y appeler Gemini.
2. Ta clé Gemini et tes données restent **sur ta machine** (privé).

```
   Site (Vercel)  ──POST /api/proposals──►  philo-mailbox (PythonAnywhere)
                                                    │
   Ton PC (philo-aggregator) ──GET /api/pull────────┘  (secret requis)
                             ──POST /api/ack──►  marque « récupéré »
```

## Les routes

| Méthode & route | Accès | Rôle |
|---|---|---|
| `GET /api/health` | public | Vérifier que le service tourne. |
| `POST /api/proposals` | public | Le site dépose une proposition (texte brut **ou** JSON `{"body":"…"}`). |
| `GET /api/pull?limit=200` | **secret** | Le cerveau local lit les propositions non encore récupérées. |
| `POST /api/ack` | **secret** | Le cerveau confirme : `{"ids":[1,2,3]}` → marquées « récupérées ». |

Le secret se passe via l'en-tête `X-Mailbox-Secret: …` **ou** le paramètre
`?key=…`. Sans bon secret → `401`.

## Configuration (variables d'environnement)

Rien n'est écrit en dur dans le code. Le secret **ne doit jamais** finir
sur GitHub.

| Variable | Défaut | Rôle |
|---|---|---|
| `MAILBOX_SECRET` | *(vide)* | **Obligatoire.** Secret partagé pour `pull`/`ack`. Vide ⇒ ces routes restent fermées. |
| `ALLOWED_ORIGIN` | `*` | Liste blanche d'origines CORS, séparées par des virgules (ex. `https://mon-site.vercel.app,https://preview.vercel.app`). `*` = tout accepter. Une origine hors liste est refusée par le navigateur. |
| `MAX_BODY_BYTES` | `65536` | Taille maxi d'une proposition (64 Kio). |
| `RATE_MAX` | `20` | Nb maxi de POST par IP et par fenêtre. |
| `RATE_WINDOW_S` | `600` | Durée de la fenêtre anti-spam (secondes). |

## Tester en local (avant tout déploiement)

```bash
cd philo-mailbox
python -m venv .venv            # crée un environnement isolé
.venv\Scripts\activate         # (Windows ; sur Mac/Linux : source .venv/bin/activate)
pip install -r requirements.txt

# Définir le secret pour la session (Windows PowerShell) :
$env:MAILBOX_SECRET = "un-secret-quelconque-pour-tester"
python app.py                  # sert sur http://127.0.0.1:5001
```

Dans un autre terminal :

```bash
# Santé
curl http://127.0.0.1:5001/api/health

# Déposer une proposition (le corps DOIT contenir les marqueurs du site)
curl -X POST http://127.0.0.1:5001/api/proposals --data "[PHILO-PROPOSAL-JSON-START]{}[PHILO-PROPOSAL-JSON-END]"

# Récupérer (avec le secret)
curl "http://127.0.0.1:5001/api/pull?key=un-secret-quelconque-pour-tester"
```

## Déployer sur PythonAnywhere (offre gratuite)

1. Crée un compte gratuit sur **pythonanywhere.com** (aucune carte
   bancaire). Ton service sera à `https://<utilisateur>.pythonanywhere.com`.
2. Onglet **Files** (ou `git clone`) : envoie le dossier `philo-mailbox/`.
3. Onglet **Web → Add a new web app → Manual configuration → Python 3.x**.
4. **Virtualenv** : crée-en un et `pip install -r requirements.txt` dedans
   (ou installe Flask en global, l'offre gratuite l'autorise).
5. **Édite le fichier WSGI** (lien dans l'onglet Web). C'est l'endroit où
   l'on règle les variables d'environnement (l'offre gratuite n'a pas
   d'interface pour ça) **et** où l'on importe l'app :

   ```python
   import os
   os.environ["MAILBOX_SECRET"] = "ton-vrai-secret-long-et-aleatoire"
   os.environ["ALLOWED_ORIGIN"] = "https://ton-site.vercel.app"

   import sys
   path = "/home/<utilisateur>/philo-mailbox"
   if path not in sys.path:
       sys.path.insert(0, path)

   from app import application   # Flask cherche la variable `application`
   ```

   > Ce fichier WSGI vit sur **ton** compte PythonAnywhere, pas dans ce
   > dépôt Git : le secret y est donc en sécurité (jamais publié).
6. Clique **Reload**. Teste `https://<utilisateur>.pythonanywhere.com/api/health`.

## Sécurité — l'essentiel

- `pull` et `ack` sont fermés tant que `MAILBOX_SECRET` n'est pas défini.
- Anti-spam : taille plafonnée, marqueurs du site exigés, débit limité par
  IP (en mémoire — assez pour freiner un robot, remis à zéro au reload).
- La boîte ne stocke que du texte brut ; aucune exécution de ce contenu.
- Quand tu migreras vers ta **Freebox**, seul l'hébergement change : le
  même `app.py` tourne derrière n'importe quel serveur WSGI.
