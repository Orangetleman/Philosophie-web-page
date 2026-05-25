# CLAUDE.md — Consignes du projet

Outil de révision **Philosophie Terminale** : application mono-fichier `index.html`
(HTML + CSS + JS), dark mode, sans dépendance ni build.

## Architecture de `index.html`

1. `<head>` — métadonnées, police Google Fonts (Inter)
2. `<style>` — tout le CSS
3. `<body>` HTML — squelette : sidebar (`#sb`) + zone principale (`#main`)
4. `<script>` — toute la logique JS, les données et le rendu

### Données (dans le `<script>`)
- `const D` — les notions du programme (conscience, nature, science…)
- `const AM` — métadonnées des auteurs (bio, courant, période, thèmes, dialogues)
- `const CONCEPTS` — glossaire des concepts clés
- `const CC` — couleurs par courant philosophique

## Règles de modification (IMPÉRATIVES)

- **Réécrire les sections complètes**, jamais des snippets partiels qui
  risquent de casser la syntaxe JS.
- **Ne jamais toucher au CSS ni au JS de rendu existant** sans raison
  explicite et justifiée.
- **Ne jamais toucher aux commentaires/explications existants du code**
  (sauf demande explicite de mise à jour).
- **Tout élément ajouté** (notion, auteur, texte, axe, exemple, concept,
  dissertation) **doit porter `new:true`**.
- **Annoter le code** : tout ajout ou correction de logique JS doit être
  accompagné de commentaires clairs et à jour (commentaire d'en-tête de
  fonction + repères inline). Mettre à jour les commentaires existants
  s'ils deviennent obsolètes après une modification.
- Après toute modification du `<script>`, **vérifier la validité de la
  syntaxe JS** avant de livrer.

## Structures de données

### Notion (objet dans `D`)
```js
{
  c:"#couleur", l:"Label", s:"Question/sous-titre",
  def:"HTML de la définition (peut contenir <details>)",
  auteurs:[ {n, ideas:[ {w,i, citations:[…], new?, modified?}, … ]}, … ],
  textes:[ {n,t, new?, modified?}, … ],
  axes:[ {n,t,pb,sps:[{l,c,r}], new?, modified?}, … ],   // ANCIEN — migré en plans au chargement
  plans:[ {q, intro, pb, axes:[ {t, sps:[{t,args,auteurs,ref,limite}], limite}, … ], new?, modified?}, … ],
  exemples:[ {tag,tit,body,lien, new?, modified?}, … ],
  liens:["AutreNotion", …],
  diss:["Question ?", {q, new?, modified?}, … ]
}
```

**Onglets d'une notion** : `auteurs`, `textes`, `concepts`, `diss`
(« Dissertations »), `exemples`. L'ancien onglet `axes` a été supprimé,
remplacé par les **plans** dans l'onglet Dissertations.

**Format dissertation — plans (`plans:[]`).** Un plan = **1 sujet + 1
problématique + 3 axes I/II/III**. Chaque axe a un titre, des
**sous-parties déroulables** (`sps:[{t, args, auteurs, ref, limite}]`, rendues
en `<details>`) et une **limite de fin d'axe** (transition). L'onglet
Dissertations rend : liens entre notions + `plans` (déroulables) + `diss`
(questions simples).

Migration : `normalizeD()` convertit au chargement chaque ancien
`axes:[{t,pb,sps:[A,B,C]}]` en un plan dont A/B/C deviennent les 3 axes
(contenu `c`→`args`, `r`→`ref`), avec `migrated:true` (badge « ↻ à
enrichir »). `D[k].plans` = plans rédigés à la main **puis** axes migrés.
La source n'est pas réécrite ; toute **nouvelle** dissertation détaillée
s'écrit directement dans `plans:[…]`.

**Format auteur — multi-idées + multi-citations.** Un même auteur peut
avoir plusieurs idées (plusieurs œuvres / angles) sur une même notion ;
chaque idée est un objet `{w, i, citations:[…], new?, modified?}` du tableau
`ideas`. Le nom `n` reste au niveau auteur. Chaque idée porte **plusieurs
citations** dans `citations:[]` (la 1re est affichée, les suivantes dans un
déroulant ; toutes apparaissent dans l'onglet *Citations* de l'auteur). Une
idée sans `i` (texte) mais avec une `citations` = une **citation simple**.

L'ancien format à plat `{n, w, i, q}` et le `q` unique d'une idée restent
acceptés en source : `normalizeAuthor()` convertit au chargement en
`{n, ideas:[{w, i, citations:[q]}]}`. Toute **nouvelle entrée** s'écrit
directement avec `citations:[…]`. `buildAI` fusionne les idées si un auteur
apparaît plusieurs fois dans la même `D[k].auteurs[]`.

### Auteur (objet dans `AM`)
```js
{ bio, courant, periode, themes:[…],
  dialogues:[ {dir:"oppose"|"prolonge"|"repond", auteur, sujet, desc}, … ] }
```
Un auteur peut aussi avoir un alias court : `"Tzara":{bio:"Voir 'Tristan Tzara'.",…}`.

### Concept (objet dans `CONCEPTS`)
```js
{ id, term, cat, def, auteur, notions:[…], new?,
  liens:{ notionKey:"explication du lien avec CETTE notion", … },      // optionnel
  relations:[ {to:"id-concept", type, desc},          // cible = concept (lien dynamique)
              {term:"terme libre", type, desc},        // cible non fichée (rendue via linkTerms)
              {type:"distinction", desc:"A ≠ B"}, … ] }  // ex-« tension »
}
```
`type` ∈ `oppose | prolonge | complete | repond | distinction | implique`.

**Relations unifiées.** L'ancien champ `tensions:[…]` (chaînes « A ≠ B »,
sans lien dynamique) a été **fusionné dans `relations`** :
`normalizeConcepts()` convertit au chargement chaque tension en
`{type:'distinction', desc}`. Tout passe par `linkTerms` → les termes qui
sont des concepts/notions/auteurs deviennent cliquables. Une relation cible
soit un concept (`to`, lien direct), soit un terme libre (`term`, se liera
si une fiche est créée plus tard). **Ne plus écrire `tensions` dans la
source** : utiliser `relations`.

**Onglet « Concepts » d'une notion** : **deux sous-onglets**
(`curConceptSubTab`) — « Concepts liés à la notion » (avec `liens[notionKey]`
si présent) et « Liens entre les concepts » (les `relations` dont les deux
extrémités appartiennent à la notion). La **fiche concept** affiche une
section unique « Relations & distinctions » : relations **sortantes**
(`relations`) ET **entrantes** (calculées). `relations[].to` doit être un
`id` de concept existant (⚠ certains ids portent des accents, ex.
`aliénation-religieuse`).

## Liens dynamiques

`linkTerms(html)` détecte automatiquement, dans tout texte libre, trois
types de termes et les rend cliquables — sans balisage manuel :
- **notions** (libellés de `D`) → `.nterm`, coloré avec la couleur de la notion
- **concepts** (termes de `CONCEPTS`) → `.cterm`, soulignement pointillé
- **auteurs** (clés de `AI`) → `.aterm`, soulignement plein

### Couverture des liens — RÈGLE IMPORTANTE

Un terme n'est lié **que s'il existe une entrée correspondante** (notion `D`,
concept `CONCEPTS`, ou auteur `AI`). Conséquence : à chaque ajout/modification
de contenu, **vérifier que les notions, concepts et auteurs cités dans le
texte disposent bien de leur entrée** — sinon ils restent du texte mort,
non cliquable.

Quand un texte mentionne une notion philosophique importante (ex.
*rationalisme*, *empirisme*, *scepticisme*…) qui n'a pas encore de fiche
concept, **créer le concept manquant** plutôt que de laisser le terme
orphelin. Faire une recherche dans tout le fichier (`grep`) pour mesurer la
fréquence du terme avant de décider. L'objectif : tout terme conceptuel
récurrent doit avoir sa fiche et donc son lien dynamique.

Ne **pas** ajouter pour autant un auteur au champ `auteur` d'un concept ni
aux `auteurs:[]` d'une notion s'il n'a pas *explicitement traité* ce
concept/cette notion : ces champs sont réservés aux auteurs de référence.
Les simples mentions dans le texte sont, elles, liées automatiquement.

## Fonctionnalité de contribution (section JS « J. »)

Une modale permet aux visiteurs de **proposer du contenu**. Bouton
d'ouverture `.sb-propose` (« 💡 Proposer du contenu ») intégré à la sidebar.

- **Modèle « boîte »** : une soumission = une ou plusieurs boîtes empilées.
  Chaque boîte a un **menu à 2 niveaux** + une action :
  - `categorie` (niveau 1) : `notion` / `auteur` / `concept` ;
  - `cible` (niveau 2 = sous-cible, clé de dispatch) :
    - notion → `notion` (définition) / `texte` / `plan` / `dissertation` (sujet) / `exemple` ;
    - auteur → `auteur` (idée/œuvre) / `auteur-citation` / `auteur-dialogue` / `auteur-bio` ;
    - concept → `concept` (définition) / `concept-relation` ;
  - `type` (action) : `ajout` / `correction` / `remarque`.

  État dans `proposalBoxes` (`{id, categorie, cible, type, f}`) ; valeurs de
  champ dans `box.f`. `PROPOSAL_SOUSCIBLES` mappe catégorie→sous-cibles ;
  `CIBLE_CAT`/`cibleCat()` font l'inverse (et la rétro-compat des anciennes
  cibles à plat). Les selects en cascade sont dans `renderProposal` ;
  `renderBoxFields` dispatche par `(categorie × cible × type)`.
  - **Cible `auteur` (idée)** : `f.ideas[]`, chaque idée
    `{notion, oeuvre, date, idee, citations:[…], concepts, remove?, justif?}`
    → **multi-notions** (une notion par bloc) + **multi-citations**. En
    correction, `remove:true` + `justif` retire une idée/notion.
  - **Remarque** : ciblage adapté à la catégorie (notion / nom d'auteur /
    concept) + `remtexte`, sans champs de contenu.
- **Boutons « + »** injectés dans les vues (`pPlus` carte → correction,
  `pPlusCat` bas de catégorie → ajout) ; un écouteur délégué lit les
  `data-*` et appelle `openProposalFromPlus`.
- **Génération** (`generateProposalText`) : une partie lisible **+** un
  bloc JSON délimité par `[PHILO-PROPOSAL-JSON-START]` /
  `[PHILO-PROPOSAL-JSON-END]`, destiné à un programme d'agrégation externe.
- **Envoi** : `mailto:` vers la constante `PROPOSAL_EMAIL`.

### Schéma JSON « philo-proposal/v3 »

```json
{ "schema":"philo-proposal/v3", "date":"<ISO>", "contributor":"<nom|anonyme>",
  "boxes":[ { "categorie":"...", "cible":"...", "type":"...", "fields":{ ... } } ] }
```

`fields` = `box.f` nettoyé (champs vides exclus).

- **Cible `concept`** (définition) : notions liées dans `fields.cnotions`
  (**tableau**) — pas dans `fields.notion`.
- **Cible `auteur`** (idée/œuvre) : `fields.ideas[]`, chaque idée
  `{notion, oeuvre, date, idee, citations:[…], concepts}`. Le **nom** est
  dans `fields.nom`. La **notion est PAR IDÉE** (`ideas[].notion`), pas dans
  `fields.notion`.
- **`auteur-citation`** : `fields.notion` + `oeuvre` + `citation` (+`rattach`).
- **`auteur-dialogue` / `auteur-bio` / `concept-relation`** : pas de notion.
- **Autres cibles** : la notion est dans `fields.notion` (clé de `D`).

**Rétro-compat** : l'agrégateur (`philo-aggregator/`) lit v1/v2/v3. En v1/v2,
la boîte n'a pas de `categorie` (déduite via `cibleCat`) et la cible `auteur`
a ses champs d'idée à plat (v1) ou dans `ideas[]` sans `notion`/`citations`
(v2). Tenir compte de ces différences dans tout code qui lit une proposition.

## Pièges connus

- Les chaînes JS sont en **guillemets doubles** ; les apostrophes françaises
  passent sans échappement, mais **jamais de guillemet droit `"` à l'intérieur** :
  utiliser les guillemets typographiques `«  »` ou `“ ”`.
- `Array.sort()` est stable : on peut s'appuyer dessus pour préserver
  l'ordre d'origine à valeur de tri égale.
- Une boîte de contribution de cible `concept` n'a **pas** de `f.notion` :
  ses notions sont dans `f.cnotions` (tableau). Idem dans le JSON généré.
