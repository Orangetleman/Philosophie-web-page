# CLAUDE.md — Consignes du projet

Outil de révision **Philosophie Terminale** : `index.html` (HTML + CSS + JS),
dark mode, sans dépendance ni build. Les **données** vivent dans `data.js`,
chargé en `<script src="data.js">` **avant** le `<script>` principal.

## Architecture de `index.html`

1. `<head>` — métadonnées, police Google Fonts (Inter)
2. `<style>` — tout le CSS
3. `<body>` HTML — squelette : sidebar (`#sb`) + zone principale (`#main`)
4. `<script src="data.js">` — les données du site (voir ci-dessous)
5. `<script>` — toute la logique JS et le rendu (consomme les données globales)

### Données (dans `data.js`, globales)
- `const D` — les notions du programme (conscience, nature, science…)
- `const KEYS` — `Object.keys(D)` (ordre des notions)
- `const AM` — métadonnées des auteurs (bio, courant, période, thèmes, dialogues)
- `const CONCEPTS` — glossaire des concepts clés
- `const CC` — couleurs par courant philosophique (resté dans `index.html`)

Ces `const` sont **globales** (script classique, pas de module) : `index.html`
les utilise directement (normalizeD/buildAI/rendu). **Modifier les notions,
auteurs et concepts dans `data.js`.** Après modif de `data.js` OU du `<script>`,
relancer la vérif syntaxe sur les **deux** (concaténés). Toute nouvelle
ressource statique (comme `data.js`) doit être ajoutée au `PRECACHE` de `sw.js`
et la version du cache (`philo-vN`) incrémentée, sinon le hors-ligne sert une
version périmée.

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

### Repères du programme (`cat:'Repère'`)

Les **repères conceptuels** officiels (paires/triades à distinguer :
*absolu / relatif*, *en acte / en puissance*, *légal / légitime*…) sont
des entrées de `CONCEPTS` **comme les autres**, distinguées par leur
catégorie `cat:'Repère'` et un `id` préfixé `rep-…`. Conséquences :
- ils sont **liés dynamiquement** par `linkTerms` (aucune modif nécessaire) ;
- ils n'ont **pas** de champ `auteur` (ce sont des distinctions du programme,
  pas des concepts d'un auteur précis) ;
- leur `term` est la paire/triade littérale (`'Absolu / Relatif'`), leur `def`
  décrit chaque pôle (`<strong>…</strong> : …`) et finit par un `<em>Ex.</em>` ;
- ils portent au moins une `relations:[{type:'distinction', desc:'A ≠ B'}]`,
  plus d'éventuels liens vers des concepts fichés (`{to:'sophisme', …}`).

**Séparation des listes.** Helpers dans `index.html` :
`isRepere(c)` (`c.cat==='Repère'`), `REPERES()` et `realConcepts()`. Les
repères sont **exclus** du glossaire Concepts (sidebar `renderSBConceptsList`
+ comptage) **et** de l'onglet « Concepts » de chaque notion ; ils peuplent à
la place l'onglet **Repères** (voir ci-dessous). La **fiche** est la même
(`renderConceptContent` + `curConcept`) : un repère *est* un concept, donc
aucun renderer dédié.

## Onglet « Repères » (sidebar, `sbMode='reperes'`)

⚠ **Ne pas confondre** « Repères » (`sbMode='reperes'`, les distinctions du
programme) et « Méthodo » (`sbMode='methodo'`, le **guide de méthode** — section
suivante). Ce sont **deux onglets distincts**.

Le mode `reperes` liste les **repères** (`REPERES()`, triés `localeCompare('fr')`),
avec une **barre de recherche seule** (`repereSearch`, `renderSBReperesList()`,
liste `#sb-reperes-list`) — pas de filtres par notion. Il **réutilise**
`curConcept` et la fiche concept (un repère est un concept). Tout le câblage de
navigation reflète le mode `concepts` : `renderSB` (onglets + branche dédiée),
`goBack`, `goMode('reperes')`, `renderCrumbs` (segment « Repères »),
`openConcept` (qui choisit `sbMode = isRepere(c) ? 'reperes' : 'concepts'`). À
l'entrée d'un mode, un garde recalcule `curConcept` pour qu'il appartienne à la
liste active.

## Onglet « Méthodo » — guide de méthode (sidebar, `sbMode='methodo'`)

La sidebar a **cinq modes** : `sbMode` ∈
`'notions' | 'auteurs' | 'concepts' | 'reperes' | 'methodo'`. Le mode `methodo`
est un **guide de méthodologie** (PAS une fiche), au rendu et à l'interface
volontairement **distincts** des fiches. Deux parcours (`METHODO_TOPICS` :
`dissertation` / `explication`), état courant `methodoTopic` (persisté dans la
pile `navHistory`). Données dans `METHODO_GUIDE[topic]` = `{titre, intro,
squelette:[{bloc,detail}], etapes:[{t, body, phrases:[…], tip}]}` — **pas de
data.js** (méthodologie pure). `renderMethodoContent()` peuple `#main` (même
ossature `.tabs`+`.main-content` que `renderConceptContent`) avec : une bascule
de parcours (`.methodo-switch`), un **squelette visuel** de la copie
(`.methodo-skel`, une ligne par bloc), puis les **étapes dépliables**
(`.methodo-step` = `<details>`, 1re ouverte) avec « phrases toutes prêtes » et
une astuce. Tout le texte passe par `linkTerms()`. Câblage : `renderSB` (branche
liste = `METHODO_TOPICS`), `goBack`/`goMode('methodo')` →
`renderMethodoContent()`, `renderCrumbs` (segment « Méthodo » + parcours),
`tourShowSidebarMode('methodo')`. CSS dédié `.methodo-*` (thème accent bleu du
quiz). Si tu ajoutes un parcours/une étape : enrichir `METHODO_GUIDE`,
éventuellement `METHODO_TOPICS`.

L'onboarding (`TOUR_STEPS`) présente les **cinq** portes d'entrée (Notions,
Auteurs, Concepts, Repères, Méthodo) : chacune **bascule réellement la sidebar
dans son mode** via `tourShowSidebarMode(mode)` (recale `curAuthor`/`curConcept`
ou rend le guide, rend sidebar + contenu) et met en valeur la **liste**
(`#sb .sidebar-list`), pas le seul bouton d'onglet.

Les **onglets de mode** (`.sb-tabs`) s'**enroulent** sur plusieurs rangées
(`flex-wrap` + `flex-basis:calc(50% - 2px)`, 2 par rangée) : sur la sidebar
étroite (155px), tous les onglets sur une rangée débordaient et le dernier était
**rogné** par l'`overflow:hidden` de `.sidebar`. Avec 5 onglets → 3 rangées
(2+2+1), tous visibles desktop comme mobile.

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

### Surbrillance d'arrivée (suivre un lien)

Suivre un lien dynamique fait **briller la cible** ~1,6 s (CSS
`@keyframes flashTarget` → classe `.flash-target`, repli `outline` si
`prefers-reduced-motion`). `focusAfterRender()` (appelé en fin de
`openNotion`/`openConcept`/`openAuthor`, via `requestAnimationFrame`) fait
briller l'**en-tête `.notion-head`** de la fiche ouverte (repère « tu es
ici » — présent dans les **trois** vues). Cas spécial : une notion ouverte
**depuis une fiche concept** (pastilles « Notions concernées » →
`openNotionFromConcept(key, conceptId)`) pose `pendingConceptMention` ;
`focusAfterRender()` défile alors vers la **1re mention** de ce concept dans
le contenu (`.cterm[onclick*="openConcept('id')"]`) et la fait briller, au
lieu de l'en-tête. `scrollAndFlash(el)` centre l'élément puis relance
l'animation (retrait/reflow/ajout de classe).

## Fonctionnalité de contribution (section JS « J. »)

Une modale permet aux visiteurs de **proposer du contenu**. Bouton
d'ouverture `.sb-propose` (« 💡 Proposer du contenu ») intégré à la sidebar.

- **Modèle « boîte »** : une soumission = une ou plusieurs boîtes empilées.
  Chaque boîte a un **menu à 2 niveaux** + une action :
  - `categorie` (niveau 1) : `notion` / `auteur` / `concept` / `site` ;
  - `cible` (niveau 2 = sous-cible, clé de dispatch) :
    - notion → `notion` (définition) / `texte` / `plan` / `dissertation` (sujet) / `exemple` ;
    - auteur → `auteur` (idée/œuvre) / `auteur-citation` / `auteur-dialogue` / `auteur-bio` ;
    - concept → `concept` (définition) / `concept-relation` ;
    - site → `site-bug` (signaler une erreur) / `site-fonction` (proposer une fonctionnalité) ;
  - `type` (action) : `ajout` / `correction` / `remarque`.

  **Catégorie `site` (retours sur l'outil, pas sur le contenu)** : le menu
  « Type d'action » est **masqué** et le `type` figé sur `remarque` (valeur
  déjà connue de la pipeline → rien de neuf à propager côté base). La cible
  (`site-bug` / `site-fonction`) suffit à distinguer les deux. Ces boîtes
  ne visent **pas** `data.js` : elles ont leur propre section « RETOURS SITE »
  dans le dashboard de l'agrégateur et sont **exclues de la relecture Gemini**.

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
- **Envoi** — `submitProposalOnline()` aiguille la **voie principale** : si
  connecté → table Supabase `contributions` (`sendProposalToSupabase`, suivi
  du statut dans « Mes propositions ») ; sinon → boîte anonyme PythonAnywhere
  (`sendProposalOnline`). Le **`mailto:`** (constante `PROPOSAL_EMAIL`,
  `sendProposal`) n'est **plus une voie à choisir** mais un **repli
  automatique** : en cas d'échec en ligne, `proposalMailtoFallback(reason)`
  ouvre l'appli mail du contributeur (sans quitter la page) et l'annonce
  d'une ligne. Le bouton « Envoyer par email » subsiste, discret
  (`.pbtn-ghost`), pour relancer le mail à la main.
- **Éditer un envoi « en attente »** (compte connecté) — depuis « Mes
  propositions », chaque ligne au statut `en_attente` porte un bouton ✎
  *Modifier* (`editMyContribution(id)`). Mécanique : `boxesFromPayload(payload)`
  reconstruit `proposalBoxes` depuis le JSON stocké (copie profonde ; déduit la
  catégorie en v1/v2 ; garantit `f.ideas` pour `auteur`) ; le **brouillon local
  en cours est mis de côté** dans `editDraftBackup` et restauré par
  `exitEditContrib()` (annulation ou enregistrement). `editingContribId` (id de
  la ligne) marque le mode édition : tant qu'il est posé, **`draftChanged()`
  ne touche plus au brouillon** (ni `localStorage`, ni sync) pour ne pas
  l'écraser. L'aperçu remplace « Envoyer en ligne » par « Enregistrer les
  modifications » et masque copie/mailto (un email n'updaterait rien) ;
  `submitProposalOnline()` aiguille vers `updateProposalInSupabase()` →
  `UPDATE … .eq('id',…).eq('user_id',…).select('id')`. Le `.select('id')`
  permet de détecter un **refus RLS silencieux** (0 ligne touchée si le statut
  n'est plus `en_attente`). Côté base : la **policy RLS UPDATE** n'autorise que
  `user_id = auth.uid()` **et** `statut = 'en_attente'` (USING + WITH CHECK) —
  une fois triée, la proposition n'est plus modifiable. `myContribCache` garde
  les lignes chargées pour retrouver un payload par id.

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

## Interface & ergonomie (déjà en place)

- **Responsive ≤ 700 px** : la sidebar devient un **tiroir** ouvert par un
  bouton burger inline dans `.topbar` (voile `.sb-backdrop`, fermeture au clic
  / Échap / sélection d'un item) ; onglets de notion **scrollables
  horizontalement**. **Geste tactile** (`initSidebarSwipe()` IIFE, près de
  `initSidebarDrawer`) : balayage horizontal franc pour ouvrir/fermer le
  tiroir — départ au bord gauche (≤ 28 px) + glissé vers la droite l'ouvre ;
  glissé vers la gauche le ferme. Inactif sur grand écran ou si une surcouche
  (quiz, modale de proposition, onboarding) est ouverte.
- **Fil d'Ariane** cliquable (`renderCrumbs()`, bloc `#crumbs` dans `.topbar`)
  façon explorateur : chaque segment ramène à son niveau ; `goMode(mode)`
  bascule entre les 3 modes de sidebar.
- **Mode révision / édition** (localStorage `philo-mode`) : par défaut
  *révision* (rendu épuré — badges `new`/`modified`, boutons `+` et
  `.sb-propose` cachés via `body:not(.mode-edition)`) ; *édition* révèle tout.
  Toggle `.sb-mode` en bas de sidebar.
- **PWA** : `manifest.json` + `sw.js` + `icon.svg`, enregistrés depuis
  `index.html`. Installable et hors-ligne. **Stratégie de cache mixte** :
  HTML/JS de même origine (le « code », qui change à chaque déploiement) en
  **réseau d'abord** (cache en repli hors-ligne) → une **simple
  actualisation** récupère la dernière version, sans vidage manuel ; le reste
  (icône, manifeste, polices) reste **cache d'abord**. **Mise à jour
  transparente** : `index.html` écoute `controllerchange` et **recharge une
  fois** quand un nouveau SW prend le contrôle (garde anti-boucle
  `swReloading` ; rechargement auto activé **seulement** si un
  `serviceWorker.controller` existait déjà au chargement, pour ne pas
  recharger à la 1ʳᵉ visite) ; `reg.update()` est appelé après l'enregistrement.
  **À chaque modif d'un fichier précaché, incrémenter `CACHE` (`philo-vN`)
  dans `sw.js`.**
- **Onboarding** 1ʳᵉ visite (overlay `.onb-overlay`, drapeau localStorage
  `philo-onboarded`).

## Mode quiz (révision active — section JS « K. »)

Overlay plein écran de révision par cartes à **répétition espacée** (Leitner),
ouvert par le bouton **`.sb-quiz` (« 🎯 Réviser », thème bleu)** placé au-dessus
de `.sb-propose` dans `renderSB` (toujours visible, révision ET édition).
Overlay `#quiz-overlay` (z-index **850**, sous la modale=1000) ; contenu injecté
dans `#quiz-body` par `renderQuiz()`. Aucune donnée n'est redite : tout est
**dérivé** de `CONCEPTS` / `D` / `AI`.

**Variables CSS bleues** dédiées : `--color-background-quiz`,
`--color-border-quiz`, `--color-text-quiz`, `--color-accent-quiz`.

### Cartes — `buildQuizCards()` → `QUIZ_CARDS` (index `QUIZ_BY_ID`)
Chaque carte = `{id stable, type, notion?, recto, verso, qLabel, meta}`. 5 types :
- `concept-def` (C1) terme→déf · `def-concept` (C2) déf→terme (bon support QCM) ;
- `cite-author` / `author-cite` (C3) citation↔auteur, **les deux sens**, depuis
  `AI[name].entries[k].ideas[].citations[]` ;
- `notion-authors` (C4) notion→auteurs majeurs + thèse (auto-évaluation).
`stripHtml()` nettoie les `def`/`i` (retire balises et `<details>`). **L'`id`
doit rester stable** entre visites (sert de clé de progression).

### Moteur Leitner — double horizon
`QUIZ_INTERVALS = {sprint:[0,1,2,4,7], long:[0,2,5,14,30]}` (jours, boîtes 1→5).
Les 2 horizons gardent leur progression séparée (basculer ne perd rien).
« Maîtrisé » = boîte ≥ 4. **Vocabulaire UI** : côté interface on dit « **palier
de mémorisation** » (1→5) et « cartes **mémorisées** » — *jamais* « boîte »
(jargon Leitner) ni « niveau » (réservé à la gamification ⭐ XP, pour éviter la
confusion). En interne, le code garde `box`/« boîte ». Fonctions : `isDue(card,horizon)`, `onAnswer(id,ok)`
(ok→box+1 max 5 ; échec→box=1 ; maj lastSeen/seen/correct + compteur quotidien +
**XP/niveau** ; **renvoie** `{gain, promoted, newlyMastered, box, leveledUp}`
pour alimenter le récap de fin), `pickSession(n=15)` (dues triées par boîte
ascendante + nouvelles jamais vues, léger mélange), `cardsForFilter()`,
`quizStats()`.

### localStorage `philo-quiz`
```js
{ horizon:'sprint',
  byHorizon:{ sprint:{cardId:{box,lastSeen,seen,correct}}, long:{…} },
  daily:{date,count,goal,streak,lastDate},
  gamif:{xp,level},                        // gamification (transversal aux horizons)
  prefs:{dontWarnNewSession},              // « ne plus afficher » l'avertissement
  active:{ids:[…],idx,mode,horizon,results}|null }  // session reprenable (sérialisée)
```
Lu/garanti par `loadQuizState()` ; écrit par `saveQuizState()`. **Persistance** :
tout est dans `localStorage`, donc la progression survit à un refresh, à la
fermeture de l'onglet et à un redémarrage de l'appareil (rien n'est en
`sessionStorage`). Seul un effacement manuel du stockage du site la supprime.

### Reprise de session (`active`)
`persistActive()` sérialise/efface la session en cours dans `philo-quiz.active`
(ids + position + mode + horizon + récap) à chaque `advanceQuiz()` et au
démarrage (`beginSession`). `quizSessionActive()` = il reste des cartes.
`openQuiz()` **reconstruit** la session depuis `active` → la reprise survit même
à un refresh. Fin de session ⇒ `active=null`. Contrôles : `resumeQuizSession()`,
`requestNewSession()` (affiche l'avertissement si une session est active **et**
`prefs.dontWarnNewSession` faux), `renderNewSessionWarning()` (panneau +
case `#quiz-dontwarn`), `confirmNewSession()` / `cancelNewSession()`,
`beginSession()` (cœur du démarrage), `quitSession()` (retour dashboard sans
perdre la session).

### Vues (état runtime `quizState`)
`dashboard` (**niveau ⭐ + barre XP**, maîtrise %, sélecteur horizon, format
**Cartes/QCM**, **filtres MULTI-SÉLECTION** Mes ratés/notions/types + « tout
effacer », **Reprendre** / **Nouvelle session** (avec avertissement),
**objectif 10/20/50 + barre du jour**, streak, **maîtrise par notion** +
**badges** en `<details>`, **encadrés d'aide repliables** `.quiz-help` (« Comment
fonctionne la révision ? » = paliers de mémorisation + répétition espacée ;
« Ma progression est-elle sauvegardée ? » = persistance/limites), **deux
réinitialisations** : `resetQuizHorizon()` (cartes du rythme courant seulement,
niveau/XP conservés) et `resetAllQuiz()` (TOUT : 2 rythmes + niveau + XP +
série + objectif, efface la clé localStorage)) → `session` → `end` (**récap gamifié** :
score, XP gagnés, cartes en progrès, nouvelles maîtrisées, montée de niveau,
barres niveau + jour, « Refaire les ratés » `redoWrong()` + Retour).
`openQuiz()` / `closeQuiz()` (Échap ferme). Défauts : `QUIZ_SESSION_N=15`,
`QUIZ_DEFAULT_GOAL=20`. **Filtres** (runtime) : `quizState.notionFilters` /
`typeFilters` (deux `Set` ; OU dans une catégorie, ET entre catégories) +
`quizState.wrongOnly` (drapeau) ; helpers `toggleNotionFilter`/`toggleTypeFilter`/
`toggleQuizWrong`/`clearQuizFilters`/`quizFiltersEmpty`. `quizState.mode` ∈
`cards|qcm` ; `quizState.qcmData`/`qcmAnswered`/`qcmChosen` pour la carte QCM ;
`quizState.confirmNew` (panneau d'avertissement). `quizState.results` cumule
`{ok,ko,wrongIds,xp,promoted,mastered,leveledUp}`.

### v2 — fait
- **Flip 3D** (CSS `rotateY`) : `renderFlipBody()` empile 2 faces dans une même
  cellule de grille (hauteur = face la plus grande) ; `revealQuiz()` ajoute
  `.flipped` sur l'élément **existant** (pas de re-rendu) pour animer.
  `flipToQuestion()` **retire** `.flipped` pour **revenir lire la question**
  après avoir vu la réponse (autant de fois qu'on veut). Les boutons ❌/✅
  sont placés **sous** la carte (`.quiz-answer-row`, masquée tant que la réponse
  n'est pas révélée) et **restent visibles** quand on retourne la carte.
- **QCM** (toggle Cartes/QCM, `setQuizMode`) : appliqué aux types `def-concept`
  et `cite-author` ; les autres restent en flip. `prepareCard()` génère 4 choix
  une fois via `buildQCMChoices(card)` (3 distracteurs même `cat`/notion, dédoublonnés,
  mélangés). `qcmAnswer(ix)` → feedback vert/rouge → `advanceQuiz()`. `recordResult`
  factorise l'enregistrement Leitner pour les 2 modes.
- **Barres de maîtrise par notion** : `notionMastery()` (% boîte≥4 par notion).
- (Option non faite) mode **Match**.

### v3 — fait
- **Objectif quotidien réglable** 10/20/50 (`setQuizGoal`, persisté dans
  `daily.goal`) + **barre de progression du jour**. **Streak** déjà géré par
  `onAnswer` (`daily.streak`).
- **Badges** : `quizBadges()` — 1 par notion, acquis si toutes ses cartes en
  boîte 5 (horizon courant).
- **Gamification XP/niveau** (`gamif:{xp,level}`, transversal aux horizons) :
  `onAnswer` attribue 10 XP/bonne réponse (1 sinon) + bonus (+5 promotion de
  boîte, +25 première maîtrise boîte≥4, +25 boîte 5). `quizLevel(xp)` =
  `floor(xp/100)+1`, `quizXpInLevel(xp)` = `xp%100`. Affichés sur le dashboard
  (badge ⭐ + barre) et dans le récap de fin (XP gagnés, cartes en progrès,
  nouvelles maîtrisées, « Niveau N atteint ! » si montée).
- **Filtres multi-sélection** : `notionFilters`/`typeFilters` (Sets) + `wrongOnly`,
  OU intra-catégorie / ET inter-catégories (`cardsForFilter`).
- **Reprise de session** : `active` persisté + avertissement « nouvelle session »
  avec case « ne plus afficher » (cf. § Reprise de session).

## Pièges connus

- Les chaînes JS sont en **guillemets doubles** ; les apostrophes françaises
  passent sans échappement, mais **jamais de guillemet droit `"` à l'intérieur** :
  utiliser les guillemets typographiques `«  »` ou `“ ”`.
- `Array.sort()` est stable : on peut s'appuyer dessus pour préserver
  l'ordre d'origine à valeur de tri égale.
- Une boîte de contribution de cible `concept` n'a **pas** de `f.notion` :
  ses notions sont dans `f.cnotions` (tableau). Idem dans le JSON généré.
