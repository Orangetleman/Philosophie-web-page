# Mettre à jour la carte (`docs/carte/`)

La carte est **pilotée par les données** : `carte.data.js` est la **seule
source de vérité** des nœuds et de leurs textes. `carte.html` n'a aucune
donnée en dur et n'a jamais besoin d'être modifié pour une mise à jour.

Depuis l'étape 3 (octobre 2026), le partage des rôles est le suivant :
- **à la main** : les nœuds (ajouter, retirer, rattacher), leurs textes
  (`novice`, `ingenieur`), les `symbols[]` (sorte et nom) et les liens ;
- **automatique** : les `ref` « fichier:ligne ». Le build
  (`node outils/construire.mjs`) lance `verifie.mjs --corriger`, qui retrouve
  la DÉFINITION de chaque symbole dans le code et réécrit sa ref, même si le
  symbole a changé de fichier. Pour un nouveau symbole, une ref approximative
  (`js/04-fiches.js:1`) suffit : le build la corrige.

## Règle de PR
> **Toute PR qui modifie l'architecture (ajout/suppression/renommage d'une
> fonction, variable, table, route, clé localStorage, ou d'un flux de données)
> met à jour les nœuds de `docs/carte/carte.data.js` dans le MÊME commit**.
> Le build échoue si un symbole cité n'existe plus.

## Vérifier (anti-dérive)
```
node docs/carte/verifie.mjs              # contrôle
node docs/carte/verifie.mjs --corriger   # réécrit les refs (le build le fait)
```
- **PÉRIMÉ** → le symbole n'est DÉFINI nulle part dans le code (une mention
  en commentaire ne compte pas pour une fonction) : corriger ou retirer le nœud.
- **DÉPLACÉ** → défini ailleurs que la ref : `--corriger` (ou le build) la
  réécrit. En contrôle simple, c'est un écart (sortie 1) : le hook de commit
  exige des refs exactes.
- Sortes : `fn` exige une définition (`function nom(`, `(function nom(`,
  `def nom(`, `class nom`, `create function nom`) ; `var` et `table` cherchent
  une définition puis une mention ; `key`, `css`, `route` une mention.

## Quand je change X dans le code → quel nœud mettre à jour

| Changement dans le code | Nœud(s) de `carte.data.js` à toucher |
|---|---|
| Renommer/déplacer une fonction `render*`, `open*`, `normalize*`… | le nœud Front/Navigation/Données concerné → `symbols[].name` + `ref` |
| Ajouter une **fonction** notable (≥ rôle de module) | ajouter un nœud `niveau:2` sous le bon module, avec `symbols` |
| Ajouter un **module** entier (nouvelle zone de logique) | ajouter un nœud `niveau:1` sous le domaine, + ses L2 |
| Ajouter/retirer une **clé localStorage** | domaine `nav` → `nav.keys.*` (ou le domaine porteur) ; `kind:"key"` |
| Ajouter/retirer une **table Supabase** | `sync.tables.*` et/ou `backend.supabase` ; `kind:"table"` |
| Ajouter/modifier une **route Flask** (dashboard) | `backend.dashboard` ; `kind:"route"` |
| Changer la **version du cache** PWA (`philo-vN`) | `pwa.sw` (texte `ingenieur`) — la `ref` `sw.js:12` reste valable |
| Modifier le **schéma de proposition** (vX) | `contrib.generate` + `backend.ingest` (`SUPPORTED_SCHEMAS`) |
| Modifier un **flux** (envoi, pull, review, sync) | tableau `edges[]` (note + `from`/`to`) |
| Changer le **modèle Gemini** | `backend.review` (`DEFAULT_MODEL`, `ref` review.py:41) |
| Ajouter un **domaine** entier | `domaines[]` (id+couleur) + un nœud `niveau:0` + ses enfants |
| Zone du code **ambiguë** | poser `incertain:true` + `note` sur le nœud (un ⚑ apparaît) |

## Conventions du fichier de données
- `id` **stable** (sert d'ancre des liens) : ne pas le renommer à la légère.
- `niveau` : `0` domaine · `1` module · `2` fonction/état · `3` variable/détail.
- `parent` : `id` du nœud parent (`null` pour les domaines). `domaine` : un `id`
  de `domaines[]` (la couleur). En pratique, un nœud hérite du `domaine` de son
  domaine racine.
- `symbols[].kind` ∈ `var | fn | css | route | table | key`.
- `liens[]` (par nœud) = liens internes ; `edges[]` (global) = flux transverses.
- Chaque nœud porte **`novice`** (sans jargon) **et** `ingenieur` (précis) :
  garder les deux à jour.
- Toute `ref` pointe la définition **réelle** du symbole (tenue à jour par le build).

## Frise des commits (`frise.html`)
`frise.html` lit `frise.data.js` (généré). Pour rafraîchir la frise après de
nouveaux commits :
```
node docs/carte/frise.gen.mjs
```
(relit `git log` et réécrit `frise.data.js` — ne pas éditer ce dernier à la main).

**Automatique** : un hook `pre-commit` (`.githooks/pre-commit`) régénère et stage
`frise.data.js` à chaque commit (non bloquant). Il est activé par
`git config core.hooksPath .githooks` — à relancer **une fois** sur un nouveau
clone du dépôt (la config locale n'est pas versionnée). La frise reflète alors
l'historique jusqu'au commit précédent (le commit courant apparaît au suivant).

## Rappel
Ces fichiers sont de la **documentation** : ne PAS les ajouter au `PRECACHE`
de `sw.js`.
