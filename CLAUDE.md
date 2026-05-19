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
  auteurs:[ {n,w,i,q, new?, modified?}, … ],
  textes:[ {n,t, new?, modified?}, … ],
  axes:[ {n,t,pb,sps:[{l,c,r}], new?, modified?}, … ],
  exemples:[ {tag,tit,body,lien, new?, modified?}, … ],
  liens:["AutreNotion", …],
  diss:["Question ?", {q, new?, modified?}, … ]
}
```

### Auteur (objet dans `AM`)
```js
{ bio, courant, periode, themes:[…],
  dialogues:[ {dir:"oppose"|"prolonge"|"repond", auteur, sujet, desc}, … ] }
```
Un auteur peut aussi avoir un alias court : `"Tzara":{bio:"Voir 'Tristan Tzara'.",…}`.

### Concept (objet dans `CONCEPTS`)
```js
{ id, term, cat, def, auteur, tensions:[…], notions:[…], new? }
```

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
  Chaque boîte : un **type** (`ajout` / `correction` / `remarque`) et une
  **cible** (`notion` / `auteur` / `texte` / `axe` / `exemple` /
  `dissertation` / `concept`). État dans `proposalBoxes` ; valeurs de champ
  dans `box.f`.
- **Boutons « + »** injectés dans les vues (`pPlus` carte → correction,
  `pPlusCat` bas de catégorie → ajout) ; un écouteur délégué lit les
  `data-*` et appelle `openProposalFromPlus`.
- **Génération** (`generateProposalText`) : une partie lisible **+** un
  bloc JSON délimité par `[PHILO-PROPOSAL-JSON-START]` /
  `[PHILO-PROPOSAL-JSON-END]`, destiné à un programme d'agrégation externe.
- **Envoi** : `mailto:` vers la constante `PROPOSAL_EMAIL`.

### Schéma JSON « philo-proposal/v1 »

```json
{ "schema":"philo-proposal/v1", "date":"<ISO>", "contributor":"<nom|anonyme>",
  "boxes":[ { "type":"...", "cible":"...", "fields":{ ... } } ] }
```

`fields` = `box.f` nettoyé (champs vides exclus). Pour la cible `concept`,
la/les notion(s) sont dans `fields.cnotions` (**tableau**) — pas dans
`fields.notion`. Pour les autres cibles, la notion est dans `fields.notion`
(clé de `D`). Tenir compte de cette différence dans tout code qui lit une
proposition.

## Pièges connus

- Les chaînes JS sont en **guillemets doubles** ; les apostrophes françaises
  passent sans échappement, mais **jamais de guillemet droit `"` à l'intérieur** :
  utiliser les guillemets typographiques `«  »` ou `“ ”`.
- `Array.sort()` est stable : on peut s'appuyer dessus pour préserver
  l'ordre d'origine à valeur de tri égale.
- Une boîte de contribution de cible `concept` n'a **pas** de `f.notion` :
  ses notions sont dans `f.cnotions` (tableau). Idem dans le JSON généré.
