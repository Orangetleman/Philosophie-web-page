# Mettre à jour la carte (`docs/carte/`)

La carte est **pilotée par les données** : `carte.data.js` est la **seule
source de vérité**. `carte.html` n'a aucune donnée en dur et n'a jamais besoin
d'être modifié pour une mise à jour de contenu. On édite `carte.data.js`, on
relance `verifie.mjs`, c'est tout.

## Règle de PR
> **Toute PR qui modifie l'architecture (ajout/suppression/renommage d'une
> fonction, variable, table, route, clé localStorage, ou d'un flux de données)
> met à jour `docs/carte/carte.data.js` dans le MÊME commit**, puis fait passer
> `node docs/carte/verifie.mjs` (0 périmé).

## Vérifier (anti-drift)
```
node docs/carte/verifie.mjs
```
- **PÉRIMÉ** → un `name` n'existe plus dans le fichier cité : corriger le nœud.
- **DÉPLACÉ** → le `name` existe mais a changé de ligne : mettre à jour la `ref`
  (non bloquant, le script indique la nouvelle ligne).
- **FICHIER?** → fichier renommé/supprimé : corriger la `ref`.

## Quand je change X dans le code → quel nœud mettre à jour

| Changement dans le code | Nœud(s) de `carte.data.js` à toucher |
|---|---|
| Renommer/déplacer une fonction `render*`, `open*`, `normalize*`… | le nœud Front/Navigation/Données concerné → `symbols[].name` + `ref` |
| Ajouter une **fonction** notable (≥ rôle de module) | ajouter un nœud `niveau:2` sous le bon module, avec `symbols` |
| Ajouter un **module** entier (nouvelle zone de logique) | ajouter un nœud `niveau:1` sous le domaine, + ses L2 |
| Ajouter/retirer une **clé localStorage** | domaine `nav` → `nav.keys.*` (ou le domaine porteur) ; `kind:"key"` |
| Ajouter/retirer une **table Supabase** | `sync.tables.*` et/ou `backend.supabase` ; `kind:"table"` |
| Ajouter/modifier une **route Flask** (mailbox/dashboard) | `mailbox.api.*` / `backend.dashboard` ; `kind:"route"` |
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
- Toute `ref` doit pointer un symbole **réel** (confirmé par `verifie.mjs`).

## Rappel
Ces fichiers sont de la **documentation** : ne PAS les ajouter au `PRECACHE`
de `sw.js`.
