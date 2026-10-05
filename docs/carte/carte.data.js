/* ════════════════════════════════════════════════════════════════════════
   carte.data.js — SOURCE DE VÉRITÉ de la carte interactive du projet Philo.

   C'est CE fichier qu'on édite à chaque mise à jour du code (voir MAJ.md).
   carte.html ne contient AUCUNE donnée en dur : il lit window.CARTE.

   Modèle d'un nœud :
   {
     id, label,                 // identifiant stable + nom affiché
     niveau: 0|1|2|3,           // 0 = grands domaines … 3 = variables/détails
     parent,                    // id du nœud parent (null pour les domaines L0)
     domaine,                   // id d'un des 10 domaines (couleur + légende)
     novice,                    // 1–2 phrases SANS jargon (ce que ça fait pour l'élève)
     ingenieur,                 // explication technique (rôle, état, structure)
     symbols: [ {kind, name, ref:"fichier:ligne"} ],   // grep-confirmés
     liens:   [ {to, type, note} ],                    // liens internes au graphe
     incertain?: true, note?: "…"                      // zone ambiguë signalée
   }
   + edges[] : arêtes transverses (flux de données) entre domaines.

   Toutes les `ref` ont été confirmées par grep. node docs/carte/verifie.mjs
   re-vérifie que chaque `name` existe encore dans le fichier cité (anti-drift).
   ════════════════════════════════════════════════════════════════════════ */
window.CARTE = {

  meta: {
    version: "1.1",
    genere_le: "2026-06-14",
    a_propos: "Carte interactive et évolutive du projet (outil de révision Philo Terminale). " +
              "Du parcours élève jusqu'au nom des variables/fonctions. Édite ce fichier, pas carte.html.",
    fichiers: {
      "index.html": "Squelette HTML de la page ; charge app.css, data.js puis app.js.",
      "js/, css/":  "Le CODE du site en morceaux numérotés (sources) ; recollés par le build en app.js / app.css (générés, ne pas éditer).",
      "data.js":    "GÉNÉRÉ par outils/construire.mjs depuis contenu/ : D (notions), KEYS, AM (auteurs), CONCEPTS (glossaire + repères). Ne pas éditer.",
      "sw.js":      "Service Worker PWA (cache, hors-ligne).",
      "manifest.json": "Métadonnées d'installation PWA.",
      "philo-aggregator/": "Pipeline Python local : ingest des propositions, relecture Gemini, dashboard, export.",
      "contenu/":          "SOURCES du contenu : un fichier par notion (notions/), par auteur (auteurs/), concepts.js, reperes.js, ordre.js. On édite ici.",
      "outils/":           "Outillage Node : construire.mjs (build → data.js, sw.js), verifier_contenu.mjs (contrôle, avec témoins), lib/ (formats, écriture), banc/ (règles d'accès Supabase sur PGlite)."
    }
  },

  /* ── 10 domaines (L0) = légende des couleurs ───────────────────────── */
  domaines: [
    { id:"ux",      label:"Expérience utilisateur", couleur:"#e0883b" },
    { id:"front",   label:"Front (rendu)",          couleur:"#5aa0e6" },
    { id:"donnees", label:"Données",                couleur:"#6cc24a" },
    { id:"nav",     label:"Navigation / persistance", couleur:"#c77dd6" },
    { id:"quiz",    label:"Quiz (révision)",        couleur:"#3b82d6" },
    { id:"contrib", label:"Contribution",           couleur:"#e6b800" },
    { id:"sync",    label:"Compte / Sync",          couleur:"#2bb3a3" },
    { id:"pwa",     label:"PWA (hors-ligne)",       couleur:"#8892b0" },
    { id:"backend", label:"Backend agrégateur",     couleur:"#e0654b" },
    { id:"seo",     label:"Référencement (SEO)",    couleur:"#b08a3c" }
  ],

  /* ── Types de lien (légende des arêtes) ────────────────────────────── */
  typesLien: [
    { id:"appelle",   label:"appelle",   style:{ dash:"",        width:2,   color:"#9fb0c8" } },
    { id:"produit",   label:"produit",   style:{ dash:"",        width:3,   color:"#6cc24a" } },
    { id:"lit",       label:"lit",       style:{ dash:"6 4",     width:2,   color:"#5aa0e6" } },
    { id:"ecrit",     label:"écrit",     style:{ dash:"",        width:2.6, color:"#e6b800" } },
    { id:"navigue",   label:"navigue",   style:{ dash:"2 4",     width:1.7, color:"#c77dd6" } },
    { id:"declenche", label:"déclenche", style:{ dash:"9 3 2 3", width:2,   color:"#e0654b" } }
  ],

  nodes: [

  /* ═══════════════ UX — Expérience utilisateur ═══════════════ */
  { id:"ux", label:"Expérience utilisateur", niveau:0, parent:null, domaine:"ux",
    novice:"Tout ce qui accueille et guide l'élève : la visite guidée du départ, la recherche rapide, les réglages, et l'ouverture du menu sur téléphone.",
    ingenieur:"Couche d'accueil et de confort. N'affiche pas le contenu lui-même (c'est Front) mais oriente l'utilisateur : onboarding (tour), palette de recherche globale (⌘/Ctrl+K), réglages/mode, tiroir et gestes mobile." },

    { id:"ux.tour", label:"Visite guidée", niveau:1, parent:"ux", domaine:"ux",
      novice:"La présentation interactive qui se lance à la première visite et montre comment se servir du site.",
      ingenieur:"Onboarding superposé. Visite « noyau + détail optionnel » : le 1er passage ne joue que les étapes essentielles puis propose le détail.",
      symbols:[{kind:"var",name:"TOUR_STEPS",ref:"js/08-visite-guidee.js:176"}] },
      { id:"ux.tour.steps", label:"Étapes & séquence", niveau:2, parent:"ux.tour", domaine:"ux",
        novice:"La liste des étapes de la visite et la façon dont elles s'enchaînent.",
        ingenieur:"TOUR_STEPS = définitions d'étapes. tourState = {i, mode:'core'|'detail'|'full', decision…}. tourSeq() renvoie les indices actifs selon le mode ; toute la navigation opère sur cette séquence.",
        symbols:[{kind:"var",name:"TOUR_STEPS",ref:"js/08-visite-guidee.js:176"},{kind:"var",name:"tourState",ref:"js/08-visite-guidee.js:442"},{kind:"fn",name:"tourSeq",ref:"js/08-visite-guidee.js:449"},{kind:"fn",name:"markTourCore",ref:"js/08-visite-guidee.js:428"}] },
      { id:"ux.tour.control", label:"Contrôle de la visite", niveau:2, parent:"ux.tour", domaine:"ux",
        novice:"Démarrer, terminer, ou relancer la visite.",
        ingenieur:"startTour(i, jumped, mode) lance la visite ; endTour() la ferme ; tourStartIfFirst() la déclenche à la 1re venue (drapeau philo-onboarded).",
        symbols:[{kind:"fn",name:"startTour",ref:"js/08-visite-guidee.js:476"},{kind:"fn",name:"endTour",ref:"js/08-visite-guidee.js:531"},{kind:"fn",name:"tourStartIfFirst",ref:"js/08-visite-guidee.js:818"}],
        liens:[{to:"nav.keys.onboarded",type:"lit",note:"philo-onboarded décide si la visite se lance."}] },
      { id:"ux.tour.decision", label:"Écran de choix & sauts", niveau:2, parent:"ux.tour", domaine:"ux",
        novice:"Après l'essentiel, l'écran « Tu connais l'essentiel — voir le détail ? » et le saut direct à une partie.",
        ingenieur:"tourShowDecision()/tourContinueDetailed() enchaînent du noyau au détail ; tourGoPart() saute à une partie ; tourShowSidebarMode() bascule réellement la sidebar dans le mode présenté.",
        symbols:[{kind:"fn",name:"tourShowDecision",ref:"js/08-visite-guidee.js:578"},{kind:"fn",name:"tourContinueDetailed",ref:"js/08-visite-guidee.js:597"},{kind:"fn",name:"tourGoPart",ref:"js/08-visite-guidee.js:492"},{kind:"fn",name:"tourShowSidebarMode",ref:"js/08-visite-guidee.js:93"}] },

    { id:"ux.search", label:"Recherche globale ⌘K", niveau:1, parent:"ux", domaine:"ux",
      novice:"La barre de recherche rapide (Ctrl+K ou ⌘K) : elle cherche dans tout le contenu (citations, œuvres, sujets, textes, exemples, définitions), ouvre la bonne page sur le bon onglet et fait briller ce qu'elle a trouvé.",
      ingenieur:"Palette de commande. Index pré-calculé une fois au chargement (≈1 200 entrées) : notions, auteurs, concepts, accroches, et depuis l'étape 3 (oct. 2026) citations, œuvres, sujets, textes, exemples, plus un champ texte (définitions, corps) cherché en dernier rang. paletteSearch classe (libellé, chaîne, texte) et plafonne à PALETTE_PAR_GROUPE par type. ouvrirResultat() ouvre la fiche sur l'onglet voulu et pose pendingCible, que focusAfterRender fait briller à la place de l'en-tête.",
      symbols:[{kind:"var",name:"PALETTE_INDEX",ref:"js/14-recherche.js:39"},{kind:"var",name:"PALETTE_GROUPS",ref:"js/14-recherche.js:123"},{kind:"var",name:"PALETTE_ORDER",ref:"js/14-recherche.js:124"},{kind:"fn",name:"paletteSearch",ref:"js/14-recherche.js:143"},{kind:"fn",name:"ouvrirResultat",ref:"js/14-recherche.js:246"},{kind:"var",name:"PALETTE_PAR_GROUPE",ref:"js/14-recherche.js:126"},{kind:"var",name:"pendingCible",ref:"js/04-fiches.js:16"}],
      liens:[{to:"nav.open",type:"navigue",note:"Activer un résultat ouvre la cible via les points d'entrée open*."}] },

    { id:"ux.settings", label:"Réglages & modes", niveau:1, parent:"ux", domaine:"ux",
      novice:"Le menu ⚙ Réglages : aide, relance de la visite, bascule révision/édition, « mode fiche » (lecture compressée), et accès à cette carte + à la frise.",
      ingenieur:"Overlay #settings-overlay regroupant les fonctions non nécessaires à la révision. Deux bascules d'affichage : applyPhiloMode (révision/édition, classe body.mode-edition) et applyFicheMode (mode fiche, classe body.mode-fiche). Le menu offre aussi les liens vers docs/carte/carte.html et frise.html.",
      symbols:[{kind:"fn",name:"openSettings",ref:"js/07-affichage-reglages.js:79"},{kind:"fn",name:"renderSettingsBody",ref:"js/07-affichage-reglages.js:52"},{kind:"fn",name:"applyPhiloMode",ref:"js/07-affichage-reglages.js:19"},{kind:"fn",name:"togglePhiloMode",ref:"js/07-affichage-reglages.js:27"},{kind:"fn",name:"applyFicheMode",ref:"js/07-affichage-reglages.js:37"},{kind:"fn",name:"toggleFicheMode",ref:"js/07-affichage-reglages.js:42"}],
      liens:[{to:"nav.keys.mode",type:"ecrit",note:"Le mode révision/édition est persisté dans philo-mode."},{to:"nav.keys.fiche",type:"ecrit",note:"Le mode fiche est persisté dans philo-fiche."}] },

    { id:"ux.mobile", label:"Tiroir & gestes mobile", niveau:1, parent:"ux", domaine:"ux",
      novice:"Sur téléphone, le menu de gauche devient un tiroir qu'on ouvre avec le bouton ☰ ou en glissant le doigt depuis le bord.",
      ingenieur:"Responsive ≤700px : sidebar en tiroir (voile .sb-backdrop, fermeture clic/Échap/sélection) + gestes tactiles (balayage depuis le bord gauche).",
      symbols:[{kind:"fn",name:"initSidebarDrawer",ref:"js/08-visite-guidee.js:837"},{kind:"fn",name:"initSidebarSwipe",ref:"js/08-visite-guidee.js:873"},{kind:"css",name:".sb-backdrop",ref:"css/07-mobile.css:35"}] },

  /* ═══════════════ FRONT — rendu ═══════════════ */
  { id:"front", label:"Front (rendu)", niveau:0, parent:null, domaine:"front",
    novice:"Ce qui s'affiche à l'écran : le menu de gauche, la fiche d'une notion et ses onglets, les fiches d'auteur et de concept, le guide de méthode, le fil d'Ariane en haut.",
    ingenieur:"Couche de rendu : fonctions render* qui réécrivent #sb (sidebar) et #main selon l'état courant (sbMode, cur, curTab…). Aucune donnée propre — consomme D / AI / CONCEPTS." },

    { id:"front.sidebar", label:"Barre latérale", niveau:1, parent:"front", domaine:"front",
      novice:"Le menu de gauche avec ses cinq entrées : Notions, Auteurs, Concepts, Repères, Méthodo.",
      ingenieur:"renderSB() rend la sidebar selon sbMode (5 modes). Listes filtrables pour concepts/repères. Les onglets s'enroulent sur plusieurs rangées (flex-wrap).",
      symbols:[{kind:"fn",name:"renderSB",ref:"js/03-barre-laterale.js:79"}] },
      { id:"front.sidebar.render", label:"renderSB()", niveau:2, parent:"front.sidebar", domaine:"front",
        novice:"La fonction qui dessine le menu de gauche.",
        ingenieur:"renderSB() : onglets de mode + barre de recherche/filtres + liste de l'item actif. sbMode ∈ notions|auteurs|concepts|reperes|methodo (déclarée par let dans index.html, section B).",
        symbols:[{kind:"fn",name:"renderSB",ref:"js/03-barre-laterale.js:79"},{kind:"fn",name:"goMode",ref:"js/04-fiches.js:616"}] },
      { id:"front.sidebar.lists", label:"Listes Concepts / Repères", niveau:2, parent:"front.sidebar", domaine:"front",
        novice:"La liste filtrable des concepts, et celle des repères du programme.",
        ingenieur:"renderSBConceptsList() (exclut les repères) et renderSBReperesList() (seulement les repères). Recherche dédiée repereSearch.",
        symbols:[{kind:"fn",name:"renderSBConceptsList",ref:"js/03-barre-laterale.js:311"},{kind:"fn",name:"renderSBReperesList",ref:"js/03-barre-laterale.js:354"},{kind:"var",name:"repereSearch",ref:"js/01-donnees-etat.js:61"}] },
      { id:"front.sidebar.tabs", label:"Onglets de notion", niveau:2, parent:"front.sidebar", domaine:"front",
        novice:"Les onglets d'une notion : Auteurs, Textes, Concepts, Dissertations, Exemples.",
        ingenieur:"NOTION_TABS fixe l'ordre des onglets. curTab/curConceptSubTab/curExempleSubTab (déclarées par let dans index.html, section B) mémorisent l'onglet et le sous-onglet actifs.",
        symbols:[{kind:"var",name:"NOTION_TABS",ref:"js/02-navigation.js:75"}] },
      { id:"front.sidebar.search", label:"Recherche & effacement", niveau:2, parent:"front.sidebar", domaine:"front",
        novice:"Les barres de recherche du menu, avec une croix (ou un clic droit) pour tout effacer d'un coup.",
        ingenieur:"sbSearchInput() filtre la liste et affiche/masque la croix ; clearSidebarSearch() vide ; searchCtxClear() fait pareil au clic droit. clearPaletteSearch() vide la palette ⌘K. Bouton CSS .sb-search-clear.",
        symbols:[{kind:"fn",name:"sbSearchInput",ref:"js/03-barre-laterale.js:56"},{kind:"fn",name:"clearSidebarSearch",ref:"js/03-barre-laterale.js:67"},{kind:"fn",name:"searchCtxClear",ref:"js/03-barre-laterale.js:77"},{kind:"fn",name:"clearPaletteSearch",ref:"js/14-recherche.js:208"},{kind:"css",name:".sb-search-clear",ref:"js/03-barre-laterale.js:60"}] },

    { id:"front.notion", label:"Vue notion", niveau:1, parent:"front", domaine:"front",
      novice:"La fiche d'une notion (ex. la conscience) avec sa définition et ses onglets.",
      ingenieur:"renderContent() rend la notion courante (cur) : définition + onglets auteurs/textes/concepts/diss/exemples. Regroupe les cartes auteur par nom, trie par « popularité ».",
      symbols:[{kind:"fn",name:"renderContent",ref:"js/04-fiches.js:848"}],
      liens:[{to:"donnees.liens",type:"appelle",note:"Toute la prose passe par linkTerms() pour devenir cliquable."}] },
      { id:"front.notion.render", label:"renderContent()", niveau:2, parent:"front.notion", domaine:"front",
        novice:"La fonction qui dessine la fiche d'une notion.",
        ingenieur:"renderContent() : lit D[cur], construit les onglets, délègue le tri auteur à compareAuthors. La carte auteur multi-idées s'élargit sur 2 colonnes (.ac-multi).",
        symbols:[{kind:"fn",name:"renderContent",ref:"js/04-fiches.js:848"}] },

    { id:"front.auteur", label:"Fiche auteur", niveau:1, parent:"front", domaine:"front",
      novice:"La page d'un philosophe : ses idées, ses œuvres, ses citations et ses dialogues avec d'autres auteurs.",
      ingenieur:"renderAuthorContent() rend l'auteur courant (curAuthor) à partir de l'index AI[name] et des métadonnées AM[name]. Onglets idées/œuvres/citations/dialogues.",
      symbols:[{kind:"fn",name:"renderAuthorContent",ref:"js/04-fiches.js:691"}] },

    { id:"front.concept", label:"Fiche concept & repère", niveau:1, parent:"front", domaine:"front",
      novice:"La page d'un concept (ex. l'aliénation) ou d'un repère du programme, avec sa définition et ses liens.",
      ingenieur:"renderConceptContent() rend le concept courant (curConcept). Un repère EST un concept (même renderer), seulement rangé à part. Section « Relations & distinctions » (sortantes + entrantes calculées).",
      symbols:[{kind:"fn",name:"renderConceptContent",ref:"js/04-fiches.js:238"},{kind:"var",name:"curConcept",ref:"js/01-donnees-etat.js:50"}] },

    { id:"front.methodo", label:"Guide méthodo", niveau:1, parent:"front", domaine:"front",
      novice:"Le guide de méthode (dissertation et explication de texte) : un mode d'emploi, pas une fiche de cours.",
      ingenieur:"renderMethodoContent() : squelette visuel de la copie + étapes dépliables avec « phrases toutes prêtes ». Données dans METHODO_GUIDE (pas dans data.js).",
      symbols:[{kind:"fn",name:"renderMethodoContent",ref:"js/04-fiches.js:430"},{kind:"var",name:"METHODO_GUIDE",ref:"js/04-fiches.js:346"},{kind:"var",name:"METHODO_TOPICS",ref:"js/04-fiches.js:341"},{kind:"var",name:"methodoTopic",ref:"js/01-donnees-etat.js:65"}] },

    { id:"front.crumbs", label:"Fil d'Ariane & aiguillage", niveau:1, parent:"front", domaine:"front",
      novice:"Le chemin cliquable en haut de page (« Notions › Conscience › Auteurs ») et le choix de la bonne vue à afficher.",
      ingenieur:"renderCrumbs() rend le fil d'Ariane et appelle persistNav(). renderCurrentView() aiguille vers le bon render* selon sbMode (même logique que goBack).",
      symbols:[{kind:"fn",name:"renderCrumbs",ref:"js/04-fiches.js:551"},{kind:"fn",name:"renderCurrentView",ref:"js/02-navigation.js:79"}],
      liens:[{to:"nav.persist",type:"appelle",note:"renderCrumbs() persiste la position via persistNav()."}] },

    { id:"front.focus", label:"Surbrillance d'arrivée", niveau:1, parent:"front", domaine:"front",
      novice:"Quand tu suis un lien, la cible « brille » un instant pour te montrer où tu as atterri.",
      ingenieur:"focusAfterRender() fait briller l'en-tête (ou la carte/concept ciblé) après chaque open*. scrollAndFlash() ouvre les <details> ancêtres, attend une mise en page stable, centre puis relance l'animation.",
      symbols:[{kind:"fn",name:"focusAfterRender",ref:"js/04-fiches.js:51"},{kind:"fn",name:"scrollAndFlash",ref:"js/04-fiches.js:30"}] },

  /* ═══════════════ DONNÉES — data.js ═══════════════ */
  { id:"donnees", label:"Données", niveau:0, parent:null, domaine:"donnees",
    novice:"La matière du site : toutes les notions, auteurs, concepts et repères du programme. C'est là qu'on ajoute ou corrige le contenu.",
    ingenieur:"data.js expose des globales (D, KEYS, AM, CONCEPTS, CC). index.html les normalise au chargement, en dérive l'index auteurs (AI), le tri et le moteur de liens (linkTerms)." },

    { id:"donnees.verif", label:"Vérificateur du contenu", niveau:1, parent:"donnees", domaine:"donnees",
      novice:"Le contrôle qui relit tout le contenu avant chaque envoi : doublons, auteurs sans biographie, citations mal guillemetées, renvois à un cours… et qui prouve qu'il voit vraiment les fautes.",
      ingenieur:"outils/verifier_contenu.mjs (Node seul, oct. 2026, modèle verifier_corpus.py de Fiches BUT) : charger() exécute data.js dans un bac à sable vm ; QUESTIONS = 9 contrôles {err, warn} ; TEMOINS = une faute glissée par question (--temoins) ; sortie « cohérent » (0) ou « À CORRIGER » (1). Lancé par .githooks/pre-commit quand data.js est commité. Règles : docs/protocole-contenu.md.",
      symbols:[{kind:"fn",name:"charger",ref:"outils/verifier_contenu.mjs:41"},{kind:"var",name:"QUESTIONS",ref:"outils/verifier_contenu.mjs:79"},{kind:"var",name:"TEMOINS",ref:"outils/verifier_contenu.mjs:196"},{kind:"fn",name:"main",ref:"outils/verifier_contenu.mjs:214"}],
      liens:[{to:"donnees.globales",type:"lit",note:"Lit D, KEYS, AM, CONCEPTS (et AUTHOR_ALIASES d'index.html)."}] },
    { id:"donnees.globales", label:"Globales data.js", niveau:1, parent:"donnees", domaine:"donnees",
      novice:"Les grandes listes du contenu : notions, auteurs, concepts, couleurs.",
      ingenieur:"Constantes globales (script classique, pas de module) consommées directement par index.html.",
      symbols:[{kind:"var",name:"D",ref:"data.js:5"},{kind:"var",name:"KEYS",ref:"data.js:24"},{kind:"var",name:"AM",ref:"data.js:25"},{kind:"var",name:"CONCEPTS",ref:"data.js:120"},{kind:"var",name:"CC",ref:"js/01-donnees-etat.js:16"}] },
      { id:"donnees.globales.D", label:"D (notions)", niveau:2, parent:"donnees.globales", domaine:"donnees",
        novice:"Toutes les notions du programme (la conscience, le bonheur, la justice…) avec leur contenu.",
        ingenieur:"D = objet { cléNotion: {c,l,s,def, auteurs[], textes[], plans[], exemples[], accroches[], liens[], diss[]} }. KEYS = Object.keys(D) fixe l'ordre.",
        symbols:[{kind:"var",name:"D",ref:"data.js:5"},{kind:"var",name:"KEYS",ref:"data.js:24"}] },
      { id:"donnees.globales.AM", label:"AM (métadonnées auteurs)", niveau:2, parent:"donnees.globales", domaine:"donnees",
        novice:"La fiche d'identité de chaque philosophe : bio, courant, période, thèmes, dialogues.",
        ingenieur:"AM = { nom: {bio, courant, periode, themes[], dialogues[]} }. Peut contenir des alias courts (ex. 'Tzara').",
        symbols:[{kind:"var",name:"AM",ref:"data.js:25"}] },
      { id:"donnees.globales.CONCEPTS", label:"CONCEPTS (glossaire + repères)", niveau:2, parent:"donnees.globales", domaine:"donnees",
        novice:"Le glossaire des concepts clés, et les repères du programme (paires à distinguer).",
        ingenieur:"CONCEPTS = [ {id, term, cat, def, auteur?, notions[], liens{}, relations[]} ]. Les repères (cat:'Repère') sont des concepts comme les autres, rangés à part.",
        symbols:[{kind:"var",name:"CONCEPTS",ref:"data.js:120"}] },
      { id:"donnees.globales.CC", label:"CC (couleurs des courants)", niveau:2, parent:"donnees.globales", domaine:"donnees",
        novice:"La couleur associée à chaque courant philosophique (rationalisme, stoïcisme…).",
        ingenieur:"CC = { 'Courant': '#couleur' }. Resté dans index.html (et non data.js).",
        symbols:[{kind:"var",name:"CC",ref:"js/01-donnees-etat.js:16"}] },

    { id:"donnees.normalize", label:"Build : sources → data.js", niveau:1, parent:"donnees", domaine:"donnees",
      novice:"Le contenu s'écrit dans des fichiers rangés (un par notion, un par auteur) ; un petit programme les assemble dans le fichier que le site charge, en remettant au passage l'ancien contenu au format actuel.",
      ingenieur:"Étape 3 (oct. 2026) : outils/construire.mjs charge contenu/ (NOTION, AUTEUR, CONCEPT, REPERE, ORDRE dans un bac à sable vm), convertit les anciens formats (outils/lib/formats.mjs : auteur à plat → ideas, axes → plans, tensions → relations), écrit data.js (généré, versionné), recalcule CACHE et PRECACHE de sw.js (empreinte du contenu), puis lance verifier_contenu.mjs. --controle : vérifie sans écrire (hook de commit). Le site ne convertit plus rien au chargement.",
      symbols:[{kind:"fn",name:"chargerSources",ref:"outils/construire.mjs:57"},{kind:"fn",name:"assembler",ref:"outils/construire.mjs:85"},{kind:"fn",name:"ecrireData",ref:"outils/construire.mjs:95"},{kind:"var",name:"PRECACHE",ref:"outils/construire.mjs:50"},{kind:"fn",name:"normaliserNotion",ref:"outils/lib/formats.mjs:59"},{kind:"fn",name:"normaliserAuteur",ref:"outils/lib/formats.mjs:30"},{kind:"fn",name:"normaliserConcept",ref:"outils/lib/formats.mjs:70"}] },

    { id:"donnees.index", label:"Index auteurs (AI)", niveau:1, parent:"donnees", domaine:"donnees",
      novice:"Une table qui regroupe, pour chaque auteur, toutes les notions où il apparaît.",
      ingenieur:"buildAI() construit AI = { nom: {notions[], entries[]} } depuis D. Stocke une COPIE des idées pour ne pas muter D lors des fusions de doublons.",
      symbols:[{kind:"fn",name:"buildAI",ref:"js/01-donnees-etat.js:92"},{kind:"var",name:"AI",ref:"js/01-donnees-etat.js:114"}] },

    { id:"donnees.tri", label:"Tri « popularité » auteurs", niveau:1, parent:"donnees", domaine:"donnees",
      novice:"L'ordre des cartes d'auteur : les plus transversaux et les plus attendus au bac passent devant.",
      ingenieur:"compareAuthors() trie en cascade : (1) nb de notions couvertes (authorPopularity), (2) score « importance bac » (authorBacScore + bonus manuel BAC_BONUS), (3) alphabétique.",
      symbols:[{kind:"fn",name:"compareAuthors",ref:"js/01-donnees-etat.js:173"},{kind:"fn",name:"authorPopularity",ref:"js/01-donnees-etat.js:158"},{kind:"fn",name:"authorBacScore",ref:"js/01-donnees-etat.js:162"},{kind:"var",name:"BAC_BONUS",ref:"js/01-donnees-etat.js:141"}] },

    { id:"donnees.reperes", label:"Repères vs concepts", niveau:1, parent:"donnees", domaine:"donnees",
      novice:"Le tri qui sépare les repères du programme du reste du glossaire.",
      ingenieur:"isRepere(c) = c.cat==='Repère'. REPERES() peuple l'onglet Repères ; realConcepts() = le glossaire (tout sauf les repères).",
      symbols:[{kind:"fn",name:"isRepere",ref:"js/01-donnees-etat.js:70"},{kind:"fn",name:"REPERES",ref:"js/01-donnees-etat.js:71"},{kind:"fn",name:"realConcepts",ref:"js/01-donnees-etat.js:72"}] },

    { id:"donnees.liens", label:"Liens dynamiques (linkTerms)", niveau:1, parent:"donnees", domaine:"donnees",
      novice:"Ce qui rend cliquables, dans n'importe quel texte, les noms de notions, de concepts et d'auteurs.",
      ingenieur:"linkTerms(html) détecte notions (.nterm) / concepts (.cterm) / auteurs (.aterm) et les rend cliquables. LINK_MAP est l'index des termes ; AUTHOR_ALIASES rattache les anciennes graphies au nom canonique.",
      symbols:[{kind:"fn",name:"linkTerms",ref:"js/05-liens-dynamiques.js:113"},{kind:"var",name:"LINK_MAP",ref:"js/05-liens-dynamiques.js:28"},{kind:"var",name:"AUTHOR_ALIASES",ref:"js/05-liens-dynamiques.js:46"}] },

  /* ═══════════════ NAVIGATION / PERSISTANCE ═══════════════ */
  { id:"nav", label:"Navigation / persistance", niveau:0, parent:null, domaine:"nav",
    novice:"Le site se souvient de l'endroit où tu en es : si tu actualises, tu reviens au même point, et le bouton Retour marche même après.",
    ingenieur:"État de position (sbMode/cur/curTab/curAuthor/curConcept/methodoTopic) sérialisé dans localStorage. Pile d'historique persistée. Points d'entrée open* + surbrillance d'arrivée." },

    { id:"nav.history", label:"Historique « Retour »", niveau:1, parent:"nav", domaine:"nav",
      novice:"La pile des pages visitées, pour le bouton ← Retour — qui survit même à une actualisation.",
      ingenieur:"navHistory empile un snapshot avant chaque navigation (pushHistory). goBack() dépile et restaure. updateBackBtn() rafraîchit le bouton et persiste la pile (philo-navhist).",
      symbols:[{kind:"var",name:"navHistory",ref:"js/02-navigation.js:13"},{kind:"fn",name:"pushHistory",ref:"js/02-navigation.js:25"},{kind:"fn",name:"goBack",ref:"js/02-navigation.js:41"},{kind:"fn",name:"updateBackBtn",ref:"js/02-navigation.js:59"}] },

    { id:"nav.state", label:"État de position", niveau:1, parent:"nav", domaine:"nav",
      novice:"La photo de « où tu es » dans le site, vérifiée avant d'être ré-appliquée.",
      ingenieur:"navStateNow() capture {sbMode,cur,curTab,curConceptSubTab,curExempleSubTab,curAuthor,curAuthorTab,curConcept,methodoTopic}. applyNavState() valide (la cible doit exister) avant d'appliquer. navTouched : l'utilisateur a-t-il navigué ici ? (cf. adoption distante).",
      symbols:[{kind:"fn",name:"navStateNow",ref:"js/02-navigation.js:87"},{kind:"fn",name:"applyNavState",ref:"js/02-navigation.js:114"},{kind:"fn",name:"sameNav",ref:"js/02-navigation.js:94"},{kind:"fn",name:"navEntryValid",ref:"js/02-navigation.js:153"},{kind:"var",name:"navTouched",ref:"js/02-navigation.js:20"}],
      note:"sbMode/cur/curTab/curAuthor/curAuthorTab sont déclarées par let en tête du script d'index.html (section B) ; elles vivaient dans data.js jusqu'en oct. 2026." },

    { id:"nav.adresses", label:"Adresses de page (#/…)", niveau:1, parent:"nav", domaine:"nav",
      novice:"Chaque page a son adresse : on peut l'envoyer à quelqu'un, la mettre en favori, et le bouton « précédent » du navigateur ramène à la page d'avant.",
      ingenieur:"Étape 3 (oct. 2026). adresseDe(état) ↔ etatDe(#/…) : #/notion/<clé>[/<onglet>], #/auteur/<nom>[/<onglet>], #/concept/<id>, #/repere/<id>, #/methodo/<parcours>. majAdresse() (appelée par persistNav à chaque rendu) : pushState après une navigation (navAdresseEnAttente, posé par pushHistory), sinon replaceState ; ne touche pas une URL portant un jeton Supabase (adresseProtegee). popstate rejoue l'adresse ; restoreNavFromAddress() au démarrage fait gagner un lien partagé sur la position mémorisée. shareUrl() partage l'adresse de la page.",
      symbols:[{kind:"fn",name:"adresseDe",ref:"js/02-navigation.js:197"},{kind:"fn",name:"etatDe",ref:"js/02-navigation.js:210"},{kind:"fn",name:"majAdresse",ref:"js/02-navigation.js:241"},{kind:"fn",name:"restoreNavFromAddress",ref:"js/02-navigation.js:268"},{kind:"fn",name:"titrePage",ref:"js/02-navigation.js:226"},{kind:"var",name:"navAdresseEnAttente",ref:"js/02-navigation.js:194"}],
      liens:[{to:"nav.persist",type:"appelle",note:"persistNav appelle majAdresse."}] },

    { id:"nav.persist", label:"Persistance locale", niveau:1, parent:"nav", domaine:"nav",
      novice:"Ce qui écrit ta position et ton historique dans le navigateur pour les retrouver au prochain démarrage.",
      ingenieur:"persistNav() écrit philo-nav à chaque rendu (via renderCrumbs). Au démarrage, restoreNavFromStorage() ré-applique la position et restoreNavHistory() recharge la pile.",
      symbols:[{kind:"fn",name:"persistNav",ref:"js/02-navigation.js:104"},{kind:"fn",name:"restoreNavFromStorage",ref:"js/02-navigation.js:146"},{kind:"fn",name:"restoreNavHistory",ref:"js/02-navigation.js:166"}] },

    { id:"nav.open", label:"Points d'entrée open*", niveau:1, parent:"nav", domaine:"nav",
      novice:"Les fonctions qui ouvrent une notion, un auteur ou un concept (depuis un lien ou la recherche).",
      ingenieur:"openNotion()/openConcept()/openAuthor() posent l'état (cur/curConcept/curAuthor + sbMode) puis rendent la vue et déclenchent la surbrillance.",
      symbols:[{kind:"fn",name:"openNotion",ref:"js/03-barre-laterale.js:413"},{kind:"fn",name:"openConcept",ref:"js/03-barre-laterale.js:392"},{kind:"fn",name:"openAuthor",ref:"js/04-fiches.js:629"}],
      liens:[{to:"front.notion",type:"navigue",note:"openNotion → renderContent()"},{to:"front.focus",type:"appelle",note:"chaque open* finit par focusAfterRender()."}] },

    { id:"nav.cross", label:"Liens croisés ciblés", niveau:1, parent:"nav", domaine:"nav",
      novice:"Suivre un lien qui ouvre une notion ET met en valeur exactement le concept, l'auteur ou l'accroche d'où tu viens.",
      ingenieur:"openNotionFromConcept/openNotionFromAuthor/openNotionAccroche posent un drapeau pending* que focusAfterRender() consomme pour viser la bonne carte/mention.",
      symbols:[{kind:"fn",name:"openNotionFromConcept",ref:"js/04-fiches.js:129"},{kind:"fn",name:"openNotionFromAuthor",ref:"js/04-fiches.js:142"},{kind:"fn",name:"openNotionAccroche",ref:"js/04-fiches.js:154"},{kind:"var",name:"pendingConceptMention",ref:"js/04-fiches.js:13"},{kind:"var",name:"pendingAuthorMention",ref:"js/04-fiches.js:14"},{kind:"var",name:"pendingAccroche",ref:"js/04-fiches.js:15"}] },

    { id:"nav.keys", label:"Clés localStorage", niveau:1, parent:"nav", domaine:"nav",
      novice:"Les petits dossiers où le navigateur range ta position, ton historique, tes modes d'affichage et le fait que tu as vu la visite.",
      ingenieur:"Cinq clés de stockage local pour la navigation et l'affichage.",
      symbols:[{kind:"key",name:"philo-nav",ref:"js/02-navigation.js:16"},{kind:"key",name:"philo-navhist",ref:"js/02-navigation.js:66"},{kind:"key",name:"philo-mode",ref:"index.html:60"},{kind:"key",name:"philo-fiche",ref:"js/07-affichage-reglages.js:36"},{kind:"key",name:"philo-onboarded",ref:"index.html:62"}] },
      { id:"nav.keys.nav", label:"philo-nav", niveau:2, parent:"nav.keys", domaine:"nav",
        novice:"Ta position actuelle dans le site.",
        ingenieur:"localStorage 'philo-nav' = état de position sérialisé (persistNav / restoreNavFromStorage). Inclus dans la sync cloud (preferences.nav).",
        symbols:[{kind:"key",name:"philo-nav",ref:"js/02-navigation.js:16"}] },
      { id:"nav.keys.navhist", label:"philo-navhist", niveau:2, parent:"nav.keys", domaine:"nav",
        novice:"L'historique du bouton Retour.",
        ingenieur:"localStorage 'philo-navhist' = pile navHistory. Local par appareil (non synchronisé).",
        symbols:[{kind:"key",name:"philo-navhist",ref:"js/02-navigation.js:66"}] },
      { id:"nav.keys.mode", label:"philo-mode", niveau:2, parent:"nav.keys", domaine:"nav",
        novice:"Le mode d'affichage : révision (épuré) ou édition (outils).",
        ingenieur:"localStorage 'philo-mode' ∈ revision|edition (applyPhiloMode/togglePhiloMode). Synchronisé (preferences.mode).",
        symbols:[{kind:"key",name:"philo-mode",ref:"index.html:60"}] },
      { id:"nav.keys.onboarded", label:"philo-onboarded", niveau:2, parent:"nav.keys", domaine:"nav",
        novice:"Le fait que tu as déjà vu la visite guidée.",
        ingenieur:"localStorage 'philo-onboarded' = drapeau de 1re visite (tourStartIfFirst).",
        symbols:[{kind:"key",name:"philo-onboarded",ref:"index.html:62"}] },
      { id:"nav.keys.fiche", label:"philo-fiche", niveau:2, parent:"nav.keys", domaine:"nav",
        novice:"Le « mode fiche » : afficher les auteurs en version compressée (lecture rapide) ou complète.",
        ingenieur:"localStorage 'philo-fiche' ∈ 0|1 (applyFicheMode/toggleFicheMode → classe body.mode-fiche). Borne chaque boîte d'auteur des notions à ~2 lignes et masque les citations.",
        symbols:[{kind:"key",name:"philo-fiche",ref:"js/07-affichage-reglages.js:36"}] },

  /* ═══════════════ QUIZ ═══════════════ */
  { id:"quiz", label:"Quiz (révision)", niveau:0, parent:null, domaine:"quiz",
    novice:"Le mode révision par cartes : une question, tu retournes la carte, tu dis si tu savais. Les cartes ratées reviennent plus souvent.",
    ingenieur:"Overlay de répétition espacée (Leitner) entièrement dérivé de CONCEPTS/D/AI. Progression et gamification dans localStorage philo-quiz ; session reprenable après actualisation." },

    { id:"quiz.cards", label:"Génération des cartes", niveau:1, parent:"quiz", domaine:"quiz",
      novice:"La fabrique des cartes de révision à partir du contenu du site (aucune carte n'est écrite à la main). Une question ne contient jamais sa réponse, et seules les vraies citations (entre guillemets) servent à « Qui a dit cela ? ».",
      ingenieur:"buildQuizCards() dérive 5 types de cartes de CONCEPTS/D/AI. stripHtml() nettoie les définitions. QUIZ_CARDS = toutes les cartes ; QUIZ_BY_ID = index par id stable. Depuis la v4 (oct. 2026) : id des citations = empreinte du texte (quizHash + quizFold) et non plus leur position, une citation sous plusieurs notions = une carte (champ notions) ; quizQuoted() garde les seules parties « … » ; quizMaskTerm() masque le terme et sa famille dans la définition (sinon pas de carte « Quel concept ? ») ; quizThesis() résume une idée pour la carte notion→auteurs. QUIZ_LEGACY = ancien id → nouvel id.",
      symbols:[{kind:"fn",name:"buildQuizCards",ref:"js/13-quiz.js:114"},{kind:"var",name:"QUIZ_CARDS",ref:"js/13-quiz.js:180"},{kind:"var",name:"QUIZ_BY_ID",ref:"js/13-quiz.js:182"},{kind:"fn",name:"stripHtml",ref:"js/13-quiz.js:19"},{kind:"fn",name:"quizHash",ref:"js/13-quiz.js:52"},{kind:"fn",name:"quizFold",ref:"js/13-quiz.js:60"},{kind:"fn",name:"quizQuoted",ref:"js/13-quiz.js:67"},{kind:"fn",name:"quizMaskTerm",ref:"js/13-quiz.js:82"},{kind:"fn",name:"quizThesis",ref:"js/13-quiz.js:106"},{kind:"var",name:"QUIZ_LEGACY",ref:"js/13-quiz.js:113"}],
      liens:[{to:"donnees.globales",type:"lit",note:"Toutes les cartes sont dérivées de CONCEPTS / D / AI."}] },
      { id:"quiz.cards.types", label:"Types de carte", niveau:2, parent:"quiz.cards", domaine:"quiz",
        novice:"Les cinq familles de cartes : terme↔définition, citation↔auteur, et notion→auteurs.",
        ingenieur:"5 types générés par buildQuizCards. def-concept et cite-author supportent le QCM ; les autres restent en flip.",
        symbols:[{kind:"var",name:"concept-def",ref:"js/04-fiches.js:273"},{kind:"var",name:"def-concept",ref:"js/13-quiz.js:30"},{kind:"var",name:"cite-author",ref:"js/13-quiz.js:31"},{kind:"var",name:"author-cite",ref:"js/13-quiz.js:32"},{kind:"var",name:"notion-authors",ref:"js/13-quiz.js:33"}] },

    { id:"quiz.leitner", label:"Moteur Leitner", niveau:1, parent:"quiz", domaine:"quiz",
      novice:"La logique de répétition espacée : une bonne réponse espace la carte, un échec la fait revenir vite. Les cartes nouvelles sont tirées au hasard, toutes notions mêlées.",
      ingenieur:"QUIZ_INTERVALS (sprint/long, jours par palier). isDue() = carte due aujourd'hui. onAnswer() promeut/rétrograde le palier, met à jour série + XP et renvoie le récap. pickSession() compose la session (dues triées par palier, puis nouvelles TIRÉES AU HASARD depuis la v4 ; avant, l'ordre du fichier redonnait toujours les mêmes 15 cartes). isDue/cardsForFilter/pickSession/quizStats reçoivent l'état lu une fois (st) au lieu de relire le stockage pour chaque carte.",
      symbols:[{kind:"var",name:"QUIZ_INTERVALS",ref:"js/13-quiz.js:190"},{kind:"fn",name:"isDue",ref:"js/13-quiz.js:295"},{kind:"fn",name:"onAnswer",ref:"js/13-quiz.js:308"},{kind:"fn",name:"pickSession",ref:"js/13-quiz.js:381"},{kind:"fn",name:"cardsForFilter",ref:"js/13-quiz.js:351"},{kind:"fn",name:"quizStats",ref:"js/13-quiz.js:437"}] },

    { id:"quiz.state", label:"État & persistance", niveau:1, parent:"quiz", domaine:"quiz",
      novice:"Ce qui garde ta progression de révision même si tu fermes l'onglet.",
      ingenieur:"quizState = état runtime ; loadQuizState()/saveQuizState() lisent/écrivent localStorage philo-quiz (deux horizons, gamification, session active, et depuis la v4 activeAt/resetAt/epoch pour la fusion entre appareils). migrateQuizState() convertit les anciens ids de cartes (marqueur idv=2). persistActive() sérialise la session en cours. todayStr() = date LOCALE (avant : UTC).",
      symbols:[{kind:"var",name:"quizState",ref:"js/13-quiz.js:199"},{kind:"fn",name:"migrateQuizState",ref:"js/13-quiz.js:212"},{kind:"fn",name:"loadQuizState",ref:"js/13-quiz.js:244"},{kind:"fn",name:"saveQuizState",ref:"js/13-quiz.js:260"},{kind:"fn",name:"todayStr",ref:"js/13-quiz.js:264"},{kind:"fn",name:"persistActive",ref:"js/13-quiz.js:281"},{kind:"key",name:"philo-quiz",ref:"index.html:69"}] },

    { id:"quiz.views", label:"Vues & session", niveau:1, parent:"quiz", domaine:"quiz",
      novice:"L'écran d'accueil du quiz (niveau, objectif, filtres), le déroulé d'une session et le récap de fin.",
      ingenieur:"renderQuiz() aiguille dashboard/session/end. openQuiz() reconstruit la session active. beginSession()/resumeQuizSession()/requestNewSession() gèrent reprise et nouvelle session (avertissement).",
      symbols:[{kind:"fn",name:"renderQuiz",ref:"js/13-quiz.js:490"},{kind:"fn",name:"renderQuizDashboard",ref:"js/13-quiz.js:501"},{kind:"fn",name:"openQuiz",ref:"js/13-quiz.js:480"},{kind:"fn",name:"closeQuiz",ref:"js/13-quiz.js:487"},{kind:"fn",name:"beginSession",ref:"js/13-quiz.js:684"},{kind:"fn",name:"resumeQuizSession",ref:"js/13-quiz.js:719"},{kind:"fn",name:"requestNewSession",ref:"js/13-quiz.js:699"},{kind:"fn",name:"renderNewSessionWarning",ref:"js/13-quiz.js:669"}] },

    { id:"quiz.flip", label:"Cartes flip", niveau:1, parent:"quiz", domaine:"quiz",
      novice:"L'animation qui retourne la carte pour révéler la réponse — et permet de revenir à la question.",
      ingenieur:"renderFlipBody() empile 2 faces (CSS rotateY). revealQuiz() ajoute .flipped (sans re-rendu) ; flipToQuestion() la retire pour relire la question.",
      symbols:[{kind:"fn",name:"renderFlipBody",ref:"js/13-quiz.js:805"},{kind:"fn",name:"revealQuiz",ref:"js/13-quiz.js:873"},{kind:"fn",name:"flipToQuestion",ref:"js/13-quiz.js:886"}] },

    { id:"quiz.qcm", label:"Mode QCM", niveau:1, parent:"quiz", domaine:"quiz",
      novice:"La variante à choix multiples : 4 réponses proposées au lieu de retourner la carte.",
      ingenieur:"prepareCard() pré-calcule les choix ; buildQCMChoices() génère 4 options (3 distracteurs de même catégorie). qcmAnswer() → recordResult() (factorise l'enregistrement Leitner des 2 modes) → advanceQuiz().",
      symbols:[{kind:"fn",name:"prepareCard",ref:"js/13-quiz.js:736"},{kind:"fn",name:"buildQCMChoices",ref:"js/13-quiz.js:755"},{kind:"fn",name:"qcmAnswer",ref:"js/13-quiz.js:900"},{kind:"fn",name:"recordResult",ref:"js/13-quiz.js:911"},{kind:"fn",name:"advanceQuiz",ref:"js/13-quiz.js:924"}] },

    { id:"quiz.gamif", label:"Gamification & badges", niveau:1, parent:"quiz", domaine:"quiz",
      novice:"Les points d'expérience, les niveaux, la maîtrise par notion et les badges.",
      ingenieur:"quizLevel()/quizXpInLevel() dérivent le niveau ⭐ des XP. notionMastery() = % maîtrisé par notion (une carte compte pour toutes ses notions) ; quizBadges() = 1 badge/notion quand QUIZ_BADGE_PCT (80 %) de ses cartes sont mémorisées (palier ≥ 4 ; avant la v4 : toutes au palier 5). redoWrong() relance les ratés.",
      symbols:[{kind:"fn",name:"quizLevel",ref:"js/13-quiz.js:270"},{kind:"fn",name:"quizXpInLevel",ref:"js/13-quiz.js:271"},{kind:"fn",name:"notionMastery",ref:"js/13-quiz.js:937"},{kind:"var",name:"QUIZ_BADGE_PCT",ref:"js/13-quiz.js:950"},{kind:"fn",name:"quizBadges",ref:"js/13-quiz.js:951"},{kind:"fn",name:"redoWrong",ref:"js/13-quiz.js:1001"}] },

    { id:"quiz.reread", label:"Relire la fiche", niveau:1, parent:"quiz", domaine:"quiz",
      novice:"Le bouton qui, depuis une carte, ouvre la fiche d'où elle vient (concept, citations de l'auteur ou notion), sans perdre la session.",
      ingenieur:"quizReread() (v4, idée reprise de Fiches BUT) : persistActive() puis closeQuiz(), et openConcept / openAuthor (onglet Citations) / openNotion selon la carte. Une carte QCM déjà répondue est passée pour ne pas être rejouée.",
      symbols:[{kind:"fn",name:"quizReread",ref:"js/13-quiz.js:857"}],
      liens:[{to:"quiz.state",type:"ecrit",note:"Sauvegarde la session avant de sortir."}] },

  /* ═══════════════ CONTRIBUTION ═══════════════ */
  { id:"contrib", label:"Contribution", niveau:0, parent:null, domaine:"contrib",
    novice:"Les visiteurs peuvent proposer du contenu (une idée d'auteur, un concept, un exemple…). La proposition part en ligne pour être relue avant d'être ajoutée.",
    ingenieur:"Modale de proposition « boîtes ». Génère un texte lisible + un bloc JSON (schéma philo-proposal/v3). Envoi dans Supabase (connecté, ou anonyme avec user_id NULL), repli mailto automatique." },

    { id:"contrib.model", label:"Modèle « boîtes »", niveau:1, parent:"contrib", domaine:"contrib",
      novice:"Une proposition = une ou plusieurs boîtes, chacune avec un menu à deux niveaux et une action (ajout/correction/remarque).",
      ingenieur:"proposalBoxes = boîtes {id, categorie, cible, type, f}. PROPOSAL_SOUSCIBLES mappe catégorie→sous-cibles ; CIBLE_CAT/cibleCat() font l'inverse (et la rétro-compat).",
      symbols:[{kind:"var",name:"proposalBoxes",ref:"js/06-contribution.js:127"},{kind:"var",name:"PROPOSAL_SOUSCIBLES",ref:"js/06-contribution.js:80"},{kind:"var",name:"CIBLE_CAT",ref:"js/06-contribution.js:108"},{kind:"fn",name:"cibleCat",ref:"js/06-contribution.js:115"}] },

    { id:"contrib.render", label:"Rendu de la modale", niveau:1, parent:"contrib", domaine:"contrib",
      novice:"L'affichage du formulaire de proposition et les boutons « + » dans les fiches.",
      ingenieur:"renderProposal() rend la modale ; renderBoxFields() dispatche les champs par (categorie × cible × type). openProposalFromPlus() ouvre depuis un bouton + (pPlus/pPlusCat).",
      symbols:[{kind:"fn",name:"renderProposal",ref:"js/06-contribution.js:1351"},{kind:"fn",name:"renderBoxFields",ref:"js/06-contribution.js:635"},{kind:"fn",name:"openProposalFromPlus",ref:"js/06-contribution.js:1488"},{kind:"fn",name:"pPlus",ref:"js/06-contribution.js:1462"},{kind:"fn",name:"pPlusCat",ref:"js/06-contribution.js:1467"}] },

    { id:"contrib.draft", label:"Brouillon", niveau:1, parent:"contrib", domaine:"contrib",
      novice:"Ta proposition en cours est gardée automatiquement, pour ne rien perdre.",
      ingenieur:"draftChanged() persiste le brouillon dans localStorage philo-drafts (et synchronise si connecté). Suspendu pendant l'édition d'un envoi existant.",
      symbols:[{kind:"fn",name:"draftChanged",ref:"js/06-contribution.js:162"},{kind:"key",name:"philo-drafts",ref:"js/06-contribution.js:144"}] },

    { id:"contrib.generate", label:"Génération texte + JSON", niveau:1, parent:"contrib", domaine:"contrib",
      novice:"La proposition est transformée en un message lisible accompagné d'un code que le programme des coulisses sait lire.",
      ingenieur:"generateProposalText() produit une partie lisible + un bloc JSON (schéma 'philo-proposal/v3') délimité par [PHILO-PROPOSAL-JSON-START]/END.",
      symbols:[{kind:"fn",name:"generateProposalText",ref:"js/06-contribution.js:938"},{kind:"var",name:"philo-proposal/v3",ref:"js/06-contribution.js:922"},{kind:"var",name:"PHILO-PROPOSAL-JSON-START",ref:"js/06-contribution.js:937"}] },

    { id:"contrib.submit", label:"Envoi", niveau:1, parent:"contrib", domaine:"contrib",
      novice:"L'envoi de la proposition : par ton compte si tu es connecté, sinon en anonyme ; en dernier recours, par e-mail.",
      ingenieur:"submitProposalOnline() aiguille : connecté → sendProposalToSupabase (table contributions) ; anonyme → sendProposalAnonSupabase (même table, user_id NULL) ; Supabase indisponible ou échec → proposalMailtoFallback() = repli mailto (PROPOSAL_EMAIL). La boîte PythonAnywhere (sendProposalOnline) a été retirée en oct. 2026.",
      symbols:[{kind:"fn",name:"submitProposalOnline",ref:"js/06-contribution.js:1115"},{kind:"fn",name:"sendProposalToSupabase",ref:"js/06-contribution.js:1022"},{kind:"fn",name:"sendProposalAnonSupabase",ref:"js/06-contribution.js:1049"},{kind:"fn",name:"sendProposal",ref:"js/06-contribution.js:985"},{kind:"fn",name:"proposalMailtoFallback",ref:"js/06-contribution.js:1000"},{kind:"var",name:"PROPOSAL_EMAIL",ref:"js/06-contribution.js:36"}] },

    { id:"contrib.edit", label:"Édition d'un envoi", niveau:1, parent:"contrib", domaine:"contrib",
      novice:"Tant qu'une proposition n'est pas traitée, tu peux la modifier depuis « Mes propositions ».",
      ingenieur:"editMyContribution() reconstruit les boîtes via boxesFromPayload() ; updateProposalInSupabase() fait l'UPDATE (RLS : seulement statut 'en_attente'). exitEditContrib() restaure le brouillon mis de côté (editDraftBackup).",
      symbols:[{kind:"fn",name:"editMyContribution",ref:"js/06-contribution.js:1182"},{kind:"fn",name:"boxesFromPayload",ref:"js/06-contribution.js:1164"},{kind:"fn",name:"updateProposalInSupabase",ref:"js/06-contribution.js:1131"},{kind:"fn",name:"exitEditContrib",ref:"js/06-contribution.js:1205"},{kind:"var",name:"editingContribId",ref:"js/06-contribution.js:137"},{kind:"var",name:"myContribCache",ref:"js/06-contribution.js:139"}] },

  /* ═══════════════ COMPTE / SYNC ═══════════════ */
  { id:"sync", label:"Compte / Sync", niveau:0, parent:null, domaine:"sync",
    novice:"Si tu te connectes, tes révisions, ta position et tes brouillons te suivent d'un appareil à l'autre.",
    ingenieur:"Client Supabase (SB), version figée + empreinte d'intégrité. Auth Google ou e-mail. Préférences (nav/drafts/mode/tour) via la table preferences ; progression du quiz via la table quiz_progress (fusion carte par carte) ; propositions via la table contributions." },

    { id:"sync.client", label:"Client Supabase", niveau:1, parent:"sync", domaine:"sync",
      novice:"La connexion au service en ligne qui stocke comptes et données.",
      ingenieur:"SB = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) — clé anon/publishable (publique). null si la lib n'est pas chargée.",
      symbols:[{kind:"var",name:"SB",ref:"js/06-contribution.js:51"},{kind:"var",name:"SUPABASE_URL",ref:"js/06-contribution.js:46"},{kind:"var",name:"SUPABASE_ANON_KEY",ref:"js/06-contribution.js:47"}] },

    { id:"sync.auth", label:"Authentification", niveau:1, parent:"sync", domaine:"sync",
      novice:"Se connecter avec un compte Google, et se déconnecter.",
      ingenieur:"initAuth() lit la session et s'abonne aux changements ; openAuth() ouvre la modale ; authSignInGoogle()/authSignOut() gèrent la session.",
      symbols:[{kind:"fn",name:"initAuth",ref:"js/09-compte.js:25"},{kind:"fn",name:"openAuth",ref:"js/09-compte.js:115"},{kind:"fn",name:"authSignInGoogle",ref:"js/09-compte.js:263"},{kind:"fn",name:"authSignOut",ref:"js/09-compte.js:309"}] },

    { id:"sync.prefs", label:"Préférences cross-appareil", niveau:1, parent:"sync", domaine:"sync",
      novice:"Ce qui fait voyager ta progression et tes réglages entre tes appareils.",
      ingenieur:"prefsBlobForSync() agrège {mode, tour, nav, drafts} (le quiz a sa propre table, cf. sync.quiz) ; applyPrefsBlob() adopte le distant (sans téléporter l'utilisateur en pleine lecture) ; syncOnPrefsChange() pousse (debouncé) après une vraie navigation. Dernière écriture gagne.",
      symbols:[{kind:"fn",name:"prefsBlobForSync",ref:"js/11-synchro.js:81"},{kind:"fn",name:"applyPrefsBlob",ref:"js/11-synchro.js:96"},{kind:"fn",name:"syncOnPrefsChange",ref:"js/11-synchro.js:387"}],
      liens:[{to:"nav.persist",type:"lit",note:"prefsBlobForSync lit philo-nav."},{to:"contrib.draft",type:"lit",note:"prefsBlobForSync lit philo-drafts."}] },

    { id:"sync.quiz", label:"Progression du quiz cross-appareil", niveau:1, parent:"sync", domaine:"sync",
      novice:"Ce qui fait que tes révisions faites sur le téléphone et sur l'ordinateur s'additionnent au lieu de s'écraser, même hors ligne.",
      ingenieur:"Depuis la v4 : mergeQuiz() fusionne carte par carte (révision la plus récente gagne), en oubliant ce qui précède une remise à zéro datée (epoch, resetAt) ; syncOnLogin()/syncOnFocus() fusionnent au lieu d'adopter le distant, puis renvoient la fusion si quizDiffers() ; syncDirty compte ce qui reste à envoyer, syncFlush() l'envoie quand la page se cache, et l'évènement « online » relance une synchro.",
      symbols:[{kind:"fn",name:"mergeQuiz",ref:"js/11-synchro.js:162"},{kind:"fn",name:"syncOnLogin",ref:"js/11-synchro.js:225"},{kind:"fn",name:"syncOnFocus",ref:"js/11-synchro.js:398"},{kind:"var",name:"syncDirty",ref:"js/11-synchro.js:315"},{kind:"fn",name:"syncPushQuiz",ref:"js/11-synchro.js:317"},{kind:"fn",name:"syncFlush",ref:"js/11-synchro.js:358"},{kind:"fn",name:"quizDiffers",ref:"js/11-synchro.js:369"}],
      liens:[{to:"quiz.state",type:"lit",note:"Lit et réécrit philo-quiz (fusion)."},{to:"sync.tables.quiz_progress",type:"ecrit",note:"Upsert du blob quiz."}] },

    { id:"sync.banc", label:"Banc d'essai des règles d'accès", niveau:1, parent:"sync", domaine:"sync",
      novice:"Une fausse base de données, montée sur l'ordinateur, sur laquelle on vérifie que personne ne peut lire ou modifier ce qui ne lui appartient pas.",
      ingenieur:"outils/banc/banc_schema.mjs (oct. 2026) : PGlite + decor_supabase.sql (rôles et droits par défaut de Supabase, auth.uid()) ; joue ORDRE (les migrations) puis 10 essais sous un rôle via sous(), chacun avec un témoin qui retire la règle. A révélé que le REVOKE colonne de 2026_aggregator_state.sql ne cachait rien.",
      symbols:[{kind:"var",name:"ORDRE",ref:"outils/banc/banc_schema.mjs:29"},{kind:"var",name:"ESSAIS",ref:"outils/banc/banc_schema.mjs:63"},{kind:"fn",name:"sous",ref:"outils/banc/banc_schema.mjs:47"}],
      liens:[{to:"sync.tables",type:"lit",note:"Éprouve les règles des tables Supabase."}] },

    { id:"sync.tables", label:"Tables Supabase", niveau:1, parent:"sync", domaine:"sync",
      novice:"Les trois tableaux en ligne : tes propositions, tes préférences et ta progression au quiz.",
      ingenieur:"Trois tables PostgREST, protégées par RLS (auth.uid() = user_id). Schéma versionné depuis oct. 2026 dans philo-aggregator/migrations/ (2026_schema_base.sql, reconstitué depuis le code ; droits colonne par colonne sur contributions : 2026_contributions_colonnes.sql), éprouvé par outils/banc/banc_schema.mjs (PGlite, un témoin par essai).",
      symbols:[{kind:"table",name:"contributions",ref:"js/06-contribution.js:1028"},{kind:"table",name:"preferences",ref:"js/11-synchro.js:234"},{kind:"table",name:"quiz_progress",ref:"js/11-synchro.js:233"}] },
      { id:"sync.tables.quiz_progress", label:"quiz_progress", niveau:2, parent:"sync.tables", domaine:"sync",
        novice:"Le tableau qui stocke ta progression au quiz pour la retrouver sur un autre appareil.",
        ingenieur:"Table 'quiz_progress' {user_id, data, updated_at}. data = l'objet philo-quiz entier (quizBlobForSync).",
        symbols:[{kind:"table",name:"quiz_progress",ref:"js/11-synchro.js:233"}] },
      { id:"sync.tables.contributions", label:"contributions", niveau:2, parent:"sync.tables", domaine:"sync",
        novice:"Le tableau qui stocke les propositions envoyées depuis un compte.",
        ingenieur:"Table 'contributions' {id, user_id, payload, statut…}. Écrite par sendProposalToSupabase/updateProposalInSupabase ; relue côté agrégateur et pour « Mes propositions ».",
        symbols:[{kind:"table",name:"contributions",ref:"js/06-contribution.js:1028"}] },
      { id:"sync.tables.preferences", label:"preferences", niveau:2, parent:"sync.tables", domaine:"sync",
        novice:"Le tableau qui stocke tes réglages et ta progression pour les retrouver ailleurs.",
        ingenieur:"Table 'preferences' {user_id, data, updated_at}. data = blob prefsBlobForSync (nav/drafts/mode/tour).",
        symbols:[{kind:"table",name:"preferences",ref:"js/11-synchro.js:234"}] },

  /* ═══════════════ PWA ═══════════════ */
  { id:"pwa", label:"PWA (hors-ligne)", niveau:0, parent:null, domaine:"pwa",
    novice:"Le site s'installe comme une appli et marche sans connexion. Une simple actualisation récupère la dernière version.",
    ingenieur:"manifest.json + sw.js. Cache mixte : réseau-d'abord pour le code (HTML/JS), cache-d'abord pour les assets. Rechargement transparent au changement de Service Worker." },

    { id:"pwa.sw", label:"Service Worker", niveau:1, parent:"pwa", domaine:"pwa",
      novice:"Le petit programme de fond qui garde une copie du site pour le faire marcher hors-ligne.",
      ingenieur:"sw.js : CACHE = 'philo-vN' (à incrémenter à chaque modif d'un fichier précaché). PRECACHE liste les ressources. fetch : réseau-d'abord (code) / cache-d'abord (icône, manifeste, polices).",
      symbols:[{kind:"var",name:"CACHE",ref:"sw.js:13"},{kind:"var",name:"PRECACHE",ref:"sw.js:14"}] },

    { id:"pwa.register", label:"Enregistrement & MAJ", niveau:1, parent:"pwa", domaine:"pwa",
      novice:"Ce qui installe le programme de fond et récupère sans heurt la dernière version.",
      ingenieur:"index.html enregistre sw.js, appelle reg.update() au chargement, et recharge une fois sur 'controllerchange' (garde anti-boucle swReloading).",
      symbols:[{kind:"var",name:"swReloading",ref:"js/12-demarrage.js:32"},{kind:"var",name:"controllerchange",ref:"js/12-demarrage.js:25"},{kind:"var",name:"register",ref:"js/09-compte.js:377"}],
      note:"controllerchange/register ne sont pas des fonctions nommées mais des appels (addEventListener/serviceWorker.register) ; cités pour le repère de ligne." },

    { id:"pwa.manifest", label:"Manifeste", niveau:1, parent:"pwa", domaine:"pwa",
      novice:"La carte d'identité de l'appli installable (nom, icône, écran de démarrage).",
      ingenieur:"manifest.json : name, start_url, display:standalone, icons (icon.svg).",
      symbols:[{kind:"var",name:"start_url",ref:"manifest.json:6"},{kind:"var",name:"display",ref:"manifest.json:8"}] },


  /* ═══════════════ RÉFÉRENCEMENT (SEO) ═══════════════ */
  { id:"seo", label:"Référencement (SEO)", niveau:0, parent:null, domaine:"seo",
    novice:"Ce qui aide Google à trouver et indexer le site — ça n'a rien à voir avec le hors-ligne (PWA).",
    ingenieur:"Fichiers statiques à la racine destinés aux moteurs de recherche (et non au fonctionnement de l'appli)." },

    { id:"seo.sitemap", label:"sitemap.xml", niveau:1, parent:"seo", domaine:"seo",
      novice:"Le plan du site : la liste des pages, donnée à Google.",
      ingenieur:"sitemap.xml — un <urlset> listant les URL (loc, lastmod, changefreq, priority).",
      symbols:[{kind:"route",name:"urlset",ref:"sitemap.xml:2"}] },
    { id:"seo.robots", label:"robots.txt", niveau:1, parent:"seo", domaine:"seo",
      novice:"Les consignes pour les robots des moteurs : ce qu'ils peuvent explorer.",
      ingenieur:"robots.txt (nom exact attendu par les moteurs ; s'appelait robot.txt, donc jamais lu, jusqu'en oct. 2026) : User-agent / Allow + un pointeur Sitemap vers sitemap.xml.",
      symbols:[{kind:"route",name:"User-agent",ref:"robots.txt:1"}] },

  /* ═══════════════ BACKEND AGRÉGATEUR ═══════════════ */
  { id:"backend", label:"Backend agrégateur", niveau:0, parent:null, domaine:"backend",
    novice:"Côté coulisses (sur l'ordinateur de l'enseignant) : un programme récupère les propositions, les fait relire par une IA, puis les présente pour décider quoi garder.",
    ingenieur:"Pipeline Python local (philo-aggregator/) : pull-cloud (Supabase) → ingest (dédup par signature) → relecture Gemini → dashboard Flask de tri → push statut → export pour intégration manuelle dans data.js." },

    { id:"backend.pipeline", label:"Orchestration", niveau:1, parent:"backend", domaine:"backend",
      novice:"Le chef d'orchestre qui va chercher les propositions et renvoie les décisions.",
      ingenieur:"pipeline.py : pull_cloud_and_ingest (Supabase, idempotent via remote_id), sync_cloud (bidirectionnel), push_contribution_status (renvoie statut + explication au contributeur).",
      symbols:[{kind:"fn",name:"pull_cloud_and_ingest",ref:"philo-aggregator/pipeline.py:29"},{kind:"fn",name:"sync_cloud",ref:"philo-aggregator/pipeline.py:195"},{kind:"fn",name:"push_contribution_status",ref:"philo-aggregator/pipeline.py:106"},{kind:"fn",name:"derive_local_status",ref:"philo-aggregator/pipeline.py:93"}] },

    { id:"backend.ingest", label:"Ingestion & dédup", niveau:1, parent:"backend", domaine:"backend",
      novice:"Le tri d'entrée : lit le code d'une proposition, vérifie qu'il est valide, repère les doublons.",
      ingenieur:"ingest.py : extract_json_block (marqueurs), validate_payload (SUPPORTED_SCHEMAS v1/v2/v3), compute_signature (empreinte SHA256 anti-doublon), ingest_text/ingest_payload, run (boucle inbox).",
      symbols:[{kind:"fn",name:"extract_json_block",ref:"philo-aggregator/ingest.py:49"},{kind:"fn",name:"validate_payload",ref:"philo-aggregator/ingest.py:65"},{kind:"var",name:"SUPPORTED_SCHEMAS",ref:"philo-aggregator/ingest.py:62"},{kind:"fn",name:"compute_signature",ref:"philo-aggregator/ingest.py:221"},{kind:"fn",name:"ingest_payload",ref:"philo-aggregator/ingest.py:271"},{kind:"fn",name:"run",ref:"philo-aggregator/ingest.py:427"}] },

    { id:"backend.review", label:"Relecture Gemini", niveau:1, parent:"backend", domaine:"backend",
      novice:"Une IA lit chaque proposition et donne un avis (valable, douteux, à rejeter) avant la décision humaine.",
      ingenieur:"review.py : SDK google-genai (client genai.Client, adaptateur _GeminiModel ; remplace google-generativeai, abandonné par Google fin 2025), modèle DEFAULT_MODEL='gemini-flash-latest' (surchargé par GEMINI_MODEL), SYSTEM_INSTRUCTION (rôle + format JSON). review_box() interroge Gemini (gestion des quotas) ; parse_verdict() extrait le verdict ; run() boucle. Exclut les retours « site » (SITE_CIBLES).",
      symbols:[{kind:"var",name:"DEFAULT_MODEL",ref:"philo-aggregator/review.py:41"},{kind:"var",name:"SYSTEM_INSTRUCTION",ref:"philo-aggregator/review.py:67"},{kind:"fn",name:"_configure_model",ref:"philo-aggregator/review.py:117"},{kind:"fn",name:"parse_verdict",ref:"philo-aggregator/review.py:150"},{kind:"fn",name:"review_box",ref:"philo-aggregator/review.py:248"},{kind:"fn",name:"run",ref:"philo-aggregator/review.py:302"}] },

    { id:"backend.db", label:"Base locale (SQLite)", niveau:1, parent:"backend", domaine:"backend",
      novice:"Le carnet où le programme range les propositions reçues et leur état.",
      ingenieur:"db.py : SQLite proposals.db, tables submissions (1/fichier) et boxes (1/boîte). Statuts (STATUSES), catégories/cibles. update_status() et set_ai_review() font évoluer chaque boîte. get_unreviewed_boxes() exclut SITE_CIBLES.",
      symbols:[{kind:"table",name:"submissions",ref:"philo-aggregator/db.py:101"},{kind:"table",name:"boxes",ref:"philo-aggregator/db.py:116"},{kind:"var",name:"STATUSES",ref:"philo-aggregator/db.py:34"},{kind:"fn",name:"init_db",ref:"philo-aggregator/db.py:252"},{kind:"fn",name:"update_status",ref:"philo-aggregator/db.py:524"},{kind:"fn",name:"set_ai_review",ref:"philo-aggregator/db.py:570"},{kind:"fn",name:"get_unreviewed_boxes",ref:"philo-aggregator/db.py:446"}] },

    { id:"backend.supabase", label:"Client Supabase (serveur)", niveau:1, parent:"backend", domaine:"backend",
      novice:"Le lien entre le programme des coulisses et le tableau en ligne des propositions.",
      ingenieur:"supabase_client.py : TABLE='contributions'. pull_pending()/pull_all() tirent les contributions ; set_status()/set_aggregator_state() renvoient statut et état de travail (clé service_role).",
      symbols:[{kind:"var",name:"TABLE",ref:"philo-aggregator/supabase_client.py:44"},{kind:"fn",name:"pull_pending",ref:"philo-aggregator/supabase_client.py:148"},{kind:"fn",name:"pull_all",ref:"philo-aggregator/supabase_client.py:180"},{kind:"fn",name:"set_status",ref:"philo-aggregator/supabase_client.py:241"},{kind:"fn",name:"set_aggregator_state",ref:"philo-aggregator/supabase_client.py:210"}] },

    { id:"backend.dashboard", label:"Tableau de bord", niveau:1, parent:"backend", domaine:"backend",
      novice:"La page web locale où l'enseignant trie les propositions (garder, corriger, rejeter).",
      ingenieur:"dashboard.py : petit serveur Flask local (port DASHBOARD_PORT, défaut 5002). _run_review_thread() lance la relecture IA en fond ; _card() rend chaque boîte avec ses actions.",
      symbols:[{kind:"fn",name:"run",ref:"philo-aggregator/dashboard.py:969"},{kind:"fn",name:"_run_review_thread",ref:"philo-aggregator/dashboard.py:118"},{kind:"fn",name:"_card",ref:"philo-aggregator/dashboard.py:391"}] },

    { id:"backend.export", label:"Export relecture", niveau:1, parent:"backend", domaine:"backend",
      novice:"L'export d'un fichier texte regroupant les propositions à intégrer à la main dans le contenu.",
      ingenieur:"export.py : génère review_*.txt (boîtes en attente, groupées par section), chaque boîte préfixée [BOX <id>]. FIELD_LABELS mappe les noms de champ.",
      symbols:[{kind:"var",name:"FIELD_LABELS",ref:"philo-aggregator/export.py:32"}] },

    { id:"backend.cli", label:"Ligne de commande", niveau:1, parent:"backend", domaine:"backend",
      novice:"Les commandes tapées au clavier pour piloter le programme (ingest, pull, review, dashboard…).",
      ingenieur:"aggregate.py : point d'entrée. build_parser() déclare les sous-commandes (ingest/pull_cloud/sync/push/review/list/show/dupes/export/mark/note/archive/purge/stats/dashboard) ; main() initialise la base et dispatch.",
      symbols:[{kind:"fn",name:"build_parser",ref:"philo-aggregator/aggregate.py:300"},{kind:"fn",name:"main",ref:"philo-aggregator/aggregate.py:436"}] },

    { id:"backend.view", label:"Affichage terminal", niveau:1, parent:"backend", domaine:"backend",
      novice:"La mise en forme des listes affichées dans le terminal.",
      ingenieur:"view.py : BUCKETS classe chaque cible en section (NOTIONS/AUTEURS/CONCEPTS/RETOURS SITE) ; SECTION_ORDER fixe l'ordre. Les retours « site » sont une section à part (exclue de la relecture Gemini).",
      symbols:[{kind:"var",name:"BUCKETS",ref:"philo-aggregator/view.py:28"},{kind:"var",name:"SECTION_ORDER",ref:"philo-aggregator/view.py:49"}] },

    { id:"backend.config", label:"Config & clients externes", niveau:1, parent:"backend", domaine:"backend",
      novice:"Les réglages secrets (clés, adresses) du cerveau local.",
      ingenieur:"localenv.py : lecteur .env minimal (get/require) — GEMINI_*, SUPABASE_*. (mailbox_client.py, client de la boîte PythonAnywhere, retiré en oct. 2026.)",
      symbols:[{kind:"fn",name:"get",ref:"philo-aggregator/localenv.py:74"},{kind:"fn",name:"require",ref:"philo-aggregator/localenv.py:87"}] },
  ],

  /* ── Arêtes transverses : le « grand circuit » des données ───────────── */
  edges: [
    { from:"contrib.submit", to:"sync.tables.contributions", type:"ecrit",
      note:"Connecté : sendProposalToSupabase INSÈRE la proposition dans la table Supabase contributions." },
    { from:"backend.pipeline", to:"sync.tables.contributions", type:"lit",
      note:"pull_cloud_and_ingest récupère les contributions en attente depuis Supabase (idempotent via remote_id)." },
    { from:"backend.pipeline", to:"backend.ingest", type:"appelle",
      note:"Chaque proposition tirée est ingérée (validée + dédupliquée par signature)." },
    { from:"backend.ingest", to:"backend.db", type:"ecrit",
      note:"ingest_payload insère une ligne submissions + ses boxes dans proposals.db." },
    { from:"backend.review", to:"backend.db", type:"ecrit",
      note:"La relecture Gemini écrit le verdict (set_ai_review) ; les retours « site » (SITE_CIBLES) en sont exclus." },
    { from:"backend.dashboard", to:"backend.pipeline", type:"declenche",
      note:"Le tri manuel sur le dashboard déclenche push_contribution_status." },
    { from:"backend.pipeline", to:"sync.tables.contributions", type:"ecrit",
      note:"push_contribution_status met à jour contributions.statut (+ explication) → visible côté élève dans « Mes propositions »." },
    { from:"backend.export", to:"donnees.globales", type:"produit",
      note:"export.py produit review_*.txt → intégration manuelle du contenu validé dans data.js." },
    { from:"sync.prefs", to:"sync.tables.preferences", type:"ecrit",
      note:"prefsBlobForSync pousse / applyPrefsBlob adopte le blob {nav, drafts, mode, tour}." },
    { from:"donnees.liens", to:"front.notion", type:"produit",
      note:"linkTerms rend cliquables notions/concepts/auteurs dans toute la prose rendue (toutes les vues)." },
    { from:"quiz.cards", to:"donnees.globales", type:"lit",
      note:"buildQuizCards dérive 100% des cartes de CONCEPTS / D / AI (aucune donnée redite)." },
    { from:"ux.search", to:"nav.open", type:"navigue",
      note:"Activer un résultat de la recherche ⌘K ouvre la cible via openNotion/openConcept/openAuthor." }
  ]
};
