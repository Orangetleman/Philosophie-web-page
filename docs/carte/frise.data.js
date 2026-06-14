/* GÉNÉRÉ par frise.gen.mjs — ne pas éditer à la main.
   Relancer : node docs/carte/frise.gen.mjs */
window.FRISE = {
  "genere_le": "2026-06-14T20:47:14.953Z",
  "commits": [
    {
      "hash": "e528d6f31eb84cbfaefedbb1505f3b8e3cc53129",
      "short": "e528d6f",
      "auteur": "Orangentleman",
      "date": "2026-06-14T22:44:03+02:00",
      "sujet": "Merge pull request #5 from Orangetleman/claude/carte-maj-mode-fiche",
      "corps": "Carte : MAJ archi (mode fiche, sitemap…) + fix bulle hors-écran & flèches de liens",
      "tag": ""
    },
    {
      "hash": "4e2ed88142ef841cdcf6feb5d4867ca3b8b8f6f9",
      "short": "4e2ed88",
      "auteur": "Orangentleman",
      "date": "2026-06-14T22:43:52+02:00",
      "sujet": "Merge remote-tracking branch 'origin/main' into claude/carte-maj-mode-fiche",
      "corps": "# Conflicts:\n#\tdocs/carte/frise.data.js",
      "tag": ""
    },
    {
      "hash": "d73bca95aabd6c4287461a3860b09a55db8493e8",
      "short": "d73bca9",
      "auteur": "Orangentleman",
      "date": "2026-06-14T22:40:25+02:00",
      "sujet": "Carte : MAJ archi (mode fiche, recherche, sitemap) + fix bulle hors-écran + flèches",
      "corps": "carte.data.js (v1.1) — reflète les commits récents de main :\n- nouveaux nœuds : « Mode fiche » (applyFicheMode/toggleFicheMode, clé\n  philo-fiche), « Recherche & effacement » de la sidebar (clearSidebarSearch,\n  searchCtxClear, clearPaletteSearch, .sb-search-clear), « Référencement\n  (sitemap) ». Refs des Réglages rafraîchies. verifie.mjs : 0 périmé.\n\ncarte.html — deux corrections d'ergonomie :\n- BULLE d'info : clamp dur → elle reste TOUJOURS entièrement dans la fenêtre\n  (fini le fantôme invisible mais cliquable au déplacement) ; se ferme\n  proprement si son nœud disparaît (repli/filtre) ; échelle plafonnée à la\n  taille de la fenêtre. closeBubble() unifie la fermeture (✕ / Échap / fond).\n- FLÈCHES des liens : les arêtes de flux s'arrêtent au BORD du nœud cible\n  (la flèche n'est plus cachée dessous) + marqueurs agrandis (userSpaceOnUse).\n  Légende : échantillons fléchés + note « sens du flux ».\n\nCo-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>",
      "tag": "Carte"
    },
    {
      "hash": "41ef141c0d01836c12543826725dc659b3d8a7b3",
      "short": "41ef141",
      "auteur": "Orangentleman",
      "date": "2026-06-14T19:38:27+02:00",
      "sujet": "Create robot.txt",
      "corps": "",
      "tag": ""
    },
    {
      "hash": "4d655a27d521280d04b1d5892430a011169cd75a",
      "short": "4d655a2",
      "auteur": "Orangentleman",
      "date": "2026-06-14T18:39:32+02:00",
      "sujet": "Merge pull request #4 from Orangetleman/claude/goofy-shockley-605dab",
      "corps": "Carte interactive & frise du projet (outils de découverte technique)",
      "tag": ""
    },
    {
      "hash": "f2ba18cc357810f169a01ee259a9d8d31ad13dc4",
      "short": "f2ba18c",
      "auteur": "Orangentleman",
      "date": "2026-06-14T18:39:20+02:00",
      "sujet": "Merge remote-tracking branch 'origin/main' into claude/goofy-shockley-605dab",
      "corps": "# Conflicts:\n#\tindex.html",
      "tag": ""
    },
    {
      "hash": "d3c6e31a1e74ebc2637d5074a40dcd0d82fdd426",
      "short": "d3c6e31",
      "auteur": "Orangentleman",
      "date": "2026-06-14T18:23:01+02:00",
      "sujet": "Carte : pas de sélection de texte au déplacement + hook pre-commit (frise)",
      "corps": "- carte.html : user-select:none sur le graphe et les nœuds → le glisser ne\n  sélectionne plus le texte (la bulle .detail reste sélectionnable).\n- .githooks/pre-commit : régénère et stage docs/carte/frise.data.js à chaque\n  commit (non bloquant). Activé via core.hooksPath=.githooks ; documenté dans\n  docs/carte/MAJ.md.\n\nCo-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>",
      "tag": "Carte"
    },
    {
      "hash": "1ceb50ddb6b655197468c9764d66e71ce482487a",
      "short": "1ceb50d",
      "auteur": "Orangentleman",
      "date": "2026-06-14T18:15:34+02:00",
      "sujet": "Carte/frise : bulle ancrée+zoom, radial anti-chevauchement, focus, frise commits",
      "corps": "- Bulle d'info ANCRÉE au nœud (graphe/radial) : suit le pan/zoom (syncBubble\n  appelée par applyVB) et grossit avec le zoom (échelle ∝ vb). Vue arbre garde\n  l'ancrage à la ligne.\n- Radial : rayons agrandis selon la densité (radScale ∝ feuilles) + nœuds\n  compacts → bien moins de chevauchement, liaisons plus lisibles. Hub central\n  dessiné APRÈS les traits (au-dessus).\n- Surbrillance de sélection = changement de fond + bordure (plus d'anneau\n  ajouté), dans les 3 vues.\n- Nouvelle fenêtre « Frise des commits » : frise.html (timeline autonome) +\n  frise.data.js (généré) + frise.gen.mjs (régénérateur depuis git log).\n- index.html : Réglages → « Découvrir l'envers du projet » (Carte + Frise).\n\nCo-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>",
      "tag": "Carte/frise"
    },
    {
      "hash": "4e4cde40824913c3bbd22d7244567fd580c68551",
      "short": "4e4cde4",
      "auteur": "Orangentleman",
      "date": "2026-06-14T17:33:55+02:00",
      "sujet": "Carte projet : accès depuis Réglages + vue radiale + bulle d'info + surbrillance",
      "corps": "- index.html : lien discret « Carte du projet » dans l'overlay Réglages\n  (renderSettingsBody) ouvrant docs/carte/carte.html dans un nouvel onglet.\n- carte.html : 3e vue « Radial » (arbre circulaire — hub central, domaines en\n  couronnes, secteur angulaire ∝ feuilles visibles), partage le SVG avec Graphe\n  via buildNode/buildFlux factorisés.\n- Le détail passe d'un panneau latéral à une BULLE flottante ancrée près du\n  nœud (taille limitée, défilable à l'intérieur ; positionBubble repli dans la\n  fenêtre, centrée pour les ouvertures programmatiques).\n- Surbrillance (.focus) de l'élément sélectionné dans les 3 vues.\n\nCo-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>",
      "tag": "Carte projet"
    },
    {
      "hash": "e39c769e0d72e502a3e2a36055c4bc83a2fb3a4e",
      "short": "e39c769",
      "auteur": "Orangentleman",
      "date": "2026-06-14T16:09:00+02:00",
      "sujet": "Carte projet (P6) : verifie.mjs (anti-drift) + MAJ.md + pointeur CLAUDE.md",
      "corps": "verifie.mjs (Node pur, sans dépendance) charge window.CARTE et vérifie que\nchaque symbole (name@fichier:ligne) existe encore : 0 périmé sur l'état\nactuel (232 OK, 8 lignes déplacées non bloquantes). MAJ.md = checklist\n« quand je change X → quel nœud mettre à jour » + convention de PR. CLAUDE.md\ngagne une section « Carte du projet » pointant vers docs/carte/.\n\nCo-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>",
      "tag": "Carte projet (P6)"
    },
    {
      "hash": "df61b52b99b0f5113666346fed4b39f13fc0c601",
      "short": "df61b52",
      "auteur": "Orangentleman",
      "date": "2026-06-14T16:09:00+02:00",
      "sujet": "Carte projet (P3/P4) : carte.html — renderer graphe autonome",
      "corps": "Graphe nœud-lien SVG (dorsale arbre + arêtes transverses de flux), pan/zoom\nsouris+tactile, repli/dépli au clic, panneau détail (Découverte+Technique)\nau double-clic, recherche plein-texte qui centre la cible, filtres par\ndomaine et par type de lien, fil d'Ariane, légende, bascule\nDécouverte/Technique, et repli en arbre indenté sur écran étroit. Zéro\ndépendance, hors-ligne. Lit window.CARTE, aucune donnée en dur.\n\nCo-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>",
      "tag": "Carte projet (P3/P4)"
    },
    {
      "hash": "45cb075c594c631846f408d68b2ceb359270573b",
      "short": "45cb075",
      "auteur": "Orangentleman",
      "date": "2026-06-14T13:57:52+02:00",
      "sujet": "Barres de recherche : croix d'effacement + clic droit pour vider",
      "corps": "- Croix ✕ dans les 3 barres sidebar (auteurs/concepts/repères) et la palette\n  Ctrl+K, visible seulement quand le champ contient du texte\n- Clic droit sur un champ de recherche : bloque le menu natif et vide le champ\n- Helpers sbSearchInput / clearSidebarSearch / searchCtxClear (sidebar) et\n  paletteSyncClear / clearPaletteSearch (palette)\n\nCo-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>",
      "tag": "Barres de recherche"
    },
    {
      "hash": "c581b1d60565ba39b91f96950d9701d871b408f3",
      "short": "c581b1d",
      "auteur": "Orangentleman",
      "date": "2026-06-14T13:46:25+02:00",
      "sujet": "Intègre 4 propositions : Hannah Arendt (liberté), concepts Existentialisme + Solipsisme",
      "corps": "- BOX 42 : Hannah Arendt → liberté (idée nettoyée, œuvre « La Liberté d'être libre »)\n  + sujet de dissertation « La liberté consiste-t-elle à n'obéir à personne ? »\n- BOX 45 : concept Existentialisme (conscience/liberté/vérité, relation → absurde)\n- BOX 43+44 : concept Solipsisme (conscience, distinction → intersubjectivité)\n\nCo-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>",
      "tag": "Intègre 4 propositions"
    },
    {
      "hash": "f12b929d17218e76c93a85fe42ec463c646b9c59",
      "short": "f12b929",
      "auteur": "Orangentleman",
      "date": "2026-06-14T12:51:17+02:00",
      "sujet": "Tuto : mode fiche dans le noyau, partie Navigation plus concise, focus sur le bouton ?",
      "corps": "- « Réglages & aide » (noyau) présenté sous forme de liste : Mode fiche + Mode édition\n- Partie « Naviguer » resserrée (textes raccourcis, recap redondant retiré)\n- Nouveau focus dédié sur le bouton ? (rouvrir la visite), en fin de parcours\n- CSS .tour-list pour les listes à puces dans la bulle\n\nCo-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>",
      "tag": "Tuto"
    },
    {
      "hash": "1f7e45da75bf9e8a646c903f6bbd2088ede1af93",
      "short": "1f7e45d",
      "auteur": "Orangentleman",
      "date": "2026-06-14T12:37:30+02:00",
      "sujet": "Ajout du sitemap pour Google",
      "corps": "",
      "tag": ""
    },
    {
      "hash": "50cfffd274a0dbf84bba97dbcc0e9abed882d2c4",
      "short": "50cfffd",
      "auteur": "Orangentleman",
      "date": "2026-06-14T06:07:37+02:00",
      "sujet": "Mode fiche : synthèses manuelles pour justice, état, nature (31 auteurs)",
      "corps": "Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>",
      "tag": "Mode fiche"
    },
    {
      "hash": "e301074c4170b56291648e01bda31c4e467f641c",
      "short": "e301074",
      "auteur": "Orangentleman",
      "date": "2026-06-14T06:03:21+02:00",
      "sujet": "Mode fiche : synthèses manuelles (langage, travail, art, technique)",
      "corps": "42 synthèses 'fiche' rédigées à la main couvrant tous les auteurs de ces\n4 notions, dont les doublons par œuvre (travail : Nietzsche Aurore /\nHumain trop humain ; Arendt Condition / Crise de la culture) et le\nmulti-idées (langage : Cassin, 2 idées). sw.js : cache v49.\n\nCo-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>",
      "tag": "Mode fiche"
    },
    {
      "hash": "bb72b72cff726dc51daa2e038756e4f2f891b978",
      "short": "bb72b72",
      "auteur": "Orangentleman",
      "date": "2026-06-14T00:42:07+02:00",
      "sujet": "Mode fiche : synthèses manuelles pour 5 notions (bonheur, devoir, liberté, inconscient, religion)",
      "corps": "54 synthèses 'fiche' rédigées à la main (7+11+12+4+20), couvrant tous les\nauteurs de ces notions — y compris les cas multi-idées (Freud/inconscient :\nfiche par idée), doublons (Sartre/liberté : 2 œuvres) et formats multi-idées\n(propagation entrée→idées dans normalizeAuthor).\n\n- data.js : champ fiche:\"...\" ajouté à chaque idée d'auteur des 5 notions.\n- index.html : normalizeAuthor propage une fiche d'entrée aux idées (format\n  multi-idées) — sinon perdue.\n- sw.js : cache v48.\n\nCo-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>",
      "tag": "Mode fiche"
    },
    {
      "hash": "f13fa173759672fb87d7ea8b13ef4336d6260e70",
      "short": "f13fa17",
      "auteur": "Orangentleman",
      "date": "2026-06-13T23:31:39+02:00",
      "sujet": "Notions : réordonnancement + fiches manuelles (conscience)",
      "corps": "- Ordre des notions revu (KEYS explicite, sans déplacer les blocs de D) :\n  conscience, inconscient, devoir, liberté, bonheur, religion, langage, art,\n  technique, travail, justice, état, nature, raison, science, vérité, temps.\n- normalizeAuthor conserve désormais le champ 'fiche' (synthèse rédigée).\n- conscience : synthèse 'fiche' rédigée à la main pour les 12 auteurs\n  (mode fiche → thèse en une phrase au lieu de l'auto-extraction).\n- sw.js : cache v47.\n\nCo-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>",
      "tag": "Notions"
    },
    {
      "hash": "430d6540f4b587891684ce3e8df9e5d56b36664a",
      "short": "430d654",
      "auteur": "Orangentleman",
      "date": "2026-06-13T18:38:58+02:00",
      "sujet": "Mode fiche : vraie synthèse du contenu (thèse en 1 phrase), pas du CSS",
      "corps": "Refonte du « mode fiche » : au lieu de masquer/tronquer visuellement le texte,\non affiche une SYNTHÈSE réellement condensée de chaque idée d'auteur.\n\n- ideaSynthese(it) : renvoie it.fiche (synthèse rédigée à la main, prioritaire)\n  ou, à défaut, la THÈSE = 1re phrase de l'idée (extraite hors balises, garde\n  anti-abréviation, rééquilibrage des balises <strong>/<em>/<span>).\n- Rendu : chaque .a-idea porte .ai (complet) + .ai-fiche (synthèse) ; le CSS\n  body.mode-fiche masque .ai et montre .ai-fiche (et masque les citations).\n- Champ optionnel it.fiche pour affiner une synthèse à la main, sans toucher\n  l'infra (remplissable au fil de l'eau).\n- sw.js : cache v46.\n\nVérifié : synthèses ~3-4× plus courtes, balises équilibrées, bascule OK.\n\nCo-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>",
      "tag": "Mode fiche"
    },
    {
      "hash": "f6cd97b78d808f6e4c832d82a61ca82ab7e68a19",
      "short": "f6cd97b",
      "auteur": "Orangentleman",
      "date": "2026-06-13T18:25:58+02:00",
      "sujet": "Réglages : « mode fiche » (lecture compressée des boîtes d'auteur)",
      "corps": "Nouveau toggle dans ⚙ Réglages (à côté de révision/édition) : le « mode\nfiche » compresse chaque carte d'auteur des notions pour une lecture rapide.\n\n- CSS body.mode-fiche : .ac/.a-idea resserrés, .ai borné à 2 lignes (clamp)\n  + police réduite, citations (.aq/.aq-details) masquées. Le contenu complet\n  reste accessible sur la fiche de l'auteur.\n- JS : applyFicheMode()/toggleFicheMode() (localStorage 'philo-fiche'),\n  appliqué à chaque renderSB ; ligne dédiée dans renderSettingsBody.\n- sw.js : cache v45.\n\nCo-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>",
      "tag": "Réglages"
    },
    {
      "hash": "8661a12cbf3a22f61c303127a3756412518ceeec",
      "short": "8661a12",
      "auteur": "Orangentleman",
      "date": "2026-06-13T13:33:53+02:00",
      "sujet": "Site : retirer les mentions « cours/classe » (accessible à tous les élèves)",
      "corps": "Le site ne suppose plus d'avoir suivi LE cours d'une prof précise.\n- index.html : onglet « Textes du cours » → « Textes » ; slabels « étudiés\n  en cours »/« citées dans le cours » → neutres ; champ de contribution\n  « Texte du cours » → « Texte / extrait » ; onboarding (titre, texte\n  « en classe », cible) ; nettoyage de la table de couleurs des tags.\n- data.js : tags d'exemples « X — Cours » → « X », titres « Cours — … » /\n  « Polycopié — … » → sans préfixe, « Polycopié » comme source retiré des\n  références, marqueurs « (Séance N) » / « PDF du cours » / « polycopié de\n  Séance 13 » supprimés.\n- PRÉSERVÉ : les vrais TITRES d'œuvres « Cours de linguistique générale »\n  (Saussure) et « Cours de philosophie positive » (Comte), et le vocabulaire\n  philosophique « classe(s) » (classe dominante/ouvrière, habitus de classe).\n- sw.js : cache v44.\n\nCo-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>",
      "tag": "Site"
    },
    {
      "hash": "ce2ccfbab5e4a64481e44fd737a14e441c756c80",
      "short": "ce2ccfb",
      "auteur": "Orangentleman",
      "date": "2026-06-13T13:25:52+02:00",
      "sujet": "Dashboard : filtre Statut (+ Intégrées) & Verdict en chips, liste à plat",
      "corps": "- _filter_links : deux groupes de chips (Statut / Verdict IA) ; ajout du\n  statut « Intégrées » qui manquait + « Tous » en tête ; chip actif surligné.\n- _page : affichage à PLAT (une liste de cartes triées des plus récentes aux\n  plus anciennes) au lieu des sections par catégorie + sous-groupes, peu\n  lisibles. Chaque carte se décrit déjà (statut, verdict, type/cible, notion).\n- CSS .filt-row/.chip ; import view allégé (bucket_of/sub_key_of/SECTION_ORDER\n  n'étaient plus utilisés ici).\n\nCo-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>",
      "tag": "Dashboard"
    },
    {
      "hash": "60d3f544f74eb4b87fd4465227a09760c7bbb877",
      "short": "60d3f54",
      "auteur": "Orangentleman",
      "date": "2026-06-13T01:40:55+02:00",
      "sujet": "Carte projet (P2) : carte.data.js — source de vérité (nœuds L0→L3 + flux)",
      "corps": "window.CARTE : 10 domaines, 6 types de lien, ~110 nœuds (du parcours élève\naux variables/fonctions) et 14 arêtes transverses (le « grand circuit »\ncontribution → Supabase/mailbox → agrégateur → Gemini → dashboard →\nintégration). Toutes les `ref` fichier:ligne sont grep-confirmées.\n\nCo-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>",
      "tag": "Carte projet (P2)"
    },
    {
      "hash": "2d83646b5ea6de98d23c063b2fcbcc54fc7a6474",
      "short": "2d83646",
      "auteur": "Orangentleman",
      "date": "2026-06-13T00:53:34+02:00",
      "sujet": "Auteurs : alias prose pour James/Breton/Tzara/Perec (formes courtes)",
      "corps": "Ajout des formes courtes (nom de famille) à AUTHOR_ALIASES : leurs\nmentions en prose deviennent cliquables vers la fiche complète\n(William James, André Breton, Tristan Tzara, Georges Perec), via\nl'injection déjà en place dans LINK_MAP. sw.js : cache v43.\n\nCo-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>",
      "tag": "Auteurs"
    },
    {
      "hash": "348f7574ed7446f5329e6cd529cab8261a6ee9a0",
      "short": "348f757",
      "auteur": "Orangentleman",
      "date": "2026-06-13T00:48:44+02:00",
      "sujet": "Auteurs : fusionner les doublons de noms (1 nom canonique par auteur)",
      "corps": "5 auteurs étaient scindés sous deux noms dans D (notions/idées éparpillées,\nrang « popularité » faussé, deux fiches). Fusion vers le canonique :\n  Arendt → Hannah Arendt (7 notions)\n  Henry David Thoreau → Thoreau (2)\n  Étienne de La Boétie → La Boétie (2)\n  J.-S. Mill → Mill (2)\n  Jonas → Hans Jonas (4)\n\n- data.js : renommage des entrées D[k].auteurs[].n, de la clé AM « Jonas »\n  → « Hans Jonas », et des dialogues (auteur:\"Jonas\"/\"Arendt\") vers le canonique.\n- index.html : table AUTHOR_ALIASES (alias→canonique) injectée dans LINK_MAP\n  après les clés AI → les mentions EN PROSE des anciennes formes restent\n  cliquables (sinon texte mort) ; openAuthor résout l'alias par sécurité.\n- sw.js : cache v42 ; CLAUDE.md documenté.\n\nVérifié : anciens noms absents de AI (88→83 auteurs), bios AM OK, idées\ncorrectement rattachées (audit 17 notions), prose-alias liée au bon auteur.\n\nCo-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>",
      "tag": "Auteurs"
    },
    {
      "hash": "fba691b493d59d2a0ff5e6a69e22b3a38029720d",
      "short": "fba691b",
      "auteur": "Orangentleman",
      "date": "2026-06-12T18:53:06+02:00",
      "sujet": "Cartes auteur : supprimer les grands vides (multi-idées = span 2, pas 1/-1)",
      "corps": "Les cartes multi-idées prenaient toute la rangée (grid-column:1/-1) :\nen s'intercalant, elles cassaient le flux de la grille et laissaient les\ncolonnes restantes vides (grands trous visibles).\n\n- .ac-multi : grid-column passe de 1/-1 à span 2 → la carte s'élargit juste\n  assez pour ses 2 zones d'idées côte à côte, sans casser la rangée.\n- .a-idea : flex-basis 220→200px pour que 2 zones tiennent dans 2 colonnes.\n- ≤700px : .ac-multi revient à grid-column:auto (1 colonne).\n- sw.js : cache v41 ; CLAUDE.md mis à jour.\n\nVérifié (écran large simulé) : les rangées se remplissent (vide à droite = 0),\nplus de grands trous ; idées toujours correctement rattachées aux auteurs\n(audit des 17 notions : aucune anomalie).\n\nCo-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>",
      "tag": "Cartes auteur"
    },
    {
      "hash": "1b0f65f02df2b3ebabda6e64451bd8baa18e235d",
      "short": "1b0f65f",
      "auteur": "Orangentleman",
      "date": "2026-06-12T13:02:45+02:00",
      "sujet": "Notion : trier les cartes auteur par « popularité » (transversalité + bac)",
      "corps": "Dans l'onglet Auteurs d'une notion, les cartes étaient dans l'ordre de la\nsource. Elles sont désormais triées (compareAuthors) :\n  1. nb de notions couvertes (authorPopularity) — auteur transversal devant ;\n  2. score « importance bac » (authorBacScore) = mesure AUTO du corpus\n     (idées×2 + dialogues×2 + citations) + coup de pouce manuel BAC_BONUS\n     (barème 4 paliers 12/9/6/3, incontournables, modifiable) ;\n  3. alphabétique.\n\nEx. vérité : Nietzsche > Kant > Platon > Descartes > Aristote > Pascal…\nLe critère 1 prime ; le bonus ne départage qu'à nombre de notions égal.\nsw.js : cache v40 ; CLAUDE.md documenté.\n\nCo-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>",
      "tag": "Notion"
    },
    {
      "hash": "ca1ad6e68e157143d58ba3f127472e216a61162b",
      "short": "ca1ad6e",
      "auteur": "Orangentleman",
      "date": "2026-06-12T05:04:35+02:00",
      "sujet": "Create google12652c48153ce64f.html",
      "corps": "",
      "tag": ""
    },
    {
      "hash": "1f3832001da4b9824c8a3ac857104ddc5f848992",
      "short": "1f38320",
      "auteur": "Orangentleman",
      "date": "2026-06-12T04:56:49+02:00",
      "sujet": "Carte auteur (notion) : idées côte à côte, chacune sa zone couleur/badge",
      "corps": "La fusion des idées d'un auteur dans une seule carte est voulue ; on\nrevoit seulement la disposition INTERNE.\n\n- renderContent regroupe explicitement les entrées d'un même auteur en\n  UNE carte (ordre de 1re apparition), au lieu de compter sur l'ancienne\n  mutation de D par buildAI (qui dupliquait l'idée).\n- Chaque idée devient une ZONE autonome (.a-idea dans .a-ideas), disposée\n  HORIZONTALEMENT (flex-wrap) au lieu d'être empilée verticalement.\n- La couleur (is-new / is-modified) et les badges sont désormais PAR\n  ZONE d'idée, plus au niveau de la carte : dans une carte fusionnée, une\n  idée peut être neuve (dorée) et une autre modifiée (bleue) côte à côte.\n- Une carte à plusieurs idées prend toute la rangée (.ac-multi) pour que\n  les zones tiennent côte à côte ; à une seule idée elle reste compacte.\n- sw.js : cache v39 ; CLAUDE.md mis à jour.\n\nCo-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>",
      "tag": "Carte auteur (notion)"
    },
    {
      "hash": "6967e530ff191a5d92e5be6908475d443706fe18",
      "short": "6967e53",
      "auteur": "Orangentleman",
      "date": "2026-06-12T04:46:34+02:00",
      "sujet": "Fix : buildAI mutait D (cartes auteur dupliquées + bleu fantôme)",
      "corps": "Quand un auteur apparaît deux fois dans une même notion (ex. William\nJames sur « vérité » : une idée existante + une idée new:true), buildAI\nstockait une RÉFÉRENCE à l'objet de D puis y poussait les idées du\ndoublon — mutant ainsi D[k].auteurs[]. Conséquences dans l'onglet\nAuteurs de la notion : l'idée était dupliquée (affichée deux fois) et la\n1re carte, mélangeant une idée ancienne et une idée neuve, recevait la\nclasse « is-modified » (fond BLEU) SANS badge « Modifié » — d'où le\n« badge modifié qui ne s'affiche pas » signalé.\n\n- buildAI : on stocke une COPIE { n, ideas: a.ideas.slice() } au lieu de\n  l'objet de D → la fusion des doublons ne touche plus D (l'index AI\n  reste correctement fusionné pour la fiche auteur).\n- renderContent (onglet Auteurs) : teinte « is-modified » seulement si une\n  idée est RÉELLEMENT modifiée (anyMod), sinon « is-new » si une idée est\n  neuve, sinon neutre — fini la carte bleue sans badge sur un mélange\n  neuve/ancienne.\n- sw.js : cache v38.\n\nCo-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>",
      "tag": "Fix"
    },
    {
      "hash": "a30dae54a18451ccfc16bb4f1aab0c0571c2b515",
      "short": "a30dae5",
      "auteur": "Orangentleman",
      "date": "2026-06-12T04:38:43+02:00",
      "sujet": "Badges « Nouveau / Modifié » visibles aussi en mode révision",
      "corps": "Les badges ✦ Nouveau / ✎ Modifié étaient cachés en mode révision (défaut),\nau même titre que les outils de contribution. Du coup le contenu corrigé\n(ex. fiche Nozick) n'affichait que sa teinte bleue, sans étiquette.\n\n- CSS : on ne cache plus .new-badge / .modified-badge en révision ; seuls\n  les OUTILS d'édition (.pplus, .pplus-catwrap, .sb-propose) restent cachés.\n- Les badges sont informatifs (signaler le récent/corrigé à l'élève), pas\n  des outils d'édition → leur place est aussi en révision.\n- sw.js : cache v37 ; CLAUDE.md mis à jour.\n\nCo-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>",
      "tag": ""
    },
    {
      "hash": "3c9bf5e54ec9f90732618b880bd8c861cce69897",
      "short": "3c9bf5e",
      "auteur": "Orangentleman",
      "date": "2026-06-11T22:00:26+02:00",
      "sujet": "Surbrillance d'arrivée : fiche auteur → carte de l'auteur dans la notion",
      "corps": "Cliquer une pastille de notion depuis une fiche auteur (onglets Idées /\nCitations / Œuvres) ouvrait la notion mais ne défilait pas vers l'endroit\noù l'auteur intervient. On ajoute la surbrillance d'arrivée, symétrique de\ncelle des concepts.\n\n- nouvel état pendingAuthorMention + openNotionFromAuthor(key, authorName)\n  (remplace l'ancien onclick inline des trois pastilles de notion) ;\n- focusAfterRender() : branche « 1bis » qui bascule sur l'onglet Auteurs\n  et fait briller la carte .ac de l'auteur, repérée par le TEXTE du lien\n  .an-link (robuste aux apostrophes) ;\n- sw.js : cache v36 ; CLAUDE.md documenté.\n\nCo-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>",
      "tag": "Surbrillance d'arrivée"
    },
    {
      "hash": "e460ee77d6a34ed59f4b37b5773ce6a950af02e9",
      "short": "e460ee7",
      "auteur": "Orangentleman",
      "date": "2026-06-11T19:09:49+02:00",
      "sujet": "Contenu : intégrer Rousseau (bonheur) + Amartya Sen (justice)",
      "corps": "Intégration de deux propositions relues (contributrice : coline).\n\n- bonheur : nouvel auteur Rousseau (La Nouvelle Héloïse, 1761) — le\n  bonheur tient à l'anticipation du désir plus qu'à la possession\n  (volonté/entendement/imagination). Citation corrigée\n  (« on n'est heureux qu'avant d'être heureux »). new:true.\n- justice : nouvel auteur Amartya Sen (L'idée de justice, 2009) —\n  justice comparative, exemple des trois enfants et de la flûte\n  (Anne/Bob/Carla, trois conceptions). new:true + bio dans AM.\n- justice : entrée Nozick corrigée — l'exemple de la flûte est\n  emprunté à Sen, vrais noms Anne/Bob/Carla (au lieu de\n  Pierre/Paul/Jacqueline). modified:true.\n- sw.js : cache v35.\n\nCo-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>",
      "tag": "Contenu"
    },
    {
      "hash": "441dd9cbdba12bc566b13f2da4ab837df3e46be6",
      "short": "441dd9c",
      "auteur": "Orangentleman",
      "date": "2026-06-11T18:56:59+02:00",
      "sujet": "Relecture IA : arrêt immédiat sur quota JOURNALIER (au lieu de mouliner)",
      "corps": "Le palier gratuit de gemini-3.5-flash est limité à 20 requêtes/JOUR.\nUne fois épuisé, Google renvoie un 429 « PerDay » avec un « retry in\n~58s » trompeur : attendre ne sert à rien (reset dans plusieurs heures).\nLe réessai-avec-pause tournait donc 60s × 3 par boîte pour rien\n(~6 min au total) avant un « 0 relue(s), N en échec » peu parlant.\n\n- review._is_daily_quota() distingue le quota « par jour » du « par\n  minute » (normalise et cherche « perday »).\n- review_box renvoie ABORT_VERDICT sur quota journalier → review.run\n  arrête TOUT le lot immédiatement (les boîtes suivantes échoueraient\n  pareil) et remonte le motif via le champ « aborted ».\n- Le quota « par minute » garde le réessai-avec-pause (cas légitime).\n- Le dashboard affiche « ⛔ Relecture arrêtée : quota JOURNALIER épuisé…\n  (réessaie demain, ou change GEMINI_MODEL / GEMINI_API_KEY) ».\n\nCo-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>",
      "tag": "Relecture IA"
    },
    {
      "hash": "377745e74ab834b08e4dc10dac919a1826525a17",
      "short": "377745e",
      "auteur": "Orangentleman",
      "date": "2026-06-11T18:51:32+02:00",
      "sujet": "Dashboard : compte à rebours pendant l'attente quota (429)",
      "corps": "Pendant une pause anti-quota, la barre affichait juste « en attente\n(quota) » sans dire combien de temps. On montre désormais le temps\nrestant, qui défile (« ⏳ quota atteint, reprise dans 1 min 05 s »).\n\n- review_box(on_wait=…) signale l'heure de reprise (epoch) au début de\n  la pause, puis 0 à la reprise ; review.run relaie via _emit\n  (champ waiting_until) jusqu'à _review_state.\n- /review-progress expose waiting_until ; le script de la page décompte\n  localement (horloge navigateur = horloge serveur, même machine) et\n  rafraîchit toutes les 0,5 s, indépendamment du sondage (1,2 s).\n\nCo-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>",
      "tag": "Dashboard"
    },
    {
      "hash": "16f4e63f394a6cfc0569b5656a73934ca867f7d9",
      "short": "16f4e63",
      "auteur": "Orangentleman",
      "date": "2026-06-11T18:36:36+02:00",
      "sujet": "Dashboard : barre de progression de la relecture IA (thread + polling)",
      "corps": "Avant, « Relire (IA) » bloquait la requête le temps des appels Gemini\n(longs, avec pauses anti-quota) : l'onglet « chargeait » sans retour.\n\n- La relecture tourne désormais dans un THREAD de fond\n  (_run_review_thread) ; /review redirige aussitôt avec ?reviewing=1.\n- review.run(on_progress=…) émet l'avancement après chaque boîte ;\n  le thread le reflète dans _review_state (verrou).\n- Nouvelle route /review-progress (JSON) ; la page interroge en boucle\n  et affiche une barre (done/total + ✓/?/✗ + « en attente quota »),\n  puis recharge pour montrer les verdicts (garde anti-boucle sawRunning).\n- Clic à vide → message immédiat « aucune boîte à relire » (pas de thread).\n- Robustesse : _say() rend les print() de review.py insensibles à\n  l'encodage console (cp1252 ne peut pas afficher ✓ ✗ ⏳) — sinon le\n  thread plantait et avortait tout le lot. Constaté en test.\n\nCo-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>",
      "tag": "Dashboard"
    },
    {
      "hash": "c3f00c7170ab630563aab9244c79fef4193e39ad",
      "short": "c3f00c7",
      "auteur": "Orangentleman",
      "date": "2026-06-11T18:28:36+02:00",
      "sujet": "Agrégateur : relire aussi les boîtes « validée » + réessai sur 429",
      "corps": "Deux correctifs sur le cerveau local (relecture IA Gemini) :\n\n1. Le bouton « Relire » du dashboard ne ciblait que les boîtes\n   « en_attente ». Or une boîte peut arriver déjà « validée »\n   (restaurée depuis Supabase lors d'une sync cross-plateforme) sans\n   transiter par « en attente » : elle restait « non relue » à vie.\n   - db.REVIEWABLE_STATUSES = (en_attente, validee) ;\n   - get_unreviewed_boxes(status=None) couvre ces deux statuts (IN),\n     en continuant d'exclure site-*, integree, rejetee, archivee ;\n   - review.run(status=None) géré ; dashboard appelle status=None.\n\n2. Sur un 429 (quota « par minute » du palier gratuit Gemini),\n   review_box PATIENTE le délai indiqué par Google (≤ 65 s) puis\n   re-tente (jusqu'à 3 fois) au lieu d'abandonner le lot.\n\nCo-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>",
      "tag": "Agrégateur"
    },
    {
      "hash": "e99839d3a82c81af5f47e06a68be4350629c98f7",
      "short": "e99839d",
      "auteur": "Orangentleman",
      "date": "2026-06-10T22:01:30+02:00",
      "sujet": "Tuto : recommencer relance aussi le noyau (cohérence)",
      "corps": "Le bouton ? « Refaire toute la visite » repartait en mode 'full'\n(42 étapes d'affilée), alors que la 1re visite joue le noyau puis\npropose le détail. On perdait donc l'intérêt du noyau en rejouant.\n\n- Bouton renommé « ↻ Recommencer la visite » et relancé en 'core'\n  (même expérience qu'à la 1re venue ; le détail reste accessible\n  via l'écran de décision).\n- Le mode 'full' ne sert plus qu'aux sauts ciblés (tourGoPart).\n- sw.js cache v34 ; CLAUDE.md mis à jour.\n\nCo-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>",
      "tag": "Tuto"
    },
    {
      "hash": "962b9154da28cdd1143234f478bf04b6b9693c46",
      "short": "962b915",
      "auteur": "Orangentleman",
      "date": "2026-06-10T21:54:34+02:00",
      "sujet": "Tuto : visite « noyau + détail optionnel »",
      "corps": "Le 1er passage de l'onboarding ne joue que le NOYAU (14 étapes :\nnavigation + 5 portes d'entrée + ouverture du quiz), puis propose\nla visite détaillée via un écran de décision. Le reste (onglets de\nfiche, partage, options du quiz, contribution, compte) est renvoyé\nà cette suite optionnelle.\n\n- markTourCore() marque step.core (welcome/liens/nav, fiches côté\n  sidebar, 1re étape reviser) ; tourState.mode (core|detail|full)\n  + tourState.decision ; tourSeq() filtre les étapes actives.\n- Toute la navigation (next/prev/skipPart/jumpPart + pastilles\n  tourProgressHTML) opère sur la séquence active.\n- Fin de noyau -> tourShowDecision()/tourDecisionHTML() ->\n  tourContinueDetailed() (mode detail) ou endTour().\n- Le noyau mentionne déjà le bouton ? (relance) et le menu Réglages.\n- 1re venue : startTour core ; bouton ? « Refaire » : full.\n- CSS .tour-ctrl-decision ; sw.js cache v33 ; CLAUDE.md documenté.\n\nCo-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>",
      "tag": "Tuto"
    },
    {
      "hash": "096e26221b40c4486ded11dfd937d37d1ac0c5e7",
      "short": "096e262",
      "auteur": "Orangentleman",
      "date": "2026-06-10T16:20:01+02:00",
      "sujet": "Sidebar : menu « ⚙ Réglages » + bouton de mode clarifié",
      "corps": "L'ancien bouton « Mode révision » (peu lisible — on ne savait pas si\nc'était un bouton ou un état) est remplacé par un bouton « ⚙ Réglages »\n(.sb-settings) qui ouvre un menu (#settings-overlay) regroupant les\nfonctions non nécessaires à la révision.\n\nLe toggle de mode y est rendu EXPLICITE (retour utilisateur) : le bouton\nnomme le MODE-CIBLE (« ✎ Passer en mode édition » / « 👁 Revenir au mode\nrévision ») et le MODE ACTUEL est rappelé juste au-dessus. applyPhiloMode\nrafraîchit le menu s'il est ouvert. Étape de tuto « proposer » mise à jour\npour pointer Réglages. (Connexion/inscription gardés séparés, au choix de\nl'utilisateur.)\n\nVérifié : Réglages s'ouvre, libellé inversé correct, bascule → body\nmode-edition + « Proposer » révélé. MAJ CLAUDE.md.\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>",
      "tag": "Sidebar"
    },
    {
      "hash": "30b118daadebe58583531e01bd3fca3f89be1df6",
      "short": "30b118d",
      "auteur": "Orangentleman",
      "date": "2026-06-10T11:21:57+02:00",
      "sujet": "Mobile : agrandir les cibles tactiles (onglets, fil d'Ariane, Retour)",
      "corps": "Mesurés trop petits au doigt (< 44 px) : onglets 31 px, fil d'Ariane 20 px,\nbouton Retour 30 px. Padding/min-height augmentés dans le bloc @media\nmobile → 39 / 27 / 38 px. Aucun impact desktop.\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>",
      "tag": "Mobile"
    },
    {
      "hash": "d5fc8071cb30398bace5f2cb3dcf4d1be1ed8f28",
      "short": "d5fc807",
      "auteur": "Orangentleman",
      "date": "2026-06-10T11:20:21+02:00",
      "sujet": "Proposition : valider les champs obligatoires avant envoi (+ libellé QCM)",
      "corps": "Bug signalé : on pouvait envoyer une proposition avec des champs\nobligatoires vides, sans aucun avertissement.\n\n- proposalMissing() reconstruit la liste des champs requis manquants en\n  miroir des règles de renderBoxFields (catégorie × cible × type : notion,\n  cibleref, remtexte, nom d'auteur + œuvre/idée par idée, champs d.r…).\n  proposalGuardOk() bloque submitProposalOnline() ET sendProposal() (mailto)\n  et affiche les manques dans #psend-status. Vérifié sur notion/accroche/\n  auteur/site.\n- Quiz : libellé du mode QCM reformulé (la session privilégie désormais les\n  cartes à choix), l'ancien texte étant devenu inexact.\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>",
      "tag": "Proposition"
    },
    {
      "hash": "999eb0dade7c31f14bc653cece8003d17a85f5d4",
      "short": "999eb0d",
      "auteur": "Orangentleman",
      "date": "2026-06-10T01:21:47+02:00",
      "sujet": "Quiz : le mode QCM affichait surtout des cartes à retourner (fix)",
      "corps": "En mode QCM, la session ne contenait quasi aucune question à choix : la\ndédup par paire de pickSession gardait la direction « concept → définition »\n(retournement) au lieu de « définition → concept » (éligible au QCM). Une\nsession fraîche sortait 15/15 cartes flip.\n\nCorrectif : en mode QCM, au sein d'une même paire, on PRÉFÈRE la variante\néligible (déf→concept, citation→auteur) en remplaçant l'entrée déjà retenue\n— même item, même priorité de révision, on échange juste le sens. Le mode\nCartes est inchangé.\n\nVérifié : mode QCM → session 15/15 éligibles, 4 choix de la même famille,\nréponse + feedback + passage à la carte suivante OK ; mode Cartes inchangé.\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>",
      "tag": "Quiz"
    },
    {
      "hash": "854a76c32de3fcb6c35fa0e303aeb1defa2de165",
      "short": "854a76c",
      "auteur": "Orangentleman",
      "date": "2026-06-08T12:09:20+02:00",
      "sujet": "Adoption d'une page distante : « Retour » revient à la page locale",
      "corps": "Quand un appareil récupère la page (plus récente) d'un AUTRE appareil, son\nbouton « ← Retour » pointait vers son ancien historique local — la page\nqu'il affichait juste avant l'adoption « disparaissait » du fil.\n\napplyPrefsBlob empile désormais la position locale courante dans navHistory\nAVANT d'appliquer la position distante (sans toucher navTouched : l'appareil\nreste un spectateur passif qui continue d'adopter les MAJ suivantes). Ainsi\n« Retour » ramène à là où CET appareil en était. Helper sameNav() pour\ndédoublonner. L'historique reste local ; seule la position se synchronise.\n\nVérifié : appareil sur « art » → adopte « dogmatisme » (distant) → Retour\nramène bien à « art ». Syntaxe OK.\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>",
      "tag": "Adoption d'une page distante"
    },
    {
      "hash": "b0ab263f1262c2d6b37061d60e39c70a693d0246",
      "short": "b0ab263",
      "auteur": "Orangentleman",
      "date": "2026-06-08T01:23:11+02:00",
      "sujet": "Historique « ← Retour » persistant (résiste à l'actualisation)",
      "corps": "La position était déjà restaurée au refresh, mais la pile navHistory\nrestait en mémoire vive → le bouton Retour repartait vide après une\nactualisation.\n\n- navHistory sauvegardée dans localStorage (philo-navhist) à chaque\n  changement (updateBackBtn, appelée par pushHistory/goBack) et rechargée\n  au démarrage par restoreNavHistory() (entrées invalides filtrées via\n  navEntryValid). Le bouton « ← Retour » fonctionne désormais même après\n  un rafraîchissement.\n- Local seulement (propre à l'appareil) : l'historique est un fil de\n  session, contrairement à la position (qui, elle, se synchronise).\n\nVérifié : après reload, pile restaurée (2 entrées), bouton actif, et\n« Retour » ramène bien à la page précédente. Syntaxe OK.\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>",
      "tag": ""
    },
    {
      "hash": "cf786cc821547b675e8f4665cdbf69f5d4a5c1c3",
      "short": "cf786cc",
      "auteur": "Orangentleman",
      "date": "2026-06-08T01:17:52+02:00",
      "sujet": "Position persistante : résiste à l'actualisation + cross-plateforme",
      "corps": "La page rouvrait toujours sur la 1re notion (onglet Auteurs) après un\nrefresh, et la position n'était pas partagée entre appareils.\n\n- localStorage `philo-nav` : la position (sbMode + fiche + onglet + sous-\n  onglets) est sauvegardée à chaque rendu via persistNav() (appelé en tête\n  de renderCrumbs, commun aux 4 vues). Au démarrage, restoreNavFromStorage()\n  la ré-applique avant le 1er rendu, puis renderCurrentView() rend la bonne\n  vue selon sbMode (même aiguillage que goBack). applyNavState() VALIDE la\n  cible (notion/fiche encore existante) avant application — sinon repli défaut.\n- Cross-plateforme : `philo-nav` est inclus dans prefsBlobForSync().nav\n  (table preferences) ; applyPrefsBlob adopte la position distante UNIQUEMENT\n  si l'utilisateur n'a pas encore navigué ici (navTouched, posé dans\n  pushHistory) — jamais de « téléportation » en pleine lecture, ni d'écrasement\n  de la position locale. Push cloud (debouncé) seulement après une navigation.\n\nVérifié : refresh rouvre la même fiche (test concept « Syllogisme ») ;\nposition invalide → repli propre ; syntaxe concaténée OK.\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>",
      "tag": "Position persistante"
    },
    {
      "hash": "9a844b516862ae370603bfa6b12dd87e5364b511",
      "short": "9a844b5",
      "auteur": "Orangentleman",
      "date": "2026-06-06T23:08:05+02:00",
      "sujet": "notice-banner timestamp update",
      "corps": "60s -> 30s d'affichage de la banière",
      "tag": ""
    },
    {
      "hash": "87954346c418bc32dce394c83e63dd7c441b2b8f",
      "short": "8795434",
      "auteur": "Orangentleman",
      "date": "2026-06-06T22:57:37+02:00",
      "sujet": "Raison : enrichissement depuis le recueil bac (auteurs canoniques)",
      "corps": "Dépouillement du recueil « Sujets-Bac philo 1996–2025 » (1178 textes) :\nextraction des auteurs récurrents sur la notion Raison (191 pages\nindexées) et comblement des lacunes canoniques de la notion.\n\nAjout à raison.auteurs (idée + citation vérifiée, new:true) :\n- Descartes (Discours de la méthode) — le « bon sens » universel + la méthode ;\n- Spinoza (Éthique) — comprendre plutôt que subir, la raison libère des passions ;\n- Leibniz (Monadologie) — principe de raison suffisante (« rien sans raison »),\n  le sens « fondement » de ratio ; fiche AM créée ;\n- Hobbes (Léviathan) — la raison comme calcul (ratio = computation) ;\n- Schopenhauer (L'Art d'avoir toujours raison) — la dialectique éristique :\n  l'envers exact du sujet « avoir raison à tout prix ».\n+ 2 textes sources (Descartes, le bon sens ; Schopenhauer, l'éristique).\n\nLa notion compte désormais 19 auteurs. Vérifié : data.js valide, syntaxe\nconcaténée OK, rendu + liens dynamiques OK. (sw.js déjà en philo-v32.)\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>",
      "tag": "Raison"
    },
    {
      "hash": "ff1ec29614a7e0f647e624290ca2bc8986588862",
      "short": "ff1ec29",
      "auteur": "Orangentleman",
      "date": "2026-06-06T18:46:27+02:00",
      "sujet": "Raison : intégrer le corpus « avoir raison à tout prix » (avec vérif)",
      "corps": "Enrichissement de la notion Raison à partir du corpus fourni\n(« Raisonne-t-on bien quand on veut avoir raison à tout prix ? »).\n\n- Plan de dissertation détaillé (plans[]) : 3 axes — (I) bien raisonner =\n  cohérence/non-contradiction (Aristote) + adéquation au réel (Bachelard) ;\n  (II) le risque du dogmatisme → critique de la raison (Sextus Empiricus,\n  Hume, Kant, Popper) ; (III) convaincre vs vaincre + part nécessaire des\n  croyances communes (Tocqueville). Transitions (limites) à chaque étape.\n- 7 textes sources (extraits fidèles, attribués) : Aristote (Topiques),\n  Bachelard (obstacle épistémologique), Sextus Empiricus (tropes d'Agrippa),\n  Hume (relations d'idées/faits), Kant (révolution copernicienne), Popper\n  (conjectures/réfutations), Tocqueville (croyances dogmatiques).\n- 5 auteurs ajoutés à la notion (Bachelard, Sextus Empiricus, Hume, Popper,\n  Tocqueville), chacun avec idée + citation. Fiche AM créée pour Sextus\n  Empiricus (+ couleur courant « Scepticisme » dans CC).\n- 6 concepts (cliquables partout) : scepticisme, dogmatisme, obstacle\n  épistémologique, falsifiabilité, sophisme, syllogisme.\n\nTout porte new:true. Vérifié : data.js valide, syntaxe concaténée OK,\nplan rendu + liens dynamiques OK. sw.js → philo-v32.\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>",
      "tag": "Raison"
    },
    {
      "hash": "4da49a3d1a7725d13f68410c73c7e929fb2bd6cc",
      "short": "4da49a3",
      "auteur": "Orangentleman",
      "date": "2026-06-06T13:40:07+02:00",
      "sujet": "Méthodo plus lisible + courants/catégories cliquables (facettes)",
      "corps": "1) Interface Méthodo refondue : suppression du gros titre redondant et\n   INVISIBLE (h1 sans couleur → noir sur fond sombre) ; la bascule\n   Dissertation/Explication devient un « segmented control » compact\n   (au lieu de deux gros boutons) ; libellé discret « Je révise la\n   méthode de… » ; intro plus lisible.\n\n2) Contenu enrichi (recherche méthodo en ligne) : nomme les deux plans\n   admis en dissertation (dialectique / progressif) + « 5 auteurs max,\n   on mobilise sans réciter ».\n\n3) Facettes cliquables : le COURANT d'un auteur (sous son nom) et la\n   CATÉGORIE d'un concept (badge de fiche + tag de carte) ouvrent une\n   petite liste de ceux qui partagent l'étiquette (openFacet/closeFacet,\n   overlay #facet-overlay, Échap/clic-voile pour fermer). Pour les\n   courants composés et quasi uniques, regroupement par MOT significatif\n   (≥5 lettres, hors « philosophie ») → tous les rationalismes /\n   idéalismes / phénoménologies… ensemble ; courant propre affiché en\n   sous-ligne.\n\nVérifié : syntaxe concaténée OK ; Méthodo (titre retiré, switch 46px,\nintro lisible) ; facettes courant (Kant→Kant/Hegel/Platon ;\nRationalisme→Descartes/Alain/Spinoza) et catégorie OK.\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>",
      "tag": ""
    },
    {
      "hash": "8aef9955e17537f16b602d83a55156faadec607e",
      "short": "8aef995",
      "auteur": "Orangentleman",
      "date": "2026-06-05T00:20:06+02:00",
      "sujet": "Temps : intégrer le cours d'un contributeur (Camus, Épicure, Rosa)",
      "corps": "Les notes partagées reprenaient le plan « Peut-on échapper au temps ? »,\ndéjà présent à ~85 % (Bergson, Heidegger, Augustin, Nietzsche, Sartre,\nArendt pardon/promesse — déjà bien attribué à Arendt, et non Sartre —,\nBarthes, Rosa, Sénèque, Pascal, Épictète). Ajout des éléments réellement\nnouveaux, vérifiés :\n\n- Camus (Le Mythe de Sisyphe) : auteur + fiche AM + texte + sous-partie\n  d'axe III (l'absurde, le suicide, la révolte). Concept « absurde » créé\n  (lié à temps + bonheur) ; courant « Philosophie de l'absurde » coloré (CC).\n- Épicure (Lettre à Ménécée, « la mort n'est rien ») : idée dans la notion\n  Temps + texte + sous-partie d'axe III (accepter la finitude).\n- Hartmut Rosa : 2e idée « Rendre le monde indisponible » (disponibilité /\n  contingence / résonance).\n- Axe III du plan réordonné : Épictète → Épicure → Camus → Nietzsche\n  (éternel retour) → Arendt → Rosa, avec transitions (limites) cohérentes.\n\nTout porte new:true. Vérifié : data.js valide, syntaxe concaténée OK,\nrendu + liens dynamiques (Camus/Épicure/absurde) OK. sw.js → philo-v31.\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>",
      "tag": "Temps"
    },
    {
      "hash": "d59575e7fce5dbb13d79b4dff6fee76a28732088",
      "short": "d59575e",
      "auteur": "Orangentleman",
      "date": "2026-06-04T11:53:06+02:00",
      "sujet": "Tuto + proposition : couvrir les accroches (BOX 24/25)",
      "corps": "Onboarding : l'étape « Onglet Exemples » présente désormais les DEUX\nsous-onglets, dont les Accroches (phrases d'ouverture, cherchables Ctrl+K).\n\nModale de proposition : nouvelle cible « accroche » (sous la catégorie\nnotion) — champs acctype / acctexte / accsrc → D[notion].accroches[]\n(avec new:true). Boutons « + » ajoutés dans la vue Exemples > Accroches\n(carte = correction, bas = ajout). Câblage : PROPOSAL_SOUSCIBLES,\nCIBLE_CAT, PROPOSAL_FIELDS, generateProposalText, CSS .accroche-card\n(position relative + survol du +).\n\nAgrégateur : la cible « accroche » est acceptée de bout en bout —\ndb.CIBLES, ingest.compute_key_term (discriminant = texte tronqué),\nview.BUCKETS (section NOTIONS) + aperçu, export labels. Notion lue dans\nfields.notion (comme exemple). Vérifié : ingestion OK, section NOTIONS.\n\nLes onglets Méthodo / Repères et le bandeau étaient déjà couverts par\nl'onboarding (phase B) — rien à ajouter là.\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>",
      "tag": "Tuto + proposition"
    },
    {
      "hash": "6edd92075919a8a7140dc9a2033eaa58f3402565",
      "short": "6edd920",
      "auteur": "Orangentleman",
      "date": "2026-06-03T20:17:26+02:00",
      "sujet": "Mobile : le contenu passait sous la barre de navigation (BOX 34)",
      "corps": "La hauteur plein écran utilisait 100vh = « grand » viewport (barre du\nnavigateur incluse) → sur mobile/tablette, le bas du contenu (dernier\nbouton) se retrouvait masqué derrière la barre de navigation.\n\n- Le repli dvh était même INVERSÉ (`height:100dvh;height:100vh`) : 100vh,\n  déclaré en dernier, gagnait toujours → correctif annulé. Ordre remis\n  dans le bon sens partout : 100vh (secours) PUIS 100dvh (moderne, gagne).\n- 100dvh appliqué aussi aux règles par défaut (tablette >700px) + à la\n  modale (max-height) ; viewport-fit=cover ajouté au meta viewport.\n- padding-bottom: env(safe-area-inset-bottom) sur les zones défilantes\n  (.main-content, .sidebar-list, overlay quiz, modale) → le dernier\n  élément dégage la barre d'accueil / le bord bas.\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>",
      "tag": "Mobile"
    },
    {
      "hash": "9682a25a20ae7a9c256f994956a0f667a0f2b3f4",
      "short": "9682a25",
      "auteur": "Orangentleman",
      "date": "2026-06-03T20:08:00+02:00",
      "sujet": "Quiz : ne plus montrer deux fois la même carte (BOX 33)",
      "corps": "pickSession ne dédoublonnait que par PAIRE (les deux sens d'un même item).\nMais une citation rangée sous plusieurs notions (ex. Descartes « maîtres et\npossesseurs de la nature » en nature ET technique) ou deux fiches concept de\nmême terme produisent des cartes au CONTENU identique mais de paires\ndifférentes — d'où la même carte vue deux fois dans une session.\n\nAjout d'une 2e dédup par contenu (type + question normalisée) dans\npickSession. Vérifié : 0 question en double sur 40 sessions de 50 cartes.\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>",
      "tag": "Quiz"
    },
    {
      "hash": "dfb9db1f31031a2c5e11fa3f9e995299e5b46587",
      "short": "dfb9db1",
      "auteur": "Orangentleman",
      "date": "2026-06-03T18:09:04+02:00",
      "sujet": "Agrégateur : synchro cross-plateforme de l'état via Supabase",
      "corps": "L'état de tri du mainteneur (statut/note/avis IA par boîte) vivait\nuniquement dans le SQLite local → invisible depuis une autre machine, et\nle pull ne ramenait que les contributions « en_attente » (les déjà\nvalidées ailleurs étaient irrécupérables).\n\nDésormais cet état est miroité dans Supabase (colonne aggregator_state\nJSONB de `contributions`) :\n- db.py : colonne submissions.state_updated_at (datation), serialize/\n  apply_submission_state (clé = position de boîte, stable car re-dérivée\n  du payload), bump auto sur update_status/update_note/set_ai_review.\n- supabase_client.py : pull_all (toutes contributions + état),\n  set_aggregator_state, local_status_for_remote (repli legacy).\n- pipeline.py : push_aggregator_state + sync_cloud (2 sens, arbitrage\n  « dernière écriture gagne » par horodatage).\n- dashboard.py : push auto après valider/intégrer/rejeter/noter + bouton\n  « 🔄 Synchroniser ». aggregate.py : commande `sync`.\n- migrations/2026_aggregator_state.sql : ajoute les colonnes + REVOKE la\n  lecture aux contributeurs (notes internes). À lancer 1 fois dans Supabase.\n\nLe local reste un cache reconstructible : sur une machine neuve, `sync`\nrebâtit tout le tableau de bord depuis le cloud. .env / proposals.db\nrestent hors Git.\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>",
      "tag": "Agrégateur"
    },
    {
      "hash": "9efbac6e35e8e4c41ef644d49dfc4ac31c895bde",
      "short": "9efbac6",
      "auteur": "Orangentleman",
      "date": "2026-06-02T22:00:19+02:00",
      "sujet": "Bandeau « contenu en construction » (en haut, fermable, auto-disparition 1 min)",
      "corps": "Affiche à CHAQUE chargement un petit bandeau ambré en haut de la zone\nprincipale : prévient que le contenu peut être inexact/incomplet et invite\nà participer via un mot souligné qui ouvre la partie « Proposer / éditer »\nde la visite guidée (tourGoPart('proposer')).\n\n- Aucune persistance : réapparaît à chaque rechargement (≠ onboarding).\n- Se ferme via la croix (dismissNotice) ou disparaît seul au bout de 60 s\n  (timer posé par initNotice, annulé si fermé avant).\n- Placé en 1er enfant de <main> (flex column) → au-dessus du fil d'Ariane,\n  sans perturber la mise en page ; CSS .notice-banner dédié.\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>",
      "tag": ""
    },
    {
      "hash": "9267274bae55255088b8d41e63ec394d1b9bcfab",
      "short": "9267274",
      "auteur": "Orangentleman",
      "date": "2026-06-02T21:43:09+02:00",
      "sujet": "Surbrillance concept : viser sa carte (onglet Concepts) plutôt que le titre",
      "corps": "Quand on ouvre une notion depuis la pastille « Notions concernées » d'un\nconcept mais que ce concept n'est PAS mentionné dans la prose visible, on\nfaisait briller le titre de la notion — ce qui n'apprend rien sur le\nconcept recherché.\n\nNouvel ordre de ciblage dans focusAfterRender (pendingConceptMention) :\n  a) mention visible dans la prose courante → brille en contexte ;\n  b) sinon → bascule sur l'onglet « Concepts » de la notion (le concept y\n     figure forcément, puisqu'on vient de sa pastille) et brille SA CARTE,\n     qui documente le lien notion↔concept ;\n  c) dernier recours : mention cachée (dépliée) puis en-tête.\n\nVérifié : pour tous les concepts sans mention visible, leur carte est bien\nprésente dans l'onglet Concepts de la notion. MAJ CLAUDE.md.\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>",
      "tag": "Surbrillance concept"
    },
    {
      "hash": "c91930b66077bce9998b23821e775405c43719c4",
      "short": "c91930b",
      "auteur": "Orangentleman",
      "date": "2026-06-02T21:35:02+02:00",
      "sujet": "Surbrillance d'arrivée : fiabiliser le scroll + viser le bon élément",
      "corps": "Deux causes aux ratés signalés (« parfois ça marche, parfois non, ou\nça focus le mauvais élément ») :\n\n1. Timing : focusAfterRender défilait dans un seul requestAnimationFrame,\n   avant que la mise en page de .main-content fraîchement réécrit soit\n   stable → scrollIntoView atterrissait à côté de façon intermittente.\n   scrollAndFlash attend désormais deux rAF (layout stabilisé) avant de\n   centrer et faire briller.\n\n2. Mauvais élément : la 1re mention d'un concept est souvent logée dans\n   le <details> « Approfondir la notion » REPLIÉ (élément masqué,\n   offsetParent nul) → on défilait vers un point invisible. Désormais :\n   focusAfterRender PRÉFÈRE une mention visible (hors details replié), et\n   à défaut scrollAndFlash OUVRE les <details> ancêtres de la cible avant\n   de défiler.\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>",
      "tag": "Surbrillance d'arrivée"
    },
    {
      "hash": "f6765781c431bd30629af270a37b594a3dcbab39",
      "short": "f676578",
      "auteur": "Orangentleman",
      "date": "2026-06-02T21:13:50+02:00",
      "sujet": "Exemples : sous-onglet « Accroches » + recherche globale",
      "corps": "Ajoute dans chaque notion un sous-onglet « Accroches » (à côté\nd'« Exemples ») listant des phrases d'ouverture rédigées, prêtes à\nrecopier pour amorcer une dissertation. 34 accroches sur les 17\nnotions, toutes new:true.\n\n- data.js : champ accroches:[{type,t,src?,new}] par notion + état\n  curExempleSubTab.\n- index.html : sous-onglets dans l'onglet Exemples (.accroche-card,\n  CSS dédié) ; indexation dans la recherche globale (Ctrl+K, type\n  « accroche ») ; openNotionAccroche() ouvre la notion sur le bon\n  sous-onglet et fait briller la carte ciblée (pendingAccroche).\n- CLAUDE.md : documente la structure accroches + l'indexation palette.\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>",
      "tag": "Exemples"
    },
    {
      "hash": "bc432778d3f0e2c1f71df3d6c660ba86c68502de",
      "short": "bc43277",
      "auteur": "Orangentleman",
      "date": "2026-06-02T19:24:17+02:00",
      "sujet": "Méthodo : séparer « Repères » et un nouvel onglet « Méthodo » (guide)",
      "corps": "- L'ancien onglet « Méthodo » (repères du programme) est renommé\n  « Repères » (sbMode='reperes', renderSBReperesList, repereSearch).\n- Nouveau 5e onglet « Méthodo » (sbMode='methodo') : guide de méthode\n  distinct des fiches — deux parcours (dissertation, explication de texte)\n  avec squelette visuel de la copie + étapes dépliables, phrases toutes\n  prêtes et astuces (METHODO_GUIDE / renderMethodoContent, CSS .methodo-*).\n- Câblage complet : renderSB (5 onglets), goBack, goMode, renderCrumbs,\n  openConcept, pushHistory (methodoTopic), tourShowSidebarMode + onboarding\n  (5 portes d'entrée). Onglets en flex-wrap → 3 rangées, aucun rogné.\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>",
      "tag": "Méthodo"
    },
    {
      "hash": "c3f5fd5a498c283d08d3e79e1c83a89dd0dec731",
      "short": "c3f5fd5",
      "auteur": "Orangentleman",
      "date": "2026-06-02T19:11:58+02:00",
      "sujet": "Mobile: swipe pour ouvrir/fermer le tiroir + mise à jour auto du SW",
      "corps": "- Geste tactile (initSidebarSwipe) : balayage depuis le bord gauche pour\n  ouvrir, vers la gauche pour fermer ; inactif si une surcouche est ouverte.\n- sw.js en réseau-d'abord pour le HTML/JS (cache en repli hors-ligne) :\n  une simple actualisation récupère la dernière version déployée.\n- Rechargement transparent sur controllerchange (garde anti-boucle,\n  uniquement si un contrôleur existait déjà) + reg.update() au chargement.\n- Bump cache philo-v29 → philo-v30.\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>",
      "tag": "Mobile"
    },
    {
      "hash": "c5faf975b71f61040ba5a436edc1647501554710",
      "short": "c5faf97",
      "auteur": "Orangentleman",
      "date": "2026-06-02T18:34:05+02:00",
      "sujet": "Onboarding : présenter chaque mode de sidebar + onglets Méthodo visibles (2×2)",
      "corps": "- Onboarding : chaque porte d'entrée (Notions/Auteurs/Concepts/Méthodo)\n  bascule réellement la sidebar dans son mode et met en valeur sa liste,\n  au lieu de rester en mode Notions à pointer le bouton (BOX 17, reprécisé)\n- Onglets de mode (.sb-tabs) en grille 2×2 : sur la sidebar étroite (155px),\n  le 4e onglet « Méthodo » était rogné par overflow:hidden (BOX 20, reprécisé)\n- sw.js : cache philo-v29\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>",
      "tag": "Onboarding"
    },
    {
      "hash": "00e411b8d40ef16d54168e303c9670c38f4433e8",
      "short": "00e411b",
      "auteur": "Orangentleman",
      "date": "2026-06-02T18:14:56+02:00",
      "sujet": "Retours site : édition d'une proposition en attente + UX navigation/onboarding",
      "corps": "- Édition d'un envoi tant qu'il est « en attente » (bouton ✎ dans « Mes\n  propositions », reconstruction des boîtes depuis le payload v1/v2/v3,\n  UPDATE Supabase ciblé avec détection du refus RLS, brouillon local préservé)\n- Liens dynamiques : surbrillance + scroll vers la cible (BOX 19)\n- Onboarding : zoom sur une vraie boîte de contenu de chaque onglet (BOX 16/17)\n- Barre d'onglets de notion : passage en flex-wrap, plus de scroll caché (BOX 20)\n- Quiz : dédoublonnage de session + distracteurs QCM homogènes (BOX 14/15)\n- Préremplissage du nom quand on est connecté (BOX 18)\n- sw.js : cache philo-v28\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>",
      "tag": "Retours site"
    },
    {
      "hash": "e1c102730fc15cc2493ba6e2102c077d10d1119b",
      "short": "e1c1027",
      "auteur": "Orangentleman",
      "date": "2026-06-01T22:15:32+02:00",
      "sujet": "Repères : fiches + onglet Méthodologie",
      "corps": "31 repères du programme ajoutés comme entrées CONCEPTS (cat:'Repère',\nliés dynamiquement par linkTerms). Nouvel onglet sidebar « Méthodo »\n(sbMode='methodo') qui les liste à part, réutilise la fiche concept et\nles exclut du glossaire Concepts et de l'onglet Concepts des notions.\nsw.js : cache philo-v27.\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>",
      "tag": "Repères"
    },
    {
      "hash": "f6cd0bfcd04c17c865144c0384ec97a44b6ee355",
      "short": "f6cd0bf",
      "auteur": "Orangentleman",
      "date": "2026-06-01T21:16:51+02:00",
      "sujet": "Temps : intégrer le cours (corpus, auteurs, concepts, plan enrichi)",
      "corps": "- 10 textes de corpus + 2 exemples scientifiques (relativité)\n- 9 auteurs (Augustin, Nietzsche ×2, Sartre, Arendt, Barthes, Rosa,\n  Sénèque, Pascal, Épictète) au format idées + citations\n- 3 bios AM manquantes (Barthes, Hartmut Rosa, Sénèque)\n- 2 concepts créés : Éternel retour (Nietzsche), Accélération /\n  Résonance (Rosa) — auto-liés via linkTerms\n- plan « Peut-on échapper au temps ? » enrichi : axe III complété\n  (amor fati, pardon/promesse d'Arendt, accélération→résonance)\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>",
      "tag": "Temps"
    },
    {
      "hash": "160a801ada32c73f205ccca52a630d010dbbd746",
      "short": "160a801",
      "auteur": "Orangentleman",
      "date": "2026-06-01T20:30:21+02:00",
      "sujet": "contributions: avis IA renvoyé au contributeur dans un champ distinct (avis_ia)",
      "corps": "L'avis IA reformulé pour l'usager part désormais dans son PROPRE canal,\nséparé du mot du relecteur (explication) :\n- supabase_client.set_status / pipeline.push_contribution_status : nouveau\n  paramètre avis_ia (écrit seulement si fourni)\n- dashboard : pousse ai_user_message comme avis_ia au changement de statut ;\n  le champ « explication » redevient le mot humain (plus de pré-remplissage)\n- front « Mes propositions » : affiche l'avis IA à part, étiqueté\n  « 🤖 Avis automatique (indicatif) », distinct de la réponse du relecteur\n\n⚠ Nécessite côté Supabase : ALTER TABLE contributions ADD COLUMN avis_ia text;\nPWA : cache philo-v25 → philo-v26.\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>",
      "tag": "contributions"
    },
    {
      "hash": "7359cd4a0ecfdcd07a3d06c4cff5741f62592600",
      "short": "7359cd4",
      "auteur": "Orangentleman",
      "date": "2026-06-01T20:08:27+02:00",
      "sujet": "aggregator: dossier reviews/, ré-analyse IA au renvoi en attente, avis adapté au contributeur",
      "corps": "- export : les .txt datés sont rangés dans philo-aggregator/reviews/ (créé au besoin)\n- db.update_status : remettre une boîte « en_attente » efface sa pré-vérif IA\n  (verdict/review/message), pour qu'elle repasse dans la file de relecture\n- IA : Gemini renvoie un 3e champ « message_contributeur » (ton élève, sans jargon),\n  stocké en ai_user_message et pré-rempli dans le champ « explication » du dashboard\n  (le relecteur valide/édite avant l'envoi vers « Mes propositions »)\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>",
      "tag": "aggregator"
    },
    {
      "hash": "3334ba7a0a10e6f107ad244e08a3266475092716",
      "short": "3334ba7",
      "auteur": "Orangentleman",
      "date": "2026-06-01T00:50:35+02:00",
      "sujet": "Tour: pastilles de progression cliquables + nom au survol",
      "corps": "- Chaque cadre de partie saute à sa 1re étape au clic (tourJumpPart).\n- Étiquette du nom de la partie au survol/focus (CSS ::after, data-label),\n  accessible au clavier (role/tabindex/Entrée-Espace, aria-label).\n- sw.js : cache philo-v24 → v25.\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>",
      "tag": "Tour"
    },
    {
      "hash": "8e288dc8881ad0599904b62202262be4b8865092",
      "short": "8e288dc",
      "auteur": "Orangentleman",
      "date": "2026-06-01T00:31:28+02:00",
      "sujet": "Tour: ajoute le partage, réordonne proposer avant compte",
      "corps": "- Nouvelle partie « Partager » (QR / lien / partage natif) pointant le\n  bouton 🔗 de la barre du haut.\n- « Proposer » présenté avant « Mon compte » (la partie compte renvoie au\n  suivi des propositions, désormais déjà vues).\n- Texte « Mon compte » mis à jour : propositions « déjà vues » + mention\n  de la déconnexion / suppression de compte.\n- sw.js : cache philo-v23 → v24.\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>",
      "tag": "Tour"
    },
    {
      "hash": "48ca7f6b290cf30a740ca134631562f02960e133",
      "short": "48ca7f6",
      "auteur": "Orangentleman",
      "date": "2026-05-31T23:50:43+02:00",
      "sujet": "fix(auth): écran de réinitialisation du mot de passe + suppression de compte",
      "corps": "- Mot de passe oublié : le lien de récupération affichait juste un état\n  connecté sans écran de réinitialisation (course entre PASSWORD_RECOVERY et\n  l'abonnement onAuthStateChange). On capture « type=recovery » dans l'URL de\n  façon synchrone au chargement, puis on force l'écran « nouveau mot de passe ».\n- Suppression de compte : bouton « Supprimer mon compte » (profil) avec\n  confirmation → SB.rpc('delete_own_account') puis déconnexion + nettoyage\n  local. Requiert la fonction SQL SECURITY DEFINER côté Supabase.\n- PWA : cache philo-v22 → philo-v23.\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>",
      "tag": "fix(auth)"
    },
    {
      "hash": "cb50b878bd81099d9291e8c28b97d439304161e4",
      "short": "cb50b87",
      "auteur": "Orangentleman",
      "date": "2026-05-31T23:35:53+02:00",
      "sujet": "feat: bouton de partage (QR + copie + natif) + onboarding détaillé des onglets de fiche",
      "corps": "- Partage : bouton .topbar-share → modale #share-overlay (QR code, lien\n  copiable, partage natif navigator.share sur mobile), pensé mobile.\n- Onboarding : la partie « fiches » détaille désormais chaque onglet de la\n  notion (définition, Approfondir, Auteurs, Textes, Concepts, Dissertations,\n  Exemples) en basculant réellement dessus.\n- Auth : message d'inscription invite à vérifier les spams.\n- PWA : cache philo-v21 → philo-v22 (contenu index.html modifié).\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>",
      "tag": "feat"
    },
    {
      "hash": "a22ae58018e14b7c88fb5a0ec20d048198173368",
      "short": "a22ae58",
      "auteur": "Orangentleman",
      "date": "2026-05-31T23:00:15+02:00",
      "sujet": "Religion : concept Agnosticisme + Temps : plan « Peut-on échapper au temps ? »",
      "corps": "Religion/science étaient déjà saturées par rapport aux cours ; seul manquait\nle concept « Agnosticisme » (suspension du jugement sur Dieu, distinct de\nl'athéisme/théisme — Russell, Is There a God?), relié à la théière, au\nscepticisme et à l'épochè. Pour Temps, intégration de la dissertation des\ncours « Peut-on échapper au temps ? » sous forme de plan rédigé (Kant/Heidegger\nêtre-temporel ; Bergson temps mesuré vs durée ; Pascal divertissement ;\nÉpictète ce qui dépend de nous). Bump cache sw.js v20→v21.\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>",
      "tag": "Religion"
    },
    {
      "hash": "dfc071227bf5be4d2dfda0692e0460a68aaa048d",
      "short": "dfc0712",
      "auteur": "Orangentleman",
      "date": "2026-05-31T22:54:43+02:00",
      "sujet": "Vérité : idée James « vérité à crédit » + concept Rasoir d'Ockham",
      "corps": "Intègre les apports nouveaux des cours sur la vérité (le reste y figurait\ndéjà) : seconde idée de William James (les 4 critères d'une idée vraie,\nanalogie du crédit, géométries non euclidiennes) et création du concept\nmanquant « Rasoir d'Ockham » (parcimonie), relié à vérité-instrumentale et\nfalsifiabilité. Bump cache sw.js v19→v20.\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>",
      "tag": "Vérité"
    },
    {
      "hash": "e1fceb3d9aad6ba421abf10a016530b9b4765e7c",
      "short": "e1fceb3",
      "auteur": "Orangentleman",
      "date": "2026-05-31T22:32:31+02:00",
      "sujet": "feat(mes-propositions): afficher le détail des boîtes proposées",
      "corps": "« Mes propositions » ne montrait qu'un résumé d'une ligne + le statut.\nOn ajoute un dépliant « Voir le détail proposé » qui réaffiche toutes\nles boîtes et leurs champs (idées, citations, définitions…) à partir du\npayload v3 déjà stocké, tolérant aux anciens formats v1/v2. La\njustification de l'état (explication) reste affichée sous la carte.\n\nsw : cache philo-v19.\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>",
      "tag": "feat(mes-propositions)"
    },
    {
      "hash": "d6bace5c0050b6b7d6c0b4658700c117618a005c",
      "short": "d6bace5",
      "auteur": "Orangentleman",
      "date": "2026-05-31T20:11:15+02:00",
      "sujet": "feat(dashboard): heure de réception, Intégrer réservé aux validées, avis IA dans l'export",
      "corps": "- view.short_date : affiche AAAA-MM-JJ HH:MM (heure locale ; les\n  horodatages Supabase UTC sont convertis).\n- dashboard : le bouton « Intégrer » n'apparaît que sur une boîte déjà\n  « validee » (flux en_attente → validee → integree).\n- export : reprend l'avis IA de chaque boîte dans le .txt, clairement\n  étiqueté « indicatif, à vérifier », + disclaimer en en-tête rappelant\n  que les vérifications restent obligatoires.\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>",
      "tag": "feat(dashboard)"
    },
    {
      "hash": "73993c118c41339aa47929d3977424c6453ca735",
      "short": "73993c1",
      "auteur": "Orangentleman",
      "date": "2026-05-31T19:39:52+02:00",
      "sujet": "feat(dashboard): favicon engrenage (SVG inline)",
      "corps": "Ajoute une icône d'onglet ⚙️ au dashboard local de l'agrégateur,\nen data-URI SVG (pas de fichier externe).\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>",
      "tag": "feat(dashboard)"
    },
    {
      "hash": "fdbd639aeeea5b338102b1a9218be9c8f70edd84",
      "short": "fdbd639",
      "auteur": "Orangentleman",
      "date": "2026-05-31T18:26:49+02:00",
      "sujet": "fix: mot de passe oublié, tuto mobile, crash palette→concept",
      "corps": "- Auth : ajoute le parcours « mot de passe oublié » (lien dans la\n  connexion, écran d'envoi, écran nouveau mot de passe, gestion de\n  l'évènement PASSWORD_RECOVERY).\n- Tuto mobile : repositionne le projecteur en plusieurs passes pour\n  attendre la fin de la transition du tiroir + recadre les cibles trop\n  grandes dans le viewport.\n- data.js : retire une virgule en trop qui créait un trou dans CONCEPTS\n  (Array.find le visitait comme undefined → crash renderCrumbs au clic\n  sur un concept depuis la recherche globale).\n- renderCrumbs : garde défensive (x && x.id) contre un futur trou.\n- sw.js : cache philo-v18.\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>",
      "tag": "fix"
    },
    {
      "hash": "78fdfa1699256a389aa660b3403858fb492b5cc0",
      "short": "78fdfa1",
      "auteur": "Orangentleman",
      "date": "2026-05-31T16:29:13+02:00",
      "sujet": "feat(front): palette de recherche Ctrl+K, barre d'actions sans chevauchement, tuto à jour",
      "corps": "- Palette de recherche globale (Ctrl/⌘+K) : notions + auteurs + concepts,\n  navigation clavier, complète (sans remplacer) la recherche par mode.\n- Barre d'en-tête : groupe d'actions à droite (Mes propositions / Recherche /\n  Aide) ; le « ? » n'est plus en position:fixed → fini le chevauchement,\n  y compris sur mobile. Bouton « Mes propositions » (connecté) ouvrant le\n  suivi des statuts.\n- Lisibilité : :focus-visible net partout ; plans de dissertation repliables.\n- Onboarding : étape recherche globale, partie « Mon compte » (sync + suivi\n  des propositions, avec emplacement du bouton), carte de fin mentionnant la PWA.\n- Commentaires d'en-tête rafraîchis (données chargées depuis data.js).\n- sw.js : cache philo-v17.\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>",
      "tag": "feat(front)"
    },
    {
      "hash": "ae1fc487c5ee89e25dbaa0853d5947871a7d53bc",
      "short": "ae1fc48",
      "auteur": "Orangentleman",
      "date": "2026-05-31T14:06:23+02:00",
      "sujet": "feat(contrib): mailto en repli automatique + provenance visible au dashboard",
      "corps": "Front : l'échec d'un envoi en ligne (Supabase ou boîte anonyme) bascule\ndésormais AUTOMATIQUEMENT sur l'appli mail du contributeur\n(proposalMailtoFallback) au lieu de lui demander de cliquer. Le bouton\n« Envoyer par email » devient un repli discret (.pbtn-ghost). sw.js → v16.\n\nDashboard : une pastille de provenance distingue les trois canaux\n(☁ compte / ⬇ anonyme / 📄 fichier), pour rendre visible que seul le\ncanal « compte » reçoit un renvoi de statut. Docs CLAUDE.md + README mises\nà jour (envoi, cockpit, provenance).\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>",
      "tag": "feat(contrib)"
    },
    {
      "hash": "e40e6dfdd22b723bbc6a954d4f79470110f1be52",
      "short": "e40e6df",
      "auteur": "Orangentleman",
      "date": "2026-05-31T13:05:19+02:00",
      "sujet": "feat(aggregator): dashboard cockpit complet + écriture-retour Supabase",
      "corps": "Le tableau de bord local regroupe désormais toutes les commandes en\nboutons (☁ pull-cloud, ⬇ pull anonyme, 🤖 relire, 📤 exporter,\n🗄 archiver, 🗑 purger) + un panneau de stats par statut. Changer le\nstatut d'une boîte issue d'un compte pousse automatiquement le statut\ncontributeur vers Supabase (Valider→en cours, Intégrer→intégrée,\nRejeter→refusée), avec une explication facultative saisie sur la carte.\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>",
      "tag": "feat(aggregator)"
    },
    {
      "hash": "4312d7b8a9b2567ee53eebf9ddd8d2bf73423a7e",
      "short": "4312d7b",
      "auteur": "Orangentleman",
      "date": "2026-05-31T12:59:31+02:00",
      "sujet": "fix(sync): session de quiz reprenable + brouillons synchronisés cross-appareil",
      "corps": "Trois correctifs de synchro signalés à l'usage :\n\n- Quiz « session en cours » : après une adoption distante, on n'écrivait\n  que le localStorage ; le runtime (quizState.session) restait vide, donc\n  « Reprendre » n'apparaissait qu'après avoir refermé/rouvert l'overlay.\n  Extraction de la reconstruction de session dans syncRuntimeQuizFromStorage()\n  (réutilisée par openQuiz) + appel après adoption dans syncOnFocus/syncOnLogin\n  (keepLive : on n'interrompt pas une partie jouée ici). La série (streak) se\n  lisait déjà du localStorage : elle suit désormais visiblement.\n\n- Brouillons de proposition : applyDraftsBlob bloquait toute mise à jour quand\n  la modale était ouverte — or on consulte un brouillon en l'ouvrant, d'où\n  « rien n'est synchronisé », et l'ouverture re-poussait le brouillon local\n  par-dessus le distant. adoptRemoteDrafts adopte + re-rend désormais même\n  modale ouverte SI rien n'est saisi localement (sinon on préserve la saisie).\n\n- Aide « Ma progression est-elle sauvegardée ? » : insiste davantage sur le\n  multi-appareils (réviser sur le téléphone, reprendre sur l'ordinateur) et\n  rappelle que brouillons + réglages voyagent aussi avec le compte.\n\nsw.js : cache philo-v14 -> philo-v15.\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>",
      "tag": "fix(sync)"
    },
    {
      "hash": "097fe3e1e5188f73d2475ba45c6ff8f6b0335ba8",
      "short": "097fe3e",
      "auteur": "Orangentleman",
      "date": "2026-05-31T01:59:58+02:00",
      "sujet": "feat(aggregator): source Supabase (pull-cloud + push du statut)",
      "corps": "Le cerveau local lit désormais les contributions des comptes connectés\ndans Supabase et leur renvoie le statut (vu dans « Mes propositions ») :\n\n- supabase_client.py : client urllib (clé service_role via .env), pull des\n  contributions « en_attente » + PATCH statut/explication.\n- db.py : colonne submissions.remote_id (+ migration + index unique partiel)\n  pour relier une soumission locale à sa contribution Supabase ; helpers\n  remote_exists / get_remote_id_for_box / get_submission_box_statuses.\n- ingest.py : ingest_payload (objet déjà parsé) factorisé avec ingest_text.\n- pipeline.py : pull_cloud_and_ingest (rejouable, dédoublonné sur l'UUID) +\n  derive_local_status + push_contribution_status.\n- aggregate.py : commandes « pull-cloud » et « push ».\n- .env.example / README : SUPABASE_URL + SUPABASE_SERVICE_KEY (jamais publiée).\n\nAucune modif du site ni du service worker.\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>",
      "tag": "feat(aggregator)"
    },
    {
      "hash": "5fb595af0fec547a371141918f6f87a078e4fc58",
      "short": "5fb595a",
      "auteur": "Orangentleman",
      "date": "2026-05-31T01:45:10+02:00",
      "sujet": "feat(drafts): brouillon de proposition persistant + synchronisé + vidé après envoi",
      "corps": "Les boîtes en cours de saisie n'étaient qu'en mémoire (perdues au rechargement,\njamais reportées sur le compte). Désormais : persistées en localStorage\n('philo-drafts') et synchronisées avec le compte (transportées dans le bloc\npréférences, sans nouvelle table). À la 1re connexion on conserve un brouillon\nlocal non vide plutôt que d'adopter celui du compte. Après un envoi en ligne\nréussi (Supabase ou boîte), le brouillon est vidé. Bump sw.js v13 -> v14.\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>",
      "tag": "feat(drafts)"
    },
    {
      "hash": "3be5d79eb11693d7f63e9606b170d7bcf53ea87b",
      "short": "3be5d79",
      "auteur": "Orangentleman",
      "date": "2026-05-31T01:24:00+02:00",
      "sujet": "feat(contributions): propositions rattachées au compte + « Mes propositions »",
      "corps": "Connecté → « Envoyer en ligne » insère la proposition dans la table Supabase\n'contributions' (RLS : user_id = auth.uid()) au lieu de la boîte anonyme.\nNon connecté → repli inchangé sur la boîte PythonAnywhere (envoi anonyme).\nNouvelle vue « Mes propositions » : liste les contributions du compte avec\nleur statut (en attente / validée en cours / validée intégrée / non retenue)\net l'explication (verdict IA + notes admin). Bump sw.js v12 -> v13.\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>",
      "tag": "feat(contributions)"
    },
    {
      "hash": "775e48138ce47076caf8c741dee5294f4a1ca266",
      "short": "775e481",
      "auteur": "Orangentleman",
      "date": "2026-05-31T01:19:03+02:00",
      "sujet": "fix(sync): la version la plus récente gagne (suppressions propagées)",
      "corps": "La synchro fusionnait à CHAQUE chargement : une remise à zéro était donc\nressuscitée par le distant. Désormais on fusionne uniquement à la toute\npremière connexion d'un appareil (combine les données anonymes), puis on\napplique « dernière version gagne » via un marqueur de synchro persistant\n(localStorage 'philo-sync'). resetAllQuiz pousse maintenant la remise à zéro\n(il contournait saveQuizState). syncOnFocus adopte le distant au lieu de\nfusionner. Bump sw.js v11 -> v12.\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>",
      "tag": "fix(sync)"
    },
    {
      "hash": "df8b1dc1bc16524fa2ba3db97b0a5d206a5a2b15",
      "short": "df8b1dc",
      "auteur": "Orangentleman",
      "date": "2026-05-31T01:06:00+02:00",
      "sujet": "Synchro quiz : corrige le streak, ajoute la session en cours, aide à jour",
      "corps": "- Fusion : on arbitrait le « daily » sur .lastDate (champ resté vide), d'où\n  une série (streak) perdue à la fusion. On arbitre désormais sur .date.\n- La session de quiz en cours (« active ») est maintenant synchronisée :\n  on peut reprendre une session d'un appareil à l'autre.\n- Aide « Ma progression est-elle sauvegardée ? » : texte dynamique qui met\n  en avant le multi-appareils (connecté : suit partout ; déconnecté : invite\n  à créer un compte, fusion sans perte).\n\nsw.js : cache philo-v10 → philo-v11.\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>",
      "tag": "Synchro quiz"
    },
    {
      "hash": "25ff0d55af12d8585e8a4df0bc5e0283b76ad0df",
      "short": "25ff0d5",
      "auteur": "Orangentleman",
      "date": "2026-05-31T00:32:45+02:00",
      "sujet": "Comptes : synchro de la progression quiz + préférences (Phase 2)",
      "corps": "Quand l'utilisateur est connecté, sa progression au quiz et ses\npréférences (mode révision/édition, visite vue) sont sauvegardées dans\nSupabase (tables quiz_progress et preferences, un blob JSON par compte).\nÀ la 1re connexion, le localStorage anonyme est FUSIONNÉ avec l'en-ligne\n(carte par carte, meilleur XP/série) : rien n'est perdu. Ensuite chaque\nécriture est repoussée (anti-rafale 1,5 s) et l'on refusionne au retour\nd'onglet. Hors-ligne / non connecté : tout reste en localStorage.\n\nsw.js : cache philo-v9 → philo-v10.\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>",
      "tag": "Comptes"
    },
    {
      "hash": "e7899140c18a37f60c11a97b83c8f73b5419bfed",
      "short": "e789914",
      "auteur": "Orangentleman",
      "date": "2026-05-30T23:56:17+02:00",
      "sujet": "Comptes : pseudo, renommage, deux boutons (connexion / création)",
      "corps": "Affinages de l'auth Supabase suite aux retours :\n- deux boutons distincts « Se connecter » / « Créer un compte » dans la\n  sidebar (un seul, le nom, une fois connecté) ;\n- pseudo facultatif à l'inscription (nom affiché) + renommage pour les\n  comptes e-mail ; méthode affichée « Gmail » pour Google ;\n- intro « deux façons de s'identifier » + note de confidentialité ;\n- correctif : renommer ne ferme plus la modale (fermeture auto réservée\n  à la connexion). Bump service worker v8 -> v9.\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>",
      "tag": "Comptes"
    },
    {
      "hash": "dc1ba927ad59a63ef7d01f138d7217bc34f8fb64",
      "short": "dc1ba92",
      "auteur": "Orangentleman",
      "date": "2026-05-30T23:24:03+02:00",
      "sujet": "Comptes : authentification Supabase (Google + e-mail/mot de passe)",
      "corps": "Couche compte facultative côté site, socle d'une future synchro\ncross-plateforme. Client Supabase via CDN, bouton sidebar « Créer un\ncompte / se connecter », modale (onglets connexion/création, Google\nOAuth, e-mail + mot de passe), gestion de session. Désactivée\nproprement si Supabase est injoignable (client SB null). Bump du\nservice worker v7 -> v8.\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>",
      "tag": "Comptes"
    },
    {
      "hash": "a6985c786461173f905a2c53bc16b81206f40e95",
      "short": "a6985c7",
      "auteur": "Orangentleman",
      "date": "2026-05-30T18:27:41+02:00",
      "sujet": "Boîte aux lettres : CORS en liste blanche d'origines (au lieu d'une seule)",
      "corps": "ALLOWED_ORIGIN accepte désormais plusieurs origines séparées par des\nvirgules. add_cors_headers compare l'en-tête Origin de la requête à la\nliste et ne renvoie Access-Control-Allow-Origin que pour une origine\nautorisée (+ Vary: Origin). « * » reste le défaut (mode ouvert).\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>",
      "tag": "Boîte aux lettres"
    },
    {
      "hash": "06b9b650de2934e8f236edbcf9173b871b749df3",
      "short": "06b9b65",
      "auteur": "Orangentleman",
      "date": "2026-05-30T18:13:11+02:00",
      "sujet": "Refonte du tuto : points d'avancement encadrés par thème + parties réviser/proposer détaillées",
      "corps": "- Pastilles de progression regroupées en cadres colorés par thème (fond\n  translucide, contours nets, plus marqués pour le thème courant) via\n  tourProgressHTML + palette TOUR_PART_COLORS.\n- Partie « réviser » : le tuto ouvre le quiz et le pilote (niveau, maîtrise,\n  horizon, mode, filtres, démarrer, objectif).\n- Partie « proposer » : le tuto ouvre la modale de contribution et parcourt\n  son intérieur (boîte, menus en cascade, champs, +, aperçu).\n- Nettoyage des overlays à chaque étape et en fin de visite (tourCloseOverlays).\n- sw.js : cache PWA bumpé en philo-v7.\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>",
      "tag": "Refonte du tuto"
    },
    {
      "hash": "4ffcfe3864b7d9b4291f68279138b819866424c9",
      "short": "4ffcfe3",
      "auteur": "Orangentleman",
      "date": "2026-05-30T17:15:26+02:00",
      "sujet": "Contributions : catégorie « site » (signaler un bug / proposer une fonctionnalité)",
      "corps": "Deux nouveaux retours sur l'outil lui-même, distincts du contenu\nphilosophique. Réutilisent le type « remarque » pour éviter de propager\nun nouveau type dans toute la pipeline ; le menu « Type d'action » est\nmasqué côté front. Exclus de la relecture Gemini et regroupés sous une\nsection « RETOURS SITE » du dashboard. Bump cache SW v5 -> v6.\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>",
      "tag": "Contributions"
    },
    {
      "hash": "6b805e20d5d59c3ddf687c6d6abd344f3224d95e",
      "short": "6b805e2",
      "auteur": "Orangentleman",
      "date": "2026-05-30T16:41:04+02:00",
      "sujet": "Refonte de l'onboarding : visite guidée pilotée + bouton d'aide",
      "corps": "Remplace les 4 astuces statiques par une visite guidée en 14 étapes\n(spotlight + bulle, page verrouillée, boutons précédent/suivant/passer)\ncouvrant le site, les fiches, les liens dynamiques, la navigation, le\nmode révision et le mode édition. Bouton d'aide en haut à droite pour\nrefaire toute la visite ou sauter à une partie. Croix de fermeture et\nclic sur le sombre pour sortir (dernière page ou accès direct à une\npartie). Bump du cache service worker v4 -> v5.\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>",
      "tag": "Refonte de l'onboarding"
    },
    {
      "hash": "69c7167c4f02d7daa5149a23db0d08c5485f37d6",
      "short": "69c7167",
      "auteur": "Orangentleman",
      "date": "2026-05-30T13:16:10+02:00",
      "sujet": "Ajout d'un lanceur du dashboard (ouverture auto du navigateur)",
      "corps": "Le dashboard ouvre désormais le navigateur tout seul au démarrage et\ndispose d'un .bat « double-clic » pour le lancer en un geste.\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>",
      "tag": ""
    },
    {
      "hash": "458e1e1fcff9788563701311510d2395a504e739",
      "short": "458e1e1",
      "auteur": "Orangentleman",
      "date": "2026-05-30T13:00:04+02:00",
      "sujet": "a11y/pwa : bump cache service worker v2 -> v3",
      "corps": "Force le rechargement de l'index.html corrigé (contraste AA des liens\ncolorés). Sans ce bump, le service worker continuait de servir la\nversion périmée en cache, masquant le correctif.\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>",
      "tag": "a11y/pwa"
    },
    {
      "hash": "f4cd6c6cdd3b1763dc31a132ea63b98aaaac9342",
      "short": "f4cd6c6",
      "auteur": "Orangentleman",
      "date": "2026-05-30T01:30:14+02:00",
      "sujet": "a11y : landmark <main> + contraste AA des liens colorés",
      "corps": "- #main devient un vrai <main> (repère « main landmark » manquant).\n- inkOnDark() éclaircit la couleur d'une notion juste assez pour passer\n  WCAG 2 AA (4.5:1) quand elle sert de couleur de texte sur fond sombre.\n  Appliqué aux liens .nterm et aux noms d'auteurs des cartes : la teinte\n  (identité de la notion) est conservée, en plus clair. Corrige les échecs\n  de contraste signalés par l'audit (Conscience #534AB7, Langage #6B4FA0…).\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>",
      "tag": "a11y"
    },
    {
      "hash": "a0637dff5e595cbf38ed3edae2e6bc81abc93f96",
      "short": "a0637df",
      "auteur": "Orangentleman",
      "date": "2026-05-30T00:58:47+02:00",
      "sujet": "fix(review) : modèle Gemini par défaut -> gemini-flash-latest",
      "corps": "gemini-1.5-flash a été retiré par Google (erreur 404 « model is not\nfound »). On vise désormais l'alias « -latest », qui suit toujours le\nmodèle flash courant et ne se périme pas. Masque aussi le FutureWarning\nbruyant du paquet google.generativeai (déprécié mais fonctionnel).\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>",
      "tag": "fix(review)"
    },
    {
      "hash": "a3da3a68468e11efe48d88f3f2af6227f8ab1a03",
      "short": "a3da3a6",
      "auteur": "Orangentleman",
      "date": "2026-05-30T00:52:18+02:00",
      "sujet": "docs : rafraîchir README et CLAUDE.md (quiz, PWA, agrégateur)",
      "corps": "Le README décrit désormais le mode révision (quiz Leitner), la PWA\nhors-ligne, le glossaire de concepts, les liens dynamiques et le flux de\ncontribution. CLAUDE.md retire la section quiz « À IMPLÉMENTER » devenue\ncaduque (remplacée par la section décrivant l'implémentation réelle).\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>",
      "tag": "docs"
    },
    {
      "hash": "37fde8d86738913c317f0685295810be45a736e4",
      "short": "37fde8d",
      "auteur": "Orangentleman",
      "date": "2026-05-30T00:52:09+02:00",
      "sujet": "Backend 4 : bouton « Envoyer en ligne » dans la modale de contribution",
      "corps": "La proposition est postée sur la boîte aux lettres en ligne (route\npublique de PythonAnywhere). En cas d'échec (hors-ligne, service\nendormi…), le bouton invite à réessayer et l'envoi par e-mail (mailto)\nreste disponible en repli. Aucun envoi n'écrit dans data.js.\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>",
      "tag": "Backend 4"
    },
    {
      "hash": "3f49ce3cbc73f71994fb0ee374ce2c998f6b4eb6",
      "short": "3f49ce3",
      "auteur": "Orangentleman",
      "date": "2026-05-30T00:51:59+02:00",
      "sujet": "Backend 3 : cerveau local (pull + relecture Gemini + dashboard Flask)",
      "corps": "Récupère les propositions de la boîte aux lettres en ligne, les ingère\nen base, les fait pré-vérifier par Gemini, puis les trie dans un tableau\nde bord local — sans jamais écrire dans data.js (juste un changement de\nstatut). Le cœur de l'agrégateur reste en stdlib ; seules review et\ndashboard ajoutent des dépendances.\n\n- localenv.py     lecture minimale du .env (stdlib)\n- mailbox_client.py  client HTTP urllib (pull/ack)\n- pipeline.py     orchestration pull -> ingestion -> ack\n- review.py       relecture IA Gemini (verdict par boîte)\n- dashboard.py    tableau de bord local Flask (127.0.0.1)\n- db.py           get_unreviewed_boxes()\n- ingest.py       quarantine_text() pour les pulls malformés\n- aggregate.py    sous-commandes pull / review / dashboard\n- .env.example, requirements.txt, .gitignore, README mis à jour\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>",
      "tag": "Backend 3"
    },
    {
      "hash": "9a8b698af2f422563ac7d018052b5a9707811b51",
      "short": "9a8b698",
      "auteur": "Orangentleman",
      "date": "2026-05-29T22:55:24+02:00",
      "sujet": "réorganisation des dossier",
      "corps": "",
      "tag": ""
    },
    {
      "hash": "280aff90c3a4ba35b7e4d63cfaf15730b3b5928b",
      "short": "280aff9",
      "auteur": "Orangentleman",
      "date": "2026-05-29T22:51:40+02:00",
      "sujet": "Backend : fondation (statut validee, colonnes IA) + boite aux lettres Flask",
      "corps": "- philo-aggregator : nouveau statut 'validee', colonnes ai_verdict/ai_review/\n  ai_reviewed_at (migration idempotente), constante AI_VERDICTS, helper\n  set_ai_review(), et coeur d'ingestion reutilisable ingest_text().\n- philo-mailbox : serveur Flask minimal (app.py) qui encaisse les propositions\n  du site ; routes pull/ack protegees par un secret ; anti-spam (taille,\n  marqueurs, debit par IP) et CORS. Stockage SQLite (store.py), utilitaires\n  sans dependance (util.py), requirements et README de deploiement.\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>",
      "tag": "Backend"
    },
    {
      "hash": "0fa046cc50883131d0f02688b411e0936829a2e5",
      "short": "0fa046c",
      "auteur": "Orangentleman",
      "date": "2026-05-29T20:44:14+02:00",
      "sujet": "Merge branch 'main' of https://github.com/Orangetleman/Philosophie-web-page",
      "corps": "",
      "tag": "Merge branch 'main' of https"
    },
    {
      "hash": "e3c14f52b113dcaa243300e253764651dfb46b05",
      "short": "e3c14f5",
      "auteur": "Orangentleman",
      "date": "2026-05-29T20:41:39+02:00",
      "sujet": "Update CLAUDE.md",
      "corps": "",
      "tag": ""
    },
    {
      "hash": "880515ff76ff64116a5e0565bac5407e80d3c2f8",
      "short": "880515f",
      "auteur": "Orangentleman",
      "date": "2026-05-29T20:32:15+02:00",
      "sujet": "Merge pull request #3 from Orangetleman/claude/elegant-lovelace-4d093e",
      "corps": "Mode révision active (quiz) + extraction des données dans data.js",
      "tag": ""
    },
    {
      "hash": "723d749894fce8f0b1224799e760993c4abca7ae",
      "short": "723d749",
      "auteur": "Orangentleman",
      "date": "2026-05-29T20:27:27+02:00",
      "sujet": "Mode révision active (quiz) + extraction des données dans data.js",
      "corps": "Deux chantiers liés. (A) Les données du site (D, KEYS, AM, CONCEPTS) sont\nsorties d'index.html vers un fichier data.js chargé avant le script principal,\npour alléger et isoler le contenu de la logique. (B) Ajout d'un mode de\nrévision active type Quizlet/Anki, dérivé entièrement des données existantes.\n\nMode quiz (overlay « 🎯 Réviser », section JS « K. ») :\n- Cartes dérivées de CONCEPTS/D/AI (5 types : concept↔déf, citation↔auteur,\n  notion→auteurs) ; ids stables servant de clé de progression.\n- Moteur Leitner à double horizon (Sprint ≈2 sem. / Long terme ≈2 mois),\n  progression séparée, persistée dans localStorage (philo-quiz).\n- Formats Cartes (flip 3D) et QCM ; flip permet de revenir lire la question\n  après avoir vu la réponse, boutons ❌/✅ placés sous la carte.\n- Gamification : XP + niveau (bonus de promotion/maîtrise), barre de niveau,\n  récap de fin (XP gagnés, cartes en progrès, nouvelles maîtrisées, montée).\n- Objectif quotidien réglable + barre du jour, série (streak), badges,\n  barres de maîtrise par notion.\n- Filtres multi-sélection (notions/types/ratés : OU intra, ET inter).\n- Reprise de session : la session en cours est sérialisée (active) et survit\n  à un refresh ; avertissement avant d'en démarrer une nouvelle, avec\n  « ne plus afficher ».\n- Clarté : vocabulaire « palier de mémorisation » (au lieu de « boîte »),\n  encadrés d'aide repliables (fonctionnement de la révision, conditions de\n  sauvegarde de la progression).\n- Deux réinitialisations : rythme courant seul (niveau/XP conservés) ou tout.\n\nHors-ligne : sw.js passe en philo-v2 et précache data.js (sinon le cache\nservirait un index.html privé de ses données). CLAUDE.md mis à jour\n(architecture data.js, section Mode quiz, vocabulaire UI).\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>",
      "tag": ""
    },
    {
      "hash": "190022f3db57ca5d18005ed912d13fd1701e55cf",
      "short": "190022f",
      "auteur": "Orangentleman",
      "date": "2026-05-27T22:28:27+02:00",
      "sujet": "Create cours_manuscrits_6.docx",
      "corps": "",
      "tag": ""
    },
    {
      "hash": "9fd700c75b868d886571205f76b2e55c4b854c0a",
      "short": "9fd700c",
      "auteur": "Orangentleman",
      "date": "2026-05-27T22:27:40+02:00",
      "sujet": "Merge pull request #2 from Orangetleman/claude/quizzical-heyrovsky-f2ab6f",
      "corps": "Cours manuscrits 6 : enrichissement Religion / Science / Vérité + act…",
      "tag": ""
    },
    {
      "hash": "84a0114581bcd57233032c129505ad214e21bb77",
      "short": "84a0114",
      "auteur": "Orangentleman",
      "date": "2026-05-27T22:24:44+02:00",
      "sujet": "Cours manuscrits 6 : enrichissement Religion / Science / Vérité + actualité (Nietzsche, Marx, Freud)",
      "corps": "Extraction du fichier `cours_manuscrits_6.docx` (16 images : 6 pages\nmanuscrites du plan Religion + 10 articles du *1 Hebdo* et autres\nrevues). Ajouts pour intégrer ces sources à la base, avec mises à jour\nciblées des notions concernées.\n\n────────────────────────────────────────────────────────────\n📚 +12 CONCEPTS DE GLOSSAIRE (tous new:true, relations unifiées)\n────────────────────────────────────────────────────────────\n• Nietzsche & post-modernité : post-vérité, ressentiment,\n  transvaluation-valeurs, surhumain (Übermensch), grégarité.\n• Philosophie de la religion : fonction-fabulatrice (Bergson),\n  religion-statique-dynamique (Bergson), culte-morale (Kant),\n  pastafarisme, maitres-soupcon (Ricœur).\n• Épistémologie : effet-barnum (critique des pseudo-sciences).\n• Sociologie contemporaine : consommation-opium (Lipovetsky).\n\n────────────────────────────────────────────────────────────\n👤 +9 AUTEURS À AM\n────────────────────────────────────────────────────────────\n• Religion / sociologie : Lipovetsky (« nouvel opium »), Comte\n  (positivisme, loi des trois états — déjà référencé dans dialogues\n  mais sans fiche).\n• Psychanalyse contemporaine : Tisseron (« Œdipe a laissé place à\n  Narcisse »), Leguil (énigme du traumatisme), Ansermet (pulsion de\n  mort & neurosciences).\n• Sociologie du travail : Linhart (taylorisme individualisé), Méda\n  (travail face au climat), Perez (IA & concertation), Palier (sortir\n  du « low cost »).\n\n────────────────────────────────────────────────────────────\n🔬 NOTIONS ENRICHIES (toutes additions marquées new:true)\n────────────────────────────────────────────────────────────\n• Religion : +Bergson (fonction fabulatrice), Lipovetsky (consommation\n  = nouvel opium), Comte (loi des trois états) ; 3 nouveaux textes\n  (Lipovetsky, Bergson, maîtres du soupçon) ; 5 nouveaux exemples\n  (pastafarisme + théière, consommation, fonction fabulatrice, charge\n  de la preuve, maîtres du soupçon) ; +2 questions de dissertation.\n• Science : +Bachelard (IA comme nouvel obstacle épistémologique) ; 5\n  nouveaux exemples (effet Barnum, Russell *Essais sceptiques* 1928,\n  Bachelard sur IA, induction/déduction) ; +2 dissertations.\n• Vérité : Nietzsche convertie en multi-idées (perspectivisme +\n  post-vérité comme héritage nietzschéen lu via Salanevris) ; nouvel\n  exemple « post-vérité, héritage nietzschéen ? » ; +2 dissertations.\n• Langage : Cassin convertie en multi-idées (intraduisibles + Trump /\n  Poutine et brutalisation langagière) ; 3 nouveaux exemples (Cassin,\n  société qui cherche ses mots, Weil sur les limites de la liberté\n  d'expression).\n• Inconscient (refonte majeure — la notion était quasi-vide) : Freud\n  convertie en multi-idées (rêves + guerre comme retour du refoulé) ;\n  Tisseron & Leguil ajoutés ; 3 nouveaux textes ; 3 axes de\n  dissertation complets ; 3 nouveaux exemples ; +4 dissertations ;\n  nouvelle section « D'Œdipe à Narcisse » dans la définition\n  enrichie ; ajout de Langage et Religion dans les liens.\n• État : 3 nouveaux exemples (cacophonie des valeurs, tyrannie du\n  like, ressentiment) + lien Vérité + 3 dissertations.\n• Travail : 5 nouveaux exemples (Linhart, Méda, Perez, Palier,\n  Lipovetsky) + liens Nature & Bonheur + 3 dissertations.\n• Liberté : nouvel exemple sur la grégarité (Floccari / esprit libre\n  nietzschéen) + lien Vérité.\n• Bonheur : nouvel exemple « Lipovetsky — Le bonheur paradoxal » +\n  lien Religion + 1 dissertation.\n\n────────────────────────────────────────────────────────────\n🧹 NETTOYAGE\n────────────────────────────────────────────────────────────\n• Retrait des 289 anciens new:true sur les éléments inchangés depuis\n  HEAD — seuls les véritables ajouts de ce commit portent désormais\n  le drapeau new:true (61 sur 351 occurrences au total).\n• Syntaxe JS vérifiée avec node --check après chaque édition.\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>",
      "tag": "Cours manuscrits 6"
    },
    {
      "hash": "f1063397941e619bdf4d71cd36be7412f4a2055f",
      "short": "f106339",
      "auteur": "Orangentleman",
      "date": "2026-05-27T17:29:16+02:00",
      "sujet": "fix(mobile): topbar — burger inline avec le fil d'Ariane + onglets scrollables horizontalement",
      "corps": "• Le burger flottait en position:fixed et chevauchait la zone des\n  crumbs/tabs (trou visuel en L, contenu poussé à 60px). Il est\n  désormais inline dans une nouvelle bande .topbar (flex row :\n  burger + crumbs sur la même ligne), taille réduite à 32px.\n• Les onglets de notion (Auteurs / Textes / Concepts / Dissertations\n  / Exemples) débordaient et étaient inaccessibles sur 360px. Ils\n  scrollent maintenant horizontalement (overflow-x:auto + nowrap),\n  scrollbar masquée pour le rendu propre — tous accessibles par swipe.\n• Padding-left des crumbs / tabs réduit (plus besoin de contourner le\n  burger : il est dans le flux).",
      "tag": "fix(mobile)"
    },
    {
      "hash": "b7bb6b805ac3528f08caa015f84532f5188c37a6",
      "short": "b7bb6b8",
      "auteur": "Orangentleman",
      "date": "2026-05-26T21:07:42+02:00",
      "sujet": "Responsive mobile + fil d'Ariane + PWA hors-ligne + mode révision + onboarding Chantier ergonomie : le site était desktop-only et passif. Cette série le rend (a) utilisable sur téléphone, (b) navigable en 1 clic à tous les niveaux, (c) installable / fonctionnel hors-ligne, et (d) adapté aux deux publics (élève vs mainteneur).",
      "corps": "────────────────────────────────────────────────────────────\n📱 RESPONSIVE — MOBILE FIRST (≤ 700 px)\n────────────────────────────────────────────────────────────\n• Sidebar transformée en TIROIR : position fixed, hors-écran par\n  défaut, révélée par un bouton burger ☰ (top-left fixed, z-index 200).\n• Voile assombri (.sb-backdrop) ferme le tiroir au clic ; touche Échap\n  idem ; sélection d'une notion/auteur/concept ferme automatiquement\n  le tiroir (uniquement sur mobile, détecté par window.innerWidth).\n• Main panel pleine largeur, paddings réduits, place laissée pour le\n  burger dans .crumbs et .tabs (padding-left:60px).\n• Cibles tactiles élargies : .pplus 28px, .pplus-cat +padding.\n• Cartes auteur en COLONNE UNIQUE (au lieu de la grille).\n• Modale de contribution PLEIN ÉCRAN sur mobile.\n• Body height en 100dvh (avec fallback 100vh) pour éviter le bug de\n  la barre d'URL iOS Safari qui rogne le viewport.\n────────────────────────────────────────────────────────────\n🧭 FIL D'ARIANE CLIQUABLE (style explorateur Windows)\n────────────────────────────────────────────────────────────\n• Nouveau bloc .crumbs au-dessus de la barre d'onglets, alimenté par\n  renderCrumbs() à chaque rendu de contenu.\n• Chaque segment ramène à son niveau de hiérarchie en 1 clic\n  (mode → item → onglet → sous-onglet). Segment courant inerte (gras).\n• Couvre les 4 chemins :\n   · Notions › <notion> › <onglet> (Auteurs/Textes/Concepts/Dissert/Exemples)\n   · Notions › <notion> › Concepts › Liens entre concepts (sous-onglet)\n   · Auteurs › <auteur> › <onglet> (Idées/Citations/Œuvres/Dialogues)\n   · Concepts › <concept>\n• Délégation des clics propre (un écouteur unique, data-act/data-arg).\n• Nouvelle fonction goMode(mode) — bascule cohérente entre les 3 modes\n  de la sidebar (réutilisée par les crumbs).\n• Chaque saut pousse l'historique (pushHistory) → la flèche retour\n  continue de fonctionner.\n────────────────────────────────────────────────────────────\n📲 PWA — INSTALLABLE & HORS-LIGNE\n────────────────────────────────────────────────────────────\n• Nouveaux fichiers : manifest.json, sw.js, icon.svg.\n• <link rel=\"manifest\"> + <meta name=\"theme-color\"> + apple-touch-icon\n  ajoutés au <head> de index.html.\n• Service worker enregistré au load (cache-first) :\n   · précache : index, manifest, icône ;\n   · même origine + Google Fonts mis en cache à la volée ;\n   · réseau coupé en navigation → fallback sur index.html en cache ;\n   · skipWaiting + clients.claim → activation immédiate à la maj.\n• Résultat : le site fonctionne à 100 % hors-ligne et est installable\n  comme application (Android Chrome, desktop Chrome ; iOS Safari avec\n  les limites habituelles).\n────────────────────────────────────────────────────────────\n👁 MODE RÉVISION / ÉDITION (persisté en localStorage)\n────────────────────────────────────────────────────────────\n• Par DÉFAUT « révision » (élève) : rendu épuré.\n  Cachés via CSS (body:not(.mode-edition)) : .new-badge, .modified-badge,\n  .pplus, .pplus-catwrap, .sb-propose.\n• Mode « édition » (mainteneur) : tout est révélé.\n• Toggle .sb-mode persistant en bas de la sidebar (créé une fois par\n  renderSB, comme .sb-propose). Libellé dynamique :\n   · « 👁 Mode révision »  (état actuel : révision, clic → édition)\n   · « ✎ Mode édition »   (état actuel : édition, clic → révision)\n• Préférence stockée dans localStorage 'philo-mode' — survit aux\n  rechargements et fermetures du navigateur. Pur frontend, zéro serveur.\n────────────────────────────────────────────────────────────\n✨ ONBOARDING — 1ʳᵉ VISITE\n────────────────────────────────────────────────────────────\n• Overlay centré (.onb-overlay) affiché UNE seule fois (drapeau\n  localStorage 'philo-onboarded'). 4 conseils numérotés :\n   1. trois modes en haut de sidebar (Notions/Auteurs/Concepts) ;\n   2. termes colorés cliquables (graphe de liens dynamiques) ;\n   3. fil d'Ariane pour revenir à n'importe quel niveau ;\n   4. bouton ☰ sur téléphone.\n• Bouton « C'est parti » marque le drapeau et masque l'overlay.\n────────────────────────────────────────────────────────────\n🔧 DIVERS\n────────────────────────────────────────────────────────────\n• Fix CSS : .crel-card ajouté à la liste hover-reveal des .pplus\n  (les + des cartes de relation étaient invisibles sur souris).\n• pPlusCat accepte désormais un 5e paramètre ref (optionnel) →\n  permet de pré-remplir le concept source quand on propose un lien\n  depuis la fiche d'un concept.\n• Section « Relations & distinctions » de la fiche concept toujours\n  affichée (même vide) + bouton « + Proposer un lien » en bas + « + »\n  par carte de relation.",
      "tag": ""
    },
    {
      "hash": "ce53751560e4a188aa17a78f22a574e9bfaec19f",
      "short": "ce53751",
      "auteur": "Orangentleman",
      "date": "2026-05-25T21:57:43+02:00",
      "sujet": "Refonte de la contribution (menu hiérarchique) + citations multiples, relations unifiées & enrichissement des concepts Quatre chantiers depuis le dernier commit : (A) refonte du système de contribution en menu à 3 niveaux, (B) citations multiples par idée, (C) unification des relations de concepts + sous-onglets, (D) +28 concepts. Schéma de contribution passé en v3, agrégateur et docs mis à jour.",
      "corps": "────────────────────────────────────────────────────────────\n🧭 REFONTE DU SYSTÈME DE CONTRIBUTION\n────────────────────────────────────────────────────────────\n• Menu à 2 niveaux + action (au lieu d'une cible à plat) :\n   · Catégorie : Notion / Auteur / Concept ;\n   · Préciser (sous-cible) en cascade — Notion → définition / texte /\n     plan / sujet / exemple ; Auteur → idée-œuvre / citation / dialogue /\n     biographie ; Concept → définition / relation ;\n   · Action : Ajout / Correction / Remarque.\n  Modèle de boîte {categorie, cible, type, f} ; PROPOSAL_SOUSCIBLES +\n  CIBLE_CAT/cibleCat() ; renderBoxFields dispatche par (cat × cible × type).\n• Auteur multi-notions : box.f.ideas[] où chaque idée porte SA notion\n  (sélecteur par bloc) + œuvre/date/idée + citations[] + concepts.\n  « + Ajouter une idée » ; en correction, case « Retirer cette idée /\n  notion » + justification.\n• Remarque ADAPTÉE à la cible (notion / nom d'auteur / concept) au lieu\n  d'un champ générique « élément concerné ».\n• Nouvelles sous-cibles : Citation (simple, rattachée ou autonome),\n  Dialogue (AM[].dialogues[]), Biographie (AM[]), Relation de concept.\n• Ouverture intelligente : tout « + » / « Proposer… » fait défiler la\n  modale jusqu'à la boîte concernée et la met brièvement en surbrillance.\n────────────────────────────────────────────────────────────\n📎 CITATIONS MULTIPLES PAR IDÉE\n────────────────────────────────────────────────────────────\n• Modèle d'idée : citations:[] (0..N) remplace le q unique.\n  normalizeAuthor() migre l'ancien q → citations:[q] au chargement\n  (aucune donnée réécrite à la main).\n• Affichage : 1re citation visible + déroulant pour les suivantes\n  (carte idée, onglet Auteurs d'une notion ET fiche auteur) ; l'onglet\n  Citations liste TOUTES les citations. Une idée sans texte = citation\n  simple.\n────────────────────────────────────────────────────────────\n🔗 CONCEPTS — RELATIONS UNIFIÉES & SOUS-ONGLETS\n────────────────────────────────────────────────────────────\n• Fusion tensions → relations : un seul système relations:[{to|term,\n  type, desc}]. normalizeConcepts() convertit les anciennes tensions en\n  relations de type « distinction ». Tout passe par linkTerms → fini le\n  texte mort (les termes deviennent cliquables s'ils sont fichés).\n  Types : oppose / prolonge / complete / repond / distinction / implique.\n• Fiche concept : section unique « Relations & distinctions » (sortantes\n  + entrantes calculées), affichée même si vide.\n• Onglet Concepts d'une notion : 2 sous-onglets — « Concepts liés » /\n  « Liens entre concepts » (plus besoin de scroller jusqu'en bas).\n• Boutons « + » sur les cartes de relation et « + Proposer un lien »\n  (pré-remplit le concept source) dans les deux endroits.\n────────────────────────────────────────────────────────────\n📚 CONTENU\n────────────────────────────────────────────────────────────\n• +28 concepts de glossaire (tous new:true, avec définition niveau\n  Terminale ET relations) : scepticisme, épochè, scientisme, concordisme,\n  relativisme, universalisme, dualisme, monisme, matérialisme, idéalisme,\n  métaphysique, finalité, mécanisme, immanence, contingence/nécessité,\n  nihilisme, providence, laïcité, utilitarisme, hédonisme, idéologie,\n  réification, maïeutique, humanisme, finitude, sublimation,\n  a priori / a posteriori, inné / acquis.\n────────────────────────────────────────────────────────────\n🧰 SCHÉMA v3 & AGRÉGATEUR\n────────────────────────────────────────────────────────────\n• Schéma de contribution « philo-proposal/v3 » : boîtes {categorie,\n  cible, type, fields}. Auteur → fields.ideas[] {notion, oeuvre, date,\n  idee, citations[], concepts}. generateAjout groupe les idées par notion.\n• philo-aggregator : lit v1/v2/v3 (rétro-compat des anciens .txt).\n   · db.py : CATEGORIES + sous-cibles (auteur-citation/-dialogue/-bio,\n     concept-relation) ;\n   · ingest.py : extract_notions auteur lit ideas[].notion ;\n   · view.py / export.py : rendu des idées multi-notions + nouvelles\n     sous-cibles, regroupement par section.\n────────────────────────────────────────────────────────────\n🖥 UX & CORRECTIFS\n────────────────────────────────────────────────────────────\n• Fix : les « + » des cartes de relation (.crel-card) étaient masqués —\n  ajout au survol révélé par CSS.\n• Compteurs sidebar toujours affichés (« N auteurs / concepts », ou\n  « X / N » sous filtre).\n• Suppression des aperçus tronqués « … » (définitions de concepts,\n  sous-parties de plans migrés affichées en entier).\n• Nouveau CSS : .subtabs, .pidea/.pcites/.pcite-row, .aq-details,\n  .crel-distinction/.crel-implique, .pbox-flash.\n────────────────────────────────────────────────────────────\n📄 DOCS\n────────────────────────────────────────────────────────────\n• CLAUDE.md & philo-aggregator/README.md : modèle de boîte\n  catégorie/sous-cible, schéma v3, idées citations[], relations unifiées.",
      "tag": ""
    },
    {
      "hash": "22d1e18cbee28e50239ff567bb9122bf6a0e7dc8",
      "short": "22d1e18",
      "auteur": "Orangentleman",
      "date": "2026-05-23T13:42:02+02:00",
      "sujet": "Ajout .gitignore (réglages locaux Claude Code, worktrees, caches Python)",
      "corps": "Évite que .claude/settings.local.json (permissions propres à la machine),\nles worktrees temporaires et les __pycache__ apparaissent comme des\nchangements à publier.\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>",
      "tag": ""
    },
    {
      "hash": "24a886a0b5694771c255944a750059b86cd20efb",
      "short": "24a886a",
      "auteur": "Orangentleman",
      "date": "2026-05-23T13:01:42+02:00",
      "sujet": "Idées multiples par auteur, onglets Concepts & Dissertations Quatre chantiers depuis le dernier commit, plus la mise à jour de la doc et de l'agrégateur.",
      "corps": "(A) Idées multiples par auteur\n- Format auteur : {n,w,i,q} → {n, ideas:[{w,i,q, new?, modified?}, …]}.\n  Un même auteur peut porter plusieurs idées (œuvres/angles) sur une\n  même notion.\n- normalizeAuthor()/normalizeD() convertissent l'ancien format à plat\n  au chargement : aucune entrée existante n'a été réécrite (diff\n  minimal).\n- buildAI() fusionne les idées si un auteur apparaît plusieurs fois\n  dans une même notion.\n- Rendu adapté : onglet Auteurs d'une notion (cartes empilant les\n  idées) et fiche auteur (onglets Idées / Citations / Œuvres itèrent\n  sur ideas[]).\n- Modale de contribution : bouton « + Ajouter une idée », N idées par\n  boîte cible auteur (ensureIdeas/addProposalIdea/removeProposalIdea/\n  setIdeaF + pIdeaField).\n- Schéma de contribution bumpé philo-proposal/v1 → v2 (fields.ideas[]).\n(B) Onglet Concepts dans les notions\n- Nouvel onglet « Concepts » : liste tous les concepts liés à une\n  notion, indépendamment d'un auteur. Champ liens:{<notion>:\"…\"} pour\n  expliciter le rapport concept ↔ notion.\n- Relations concept ↔ concept : champ relations:[{to,type,desc}] ;\n  bloc « Liens entre concepts » dans la notion + section relations sur\n  la fiche concept.\n- Enrichissement de CONCEPTS (religiosité du savant/de l'homme simple,\n  épochè sceptique, NOMA, etc.).\n(C) Refonte « Axes » → onglet « Dissertations »\n- Les axes deviennent des plans complets : un bloc = une problématique\n  (intro de problématisation + pb) structurée en 3 axes (I thèse,\n  II réflexion, III redéfinition).\n- Structure plan : {q, intro, pb, axes:[{t, sps:[{t,args,auteurs,ref,\n  limite}], limite}]}. Sous-parties déroulables (arguments, auteurs\n  cités, référence, mini-limite) + limite marquée en fin d'axe.\n- Migration auto des anciens axes vers plans au chargement\n  (sous-parties sans titre rendues en entier).\n- Plan de démonstration « Science et religion s'opposent-elles ? ».\n- Modale de contribution étendue aux cibles concept et plan.\n(D) Corrections d'affichage\n- Suppression des aperçus tronqués « … » : définitions de concepts et\n  sous-parties de plans migrés affichées en entier.\n- Compteurs toujours visibles dans la sidebar : « N auteurs » /\n  « N concepts » par défaut, « X / N » quand un filtre est actif.\nAgrégateur (philo-aggregator) & doc\n- ingest.py : accepte les schémas v1 ET v2 (rétrocompat des anciens\n  .txt).\n- view.py / export.py : rendu du tableau ideas[] (cible auteur v2).\n- db.py : cible 'plan' ajoutée ('axe' conservée pour les .txt v1).\n- CLAUDE.md & README : structures auteur/concept/plan et schéma v2 à\n  jour.\nSyntaxe JS et Python vérifiées.",
      "tag": ""
    },
    {
      "hash": "ec2d4add3c5ea44984a5dee28ae3a0167aa0da6c",
      "short": "ec2d4ad",
      "auteur": "Orangentleman",
      "date": "2026-05-21T20:37:39+02:00",
      "sujet": "ajout favicon temple antique",
      "corps": "",
      "tag": ""
    },
    {
      "hash": "7b90dbc6fd5c1083f89f8c2c415266966faf4837",
      "short": "7b90dbc",
      "auteur": "Orangentleman",
      "date": "2026-05-20T23:54:43+02:00",
      "sujet": "Changement d'adresse mail",
      "corps": "",
      "tag": ""
    },
    {
      "hash": "bb04ebfb3d463d582cd151a12c7a43570b81f302",
      "short": "bb04ebf",
      "auteur": "Orangentleman",
      "date": "2026-05-20T22:02:04+02:00",
      "sujet": "Merge pull request #1 from Orangetleman/claude/focused-chatelet-c87fdc",
      "corps": "ajout du programme d'agrégation des propositions (philo-aggregator)",
      "tag": ""
    },
    {
      "hash": "9750e4271bd8c6bd1d70f2b051b7aced6ac8d904",
      "short": "9750e42",
      "auteur": "Orangentleman",
      "date": "2026-05-20T16:29:13+02:00",
      "sujet": "ajout du programme d'agrégation des propositions (philo-aggregator)",
      "corps": "Outil Python en ligne de commande qui ingère les .txt envoyés par le\nformulaire de contribution du site, stocke chaque boîte de proposition\ndans une base SQLite locale, et génère un rapport de revue prêt à\ncoller dans Claude pour l'intégration manuelle dans index.html.\n\nCommandes : ingest, list, show, dupes, export, mark, note, archive,\npurge, stats. Trois sections calquées sur les onglets du site\n(Notions / Auteurs / Concepts). Détection de doublons en deux passes :\nsignature SHA-256 sur (type, cible, notion, key_term) normalisés, puis\nfuzzy difflib + inclusion de noms.\n\nStdlib uniquement, aucune dépendance externe.\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>",
      "tag": ""
    },
    {
      "hash": "32de4732d0cf1a7dedf44dca9b333d67c95b5ce2",
      "short": "32de473",
      "auteur": "Orangentleman",
      "date": "2026-05-19T23:09:26+02:00",
      "sujet": "fix bugs UI et fix bug notion proposition",
      "corps": "fix bug sur l'interface de contribution qui se ferme simplement lors d'un lâchement de souris\nfix bug notions qui ne s'enregistre pas lorsqu'on veut modifier/ajouter un concept",
      "tag": ""
    },
    {
      "hash": "848cdc1881ae84fd09b02b874f809a7df607628c",
      "short": "848cdc1",
      "auteur": "Orangentleman",
      "date": "2026-05-19T19:29:30+02:00",
      "sujet": "interface de contribution + refonte du moteur de liens dynamiques Deux grands chantiers depuis le dernier commit : (A) corrections et refonte du moteur liens/recherche/tri, (B) nouvelle fonctionnalité de contribution (modale de proposition + génération + envoi).",
      "corps": "────────────────────────────────────────────────────────────\n🐛 CORRECTIONS & REFONTE\n────────────────────────────────────────────────────────────\n• Tri des concepts (sidebar) : la cause du désordre était des clés de\n  notion invalides en données — 'liberté' (×30) corrigé en 'liberte',\n  clé 'droit' (inexistante) retirée. Tri par nombre de notions\n  traitées, rendu défensif (ne compte que les notions valides).\n• Recherche Auteurs/Concepts : limitée au nom / terme (ne fouille plus\n  le courant ni les définitions — fini les faux résultats type\n  « po » → Hannah Arendt).\n• Moteur de liens dynamiques (linkTerms) :\n   · bornes accentuées corrigées (\\b → lookarounds) — 14 concepts\n     (Vérité, État, Épistémé…) ne se liaient jamais ;\n   · texte hors balises corrigé — le texte après la dernière balise\n     n'était jamais lié (auteurs cités non cliquables) ;\n   · liens typés : .cterm (concept) · .aterm (auteur) · .nterm\n     (notion, couleur de la notion) ;\n   · auto-détection des auteurs dans tout le texte.\n• CONCEPT_TO_NOTION : 'notion-science'→'science',\n  'notion-liberté'→'liberte' (redirections cassées réparées).\n• Nettoyage : 114 références internes « (cours p.xx) » et variantes\n  supprimées (titres d'ouvrages et libellés d'interface préservés).\n• Barres de défilement assorties au thème sombre.\n────────────────────────────────────────────────────────────\n📚 CONTENU\n────────────────────────────────────────────────────────────\n• +2 concepts de glossaire : Rationalisme, Empirisme.\n────────────────────────────────────────────────────────────\n✨ FONCTIONNALITÉ DE CONTRIBUTION\n────────────────────────────────────────────────────────────\n• Bouton « 💡 Proposer du contenu » intégré à la sidebar.\n• Modale fermable (croix / clic extérieur / Échap).\n• Système de « boîtes » empilables — chacune : menu Type\n  (Ajout / Correction / Remarque) + menu Cible (7 cibles).\n• Champs réels par (Type × Cible), obligatoires/facultatifs, avec\n  vérification d'auteur existant (sous-formulaire « nouvel auteur »\n  conditionnel) et catégories d'exemples consolidées.\n• Boutons « + » contextuels : sur chaque carte (vues notion + auteur\n  + fiche concept) → Correction pré-ciblée ; en bas de chaque\n  catégorie → Ajout pré-rempli. Mobile-proof (survol sur souris,\n  permanents sur tactile).\n• Génération : partie lisible + bloc JSON délimité\n  (« philo-proposal/v1 ») pour un futur programme d'agrégation.\n• Aperçu avant envoi · Copier le texte · Envoyer par email (mailto:).\n────────────────────────────────────────────────────────────\n🖥 INTERFACE & UX\n────────────────────────────────────────────────────────────\n• Nouveau CSS : .sb-propose, .modal-*, .pbox/.pfield/.psel,\n  .pplus/.pplus-cat, .pbtn, .ppreview, scrollbars sombres.\n• Nouvelle section JS commentée « J. INTERFACE DE CONTRIBUTION »,\n  moteur de liens étendu, fonction openNotion().\n• Création de CLAUDE.md (règles du projet, structures de données).",
      "tag": ""
    },
    {
      "hash": "33df83ad9b17838e01398439e25273c6f3ea9334",
      "short": "33df83a",
      "auteur": "Orangentleman",
      "date": "2026-05-17T14:45:51+02:00",
      "sujet": "Séance 13 — complétion Raison + enrichissement Science/Religion/Vérité Intégration du polycopié « Science et religion s'opposent-elles nécessairement ? » (cours_manuscrits_..._5.pdf, Séance 13). Tout le contenu ajouté porte le marqueur new:true.",
      "corps": "────────────────────────────────────────────────────────────\n📚 CONTENU & LOGIQUE\n────────────────────────────────────────────────────────────\n🧠 Notion RAISON (auparavant vide → entièrement complétée)\n  • def enrichie : 5 sous-sections (rationnel/raisonnable,\n    induction/déduction, démonstration ≠ raisonnement,\n    raison instrumentale vs essentielle, limites)\n  • +6 auteurs : Aristote, Russell, Épicure, Épictète,\n                 Jonas, Hannah Arendt\n  • +5 textes (polycopié + Russell + références croisées)\n  • +4 axes complets · +6 exemples · +6 dissertations\n🔬 Notion SCIENCE\n  • +3 auteurs : Russell, Einstein, Gould (renforcé)\n  • +6 textes longs : Russell Science et religion (1935),\n    théière (1952), Kuhn paradigme, Popper falsifiabilité,\n    Einstein religiosité, Russell induction\n  • +4 exemples (théière, Copernic/Kuhn, Dieu de Spinoza…)\n✨ Notion VÉRITÉ\n  • +2 auteurs : Russell, William James\n  • +8 textes : correspondance/cohérence, James pragmatisme,\n    Nietzsche Gai Savoir §344, Russell, Kuhn, Popper\n  • +2 axes (double critère + savoir cache une croyance)\n  • +3 exemples (horloge de James, théière, etc.)\n🙏 Notion RELIGION\n  • +2 auteurs : Russell, Einstein\n  • +7 textes : théière, pari pascalien complet,\n    arguments cosmologique/téléologique/naturaliste,\n    Marx misère matérielle, Freud désirs, Bergson, Nietzsche\n  • +3 exemples (théière, Dieu de Spinoza, pari pascalien)\n────────────────────────────────────────────────────────────\n🗂  AUTEURS (const AM)\n────────────────────────────────────────────────────────────\n  + Bertrand Russell      (Principia, théière, induction)\n  + William James         (+ alias \"James\", pragmatisme)\n  + Einstein              (religiosité cosmique, Spinoza)\n────────────────────────────────────────────────────────────\n📖 GLOSSAIRE (+17 concepts)\n────────────────────────────────────────────────────────────\n  Logique           Induction · Déduction · Sophisme\n                    Principe de non-contradiction\n  Théorie vérité    Vérité-correspondance · Vérité-cohérence\n                    Vérité instrumentale · Pragmatisme\n  Épistémologie     Théière de Russell · Problème de l'induction\n  Théorie raison    Rationnel/Raisonnable · Raison instrumentale\n  Éthique antique   Métriopathie · Tetrapharmakon · Idée rude\n  Religion          Religiosité cosmique · Pari pascalien (décisionnel)\n────────────────────────────────────────────────────────────\n🖥  INTERFACE & UX\n────────────────────────────────────────────────────────────\n  • Aucune modification CSS/JS de rendu\n  • Tous les éléments ajoutés portent new:true → badge visuel\n    automatique (système existant) dans la sidebar et les fiches\n  • Liens dynamiques entre concepts/auteurs préservés\n    (linkTerms gère les nouveaux termes automatiquement)\n  • Structure de données inchangée — uniquement enrichissement\n    de D, AM et CONCEPTS\n────────────────────────────────────────────────────────────\n🐛 FIX\n────────────────────────────────────────────────────────────\n  • Échappement double-guillemets dans citation Pascal\n    (pari pascalien) : remplacement par guillemets typographiques\n    courbes pour préserver la validité JS",
      "tag": ""
    },
    {
      "hash": "e93f681b3b82a9e173e42ff1086c0af92d1df59d",
      "short": "e93f681",
      "auteur": "Orangentleman",
      "date": "2026-05-10T20:56:02+02:00",
      "sujet": "Update index.html",
      "corps": "",
      "tag": ""
    },
    {
      "hash": "7b6c7a7880d305767cdc41259f121c11320cf323",
      "short": "7b6c7a7",
      "auteur": "Orangentleman",
      "date": "2026-05-10T20:52:03+02:00",
      "sujet": "implémentation des modes de filtrage AND/OR pour les concepts",
      "corps": "📚 Contenu Pédagogique (Filtres)\n\nLogique de Recherche : Introduction du paramètre conceptFilterMode permettant de basculer entre une sélection large (\"OU\") et une sélection restrictive (\"ET\").\n\nPrécision Contextuelle : Ajout d'infobulles explicatives (title) sur les boutons de filtrage des auteurs pour une meilleure clarté pédagogique.\n\n🖥 Interface & UX\n\nSélecteur de Mode : Ajout de boutons UI dédiés pour basculer dynamiquement entre les modes 'OR' (par défaut) et 'AND'.\n\nMise à jour du Rendu : Optimisation de renderSBConceptsList pour filtrer les concepts soit par intersection totale (\"ET\"), soit par simple appartenance (\"OU\") aux notions sélectionnées.\n\nAccessibilité : Intégration de tooltips détaillés pour guider l'utilisateur dans l'utilisation des filtres complexes.",
      "tag": ""
    },
    {
      "hash": "8d4957d2ff9f7616184064b8384819551024630a",
      "short": "8d4957d",
      "auteur": "Orangentleman",
      "date": "2026-05-10T20:42:22+02:00",
      "sujet": "Update .gitignore",
      "corps": "",
      "tag": ""
    },
    {
      "hash": "7145ca0e4e2bfd482493281bdc79bfd1f9ab030b",
      "short": "7145ca0",
      "auteur": "Orangentleman",
      "date": "2026-05-10T20:42:04+02:00",
      "sujet": "enrichissement approfondi des notions Religion et Vérité et expansion du corpus",
      "corps": "📚 Contenu Pédagogique (Religion & Vérité)\n\nEnrichissement Théorique : Ajout des étymologies détaillées et des classifications pour les notions Religion et Vérité.\n\nIndex des Auteurs : Expansion massive des entrées pour les figures majeures : Augustin, Thomas d’Aquin, Descartes, Spinoza, Kant, Feuerbach, Marx, Kierkegaard, Durkheim et Bergson.\n\nExpansion du Corpus : Intégration de nouveaux textes et axes de réflexion, notamment l'Axe 4 sur la religion comme illusion.\n\nDissertation : Ajout de nombreux nouveaux sujets et questions de réflexion à la liste diss.\n\n📖 Glossaire & Concepts\n\nNouveaux Textes de Référence : Ajout d'analyses sur la réminiscence (Platon), Bachelard, Heidegger et Popper.\n\nIllustrations & Cas d'école : Développement de nouveaux exemples concrets pour soutenir les arguments des axes de dissertation.\n\nNavigation Sémantique : Mise à jour des liens internes entre les nouveaux textes et les auteurs correspondants.\n\n🖥 Interface & UX\n\nMaintenance du Dépôt : Ajout d'une entrée dupliquée dans le fichier .gitignore pour la gestion des fichiers locaux.\n\nRendu des Sujets : Optimisation de l'affichage des nouveaux prompts de discussion dans l'interface interactive.\n\nMise à jour Data : Synchronisation des métadonnées auteurs pour inclure les nouvelles références textuelles.",
      "tag": ""
    },
    {
      "hash": "c06c5ee2d80d56aa3d2a6cdfe2be2e47db8b5a36",
      "short": "c06c5ee",
      "auteur": "Orangentleman",
      "date": "2026-05-10T18:55:14+02:00",
      "sujet": "Update .gitignore",
      "corps": "",
      "tag": ""
    },
    {
      "hash": "45da734a392d285ae378edb03ca69e81a085e974",
      "short": "45da734",
      "auteur": "Orangentleman",
      "date": "2026-05-10T18:54:58+02:00",
      "sujet": "Create .gitignore",
      "corps": "",
      "tag": ""
    },
    {
      "hash": "71433fcd2d7a572ded573d55dcda3f32ca25414c",
      "short": "71433fc",
      "auteur": "Orangentleman",
      "date": "2026-05-10T18:54:23+02:00",
      "sujet": "Enrichissement des ressources PDF et expansion majeure : Langage, Religion & Science",
      "corps": "📚 Contenu Pédagogique (Notions & Auteurs)\n\nNouvelle Ressource : Intégration d'un nouveau PDF de cours manuscrit.\n\nExpansion du Langage : Ajout de développements sur le langage comme fin en soi, les fonctions poétiques/performatives et la co-construction entre langage et pensée.\n\nEnrichissement Morale & Raison : Développement des sections Religion et Science avec l'introduction de Platon (allégorie et raison) et Stephen Jay Gould (principe du NOMA).\n\nIndex des Auteurs (AM) : Extension de la base de données avec des figures littéraires et scientifiques : Tristan Tzara (Dadaïsme), André Breton, Georges Perec, Pascal et Georges Lemaître.\n\n📖 Glossaire & Concepts\n\nÉpistémologie & Histoire : Ajout d'exemples historiques structurants (l'affaire Galilée, l'origine du peer-review).\n\nProblématisation : Intégration de nouveaux axes de réflexion, textes de référence et exemples concrets pour les notions Science et Religion.\n\nSujets de Discussion : Ajout de nouvelles questions de dissertation et de liens contextuels pour enrichir le maillage de la base de données.\n\n🖥 Interface & UX\n\nMise à jour des Data Auteurs : Optimisation des métadonnées pour les nouveaux auteurs intégrés (Tristan Tzara, etc.).\n\nAmélioration du Maillage : Mise à jour des liens interactifs pour refléter les nouvelles problématiques ajoutées aux fiches de notions.\n\nMaintenance : Révisions mineures sur la cohérence des données auteurs existantes.",
      "tag": ""
    },
    {
      "hash": "edad53b59b9bd7df2497196e903678ecda3d9bc7",
      "short": "edad53b",
      "auteur": "Orangentleman",
      "date": "2026-05-04T20:49:08+02:00",
      "sujet": "Mise à jour de la documentation et corrections orthographiques dans index.html. Lien dynamique dans l'onglet Auteurs désormé présents",
      "corps": "",
      "tag": ""
    },
    {
      "hash": "33630fc4891ea6f42438339374fa281f306de058",
      "short": "33630fc",
      "auteur": "Orangentleman",
      "date": "2026-05-04T00:42:55+02:00",
      "sujet": "Fix système lien dynamique",
      "corps": "Un lien qui mènera à la page active ne sera plus rajouté à l'historique de navigation",
      "tag": ""
    },
    {
      "hash": "75bb95495740f75ddf8877a7bc83b37fecb76144",
      "short": "75bb954",
      "auteur": "Orangentleman",
      "date": "2026-05-03T18:29:24+02:00",
      "sujet": "intégration des badges de modification et système de navigation historique",
      "corps": "📚 Contenu Pédagogique (Suivi)\n\nIndicateurs de révision : Mise à jour des moteurs de rendu pour afficher un badge ✎ et appliquer la classe is-modified sur les notions, auteurs et textes.\n\nVisibilité des mises à jour : Marquage visuel étendu aux axes de réflexion, exemples et sujets de dissertation modifiés.\n\n📖 Glossaire & Concepts\n\nCohérence du lexique : Alignement du rendu des badges sur l'ensemble des éléments du glossaire pour une identification rapide des contenus enrichis.\n\nNavigation sémantique : Intégration des appels à l'historique avant chaque changement de vue pour préserver le contexte de recherche.\n\n🖥 Interface & UX\n\nBouton Retour intelligent : Implémentation d'une pile navHistory (limitée à 50 entrées) avec les fonctions pushHistory(), goBack() et updateBackBtn().\n\nDesign & Styles CSS : Création de variables CSS dédiées pour l'état \"modifié\" (couleurs, badges et styles de cartes) et injection du HTML du bouton retour dans les barres d'onglets.\n\nOptimisation de la navigation : Protection native contre les boucles de navigation infinies lors de l'exploration du graphe.",
      "tag": ""
    },
    {
      "hash": "a839abe76c3437690203016f1fad256fe3529376",
      "short": "a839abe",
      "auteur": "Orangentleman",
      "date": "2026-05-03T18:07:24+02:00",
      "sujet": "intégration de ressources PDF et corrections éditoriales globales",
      "corps": "📚 Contenu Pédagogique (Langage & Références)\n\nNouvelle Ressource : Ajout du document de référence cours_manuscrits_LANGAGE_4.pdf.\n\nPrécisions Historiques : Correction des dates clés, notamment pour Michel Serres (1990), La Boétie (1549), la constitution de l'Équateur (2008) et Schopenhauer (1819).\n\nClarification Chronologique : Distinction entre l'année de conférence et de publication pour les œuvres de Sartre.\n\n📖 Glossaire & Rectifications\n\nCorrections Orthographiques : Révision de termes techniques tels que \"indubitable\" et \"autoconscience\".\n\nRigueur Lexicale : Correction des titres d'œuvres et des noms propres à travers l'ensemble de l'objet D.\n\nUniformisation : Amélioration de la cohérence stylistique et des formulations dans les différentes entrées des notions.\n\n🖥 Interface & Maintenance\n\nJournal de Révision : Ajout d'un commentaire HTML en haut de fichier (index.html) résumant l'ensemble des corrections factuelles et orthographiques vérifiées.\n\nOptimisation des Données : Mise à jour de la structure interne pour refléter les corrections textuelles sans impacter les performances du script.",
      "tag": ""
    },
    {
      "hash": "b14fe2d0c7adf879a60aa644562897d5b19c483e",
      "short": "b14fe2d",
      "auteur": "Orangentleman",
      "date": "2026-05-02T00:29:43+02:00",
      "sujet": "Merge branch 'main' of https://github.com/Orangetleman/Philosophie-web-page",
      "corps": "",
      "tag": "Merge branch 'main' of https"
    },
    {
      "hash": "2f094087a0eb342da2d926fc0eb1b6c6750cd453",
      "short": "2f09408",
      "auteur": "Orangentleman",
      "date": "2026-05-02T00:29:22+02:00",
      "sujet": "ajout des notions de Terminale, mapping des concepts et intégration linkTerms",
      "corps": "intégration des notions de Terminale, mapping des concepts et navigation interactive\n\n📚 Contenu Pédagogique (Notions)\n\nExpansion Massive : Intégration de l'ensemble complet des 17 entrées \"Notion — Terminale\" dans la base de données.\n\nEnrichissement des Fiches : Ajout systématique des définitions, axes de dissertation, exemples et sujets de Bac pour chaque notion.\n\nBase d'Auteurs : Mise à jour des références incluant les œuvres majeures et les thèses clés (ex: de Platon à Arendt).\n\n📖 Glossaire & Concepts\n\nNouveau Lexique : Ajout de plusieurs concepts philosophiques essentiels au tableau CONCEPTS.\n\nMapping Intelligent : Introduction de l'objet CONCEPT_TO_NOTION pour créer des ponts logiques entre les concepts isolés et les grandes notions.\n\nLiaisons Dynamiques : Implémentation de linkTerms pour transformer les termes bruts en liens cliquables dans les textes et exercices.\n\n🖥 Interface & UX\n\nNavigation Prédictive : Optimisation de openConcept pour rediriger automatiquement l'utilisateur vers la fiche de la notion correspondante.\n\nGestion d'État : Automatisation de la mise à jour des variables de vue (cur, curTab, sbMode) lors des interactions avec le glossaire.\n\nRendu Amélioré : Migration du rendu renderContent vers des spans interactifs pour une exploration fluide du graphe de connaissances.",
      "tag": ""
    },
    {
      "hash": "966ce0f6a934c93a5f2af6bfea37457fc81b68f4",
      "short": "966ce0f",
      "auteur": "Orangentleman",
      "date": "2026-05-01T12:26:18+02:00",
      "sujet": "Update README.md",
      "corps": "",
      "tag": ""
    },
    {
      "hash": "ca2f466b965b2cfec8179363f68f04f40f25f082",
      "short": "ca2f466",
      "auteur": "Orangentleman",
      "date": "2026-04-30T19:21:51+02:00",
      "sujet": "Update README.md",
      "corps": "",
      "tag": ""
    },
    {
      "hash": "459ad5a26c9d133e6c87d3c11dae4a5ea46ff01e",
      "short": "459ad5a",
      "auteur": "Orangentleman",
      "date": "2026-04-30T19:01:35+02:00",
      "sujet": "extension du panthéon philosophique et mise à jour de l'expérience utilisateur (UI)",
      "corps": "📚 Contenu & Auteurs\n\nNouvelles Fiches : Intégration complète de Kant (morale/devoir), Pascal (divertissement/misère), Morizot (diplomatie des interdépendances) et Serres (Contrat Naturel).\n\nThématiques : Développement des sections sur les droits de la nature et la philosophie de l'art.\n\nEnrichissement : Ajout de précisions étymologiques et de \"tensions conceptuelles\" pour approfondir chaque notion.\n\n🖥 Interface & UX\n\nNouveaux Badges : Implémentation de la classe CSS is-new pour marquer visuellement les derniers ajouts avec un style \"doré\".\n\nRefonte des Cartes : Optimisation des fiches auteurs pour inclure les citations clés et les problématiques majeures.",
      "tag": ""
    },
    {
      "hash": "969e3b15a4a1b85bf1f68af8667f691ecad3ccac",
      "short": "969e3b1",
      "auteur": "Orangentleman",
      "date": "2026-04-29T17:58:09+02:00",
      "sujet": "intégration du module 'Langage' et enrichissement du glossaire conceptuel",
      "corps": "📚 Contenu Pédagogique (Langage)\nNouvelle Notion : Création complète de l'entrée \"Langage\" incluant définitions, axes de réflexion, exemples et sujets de discussion.\n\nIndex des Auteurs : Extension massive de l'objet AM avec des linguistes et penseurs clés : Saussure, Benveniste, Jakobson, Austin, Watzlawick, Boroditsky, Orwell, Cassin, etc.\n\nRessources : Ajout du document de référence cours_manuscrits_LANGAGE_3.pdf.\n\n📖 Glossaire & Concepts\nNouveau Lexique : Introduction d'un tableau CONCEPTS pour centraliser les définitions.\n\nExtensions : Ajout et développement des notions liées : Inconscient, Raison, Religion, Science, Temps et Vérité.\n\n🖥 Interface & UI\nComposants : Création de styles CSS pour les \"fiches\" de concepts, les cartes dédiées et les liens contextuels (inline links).\n\nInterconnexion : Ajustement de la structure pour lier dynamiquement le nouveau glossaire aux éléments d'interface existants.",
      "tag": ""
    },
    {
      "hash": "5b94f987d40d2a1f6f709e2c4bdaae6f30dcb08d",
      "short": "5b94f98",
      "auteur": "Orangentleman",
      "date": "2026-04-18T09:49:11+02:00",
      "sujet": "Ajout système de recherche des auteurs",
      "corps": "- ajout d'une barre de recherche des auteurs par notion, thème et nom\r\n- ajout d'un philtre exclusif ou non à partir des notions",
      "tag": ""
    },
    {
      "hash": "71e37010d144984e51f50cdecf885a402111523c",
      "short": "71e3701",
      "auteur": "Orangentleman",
      "date": "2026-04-17T23:24:20+02:00",
      "sujet": "système de navigation par auteurs et interface de profil détaillée",
      "corps": "🏗 Architecture & Logique\nMappage de données : Introduction des objets AM (métadonnées auteurs) et CC (couleurs par courants philosophiques).\n\nIndexation : Ajout de la logique buildAI pour indexer les auteurs et du helper authorsSorted pour le tri.\n\nGestion d'état : Mise en place des états sbMode, curAuthor et curAuthorTab pour piloter l'interface.\n\n🖥 Interface Utilisateur (UI/UX)\nSidebar hybride : Remplacement de l'ancienne barre latérale par un système d'onglets permettant de basculer entre Notions et Auteurs.\n\nProfils Auteurs : Implémentation de renderAuthorContent et openAuthor avec une navigation par onglets : Idées, Citations, Œuvres et Dialogues.\n\nNavigation croisée : Création de liens cliquables permettant de naviguer de manière fluide entre une notion et les auteurs associés.\n\n🎨 Design & Styles\nAjout des styles CSS pour les onglets de la sidebar, les cartes de contenu (idées/citations) et les badges de courants.",
      "tag": ""
    },
    {
      "hash": "9f69d35e6787b2977bfdf4c5d085625b174887f4",
      "short": "9f69d35",
      "auteur": "Orangentleman",
      "date": "2026-04-17T22:24:00+02:00",
      "sujet": "enrichissement du lexique et ajout de ressources documentaires",
      "corps": "🎨 Interface & UI\nGlossaire : Implémentation de .def-box et .def-sec en CSS pour une meilleure structure visuelle des définitions.\n\nInteractivité : Ajout de sections <details> \"Approfondir\" pour permettre une lecture à plusieurs niveaux sans encombrer la page.\n\n📚 Contenu Pédagogique\nNouveaux Documents : Intégration des fichiers cours_manuscrits_2.docx et cours_manuscrits_2.pdf.\n\nNotions : Création complète de la notion \"Art\" et enrichissement massif de l'objet D (glossaire).\n\nApprofondissement : Ajout systématique d'auteurs, de textes sources et de pistes de réflexion pour le graphe de révision.\n\n⚙️ Optimisation\nMise à jour de l'index pour supporter la nouvelle structure du contenu enrichi.",
      "tag": ""
    },
    {
      "hash": "166c2a3d31d1cd1f087c868c147856858fe90815",
      "short": "166c2a3",
      "auteur": "Orangentleman",
      "date": "2026-04-16T22:18:51+02:00",
      "sujet": "Update index.html",
      "corps": "",
      "tag": ""
    },
    {
      "hash": "e44b818c1bf4deb224378db3312df61b5f857741",
      "short": "e44b818",
      "auteur": "Orangentleman",
      "date": "2026-04-16T22:17:26+02:00",
      "sujet": "Update index.html",
      "corps": "",
      "tag": ""
    },
    {
      "hash": "0a9dd0e24bfeb92ed9aa03b0286aed1f3a8eb9ae",
      "short": "0a9dd0e",
      "auteur": "Orangentleman",
      "date": "2026-04-13T14:31:45+02:00",
      "sujet": "enrichissement des contenus et configuration de l'espace de travail",
      "corps": "📚 Contenu Pédagogique (Philosophie)\nNouveaux Auteurs : Intégration de Kant, Pascal, Stone, Morizot, Serres, Ost, Plumwood, Arendt, Anders, Heidegger et Baudrillard.\n\nThématiques : Ajout de cas d'études juridiques, environnementaux et techniques.\n\nSections Impactées : Mise à jour approfondie des modules Nature, Technique, Bonheur et Conscience avec de nouveaux textes, axes et exemples.\n\n⚙️ Refactorisation & Structure\nNormalisation des données : Nettoyage des marqueurs 'new:true' dispersés pour une gestion plus homogène.\n\nRéorganisation : Restructuration des tableaux de données pour faciliter la maintenance des questions et des axes de discussion.\n\n🛠 Configuration Tooling\nVSCode : Ajout de .vscode/settings.json pour activer le mode yoloMode de Claude Code Chat dans le workspace.",
      "tag": ""
    },
    {
      "hash": "1816e8e8cb5616485b9e6a92ed5a6bef849a0a7c",
      "short": "1816e8e",
      "auteur": "Orangentleman",
      "date": "2026-04-12T23:13:58+02:00",
      "sujet": "ajout du système de badges 'Nouveau' et mise à jour des cours",
      "corps": "🛠 Changements techniques\nStyle : Création d'un système visuel de nouveautés via des variables CSS (--new-color, etc.).\n\nComposants : Ajout de la classe .new-badge et de l'état .is-new pour mettre en évidence les éléments récents.\n\nLogique : Mise à jour de la fonction renderContent pour injecter dynamiquement les badges et ajuster les bordures/couleurs des nouveaux items.\n\n📚 Contenu pédagogique\nDocuments : Ajout du fichier cours_manuscrits.pdf.\n\nDonnées : Enrichissement des tableaux de données avec de nouveaux auteurs et penseurs :\n\nPhilosophes : Hume, Ricœur, Nietzsche, D'Holbach, Épictète, Tocqueville.\n\nSciences/Éthique : Frans de Waal.\n\nExtensions : Intégration de nouveaux textes, axes d'étude, exemples et sujets de dissertation.",
      "tag": ""
    },
    {
      "hash": "e6e9a7f658b76181066f0e06588b842b8a51c0bc",
      "short": "e6e9a7f",
      "auteur": "Orangentleman",
      "date": "2026-04-11T14:27:26+02:00",
      "sujet": "Update index.html",
      "corps": "",
      "tag": ""
    },
    {
      "hash": "629c7821e117fc34efca16f8564695959ff13f14",
      "short": "629c782",
      "auteur": "Orangentleman",
      "date": "2026-04-08T23:14:25+02:00",
      "sujet": "jsp",
      "corps": "",
      "tag": ""
    },
    {
      "hash": "d11a0d4fb12b0bf4bfba426b50c27cc87676aeff",
      "short": "d11a0d4",
      "auteur": "Orangentleman",
      "date": "2026-04-08T21:52:44+02:00",
      "sujet": "retrait de la ref aux pages de cours",
      "corps": "",
      "tag": ""
    },
    {
      "hash": "f1823737a43bdea061a7b1caa207b777ecdcf24d",
      "short": "f182373",
      "auteur": "Orangentleman",
      "date": "2026-04-08T21:45:38+02:00",
      "sujet": "graphe update to v3",
      "corps": "",
      "tag": ""
    },
    {
      "hash": "9e06e17932a7472fd17defc4560e6737e2ee4512",
      "short": "9e06e17",
      "auteur": "Orangentleman",
      "date": "2026-04-08T21:35:09+02:00",
      "sujet": "index.html",
      "corps": "",
      "tag": ""
    },
    {
      "hash": "5770c22fe905f68ee773c98442a819734632fe4d",
      "short": "5770c22",
      "auteur": "Orangentleman",
      "date": "2026-04-08T21:34:24+02:00",
      "sujet": "files supression",
      "corps": "",
      "tag": ""
    },
    {
      "hash": "a3b81b52ff04607ca97a5ee94ca9d1cb66433b91",
      "short": "a3b81b5",
      "auteur": "Orangentleman",
      "date": "2026-04-08T09:04:06+02:00",
      "sujet": "Add files via upload",
      "corps": "",
      "tag": ""
    },
    {
      "hash": "d6dd739c168e0ee17141e3ffd8e02bd24d34a14c",
      "short": "d6dd739",
      "auteur": "Orangentleman",
      "date": "2026-04-08T09:03:38+02:00",
      "sujet": "Add files via upload",
      "corps": "",
      "tag": ""
    },
    {
      "hash": "1d374e5716fb4c381a7407670440f26b89443f6b",
      "short": "1d374e5",
      "auteur": "Orangentleman",
      "date": "2026-04-08T08:48:09+02:00",
      "sujet": "Add files via upload",
      "corps": "",
      "tag": ""
    },
    {
      "hash": "50ea00805df051b621713ad49b7ef36edf64a90d",
      "short": "50ea008",
      "auteur": "Orangentleman",
      "date": "2026-04-08T08:37:51+02:00",
      "sujet": "Initial commit",
      "corps": "",
      "tag": ""
    }
  ]
};
