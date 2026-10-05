# Diagnostic du site philo (4 octobre 2026)

Ce document fait l'état des lieux complet du site avant la mise à jour : ce
qui est cassé, ce qui gêne, ce qui encombre, ce qu'on peut emprunter à Fiches
BUT, et ce qu'on pourrait construire. Il finit par l'ordre de travail proposé
et les questions qui restent à trancher ensemble. Rien n'a été modifié dans le
code pour l'écrire.

Comment il a été fait : lecture d'`index.html`, de `data.js`, du service
worker, de la page de triage et de l'agrégateur ; des scripts Node qui
chargent `data.js` et comptent ce qui cloche (doublons, références mortes,
citations douteuses) ; le site lancé dans le navigateur, sur bureau et en
largeur de téléphone, avec des mesures prises dans la page ; le programme
officiel téléchargé (BO spécial n° 8 du 25 juillet 2019) et comparé aux
données. Les scripts d'audit sont restés dans le dossier temporaire de la
session : s'ils doivent servir encore, ils sont la base naturelle du
vérificateur proposé au § 7.

## 1. L'état des lieux en chiffres

| Élément | Nombre |
|---|---|
| Notions | 17 (les 17 du programme) |
| Concepts | 210, dont 31 repères (les 31 repères officiels sont tous là) |
| Auteurs présents dans les notions | 83, dont 45 de la liste officielle et 38 hors liste |
| Auteurs de la liste officielle absents du site | 39 sur 84 |
| Citations | 211 |
| Textes / exemples / accroches / sujets | 176 / 135 / 34 / 155 |
| Plans de dissertation | 3 rédigés, 57 « migrés » depuis l'ancien format (badge « à enrichir ») |
| Cartes de quiz générées | 859 |
| Éléments marqués `new:true` | près de 250 |
| `index.html` | 8 186 lignes, 484 Ko (CSS + HTML + tout le JS) |
| `data.js` | 681 Ko, 1 633 lignes (certaines font plusieurs milliers de caractères) |
| Chargement | 0,7 s en local sur PC, 1,2 Mo de code à analyser |

Le contenu est riche et le site tient debout. Mais une bonne partie des
données vit encore dans les anciens formats (162 entrées d'auteur sur 193 en
format « à plat », 124 concepts avec l'ancien champ `tensions`, 57 plans à
l'ancien format `axes`) que le site convertit à chaque chargement.

## 2. Ce qui est cassé

### 2.1 Le quiz

C'est la partie la plus abîmée. Chaque point ci-dessous a été reproduit dans
le navigateur.

**Les sessions tournent en rond.** Pour quelqu'un qui commence, chaque
« Nouvelle session » donne exactement les mêmes 15 cartes : les 15 premiers
concepts du fichier (absurde, antinomie, arraisonnement, dogmatisme…), tous du
même type « Concept → définition ». `pickSession()` prend les cartes neuves
dans l'ordre du tableau `QUIZ_CARDS`, qui commence par les concepts. Il faut
donc passer environ 14 sessions avant de voir une seule citation. Le petit
mélange final ne mélange que l'ordre des 15 cartes déjà choisies.

**La question donne la réponse.** Pour 118 concepts sur 210 (56 %), la
définition contient le mot à trouver. Exemple vu en QCM : « Quel concept ?
Conflit entre deux propositions contradictoires… L'antinomie révèle… » avec
« Antinomie » parmi les choix.

**Deux bonnes réponses en QCM.** Pour « Qui a dit cela ? », les leurres sont
pris parmi les autres cartes sans vérifier l'auteur. Le même auteur peut donc
revenir avec une autre œuvre : « Le moi n'est pas maître en sa propre
maison », choix « Freud, L'Interprétation des rêves » et « Freud,
Considérations actuelles sur la guerre… ». Une seule est comptée juste.
Environ 4 % des QCM de citation sont touchés. Les choix affichent aussi
l'œuvre et la date, ce qui allonge tout et aide parfois à deviner.

**Des paraphrases présentées comme citations.** 32 « citations » sur 211
(15 %) sont des résumés (« La conscience = durée intérieure, non espace
mesurable », Bergson). Le quiz les pose quand même sous « Qui a dit
cela ? ».

**La progression peut glisser d'une carte à l'autre.** L'identifiant d'une
carte de citation est fait de positions (`c3:Kant:liberte:0:1` = 1re idée,
2e citation). Ajouter ou réordonner une idée décale les numéros, et la
mémoire d'une carte passe à une autre. En plus, 4 concepts ont un `id` en
double (`scepticisme`, `obstacle-epistemologique`, `falsifiabilite`,
`sophisme`) : deux cartes partagent la même clé de progression.

**Des cartes impossibles à auto-évaluer.** Les cartes « Notion → auteurs »
demandent de restituer 5 auteurs et leur thèse : la réponse fait 925 pixels
de haut sur téléphone, et les boutons « je savais » sont sous la ligne de
flottaison.

**Le tableau de bord rame.** `isDue()` relit et décode tout le stockage local
à chaque carte : 864 décodages par affichage. Avec la moitié des cartes déjà
vues, un affichage prend 290 ms sur PC, et il est refait à chaque clic sur un
filtre. Sur un téléphone moyen, il faut probablement compter plus d'une
seconde, et le temps grossira avec le contenu.

**Le jour change à 2 h du matin.** `todayStr()` prend la date en temps
universel (UTC) : entre minuit et 2 h l'été (1 h l'hiver), les réponses
comptent pour la veille, ce qui fausse l'objectif du jour et la série.

**Des réponses perdues entre deux appareils.** La synchro envoie tout le quiz
d'un bloc, 1,5 s après la dernière réponse, et la dernière écriture gagne.
Rien n'est envoyé si on ferme l'onglet pendant ces 1,5 s, rien n'est
réessayé au retour du réseau, et au retour sur l'onglet le bloc distant
remplace le local s'il a changé. Des réponses faites hors ligne sur le
téléphone peuvent donc disparaître.

**Des badges hors d'atteinte.** Un badge de notion demande toutes ses cartes
au palier 5, soit une cinquantaine de cartes par notion.

### 2.2 Les données

| Problème | Détail |
|---|---|
| Concepts en double | 4 `id` identiques (cités plus haut) et 3 quasi-doublons : `langage-def` / `notion-langage`, `eudaimonia` / `eudaimonia2`, `elan-vital` / `elan-vital2` |
| Fiches d'auteur sans biographie | 12 auteurs des notions n'ont pas d'entrée dans `AM` (Simone Weil, Robert Nozick, Gunther Anders, Ellul, Darwin, Michel Serres…) |
| Biographies orphelines | `AM` contient « Weil », « Nozick », « Anders » : les bios manquantes existent, sous un autre nom. La fiche « Simone Weil » s'affiche sans bio alors que la bio est dans `AM["Weil"]` |
| Dialogues vers le vide | 4 dialogues visent un auteur sans fiche : Wittgenstein, Bateson, Chomsky, « Gaston Bachelard » (la fiche s'appelle « Bachelard ») |
| Auteurs cités sans fiche | Wittgenstein est nommé 13 fois, Husserl 5, Ockham 4, Foucault, Lévi-Strauss, Benjamin, Montesquieu, Berkeley 3 fois : texte mort, contraire à la règle de `CLAUDE.md` |
| Courants en texte libre | environ 75 libellés différents pour 84 auteurs ; 31 auteurs restent gris faute de couleur dans `CC`. Impossible de filtrer par courant ou par époque. (Correction du 5 octobre : les 5 entrées « vides » comptées d'abord sont des alias du type `"Arendt":{bio:"Voir 'Hannah Arendt'."}`, pas des oublis.) |
| Catégories de concepts | 61 catégories différentes pour 179 concepts (« Philosophie », « Philosophie pascalienne », « Épistémologie / Logique »…) |
| Guillemets | 143 citations entre apostrophes droites `'…'` au lieu de « … » |

### 2.3 La fiabilité du contenu

Le site veut être « agrégé, sourcé et fiable ». Aujourd'hui, il ne peut pas
encore le prouver.

**Des erreurs de référence.** Exemple type : « Je pense, donc je suis » est
attribué aux *Méditations métaphysiques* (1641). La formule est dans le
*Discours de la méthode* (1637, IVe partie) ; les *Méditations* disent « je
suis, j'existe ». C'est l'erreur classique des copies, et le site la
reproduit. Il y en a sûrement d'autres : aucune citation ne porte de
référence précise (chapitre, paragraphe, traduction), seulement l'œuvre et
l'année au niveau de l'idée.

**Des traces du cours.** 67 mentions « (TEXTE 1) », « (TEXTE 9) »… renvoient au
recueil de textes d'un professeur et s'affichent telles quelles aux
visiteurs (« L'Enracinement, 1943 (TEXTE 10) » sur la fiche de Simone Weil).
Fiches BUT a réglé la même question par une doctrine : le support d'un
enseignant dit *ce qui a été vu*, jamais *ce qu'on écrit*.

**Des citations répétées.** 13 citations apparaissent sous plusieurs
notions ; sur la fiche d'auteur, la même phrase s'affiche deux fois de suite.

**Aucune source générale.** Ni les notions ni les concepts ne disent d'où
vient leur définition (Lalande, encyclopédie, manuel, œuvre).

### 2.4 Le site et l'outillage

| Problème | Détail |
|---|---|
| `robot.txt` | le fichier s'appelle `robot.txt` ; les moteurs cherchent `robots.txt`, donc il n'est jamais lu |
| Bibliothèque Supabase | chargée par `supabase-js@2` sans version précise ni empreinte d'intégrité : une mise à jour majeure côté CDN peut casser le compte du jour au lendemain |
| SDK Gemini | l'agrégateur dépend de `google-generativeai`, abandonné par Google depuis le 30 novembre 2025 ; il faut passer à `google-genai` |
| Schéma de la base | les tables `contributions`, `preferences`, `quiz_progress` et la fonction `delete_own_account` ne sont décrites nulle part dans le dépôt (les 3 migrations présentes ne portent que sur l'administration mobile, l'état de l'agrégateur et les envois anonymes). Impossible de reconstruire la base ou de tester ses règles d'accès |
| Carte du projet | `verifie.mjs` annonce « aucun drift » mais 194 références sur 251 ont bougé, et il accepte un nom trouvé dans un commentaire (`contributions` « déplacé » vers la ligne 69, qui est l'en-tête). Il ne verrait pas une fonction supprimée si son nom reste dans un commentaire |

### 2.5 La documentation a dérivé

Le `README.md` parle de « plus de 160 concepts », d'un cache « cache-first »,
d'un envoi des propositions par e-mail et de badges visibles seulement en
mode édition : tout cela a changé. L'en-tête d'`index.html` décrit encore
3 modes de barre latérale (il y en a 5) et la boîte PythonAnywhere (éteinte).
`CLAUDE.md` ignore le « mode fiche » (lecture compressée, clé `philo-fiche`)
et le champ `fiche` présent sur 182 entrées d'auteur. Et `CLAUDE.md` fait
660 lignes : il est relu en entier à chaque session, ce qui coûte cher et
noie les règles importantes.

## 3. Les frictions pour qui utilise le site

**Pas d'adresse par page.** Le site n'a qu'une seule URL. On ne peut pas
envoyer un lien vers « Liberté » ou vers Kant : le bouton « Partager »
partage la page d'accueil. Le bouton « précédent » du navigateur fait sortir
du site (d'où le bouton « ← Retour » maison). Et pour Google, il n'existe
qu'une page : un novice qui cherche « Spinoza liberté » ne tombera jamais
dessus. Le plan du site (`sitemap.xml`) ne liste d'ailleurs qu'une adresse.

**Trop de liens.** Sur la notion Liberté, 125 liens dans l'onglet Auteurs,
soit un mot sur sept environ ; 61 d'entre eux renvoient à la notion Liberté
elle-même. Pour un novice, la page devient un champ de mots soulignés.
L'usage courant (Wikipédia par exemple) : lier la première occurrence, jamais
la page où l'on est.

**Des liens que le clavier ne voit pas.** Les termes liés sont des `<span>`
avec `onclick` : aucun n'est atteignable à la touche Tab, et un lecteur
d'écran ne sait pas que ce sont des liens.

**Du texte très petit.** Une centaine de déclarations entre 8 et 11 pixels.

**Une recherche qui ne cherche que les titres.** Ctrl+K trouve une notion,
un auteur, un concept, une accroche, mais pas « roseau pensant », pas
« Léviathan », pas un exemple ni un sujet.

**Rien ne dit ce qui est au programme.** Le site mélange sans le signaler
les 45 auteurs de la liste officielle (ceux qui peuvent tomber à
l'explication de texte) et 38 auteurs hors liste (Camus, Tisseron, Morizot,
Orwell…). C'est pourtant l'information la plus utile pour un élève, et c'est
exactement la distinction dont le futur « hors programme » a besoin.

**Des trous du programme.** 39 auteurs de la liste officielle n'ont pas de
fiche, dont des incontournables : Montaigne, Machiavel (aucune mention dans
une notion État !), Lucrèce, Marc Aurèle, Cicéron, Montesquieu, Diderot,
Bentham, Husserl, Wittgenstein, Beauvoir, Levinas, Foucault, Lévi-Strauss.

**Le badge « Nouveau » ne veut plus rien dire.** Près de 250 éléments le
portent, sans date ni expiration.

**Détails visibles.** Des trous dans la grille des cartes d'auteur (une
colonne vide quand la carte suivante prend deux colonnes), le panneau du quiz
semi-transparent par-dessus la page, des plans marqués « ↻ à enrichir »
affichés aux visiteurs, et un seul thème, sombre, pour lire de longs textes.

## 4. Le ménage

| Quoi | Proposition |
|---|---|
| `philo-mailbox/` + `MAILBOX_URL` + `sendProposalOnline` + route `/pull` | la boîte PythonAnywhere est éteinte : archiver le dossier et retirer le repli mort du site (à décider, cf. § 10) |
| `icon.ico`, `icon_gear.ico` | référencés nulle part dans le dépôt ; à garder seulement s'ils servent à un raccourci Windows du dashboard |
| `data.js` contient de l'état de l'appli | `cur`, `curTab`, `sbMode`… n'ont rien à faire avec les données : les rapatrier dans le script |
| Anciens formats dans la source | convertir une fois pour toutes (auteurs à plat, `tensions`, `axes`) par un script, puis supprimer les fonctions de conversion |
| 64 marqueurs « new (Phase 2) » dans les commentaires | les retirer, ils datent d'un chantier fini |
| « (TEXTE n) » ×67 | retirer de l'affichage, garder éventuellement la trace dans un champ interne |
| `docs/PASSATION.md` | à fondre dans un journal de conception (§ 5) |
| Branches et worktrees | 8 branches `claude/*` locales et 3 worktrees anciens : faire le tri |
| `CLAUDE.md` | le réduire aux règles, et déplacer les descriptions détaillées dans `docs/` |

## 5. Ce que Fiches BUT fait autrement

Les deux projets sont du même auteur mais pas du même âge : Fiches BUT a été
construit en septembre 2026 avec les leçons du site philo, et il a pris
de l'avance sur l'outillage.

| Sujet | Fiches BUT | Site philo | Ce qu'on peut reprendre |
|---|---|---|---|
| Où vit le contenu | un fichier par fiche (`content/`) et un JSON par module | un seul `data.js` de 681 Ko | un fichier par notion, par auteur, pour les concepts |
| Construction | `build_site.py` écrit le site ; la sortie est versionnée | aucune, on édite le fichier servi | un petit script de construction en Node, sortie versionnée (le double-clic sur `index.html` continue de marcher) |
| Contrôle du contenu | `verifier_corpus.py`, 11 questions, « cohérent » ou « À CORRIGER », avec cas témoins | rien sur les données | un `verifier_contenu.mjs` sur le même modèle |
| Quiz | banque de questions écrite à la main (`questions/*.json`), 4 formats, 3 niveaux, une explication et un lien « Relire la section » par question, vérifiée par `verifier_questions.py` | 859 cartes générées automatiquement, sans contrôle | garder la génération pour ce qui marche, ajouter une banque écrite et vérifiée |
| Mémoire du quiz | Leitner calculé côté serveur, une ligne par question, reprise après chaque réponse | un bloc dans le navigateur, synchronisé en entier | fusion carte par carte (§ 9) |
| Liens vers un élément | toute section a une ancre ; `#ancre` y mène et la fait briller | aucune adresse par page | routage (§ 7) |
| Recherche | plein texte, mène à la section et surligne le mot | titres seulement | index plein texte construit au build |
| Carte du projet | extraite du code à chaque construction, seuls les textes sont écrits à la main | écrite à la main, vérifiée par un script trop tolérant | extraire les fonctions automatiquement |
| Journaux | `changelog.json` (site), `changelog-fiches.json` (contenu), page « Nouveautés » | `new:true` sans date | un journal du contenu et des dates d'ajout |
| Documentation | journal de conception par sujet, sections numérotées, un protocole des sources | `CLAUDE.md` monolithique + une passation | même découpage, et un protocole du contenu philo |
| Base de données | toutes les migrations versionnées, règles d'accès testées sur une base de banc (PGlite) | schéma de base absent du dépôt | versionner le schéma ; le banc peut attendre |
| Thème | clair et sombre | sombre seulement | ajouter le clair |
| Typographie | espaces insécables posés au build | à la main, inégal | les poser au build |

Deux remarques pour ne pas tout recopier. Fiches BUT a un serveur
(Cloudflare Functions) parce qu'il gère des accès réservés ; le site philo
est public et n'en a pas besoin. Et le banc d'essai de Fiches BUT
(jsdom, PGlite) est lourd : pour philo, un vérificateur de données attrape
déjà l'essentiel de ce qui est listé au § 2.

## 6. Ce qu'on pourrait construire

Classé du plus utile au plus ambitieux, à mon sens.

1. **Une adresse par page** (`#/notion/liberte`, `#/auteur/Kant`), donc des
   liens partageables, le bouton précédent du navigateur qui marche, et
   « Partager » qui partage la page ouverte.
2. **La recherche plein texte** : citations, œuvres, exemples, sujets, avec
   arrivée sur l'élément et le mot surligné (Fiches BUT a déjà la mécanique).
3. **L'aperçu au survol** d'un concept ou d'un auteur : une bulle avec la
   définition courte, un clic pour ouvrir la fiche. C'est ce que fait
   Wikipédia (« aperçus de page ») : le novice comprend sans perdre sa
   lecture. Ça permet aussi d'alléger les liens sans rien perdre.
4. **Le statut programme / hors liste / hors programme** affiché partout
   (§ 8), avec un réglage pour masquer le hors programme.
5. **Une frise des auteurs** par époque. La donnée existe (`AM.periode`),
   mais la seule frise du dépôt est celle des commits. Pour un novice, situer
   Spinoza par rapport à Descartes est la première chose à comprendre.
6. **Un vrai graphe des idées.** Le site s'appelle « Graphe Philosophie »
   mais n'a pas de vue graphe : les dialogues entre auteurs (s'oppose à,
   prolonge, répond à), les relations entre concepts et les liens entre
   notions sont déjà dans les données. La carte du projet sait déjà dessiner
   un graphe nœud-lien sans dépendance : on peut réutiliser son moteur.
7. **Les sujets tombés au bac**, datés, par notion. Des recueils complets
   existent (l'académie de Montpellier publie celui de 1996 à 2022, d'autres
   vont jusqu'en 2024) ; un sujet réel avec son année vaut plus qu'un sujet
   inventé.
8. **Les textes intégraux libres de droits** : lien vers Wikisource, Gallica
   ou les Classiques des sciences sociales pour les œuvres anciennes.
9. **Une fiche imprimable par notion** (feuille de style d'impression), le
   point fort historique de Fiches BUT.
10. **Un thème clair** et un réglage de taille de texte.
11. **Une page « Nouveautés »** alimentée par un journal du contenu, à la
    place des badges permanents.

## 7. L'architecture possible

Le principe « pas de build, on ouvre `index.html` » a bien servi, mais il
atteint sa limite : un fichier de 8 000 lignes qu'on doit réécrire par
sections entières, des données qu'on ne peut pas vérifier, des conversions
refaites à chaque chargement. Trois options :

**A. On ne change rien à la forme**, on corrige seulement. Rapide, mais
chaque ajout de contenu hors programme agrandit un fichier déjà difficile à
relire, sans filet.

**B. Un build léger, la sortie versionnée** (ma recommandation). Le contenu
passe dans `contenu/` (un fichier par notion, par auteur, un pour les
concepts, un pour le programme officiel), toujours en objets JavaScript pour
rester lisible et commentable. Un script `outils/construire.mjs`, en Node
pur et sans dépendance, les charge, les vérifie, fait une fois pour toutes
les conversions d'anciens formats, pose la typographie française, construit
l'index de recherche, et écrit `data.js` et `recherche.js`. Le CSS et le JS
d'`index.html` sortent dans `css/` et `js/` (scripts classiques, dans
l'ordre, pour que le double-clic marche toujours). Le script calcule aussi
la version du cache du service worker : fini l'oubli d'incrémenter
`philo-vN`. Comme pour Fiches BUT, ce qui est servi est versionné : Vercel
n'a rien à construire.

**C. Un framework** (Astro, Eleventy…). Plus de pages statiques, meilleur
référencement, mais une dépendance npm, un apprentissage, et une réécriture
du rendu. Disproportionné pour l'instant.

Pour les adresses : d'abord le routage par `#` (`#/notion/liberte`), qui
marche partout, y compris en double-clic, et qui se branche sur la pile
d'historique existante. Plus tard, si le référencement compte vraiment, le
build peut générer une petite page statique par notion et par auteur (titre,
description, contenu lisible par Google) qui ouvre l'application au bon
endroit.

Pour la croissance : avec le hors programme, `data.js` va dépasser le
mégaoctet. Le build permet de découper plus tard en « index léger + détail
chargé à la demande » si la mesure le justifie. Pas avant.

## 8. Le hors programme

### Trois statuts, pas deux

Le programme officiel fixe trois listes : 17 notions, 31 repères, 84 auteurs.
Mais la liste des auteurs ne joue que pour l'explication de texte : en
dissertation, un élève peut citer qui il veut. Dire « Camus : hors
programme » serait donc faux. Je propose :

| Statut | Pour quoi | Affichage proposé |
|---|---|---|
| **Programme** | les 17 notions, les 31 repères, les 84 auteurs de la liste | pastille discrète « Au programme » sur les auteurs de la liste |
| **Hors liste** | un auteur hors de la liste, mais traité dans une notion du programme (Camus, Tisseron…) | rien de spécial, ou « Hors liste » en petit sur sa fiche |
| **Hors programme** | une notion nouvelle, et tout ce qui n'apparaît que sous elle | badge « Hors programme », section repliée en bas de la barre latérale, exclu du quiz par défaut, masquable dans les Réglages |

Le statut se **calcule** au lieu de s'écrire à la main : on ajoute une
constante `PROGRAMME` (les trois listes officielles, avec la référence du
BO), et un auteur ou un concept prend son statut des notions où il
apparaît. C'est la leçon de la carte de Fiches BUT : ce qui peut dériver ne
s'écrit pas à la main.

### Le premier lot de notions

Les notions de l'ancien programme (2003) sont le candidat naturel : elles
ont été enseignées pendant quinze ans, les manuels et les annales en sont
pleins, donc elles se sourcent bien, et elles prolongent les 17 notions
actuelles. Autrui, le désir, la perception, l'existence, l'histoire, le
vivant, la matière et l'esprit, l'interprétation, la démonstration, la
société, le droit. Viennent ensuite des notions classiques que le programme
n'a jamais eues en propre (la mort, le corps, le beau, la violence…), à
choisir ensemble.

Avant ces notions, une question de priorité : les 39 auteurs de la liste
officielle absents du site sont, eux, au programme. Pour un élève, Montaigne,
Machiavel ou Beauvoir valent plus qu'une notion hors programme.

### Ce qu'il faut pour que ce soit fiable

Un protocole du contenu, écrit une fois (`docs/protocole-contenu.md`, sur le
modèle de `protocole-sources.md` de Fiches BUT), qui fixe au moins :

- une citation exacte porte sa référence complète (œuvre, partie ou
  paragraphe, traduction) et un statut `exacte`, `paraphrase` ou
  `attribuée` ; seules les exactes vont dans « Qui a dit cela ? » ;
- une définition dit sa source (le *Vocabulaire technique et critique de la
  philosophie* de Lalande, une œuvre, une encyclopédie) ;
- un auteur porte ses dates et son identifiant Wikidata, ce qui permet de
  vérifier les dates et de relier aux textes libres ;
- une notion hors programme a un minimum (définition, 3 à 6 auteurs,
  concepts, un plan, des exemples, ses sources) avant d'être publiée ;
- **une citation qu'on ne peut pas vérifier n'entre pas comme citation.**
  Ce point compte d'autant plus que le contenu sera en partie rédigé avec
  une IA, qui peut produire une phrase plausible jamais écrite par l'auteur.

Le vérificateur du § 7 bloque ce qui ne respecte pas ces règles.

## 9. Le quiz, version 4

Corriger d'abord ce qui est faux (§ 2.1), puis changer ce qui est mal pensé.

**Corrections directes.** Tirer les cartes neuves au hasard et en alternant
notions et types ; ne pas poser « Quel concept ? » quand la définition
contient le mot (ou masquer le mot par « ___ ») ; exclure des leurres le même
auteur et n'afficher que le nom ; exclure les paraphrases de « Qui a dit
cela ? » ; donner aux citations un identifiant tiré de leur texte (et non de
leur position), avec une table de correspondance pour ne pas perdre la
progression actuelle ; lire le stockage une fois par affichage ; prendre la
date locale ; badges atteignables (palier 4, ou 80 % des cartes).

**Synchro.** Fusionner carte par carte (la révision la plus récente gagne)
au lieu de remplacer le bloc, avec une date de remise à zéro par rythme pour
qu'une carte effacée ne revienne pas ; envoyer immédiatement quand la page
se cache (`pagehide`) ; réessayer au retour du réseau.

**Nouveaux types de questions**, écrits ou générés à partir de ce qui
existe déjà : vrai/faux sur les repères (« Ce qui est légal est toujours
légitime »), « qui s'oppose à qui » depuis les dialogues, « quelle notion
pour ce sujet », « dans quel ordre vont ces trois parties de plan », et une
banque de questions écrites à la main, chacune avec son explication et un
lien « Relire la fiche ».

**Le moteur.** Leitner à intervalles fixes marche, mais il existe mieux :
FSRS (Free Spaced Repetition Scheduler), l'algorithme que propose Anki
depuis 2023, estime pour chaque carte la probabilité qu'on s'en souvienne
et fixe la révision au moment où elle va baisser. D'après les mesures de ses
auteurs sur des centaines de millions de révisions, il demande 20 à 30 %
de révisions en moins pour le même taux de mémorisation. Ses formules
tiennent en une centaine de lignes de JS, sans dépendance. À garder pour
plus tard : le gain est réel, mais les corrections ci-dessus comptent plus.

## 10. L'ordre proposé, et ce qui reste à trancher

| Étape | Contenu | Pourquoi à ce rang |
|---|---|---|
| 1. Réparer | quiz (§ 2.1 et § 9 « corrections »), données (§ 2.2), `robots.txt`, version de Supabase, doc à jour | des défauts visibles aujourd'hui, peu risqués à corriger |
| 2. Outiller | `verifier_contenu.mjs`, protocole du contenu, schéma de base versionné, nettoyage du § 4 | ajouter du contenu sans filet multiplierait les erreurs du § 2.3 |
| 3. Restructurer | build léger, découpage d'`index.html`, adresses par page, recherche plein texte | rend le reste plus simple et plus sûr |
| 4. Compléter le programme | les 39 auteurs officiels manquants, l'étiquette « Au programme », les références des citations existantes | c'est ce qui sert le plus aux élèves |
| 5. Le hors programme | statuts, réglage, premier lot de notions | le cœur de la demande, sur des bases saines |
| 6. Enrichir | frise, graphe des idées, sujets réels, quiz v4, thème clair | selon l'envie et le temps |

Les décisions qui t'appartiennent :

1. Cet ordre te convient-il, ou veux-tu le hors programme plus tôt ?
2. Les trois statuts (programme / hors liste / hors programme) : d'accord ?
   Et par défaut, le hors programme est-il visible avec son badge, ou masqué
   jusqu'à ce qu'on l'active ?
3. Le build léger (option B) : d'accord pour un script Node dans `outils/`,
   avec les fichiers produits versionnés ?
4. Compléter d'abord les auteurs officiels manquants, ou attaquer
   directement les nouvelles notions ?
5. La boîte PythonAnywhere : on supprime le dossier et le repli, ou on garde
   au cas où ?

### Réponses de l'auteur (5 octobre 2026)

1. L'ordre convient tel quel.
2. Les trois statuts sont retenus. Le hors programme est **visible par
   défaut**, et le site **propose de le désactiver à l'arrivée** (première
   visite).
3. Build léger en Node, fichiers produits versionnés : oui.
4. **Compléter d'abord** les 39 auteurs officiels manquants, avant les
   nouvelles notions.
5. La boîte PythonAnywhere est **supprimée** (dossier `philo-mailbox/` et
   repli du site), elle ne sert plus.

## 11. Avancement

### Étape 1, « Réparer » (5 octobre 2026)

**Quiz** (§ 2.1). Fait : cartes neuves tirées au hasard (une session mêle
désormais 5 types et une dizaine de notions, et deux sessions ne se
ressemblent plus) ; terme masqué dans « Quel concept ? », avec sa famille de
mots (201 concepts sur 203 gardent cette carte, aucune ne contient plus sa
réponse) ; QCM de citation sans doublon d'auteur (0 sur 825 tirages
d'essai), choix réduits au nom, œuvre affichée après la réponse ; citations
exactes seules (165 cartes au lieu de 211, les reformulations et les
doublons entre notions sortent) ; identifiants tirés du texte, avec
migration de la progression existante ; carte notion → auteurs réduite à 4
auteurs et une thèse courte ; une seule lecture du stockage par affichage
(288 ms → 5 ms) ; date locale ; badges à 80 % de cartes mémorisées ; bouton
« Relire la fiche ».

**Synchro** (§ 2.1). Fait : fusion carte par carte au retour sur l'onglet,
remises à zéro datées, envoi immédiat quand la page se cache, nouvelle
tentative au retour du réseau. Éprouvé sur une fausse base en mémoire, avec
un témoin : remettre l'ancien comportement fait bien perdre la carte révisée
hors ligne, et le test le voit.

**Données** (§ 2.2 et 2.3). Fait : 4 identifiants de concept en double et
3 quasi-doublons fusionnés (203 concepts) ; la fiche « Langage » en doublon,
qui attribuait la double articulation à Saussure, fondue dans « Double
articulation » (Martinet) ; bios de Simone Weil, Robert Nozick et Gunther
Anders rattachées au bon nom ; 9 biographies écrites (Ellul, Darwin, Frans
de Waal, Christopher Stone, Baptiste Morizot, Michel Serres, François Ost,
Val Plumwood, Srdja Popovic) ; dialogue « Gaston Bachelard » rattaché ;
Descartes : « je pense, donc je suis » rendu au *Discours de la méthode* ;
titre français du livre de Frans de Waal corrigé ; 142 citations passées
des apostrophes droites aux guillemets « ».

**Site** (§ 2.4 et 2.5). Fait : `robots.txt` renommé ; `supabase-js` figé
en 2.117.2 avec empreinte d'intégrité (site et triage) ; caches `philo-v60`
et `triage-v7` ; `README.md`, en-tête d'`index.html`, `CLAUDE.md` et carte du
projet mis à jour (la carte décrivait encore le quiz dans la table
`preferences`).

**Reporté** : le passage de l'agrégateur à `google-genai` (il faut une clé
pour l'éprouver, à faire avec l'auteur) ; les 4 dialogues vers des auteurs
sans fiche (Wittgenstein arrive à l'étape 4) ; la référence de
« croyance vraie justifiée » attribuée à Platon (formule moderne ; le
*Théétète* parle d'opinion vraie accompagnée de raison), qui relève de la
vérification des citations de l'étape 4.

### Étape 2, « Outiller » (5 octobre 2026)

**Fait.**

- **PythonAnywhere supprimé** : `philo-mailbox/`, le repli du site, la
  commande `pull` et la route `/pull` de l'agrégateur, `mailbox_client.py`.
  Si Supabase manque, l'envoi passe directement au repli mail.
- **SDK Gemini** : l'agrégateur passe à `google-genai`. Éprouvé par un vrai
  verdict (modèle `gemini-2.5-flash-lite`) et sur des erreurs 429 « par
  minute » et « par jour » construites avec la classe d'erreur du SDK ; une
  surcharge passagère (503) est maintenant attendue puis réessayée. Sur le
  PC : `pip install -r requirements.txt`.
- **Ménage des données** : 71 renvois « TEXTE n » retirés ; les variables
  d'état de l'affichage sorties de `data.js`.
- **Vérificateur** `outils/verifier_contenu.mjs` : 9 questions, chacune
  avec son témoin, branché sur le hook de commit. Lancé sur le `data.js` de
  `main`, il retrouve toutes les erreurs corrigées à l'étape 1.
- **Protocole** `docs/protocole-contenu.md`.
- **Base Supabase** : schéma reconstitué et versionné, photographie en
  lecture seule pour le comparer à la base réelle, banc PGlite
  (`outils/banc/`, 10 essais et leurs témoins). Le banc a trouvé un vrai
  défaut : le retrait de lecture de `aggregator_state` ne retirait rien
  (droit de table conservé). Correction : `2026_contributions_colonnes.sql`,
  **à lancer** dans l'éditeur SQL de Supabase.

**Reporté à l'étape 3**, parce que le build les fera d'office : la
conversion des anciens formats de la source (auteurs à plat, `tensions`,
`axes`), l'allègement de `CLAUDE.md`, et une carte du projet extraite du
code (le vérificateur actuel compte plus de 200 références « déplacées »).

**Décidé ensuite par l'auteur** : `icon.ico` et `icon_gear.ico` servent au
raccourci Windows du tableau de bord local (gardés, rôle noté dans le
README) ; branches `claude/*` fusionnées et worktrees anciennes supprimées
le 5 octobre. La photographie de la base réelle a confirmé le défaut de
lecture de `aggregator_state`, et montré qu'aucun compte ne pouvait
modifier ses propositions (droit UPDATE absent) : `2026_contributions_colonnes.sql`
corrige les deux, **à lancer**.

### Étape 3, « Build léger et adresses » (5 octobre 2026)

- **Le contenu dans `contenu/`** : un fichier par notion, une fiche par
  auteur, concepts, repères, ordre. `outils/construire.mjs` produit
  `data.js` (identique aux données que le site obtenait avant, vérifié avec
  témoin), convertit une fois les anciens formats (le site ne convertit plus
  rien au chargement) et calcule la version du cache (fini `philo-vN`).
- **`index.html` découpé** : 275 lignes de HTML ; le code dans `js/` (14
  morceaux) et `css/` (8), recollés en `app.js` et `app.css`, identiques à
  l'ancien code hors lignes vides (vérifié avec témoin). Le build vérifie la
  syntaxe et nomme le fichier et la ligne d'une faute.
- **Carte du projet** : refs « fichier:ligne » tenues par le build ; le
  contrôle exige une DÉFINITION (une fonction seulement citée en commentaire
  ne passe plus pour présente).
- **Une adresse par page** (`#/notion/…`, `#/auteur/…`, `#/concept/…`) :
  liens partageables, bouton « précédent », titre d'onglet, « Partager »
  donne la page ouverte.
- **Recherche plein texte** : citations, œuvres, sujets, textes, exemples,
  définitions ; un résultat ouvre le bon onglet et fait briller l'élément.
- **Documentation** : `CLAUDE.md` réduit aux règles (150 lignes au lieu de
  770), le détail dans `docs/architecture.md`.

**Pas fait** (à garder pour plus tard, selon le besoin) : des pages statiques
par notion pour le référencement (les moteurs ignorent la partie après #),
et le découpage de `data.js` en « index + détail chargé à la demande » (pas
nécessaire tant qu'il fait moins d'un mégaoctet : 695 Ko aujourd'hui).

## Sources

- Programme de philosophie de terminale, [BO spécial n° 8 du 25 juillet 2019](https://www.education.gouv.fr/bo/19/Special8/MENE1921238A.htm) ([annexe en PDF](https://cache.media.education.gouv.fr/file/SPE8_MENJ_25_7_2019/16/1/spe238_annexe2_1159161.pdf)) : notions, repères, liste des auteurs et son usage.
- Ancien programme : [BO n° 25 du 19 juin 2003](https://www.education.gouv.fr/bo/2003/25/MENE0301199A.htm).
- Recueil des sujets du bac : [académie de Montpellier, 1996-2022](https://pedagogie.ac-montpellier.fr/sites/default/files/ressources/Sujets-Bac-Philo_Dissertation_1996-2022.pdf), [version 1996-2024](https://lyceeu.net/philo/docs/sujets.pdf).
- FSRS : [FAQ d'Anki sur ses algorithmes](https://faqs.ankiweb.net/what-spaced-repetition-algorithm), [historique de FSRS](https://www.lesswrong.com/posts/G7fpGCi8r7nCKXsQk/the-history-of-fsrs-for-anki).
- Cartes d'arguments et esprit critique (piste pour les plans de dissertation) : [van Gelder, *Using argument mapping to improve critical thinking skills*](https://thinkeranalytix.org/wp-content/uploads/2018/09/TvG-Using-argument-mapping-to-improve-critical-thinking-skills-2015.pdf), [méta-analyse 2026 sur les outils de visualisation d'arguments](https://link.springer.com/article/10.1007/s10758-026-09981-8).
- Fin du SDK `google-generativeai` : [dépôt archivé par Google](https://github.com/google-gemini/deprecated-generative-ai-python), [bibliothèques Gemini actuelles](https://ai.google.dev/gemini-api/docs/libraries).
