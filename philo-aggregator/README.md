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

- Python 3.7 ou plus récent
- Aucune dépendance externe : tout est en bibliothèque standard
  (`argparse`, `sqlite3`, `json`, `re`, `hashlib`, `difflib`,
  `unicodedata`, `pathlib`).

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

## Commandes

| Commande | Rôle |
|---|---|
| `ingest [--dir D]` | parse les `.txt` de `inbox/`, insère, déplace |
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

`philo-proposal/v1` **et** `philo-proposal/v2`, générés par le site. La
v2 introduit le multi-idées pour la cible `auteur` : les champs `oeuvre`,
`date`, `idee`, `citation`, `concepts` ne sont plus à plat dans `fields`
mais regroupés dans un tableau `fields.ideas[]` (chaque entrée = une idée
distincte du même auteur). Les anciens `.txt` (v1) restent ingestibles.

Voir `CLAUDE.md` à la racine du projet pour la spécification détaillée
(cibles, champs par cible, cas particulier de la cible `concept` dont les
notions sont dans `cnotions[]` et non `notion`).
