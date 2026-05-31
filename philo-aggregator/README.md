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
- **Cerveau local** (`review`, `dashboard`) : nécessite deux paquets,
  installés via `pip install -r requirements.txt` (Flask pour le dashboard,
  google-generativeai pour la relecture IA). Les commandes réseau
  `pull-cloud`, `push` et `pull` n'utilisent qu'`urllib` (stdlib) ; seuls
  les secrets du `.env` leur sont nécessaires.

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

Au lieu de déposer des `.txt` à la main, on récupère les propositions
directement depuis le **cloud**, on les fait **pré-vérifier par Gemini**,
puis on les trie dans un **tableau de bord local**.

Deux sources en ligne coexistent (la bascule complète vers Supabase est
prévue plus tard) :

- **Supabase** (`pull-cloud`) — les visiteurs **connectés** envoient leur
  proposition dans la table `contributions` de Supabase, rattachée à leur
  compte. On peut alors leur **renvoyer le statut** (`push`) : ils le
  voient dans « Mes propositions » sur le site.
- **Boîte PythonAnywhere** (`pull`) — repli **anonyme** pour les visiteurs
  non connectés (dossier `philo-mailbox`). Pas de compte, donc pas de
  renvoi de statut.

### Configuration (une fois)

```powershell
# 1. Installer les dépendances du cerveau
pip install -r requirements.txt

# 2. Créer le fichier de secrets (jamais publié : ignoré par Git)
copy .env.example .env
#    …puis ouvrir .env et coller :
#      - SUPABASE_URL + SUPABASE_SERVICE_KEY (source Supabase) ;
#      - MAILBOX_SECRET (repli boîte anonyme) ;
#      - GEMINI_API_KEY (relecture IA).
```

> ⚠ **`SUPABASE_SERVICE_KEY`** est la clé « service_role » : toute-puissante
> (elle ignore les règles RLS). Elle ne doit **jamais** finir dans le site
> ni sur GitHub — uniquement dans ce `.env`, qui reste sur ton PC.

### Flux

```powershell
python aggregate.py pull-cloud  # récupère les contributions Supabase -> base
python aggregate.py pull        # (repli) récupère la boîte anonyme -> base + ack
python aggregate.py review      # pré-vérifie avec Gemini (verdict par boîte)
python aggregate.py dashboard   # ouvre le tri dans le navigateur (localhost)

# Après tri (ex. on a marqué des boîtes « integree »), renvoyer le statut
# aux contributeurs connectés (ne concerne que les boîtes venues de Supabase) :
python aggregate.py mark 12 17 --as integree
python aggregate.py push 12 17  --explication "Intégré, merci !"
```

Le dashboard est un **cockpit** : toutes les commandes sont des boutons
(plus besoin du terminal).

- **Barre d'outils** (actions globales) : ☁ Récupérer (Supabase / `pull-cloud`),
  ⬇ Récupérer (anonyme / `pull`), 🤖 Relire (IA / `review`),
  📤 Exporter (`export` du statut filtré), 🗄 Archiver intégrées
  (`integree` → `archivee`), 🗑 Purger archivées (destructeur, confirmation).
- **Panneau de stats** : compteurs par statut, dans l'en-tête.
- **Tri par carte** : **Valider** (`validee`), **Intégrer** (`integree`),
  **Rejeter** (`rejetee`), **Archiver** (`archivee`), **En attente**.
- **Provenance visible** : une pastille distingue les trois canaux —
  **☁ compte** (Supabase, statut renvoyé à l'auteur), **⬇ anonyme** (boîte
  PythonAnywhere, pas de suivi), **📄 fichier** (`.txt` déposé à la main).

**Écriture-retour automatique** : changer le statut d'une boîte issue d'un
**compte** (pastille ☁) pousse aussitôt le statut « contributeur » vers
Supabase (Valider → « en cours d'intégration », Intégrer → « intégrée »,
Rejeter → « refusée »), avec une **explication facultative** saisie sur la
carte. Rien n'est poussé pour les canaux anonyme / fichier (pas de pendant
en ligne). Comme pour le reste de l'outil, **rien n'est écrit dans `data.js`**
ici : la recopie finale dans le site reste une étape manuelle séparée (via
`export` puis intégration dans une session Claude).

## Commandes

| Commande | Rôle |
|---|---|
| `ingest [--dir D]` | parse les `.txt` de `inbox/`, insère, déplace |
| `pull-cloud [--limit N]` | récupère les contributions Supabase (comptes), ingère (dédoublonné sur l'UUID, rejouable) |
| `push <id>... [--explication T]` | renvoie le statut des contributions vers Supabase (ids de boîte → contribution) |
| `pull [--limit N]` | (repli) récupère les propositions de la boîte anonyme, ingère, confirme (`ack`) |
| `review [--limit N] [--redo] [--status S]` | pré-vérifie les boîtes avec Gemini (verdict IA) |
| `dashboard [--port P]` | lance le tableau de bord local (navigateur) |
| `list [--status S] [--cible C] [--notion N] [--no-preview]` | liste groupée (4 sections : Notions/Auteurs/Concepts/Retours site) |
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
  mailbox_client.py   client HTTP de la boîte anonyme (pull/ack)
  supabase_client.py  client HTTP de Supabase (pull-cloud / push statut)
  pipeline.py         orchestration pull → ingestion + écriture-retour
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
  (`notion`/`auteur`/`concept`/`site`) + `cible` (sous-cible) + `type`. Les
  idées d'un auteur portent leur **notion** et un tableau **`citations[]`** :
  `fields.ideas[] = {notion, oeuvre, date, idee, citations:[…], concepts}`.
  Nouvelles sous-cibles : `auteur-citation`, `auteur-dialogue`, `auteur-bio`,
  `concept-relation`. Pour la cible `auteur`, `extract_notions` lit les
  notions dans `ideas[].notion` (pas `fields.notion`).

## Catégorie `site` (retours sur l'outil, pas sur le contenu)

En plus du contenu philosophique, le formulaire accepte deux **retours sur
le site lui-même** :

- `site-bug` — signaler une erreur / un bug d'usage ;
- `site-fonction` — proposer une nouvelle fonctionnalité.

Ces boîtes traversent toute la chaîne (ingestion, base, dashboard) mais avec
deux particularités, car elles ne visent **pas** `data.js` :

- **Pas de relecture Gemini** : `review` les ignore (rien de philosophique à
  vérifier). Elles gardent un `ai_verdict` NULL sans bloquer la file de
  relecture (exclues directement dans le SQL de `get_unreviewed_boxes`).
- **Section dédiée** : dans `list` (et l'export), elles sont regroupées sous
  **« RETOURS SITE »**, après Notions / Auteurs / Concepts.

Côté front, leur `type` est figé sur `remarque` (le menu « Type d'action »
est masqué) pour ne pas avoir à propager un nouveau type dans toute la
pipeline ; seules les deux nouvelles cibles distinguent ces retours.

Voir `CLAUDE.md` à la racine du projet pour la spécification détaillée
(catégories, sous-cibles, champs par sous-cible).
