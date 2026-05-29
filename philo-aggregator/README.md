# philo-aggregator

Outil en ligne de commande qui agrège les propositions de contribution
envoyées par les visiteurs du site **Graphe Philosophie — Terminale**.

Chaque proposition arrive sous forme de fichier `.txt` (corps d'un mail
généré par le formulaire de contribution du site). Ce programme :

1. extrait le bloc JSON délimité par `[PHILO-PROPOSAL-JSON-START]` /
   `[PHILO-PROPOSAL-JSON-END]` ;
2. stocke chaque boîte dans une base SQLite locale (`proposals.db`) ;
3. permet de consulter, filtrer, dédoublonner ;
4. génère un grand `.txt` de synthèse à coller dans une session Claude
   pour la revue et l'intégration finale dans `index.html`.

## Prérequis

- Python 3.7 ou plus récent.
- **Cœur de l'outil** (`ingest`, `list`, `show`, `dupes`, `export`,
  `mark`, `note`, `archive`, `purge`, `stats`) : **aucune dépendance**,
  tout est en bibliothèque standard (`argparse`, `sqlite3`, `json`, `re`,
  `hashlib`, `difflib`, `unicodedata`, `pathlib`, `urllib`).
- **Cerveau local** (`pull`, `review`, `dashboard`) : nécessite deux
  paquets, installés via `pip install -r requirements.txt` (Flask pour le
  dashboard, google-generativeai pour la relecture IA). `pull` seul
  n'utilise qu'`urllib` (stdlib).

## Utilisation rapide

```powershell
# 1. Déposer un ou plusieurs .txt dans inbox/
# 2. Ingérer
python aggregate.py ingest

# 3. Voir ce qu'il y a en attente
python aggregate.py list

# 4. Détail d'une boîte
python aggregate.py show 42

# 5. Détecter doublons et propositions proches
python aggregate.py dupes

# 6. Générer le .txt de revue pour Claude (review_YYYYMMDD.txt)
python aggregate.py export

# 7. Après revue manuelle dans Claude, marquer ce qui est intégré
python aggregate.py mark 12 17 23 --as integree

# 8. Archiver et purger plus tard
python aggregate.py archive --yes
python aggregate.py purge --before 2026-12-01 --yes
```

## Le cerveau local (en ligne → base → tri)

Au lieu de déposer des `.txt` à la main, on peut récupérer les
propositions directement depuis la **boîte aux lettres** en ligne (dossier
`philo-mailbox`, déployée sur PythonAnywhere), les faire **pré-vérifier
par Gemini**, puis les trier dans un **tableau de bord local**.

### Configuration (une fois)

```powershell
# 1. Installer les dépendances du cerveau
pip install -r requirements.txt

# 2. Créer le fichier de secrets (jamais publié : ignoré par Git)
copy .env.example .env
#    …puis ouvrir .env et coller : le secret de la boîte (MAILBOX_SECRET)
#    et la clé Gemini (GEMINI_API_KEY).
```

### Flux

```powershell
python aggregate.py pull        # récupère la boîte en ligne -> base + ack
python aggregate.py review      # pré-vérifie avec Gemini (verdict par boîte)
python aggregate.py dashboard   # ouvre le tri dans le navigateur (localhost)
```

Dans le dashboard : un clic **Valider** (statut `validee`), **Rejeter**,
**Archiver**. Comme pour le reste de l'outil, **valider n'écrit rien dans
`data.js`** : c'est juste un changement de statut en base. La recopie
finale dans le site reste une étape manuelle séparée (via `export` puis
intégration dans une session Claude).

## Commandes

| Commande | Rôle |
|---|---|
| `ingest [--dir D]` | parse les `.txt` de `inbox/`, insère, déplace |
| `pull [--limit N]` | récupère les propositions de la boîte en ligne, ingère, confirme (`ack`) |
| `review [--limit N] [--redo] [--status S]` | pré-vérifie les boîtes avec Gemini (verdict IA) |
| `dashboard [--port P]` | lance le tableau de bord local (navigateur) |
| `list [--status S] [--cible C] [--notion N] [--no-preview]` | liste groupée (3 sections : Notions/Auteurs/Concepts) |
| `show <id>` | détail complet d'une boîte |
| `dupes [--threshold 0.80] [--status S]` | rapport doublons (signature + difflib + inclusion de noms) |
| `export [-o fichier.txt] [--status S]` | gros `.txt` daté pour Claude |
| `mark <id>... --as <statut>` | change le statut (`en_attente` / `integree` / `rejetee` / `archivee`) |
| `note <id> "texte"` &nbsp;\|&nbsp; `--clear` | annote ou efface |
| `archive [--before YYYY-MM-DD] [--yes]` | `integree` → `archivee` |
| `purge   [--before YYYY-MM-DD] [--yes]` | supprime définitivement les `archivee` |
| `stats` | compteurs globaux |

## Arborescence

```
philo-aggregator/
  aggregate.py        entrée CLI
  db.py               accès SQLite
  ingest.py           parsing + validation
  view.py             affichage terminal
  export.py           génération .txt
  localenv.py         lecture du .env (cerveau local)
  mailbox_client.py   client HTTP de la boîte en ligne (pull/ack)
  pipeline.py         orchestration pull → ingestion
  review.py           relecture IA (Gemini)
  dashboard.py        tableau de bord local (Flask)
  requirements.txt    dépendances du cerveau (Flask, google-generativeai)
  .env.example        modèle de configuration (à copier en .env)
  .env                secrets locaux (gitignored — jamais publié)
  inbox/              à déposer ici (gitignored)
  processed/          fichiers ingérés avec succès (gitignored)
  quarantine/         fichiers rejetés + .err (gitignored)
  proposals.db        base SQLite (gitignored)
  review_*.txt        exports (gitignored)
```

## Détection des doublons

Deux passes complémentaires :

- **Signature** SHA-256 sur `type | cible | notion | key_term`, après
  normalisation (minuscules, accents retirés). Capture les doublons
  *quasi-exacts* (« Jean-Paul Sartre » vs « JEAN-PAUL SARTRE »).
- **Fuzzy** `difflib.SequenceMatcher` (seuil 0.80 par défaut) + heuristique
  d'**inclusion de noms** : « sartre » est rapproché de « Jean-Paul Sartre »
  même si difflib ne les juge pas similaires (substring strict).

## Schéma JSON consommé

`philo-proposal/v1`, `v2` **et** `v3`, générés par le site (rétro-compat
totale — les anciens `.txt` restent ingestibles).

- **v2** : multi-idées pour la cible `auteur` (`fields.ideas[]`).
- **v3** : menu à 2 niveaux — chaque boîte porte `categorie`
  (`notion`/`auteur`/`concept`) + `cible` (sous-cible) + `type`. Les idées
  d'un auteur portent leur **notion** et un tableau **`citations[]`** :
  `fields.ideas[] = {notion, oeuvre, date, idee, citations:[…], concepts}`.
  Nouvelles sous-cibles : `auteur-citation`, `auteur-dialogue`, `auteur-bio`,
  `concept-relation`. Pour la cible `auteur`, `extract_notions` lit les
  notions dans `ideas[].notion` (pas `fields.notion`).

Voir `CLAUDE.md` à la racine du projet pour la spécification détaillée
(catégories, sous-cibles, champs par sous-cible).
