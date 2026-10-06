# CLAUDE.md — Consignes du projet

Outil de révision **Philosophie Terminale**, ouvert à tous (novices comme
connaisseurs) : site statique en HTML, CSS et JavaScript sans framework,
thème sombre, installable et hors-ligne (PWA), comptes et synchronisation
par Supabase.

**Mise à jour en cours (octobre 2026).** Diagnostic, feuille de route
validée et avancement : `docs/diagnostic-2026-10.md` (ordre : 1 réparer,
2 outiller, 3 build et adresses par page, 4 compléter les auteurs de la
liste officielle, 5 hors programme, 6 enrichir ; décisions de l'auteur au
§ 10, avancement au § 11). Le lire avant tout chantier de cette mise à jour.

## Où est quoi

| Chemin | Rôle | On l'édite ? |
|---|---|---|
| `contenu/` | **le contenu** : `notions/<clé>.js` (un fichier par notion), `auteurs/<nom>.js` (fiche de chaque auteur), `concepts.js`, `reperes.js`, `ordre.js`, `programme.js` (la liste officielle : 17 notions, 84 auteurs) | **oui** |
| `js/`, `css/` | **le code** du site, en morceaux numérotés (`01-…` à `14-…`) | **oui** |
| `index.html` | le squelette HTML ; charge `app.css`, `data.js`, puis `app.js` | oui (HTML seulement) |
| `data.js`, `app.js`, `app.css` | **générés** par le build à partir de `contenu/`, `js/`, `css/` | **jamais** |
| `sw.js` | service worker ; ses lignes `CACHE` et `PRECACHE` sont écrites par le build | le reste, oui |
| `outils/` | `construire.mjs` (build), `verifier_contenu.mjs` (contrôle), `lib/` (formats, écriture), `banc/` (règles d'accès Supabase) | oui |
| `docs/` | diagnostic, protocole du contenu, architecture détaillée, carte du projet | oui |
| `triage/` | mini-appli de tri des propositions sur téléphone | oui |
| `philo-aggregator/` | outil Python local : récupère, relit (Gemini) et exporte les propositions ; migrations SQL | oui |
| `icon.ico`, `icon_gear.ico` | icônes du raccourci Windows du tableau de bord local de l'agrégateur | non |

## Travailler

1. Modifier les **sources** (`contenu/`, `js/`, `css/`).
2. Lancer **`node outils/construire.mjs`** : il écrit `data.js`, `app.js`,
   `app.css`, met à jour `sw.js` (version du cache = empreinte du contenu)
   et les refs de la carte, vérifie la syntaxe d'`app.js` (une faute est
   signalée avec son fichier et sa ligne) et lance le vérificateur du contenu.
   Il doit finir sans « ÉCHEC » et sur « cohérent ».
3. Regarder le résultat dans le navigateur (voir « Pièges » pour une worktree).
4. Commiter les sources **et** les fichiers produits. Le hook de commit
   (`.githooks/pre-commit`) refuse un commit dont les fichiers produits ne
   sont pas à jour (`construire.mjs --controle`) ou dont le contenu n'est
   pas cohérent.

## Règles de modification (IMPÉRATIVES)

- **Contenu : suivre `docs/protocole-contenu.md`** (sources acceptées,
  citation exacte entre « » ou reformulation sans guillemets, trois statuts
  programme / hors liste / hors programme, compte rendu). Une citation qu'on
  n'a pas pu vérifier n'entre pas comme citation.
- **Hors programme** : une notion est hors programme dès que sa clé n'est pas
  dans `contenu/programme.js` ; on l'ajoute à la fin de `ORDRE`, avec le
  minimum du protocole (§ 4.5, question 12) dont le champ `sources: [...]`.
  Les statuts (programme, hors liste, hors programme) se CALCULENT
  (`statutAuteur`, `statutConcept`, `estHP` dans `js/01-donnees-etat.js`) :
  ne jamais les écrire dans le contenu.
- **Tout élément ajouté** (notion, auteur, texte, plan, exemple, accroche,
  concept, sujet) **porte `new:true`** ; un élément corrigé, `modified:true`.
- **Un seul nom par auteur** : le `n` employé dans les notions est aussi le
  nom de sa fiche (`AUTEUR("…")`) ; les autres formes vont dans
  `AUTHOR_ALIASES` (`js/05-liens-dynamiques.js`). Chercher avant d'ajouter.
- **`id` de concept unique**, et ne jamais en renommer un à la légère : c'est
  la clé de progression du quiz.
- **Ne pas toucher au CSS ni au JS de rendu existant** sans raison explicite
  et justifiée ; **ne pas toucher aux commentaires existants** sauf pour les
  mettre à jour quand ils deviennent faux.
- **Annoter le code** : tout ajout ou correction de logique s'accompagne d'un
  commentaire d'en-tête de fonction et de repères dans le code.
- **Carte du projet** (`docs/carte/`) : à chaque changement d'architecture
  (fonction notable, variable, table, route, clé localStorage, flux), mettre
  à jour **les nœuds et les textes** de `carte.data.js` dans le même commit.
  Les refs `fichier:ligne` sont recalculées par le build ; un symbole qui a
  disparu du code le fait échouer. Voir `docs/carte/MAJ.md`. Ces fichiers
  sont de la doc : jamais dans le précache.
- **Ressource statique nouvelle** (servie au navigateur) : l'ajouter à
  `PRECACHE` dans `outils/construire.mjs` ; le build met `sw.js` à jour.

## Contrôles

- **`node outils/verifier_contenu.mjs`** : 12 questions sur `data.js` (KEYS,
  notions, ids et termes uniques, relations, repères, fiche `AM` de chaque
  auteur, dialogues, guillemets des citations, traces de support de cours,
  format canonique, programme officiel couvert, minimum d'une notion hors
  programme). `--temoins` glisse une faute par question et vérifie
  qu'elle est vue : une règle nouvelle = une question + son témoin.
  `--racine <dossier>` contrôle une autre copie du site.
- **`node outils/construire.mjs --temoins`** : prouve que le contrôle de
  syntaxe voit une faute glissée exprès.
- **`node docs/carte/verifie.mjs`** : chaque symbole de la carte doit être
  DÉFINI dans le code (une mention en commentaire ne compte pas).
- **Base Supabase** : schéma versionné dans `philo-aggregator/migrations/`
  (ordre et usage : README de l'agrégateur). `2026_schema_base.sql` est une
  reconstitution depuis le code, à comparer à la base réelle
  (`2026_schema_lecture.sql`, lecture seule). Le banc `outils/banc/`
  (`npm ci && node banc_schema.mjs`, PGlite) joue toutes les migrations et
  éprouve les règles d'accès, chacune avec son témoin. Une migration
  nouvelle va dans `ORDRE` de `banc_schema.mjs`, avec ses essais.

## Données (vue d'ensemble)

`data.js` définit cinq globales, déjà au format canonique (le build
convertit les anciens formats, cf. `outils/lib/formats.mjs`) :
`D` (les notions), `KEYS` (leur ordre), `AM` (les fiches d'auteurs),
`CONCEPTS` (concepts puis repères), `PROGRAMME` (la liste officielle,
`{source, notions, auteurs:[{bo, periode, fiches}]}`). Formats détaillés, onglets, liens
dynamiques, contribution, interface, quiz : **`docs/architecture.md`**.

Rappels qui reviennent souvent :
- notion : `{c, l, s, def, auteurs:[{n, ideas:[{w, i, citations:[…], fiche?}]}],
  textes, plans, exemples, accroches, liens, diss}` ;
- concept : `{id, term, cat, def, auteur?, notions:[…], liens?, relations:[{to|term, type, desc}]}`,
  `type` ∈ `oppose | prolonge | complete | repond | distinction | implique` ;
  un repère a `cat:'Repère'`, un `id` en `rep-…` et au moins une relation
  `distinction` ;
- fiche d'auteur : `{bio, courant, periode, themes:[…], dialogues:[{dir, auteur, sujet, desc}]}`.

## Pièges connus

- Les chaînes sont entre **guillemets doubles** ; jamais de guillemet droit
  `"` à l'intérieur d'un texte : utiliser « » ou “ ”.
- **`node --check` ne vérifie rien** sur cette machine (sortie 0 même sur un
  fichier cassé). Le build contrôle la syntaxe d'`app.js` (`vm.Script`) ;
  pour un autre fichier, compiler avec `new Function(…)` après avoir fait
  passer une version volontairement cassée.
- `Array.sort()` est stable : on peut s'appuyer dessus pour garder l'ordre
  d'origine à valeur égale.
- **L'ordre des fichiers `js/` compte** : `app.js` les recolle par ordre de
  nom et le code « de premier niveau » s'exécute dans cet ordre (une
  `const` d'un morceau n'existe pas encore pour le code de premier niveau
  d'un morceau précédent). Les fonctions, elles, sont visibles partout.
- Une boîte de contribution de cible `concept` n'a **pas** de `f.notion` :
  ses notions sont dans `f.cnotions` (tableau). Idem dans le JSON généré.
- En PostgreSQL, un `REVOKE` sur une **colonne** ne retire rien si le rôle
  garde le droit sur la **table** (Supabase donne tout d'office à anon et
  authenticated) : `revoke all` sur la table, puis `grant` colonne par colonne.
- **Hook et worktree** : `core.hooksPath` pointe vers le `.githooks` du dépôt
  PRINCIPAL ; dans une worktree, c'est la version de `main` qui s'exécute.
- **Prévisualiser une worktree** : la config `philo-static` de
  `.claude/launch.json` sert le dossier principal du dépôt ; ajouter
  temporairement une entrée avec `--directory <chemin de la worktree>`, puis
  `git checkout -- .claude/launch.json`.
- Le navigateur intégré à l'application affiche « An unknown error occurred
  when fetching the script » à l'enregistrement du service worker : ça vient
  du navigateur intégré, pas du code (vu aussi sur `main`).
