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
      "index.html": "Page unique : <style> + HTML + gros <script> (rendu, navigation, quiz, contribution, sync, PWA).",
      "data.js":    "Données globales : D (notions), KEYS, AM (auteurs), CONCEPTS (glossaire + repères), CC (couleurs).",
      "sw.js":      "Service Worker PWA (cache, hors-ligne).",
      "manifest.json": "Métadonnées d'installation PWA.",
      "philo-aggregator/": "Pipeline Python local : ingest des propositions, relecture Gemini, dashboard, export.",
      "philo-mailbox/":    "Mini-service Flask public (PythonAnywhere) : reçoit les propositions anonymes."
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
    { id:"mailbox", label:"Boîte aux lettres",      couleur:"#d4646e" }
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
      symbols:[{kind:"var",name:"TOUR_STEPS",ref:"index.html:5364"}] },
      { id:"ux.tour.steps", label:"Étapes & séquence", niveau:2, parent:"ux.tour", domaine:"ux",
        novice:"La liste des étapes de la visite et la façon dont elles s'enchaînent.",
        ingenieur:"TOUR_STEPS = définitions d'étapes. tourState = {i, mode:'core'|'detail'|'full', decision…}. tourSeq() renvoie les indices actifs selon le mode ; toute la navigation opère sur cette séquence.",
        symbols:[{kind:"var",name:"TOUR_STEPS",ref:"index.html:5364"},{kind:"var",name:"tourState",ref:"index.html:5629"},{kind:"fn",name:"tourSeq",ref:"index.html:5636"},{kind:"fn",name:"markTourCore",ref:"index.html:5615"}] },
      { id:"ux.tour.control", label:"Contrôle de la visite", niveau:2, parent:"ux.tour", domaine:"ux",
        novice:"Démarrer, terminer, ou relancer la visite.",
        ingenieur:"startTour(i, jumped, mode) lance la visite ; endTour() la ferme ; tourStartIfFirst() la déclenche à la 1re venue (drapeau philo-onboarded).",
        symbols:[{kind:"fn",name:"startTour",ref:"index.html:5663"},{kind:"fn",name:"endTour",ref:"index.html:5718"},{kind:"fn",name:"tourStartIfFirst",ref:"index.html:6005"}],
        liens:[{to:"nav.keys.onboarded",type:"lit",note:"philo-onboarded décide si la visite se lance."}] },
      { id:"ux.tour.decision", label:"Écran de choix & sauts", niveau:2, parent:"ux.tour", domaine:"ux",
        novice:"Après l'essentiel, l'écran « Tu connais l'essentiel — voir le détail ? » et le saut direct à une partie.",
        ingenieur:"tourShowDecision()/tourContinueDetailed() enchaînent du noyau au détail ; tourGoPart() saute à une partie ; tourShowSidebarMode() bascule réellement la sidebar dans le mode présenté.",
        symbols:[{kind:"fn",name:"tourShowDecision",ref:"index.html:5765"},{kind:"fn",name:"tourContinueDetailed",ref:"index.html:5784"},{kind:"fn",name:"tourGoPart",ref:"index.html:5679"},{kind:"fn",name:"tourShowSidebarMode",ref:"index.html:5281"}] },

    { id:"ux.search", label:"Recherche globale ⌘K", niveau:1, parent:"ux", domaine:"ux",
      novice:"La barre de recherche rapide (Ctrl+K ou ⌘K) pour sauter à n'importe quelle notion, auteur, concept ou accroche.",
      ingenieur:"Palette de commande. Index pré-calculé une fois au chargement ; un résultat activé appelle le bon open* (openNotion/openConcept/openAuthor/openNotionAccroche).",
      symbols:[{kind:"var",name:"PALETTE_INDEX",ref:"index.html:7803"},{kind:"var",name:"PALETTE_GROUPS",ref:"index.html:7840"},{kind:"var",name:"PALETTE_ORDER",ref:"index.html:7841"}],
      liens:[{to:"nav.open",type:"navigue",note:"Activer un résultat ouvre la cible via les points d'entrée open*."}] },

    { id:"ux.settings", label:"Réglages & modes", niveau:1, parent:"ux", domaine:"ux",
      novice:"Le menu ⚙ Réglages : aide, relance de la visite, bascule révision/édition, « mode fiche » (lecture compressée), et accès à cette carte + à la frise.",
      ingenieur:"Overlay #settings-overlay regroupant les fonctions non nécessaires à la révision. Deux bascules d'affichage : applyPhiloMode (révision/édition, classe body.mode-edition) et applyFicheMode (mode fiche, classe body.mode-fiche). Le menu offre aussi les liens vers docs/carte/carte.html et frise.html.",
      symbols:[{kind:"fn",name:"openSettings",ref:"index.html:5331"},{kind:"fn",name:"renderSettingsBody",ref:"index.html:5304"},{kind:"fn",name:"applyPhiloMode",ref:"index.html:5271"},{kind:"fn",name:"togglePhiloMode",ref:"index.html:5279"},{kind:"fn",name:"applyFicheMode",ref:"index.html:5289"},{kind:"fn",name:"toggleFicheMode",ref:"index.html:5294"}],
      liens:[{to:"nav.keys.mode",type:"ecrit",note:"Le mode révision/édition est persisté dans philo-mode."},{to:"nav.keys.fiche",type:"ecrit",note:"Le mode fiche est persisté dans philo-fiche."}] },

    { id:"ux.mobile", label:"Tiroir & gestes mobile", niveau:1, parent:"ux", domaine:"ux",
      novice:"Sur téléphone, le menu de gauche devient un tiroir qu'on ouvre avec le bouton ☰ ou en glissant le doigt depuis le bord.",
      ingenieur:"Responsive ≤700px : sidebar en tiroir (voile .sb-backdrop, fermeture clic/Échap/sélection) + gestes tactiles (balayage depuis le bord gauche).",
      symbols:[{kind:"fn",name:"initSidebarDrawer",ref:"index.html:6024"},{kind:"fn",name:"initSidebarSwipe",ref:"index.html:6060"},{kind:"css",name:".sb-backdrop",ref:"index.html:1159"}] },

  /* ═══════════════ FRONT — rendu ═══════════════ */
  { id:"front", label:"Front (rendu)", niveau:0, parent:null, domaine:"front",
    novice:"Ce qui s'affiche à l'écran : le menu de gauche, la fiche d'une notion et ses onglets, les fiches d'auteur et de concept, le guide de méthode, le fil d'Ariane en haut.",
    ingenieur:"Couche de rendu : fonctions render* qui réécrivent #sb (sidebar) et #main selon l'état courant (sbMode, cur, curTab…). Aucune donnée propre — consomme D / AI / CONCEPTS." },

    { id:"front.sidebar", label:"Barre latérale", niveau:1, parent:"front", domaine:"front",
      novice:"Le menu de gauche avec ses cinq entrées : Notions, Auteurs, Concepts, Repères, Méthodo.",
      ingenieur:"renderSB() rend la sidebar selon sbMode (5 modes). Listes filtrables pour concepts/repères. Les onglets s'enroulent sur plusieurs rangées (flex-wrap).",
      symbols:[{kind:"fn",name:"renderSB",ref:"index.html:2009"}] },
      { id:"front.sidebar.render", label:"renderSB()", niveau:2, parent:"front.sidebar", domaine:"front",
        novice:"La fonction qui dessine le menu de gauche.",
        ingenieur:"renderSB() : onglets de mode + barre de recherche/filtres + liste de l'item actif. sbMode ∈ notions|auteurs|concepts|reperes|methodo (variable globale implicite).",
        symbols:[{kind:"fn",name:"renderSB",ref:"index.html:2009"},{kind:"fn",name:"goMode",ref:"index.html:2942"}] },
      { id:"front.sidebar.lists", label:"Listes Concepts / Repères", niveau:2, parent:"front.sidebar", domaine:"front",
        novice:"La liste filtrable des concepts, et celle des repères du programme.",
        ingenieur:"renderSBConceptsList() (exclut les repères) et renderSBReperesList() (seulement les repères). Recherche dédiée repereSearch.",
        symbols:[{kind:"fn",name:"renderSBConceptsList",ref:"index.html:2231"},{kind:"fn",name:"renderSBReperesList",ref:"index.html:2274"},{kind:"var",name:"repereSearch",ref:"index.html:1558"}] },
      { id:"front.sidebar.tabs", label:"Onglets de notion", niveau:2, parent:"front.sidebar", domaine:"front",
        novice:"Les onglets d'une notion : Auteurs, Textes, Concepts, Dissertations, Exemples.",
        ingenieur:"NOTION_TABS fixe l'ordre des onglets. curTab/curConceptSubTab/curExempleSubTab (globales implicites) mémorisent l'onglet et le sous-onglet actifs.",
        symbols:[{kind:"var",name:"NOTION_TABS",ref:"index.html:1865"}] },
      { id:"front.sidebar.search", label:"Recherche & effacement", niveau:2, parent:"front.sidebar", domaine:"front",
        novice:"Les barres de recherche du menu, avec une croix (ou un clic droit) pour tout effacer d'un coup.",
        ingenieur:"sbSearchInput() filtre la liste et affiche/masque la croix ; clearSidebarSearch() vide ; searchCtxClear() fait pareil au clic droit. clearPaletteSearch() vide la palette ⌘K. Bouton CSS .sb-search-clear.",
        symbols:[{kind:"fn",name:"sbSearchInput",ref:"index.html:2058"},{kind:"fn",name:"clearSidebarSearch",ref:"index.html:2069"},{kind:"fn",name:"searchCtxClear",ref:"index.html:2079"},{kind:"fn",name:"clearPaletteSearch",ref:"index.html:8063"},{kind:"css",name:".sb-search-clear",ref:"index.html:410"}] },

    { id:"front.notion", label:"Vue notion", niveau:1, parent:"front", domaine:"front",
      novice:"La fiche d'une notion (ex. la conscience) avec sa définition et ses onglets.",
      ingenieur:"renderContent() rend la notion courante (cur) : définition + onglets auteurs/textes/concepts/diss/exemples. Regroupe les cartes auteur par nom, trie par « popularité ».",
      symbols:[{kind:"fn",name:"renderContent",ref:"index.html:3142"}],
      liens:[{to:"donnees.liens",type:"appelle",note:"Toute la prose passe par linkTerms() pour devenir cliquable."}] },
      { id:"front.notion.render", label:"renderContent()", niveau:2, parent:"front.notion", domaine:"front",
        novice:"La fonction qui dessine la fiche d'une notion.",
        ingenieur:"renderContent() : lit D[cur], construit les onglets, délègue le tri auteur à compareAuthors. La carte auteur multi-idées s'élargit sur 2 colonnes (.ac-multi).",
        symbols:[{kind:"fn",name:"renderContent",ref:"index.html:3142"}] },

    { id:"front.auteur", label:"Fiche auteur", niveau:1, parent:"front", domaine:"front",
      novice:"La page d'un philosophe : ses idées, ses œuvres, ses citations et ses dialogues avec d'autres auteurs.",
      ingenieur:"renderAuthorContent() rend l'auteur courant (curAuthor) à partir de l'index AI[name] et des métadonnées AM[name]. Onglets idées/œuvres/citations/dialogues.",
      symbols:[{kind:"fn",name:"renderAuthorContent",ref:"index.html:2985"}] },

    { id:"front.concept", label:"Fiche concept & repère", niveau:1, parent:"front", domaine:"front",
      novice:"La page d'un concept (ex. l'aliénation) ou d'un repère du programme, avec sa définition et ses liens.",
      ingenieur:"renderConceptContent() rend le concept courant (curConcept). Un repère EST un concept (même renderer), seulement rangé à part. Section « Relations & distinctions » (sortantes + entrantes calculées).",
      symbols:[{kind:"fn",name:"renderConceptContent",ref:"index.html:2564"},{kind:"var",name:"curConcept",ref:"index.html:1547"}] },

    { id:"front.methodo", label:"Guide méthodo", niveau:1, parent:"front", domaine:"front",
      novice:"Le guide de méthode (dissertation et explication de texte) : un mode d'emploi, pas une fiche de cours.",
      ingenieur:"renderMethodoContent() : squelette visuel de la copie + étapes dépliables avec « phrases toutes prêtes ». Données dans METHODO_GUIDE (pas dans data.js).",
      symbols:[{kind:"fn",name:"renderMethodoContent",ref:"index.html:2756"},{kind:"var",name:"METHODO_GUIDE",ref:"index.html:2672"},{kind:"var",name:"METHODO_TOPICS",ref:"index.html:2667"},{kind:"var",name:"methodoTopic",ref:"index.html:1562"}] },

    { id:"front.crumbs", label:"Fil d'Ariane & aiguillage", niveau:1, parent:"front", domaine:"front",
      novice:"Le chemin cliquable en haut de page (« Notions › Conscience › Auteurs ») et le choix de la bonne vue à afficher.",
      ingenieur:"renderCrumbs() rend le fil d'Ariane et appelle persistNav(). renderCurrentView() aiguille vers le bon render* selon sbMode (même logique que goBack).",
      symbols:[{kind:"fn",name:"renderCrumbs",ref:"index.html:2877"},{kind:"fn",name:"renderCurrentView",ref:"index.html:1869"}],
      liens:[{to:"nav.persist",type:"appelle",note:"renderCrumbs() persiste la position via persistNav()."}] },

    { id:"front.focus", label:"Surbrillance d'arrivée", niveau:1, parent:"front", domaine:"front",
      novice:"Quand tu suis un lien, la cible « brille » un instant pour te montrer où tu as atterri.",
      ingenieur:"focusAfterRender() fait briller l'en-tête (ou la carte/concept ciblé) après chaque open*. scrollAndFlash() ouvre les <details> ancêtres, attend une mise en page stable, centre puis relance l'animation.",
      symbols:[{kind:"fn",name:"focusAfterRender",ref:"index.html:2386"},{kind:"fn",name:"scrollAndFlash",ref:"index.html:2365"}] },

  /* ═══════════════ DONNÉES — data.js ═══════════════ */
  { id:"donnees", label:"Données", niveau:0, parent:null, domaine:"donnees",
    novice:"La matière du site : toutes les notions, auteurs, concepts et repères du programme. C'est là qu'on ajoute ou corrige le contenu.",
    ingenieur:"data.js expose des globales (D, KEYS, AM, CONCEPTS, CC). index.html les normalise au chargement, en dérive l'index auteurs (AI), le tri et le moteur de liens (linkTerms)." },

    { id:"donnees.globales", label:"Globales data.js", niveau:1, parent:"donnees", domaine:"donnees",
      novice:"Les grandes listes du contenu : notions, auteurs, concepts, couleurs.",
      ingenieur:"Constantes globales (script classique, pas de module) consommées directement par index.html.",
      symbols:[{kind:"var",name:"D",ref:"data.js:7"},{kind:"var",name:"KEYS",ref:"data.js:1230"},{kind:"var",name:"AM",ref:"data.js:1255"},{kind:"var",name:"CONCEPTS",ref:"data.js:1355"},{kind:"var",name:"CC",ref:"index.html:1763"}] },
      { id:"donnees.globales.D", label:"D (notions)", niveau:2, parent:"donnees.globales", domaine:"donnees",
        novice:"Toutes les notions du programme (la conscience, le bonheur, la justice…) avec leur contenu.",
        ingenieur:"D = objet { cléNotion: {c,l,s,def, auteurs[], textes[], plans[], exemples[], accroches[], liens[], diss[]} }. KEYS = Object.keys(D) fixe l'ordre.",
        symbols:[{kind:"var",name:"D",ref:"data.js:7"},{kind:"var",name:"KEYS",ref:"data.js:1230"}] },
      { id:"donnees.globales.AM", label:"AM (métadonnées auteurs)", niveau:2, parent:"donnees.globales", domaine:"donnees",
        novice:"La fiche d'identité de chaque philosophe : bio, courant, période, thèmes, dialogues.",
        ingenieur:"AM = { nom: {bio, courant, periode, themes[], dialogues[]} }. Peut contenir des alias courts (ex. 'Tzara').",
        symbols:[{kind:"var",name:"AM",ref:"data.js:1255"}] },
      { id:"donnees.globales.CONCEPTS", label:"CONCEPTS (glossaire + repères)", niveau:2, parent:"donnees.globales", domaine:"donnees",
        novice:"Le glossaire des concepts clés, et les repères du programme (paires à distinguer).",
        ingenieur:"CONCEPTS = [ {id, term, cat, def, auteur?, notions[], liens{}, relations[]} ]. Les repères (cat:'Repère') sont des concepts comme les autres, rangés à part.",
        symbols:[{kind:"var",name:"CONCEPTS",ref:"data.js:1355"}] },
      { id:"donnees.globales.CC", label:"CC (couleurs des courants)", niveau:2, parent:"donnees.globales", domaine:"donnees",
        novice:"La couleur associée à chaque courant philosophique (rationalisme, stoïcisme…).",
        ingenieur:"CC = { 'Courant': '#couleur' }. Resté dans index.html (et non data.js).",
        symbols:[{kind:"var",name:"CC",ref:"index.html:1763"}] },

    { id:"donnees.normalize", label:"Normalisation au chargement", niveau:1, parent:"donnees", domaine:"donnees",
      novice:"Au démarrage, le site remet le contenu ancien au format actuel, sans réécrire les fichiers.",
      ingenieur:"Rétro-compatibilité : convertit les anciens formats à plat (auteur {n,w,i,q}, axes→plans, tensions→relations) en mémoire, au chargement.",
      symbols:[{kind:"fn",name:"normalizeD",ref:"index.html:1632"},{kind:"fn",name:"normalizeAuthor",ref:"index.html:1583"},{kind:"fn",name:"normalizeConcepts",ref:"index.html:1655"}] },

    { id:"donnees.index", label:"Index auteurs (AI)", niveau:1, parent:"donnees", domaine:"donnees",
      novice:"Une table qui regroupe, pour chaque auteur, toutes les notions où il apparaît.",
      ingenieur:"buildAI() construit AI = { nom: {notions[], entries[]} } depuis D. Stocke une COPIE des idées pour ne pas muter D lors des fusions de doublons.",
      symbols:[{kind:"fn",name:"buildAI",ref:"index.html:1675"},{kind:"var",name:"AI",ref:"index.html:1697"}] },

    { id:"donnees.tri", label:"Tri « popularité » auteurs", niveau:1, parent:"donnees", domaine:"donnees",
      novice:"L'ordre des cartes d'auteur : les plus transversaux et les plus attendus au bac passent devant.",
      ingenieur:"compareAuthors() trie en cascade : (1) nb de notions couvertes (authorPopularity), (2) score « importance bac » (authorBacScore + bonus manuel BAC_BONUS), (3) alphabétique.",
      symbols:[{kind:"fn",name:"compareAuthors",ref:"index.html:1756"},{kind:"fn",name:"authorPopularity",ref:"index.html:1741"},{kind:"fn",name:"authorBacScore",ref:"index.html:1745"},{kind:"var",name:"BAC_BONUS",ref:"index.html:1724"}] },

    { id:"donnees.reperes", label:"Repères vs concepts", niveau:1, parent:"donnees", domaine:"donnees",
      novice:"Le tri qui sépare les repères du programme du reste du glossaire.",
      ingenieur:"isRepere(c) = c.cat==='Repère'. REPERES() peuple l'onglet Repères ; realConcepts() = le glossaire (tout sauf les repères).",
      symbols:[{kind:"fn",name:"isRepere",ref:"index.html:1567"},{kind:"fn",name:"REPERES",ref:"index.html:1568"},{kind:"fn",name:"realConcepts",ref:"index.html:1569"}] },

    { id:"donnees.liens", label:"Liens dynamiques (linkTerms)", niveau:1, parent:"donnees", domaine:"donnees",
      novice:"Ce qui rend cliquables, dans n'importe quel texte, les noms de notions, de concepts et d'auteurs.",
      ingenieur:"linkTerms(html) détecte notions (.nterm) / concepts (.cterm) / auteurs (.aterm) et les rend cliquables. LINK_MAP est l'index des termes ; AUTHOR_ALIASES rattache les anciennes graphies au nom canonique.",
      symbols:[{kind:"fn",name:"linkTerms",ref:"index.html:3537"},{kind:"var",name:"LINK_MAP",ref:"index.html:3457"},{kind:"var",name:"AUTHOR_ALIASES",ref:"index.html:3475"}] },

  /* ═══════════════ NAVIGATION / PERSISTANCE ═══════════════ */
  { id:"nav", label:"Navigation / persistance", niveau:0, parent:null, domaine:"nav",
    novice:"Le site se souvient de l'endroit où tu en es : si tu actualises, tu reviens au même point, et le bouton Retour marche même après.",
    ingenieur:"État de position (sbMode/cur/curTab/curAuthor/curConcept/methodoTopic) sérialisé dans localStorage. Pile d'historique persistée. Points d'entrée open* + surbrillance d'arrivée." },

    { id:"nav.history", label:"Historique « Retour »", niveau:1, parent:"nav", domaine:"nav",
      novice:"La pile des pages visitées, pour le bouton ← Retour — qui survit même à une actualisation.",
      ingenieur:"navHistory empile un snapshot avant chaque navigation (pushHistory). goBack() dépile et restaure. updateBackBtn() rafraîchit le bouton et persiste la pile (philo-navhist).",
      symbols:[{kind:"var",name:"navHistory",ref:"index.html:1804"},{kind:"fn",name:"pushHistory",ref:"index.html:1816"},{kind:"fn",name:"goBack",ref:"index.html:1831"},{kind:"fn",name:"updateBackBtn",ref:"index.html:1849"}] },

    { id:"nav.state", label:"État de position", niveau:1, parent:"nav", domaine:"nav",
      novice:"La photo de « où tu es » dans le site, vérifiée avant d'être ré-appliquée.",
      ingenieur:"navStateNow() capture {sbMode,cur,curTab,curConceptSubTab,curExempleSubTab,curAuthor,curAuthorTab,curConcept,methodoTopic}. applyNavState() valide (la cible doit exister) avant d'appliquer. navTouched : l'utilisateur a-t-il navigué ici ? (cf. adoption distante).",
      symbols:[{kind:"fn",name:"navStateNow",ref:"index.html:1877"},{kind:"fn",name:"applyNavState",ref:"index.html:1903"},{kind:"fn",name:"sameNav",ref:"index.html:1884"},{kind:"fn",name:"navEntryValid",ref:"index.html:1942"},{kind:"var",name:"navTouched",ref:"index.html:1811"}],
      note:"sbMode/cur/curTab/curAuthor/curAuthorTab sont des globales implicites (assignées sans déclaration `let`) : décrites ici en prose, pas listées comme symboles." },

    { id:"nav.persist", label:"Persistance locale", niveau:1, parent:"nav", domaine:"nav",
      novice:"Ce qui écrit ta position et ton historique dans le navigateur pour les retrouver au prochain démarrage.",
      ingenieur:"persistNav() écrit philo-nav à chaque rendu (via renderCrumbs). Au démarrage, restoreNavFromStorage() ré-applique la position et restoreNavHistory() recharge la pile.",
      symbols:[{kind:"fn",name:"persistNav",ref:"index.html:1894"},{kind:"fn",name:"restoreNavFromStorage",ref:"index.html:1935"},{kind:"fn",name:"restoreNavHistory",ref:"index.html:1951"}] },

    { id:"nav.open", label:"Points d'entrée open*", niveau:1, parent:"nav", domaine:"nav",
      novice:"Les fonctions qui ouvrent une notion, un auteur ou un concept (depuis un lien ou la recherche).",
      ingenieur:"openNotion()/openConcept()/openAuthor() posent l'état (cur/curConcept/curAuthor + sbMode) puis rendent la vue et déclenchent la surbrillance.",
      symbols:[{kind:"fn",name:"openNotion",ref:"index.html:2333"},{kind:"fn",name:"openConcept",ref:"index.html:2312"},{kind:"fn",name:"openAuthor",ref:"index.html:2955"}],
      liens:[{to:"front.notion",type:"navigue",note:"openNotion → renderContent()"},{to:"front.focus",type:"appelle",note:"chaque open* finit par focusAfterRender()."}] },

    { id:"nav.cross", label:"Liens croisés ciblés", niveau:1, parent:"nav", domaine:"nav",
      novice:"Suivre un lien qui ouvre une notion ET met en valeur exactement le concept, l'auteur ou l'accroche d'où tu viens.",
      ingenieur:"openNotionFromConcept/openNotionFromAuthor/openNotionAccroche posent un drapeau pending* que focusAfterRender() consomme pour viser la bonne carte/mention.",
      symbols:[{kind:"fn",name:"openNotionFromConcept",ref:"index.html:2455"},{kind:"fn",name:"openNotionFromAuthor",ref:"index.html:2468"},{kind:"fn",name:"openNotionAccroche",ref:"index.html:2480"},{kind:"var",name:"pendingConceptMention",ref:"index.html:2349"},{kind:"var",name:"pendingAuthorMention",ref:"index.html:2350"},{kind:"var",name:"pendingAccroche",ref:"index.html:2351"}] },

    { id:"nav.keys", label:"Clés localStorage", niveau:1, parent:"nav", domaine:"nav",
      novice:"Les petits dossiers où le navigateur range ta position, ton historique, tes modes d'affichage et le fait que tu as vu la visite.",
      ingenieur:"Cinq clés de stockage local pour la navigation et l'affichage.",
      symbols:[{kind:"key",name:"philo-nav",ref:"index.html:1894"},{kind:"key",name:"philo-navhist",ref:"index.html:1951"},{kind:"key",name:"philo-mode",ref:"index.html:5271"},{kind:"key",name:"philo-fiche",ref:"index.html:5295"},{kind:"key",name:"philo-onboarded",ref:"index.html:6005"}] },
      { id:"nav.keys.nav", label:"philo-nav", niveau:2, parent:"nav.keys", domaine:"nav",
        novice:"Ta position actuelle dans le site.",
        ingenieur:"localStorage 'philo-nav' = état de position sérialisé (persistNav / restoreNavFromStorage). Inclus dans la sync cloud (preferences.nav).",
        symbols:[{kind:"key",name:"philo-nav",ref:"index.html:1894"}] },
      { id:"nav.keys.navhist", label:"philo-navhist", niveau:2, parent:"nav.keys", domaine:"nav",
        novice:"L'historique du bouton Retour.",
        ingenieur:"localStorage 'philo-navhist' = pile navHistory. Local par appareil (non synchronisé).",
        symbols:[{kind:"key",name:"philo-navhist",ref:"index.html:1951"}] },
      { id:"nav.keys.mode", label:"philo-mode", niveau:2, parent:"nav.keys", domaine:"nav",
        novice:"Le mode d'affichage : révision (épuré) ou édition (outils).",
        ingenieur:"localStorage 'philo-mode' ∈ revision|edition (applyPhiloMode/togglePhiloMode). Synchronisé (preferences.mode).",
        symbols:[{kind:"key",name:"philo-mode",ref:"index.html:5157"}] },
      { id:"nav.keys.onboarded", label:"philo-onboarded", niveau:2, parent:"nav.keys", domaine:"nav",
        novice:"Le fait que tu as déjà vu la visite guidée.",
        ingenieur:"localStorage 'philo-onboarded' = drapeau de 1re visite (tourStartIfFirst).",
        symbols:[{kind:"key",name:"philo-onboarded",ref:"index.html:6005"}] },
      { id:"nav.keys.fiche", label:"philo-fiche", niveau:2, parent:"nav.keys", domaine:"nav",
        novice:"Le « mode fiche » : afficher les auteurs en version compressée (lecture rapide) ou complète.",
        ingenieur:"localStorage 'philo-fiche' ∈ 0|1 (applyFicheMode/toggleFicheMode → classe body.mode-fiche). Borne chaque boîte d'auteur des notions à ~2 lignes et masque les citations.",
        symbols:[{kind:"key",name:"philo-fiche",ref:"index.html:5295"}] },

  /* ═══════════════ QUIZ ═══════════════ */
  { id:"quiz", label:"Quiz (révision)", niveau:0, parent:null, domaine:"quiz",
    novice:"Le mode révision par cartes : une question, tu retournes la carte, tu dis si tu savais. Les cartes ratées reviennent plus souvent.",
    ingenieur:"Overlay de répétition espacée (Leitner) entièrement dérivé de CONCEPTS/D/AI. Progression et gamification dans localStorage philo-quiz ; session reprenable après actualisation." },

    { id:"quiz.cards", label:"Génération des cartes", niveau:1, parent:"quiz", domaine:"quiz",
      novice:"La fabrique des cartes de révision à partir du contenu du site (aucune carte n'est écrite à la main).",
      ingenieur:"buildQuizCards() dérive 5 types de cartes de CONCEPTS/D/AI. stripHtml() nettoie les définitions. QUIZ_CARDS = toutes les cartes ; QUIZ_BY_ID = index par id stable.",
      symbols:[{kind:"fn",name:"buildQuizCards",ref:"index.html:6989"},{kind:"var",name:"QUIZ_CARDS",ref:"index.html:7039"},{kind:"var",name:"QUIZ_BY_ID",ref:"index.html:7041"},{kind:"fn",name:"stripHtml",ref:"index.html:6972"}],
      liens:[{to:"donnees.globales",type:"lit",note:"Toutes les cartes sont dérivées de CONCEPTS / D / AI."}] },
      { id:"quiz.cards.types", label:"Types de carte", niveau:2, parent:"quiz.cards", domaine:"quiz",
        novice:"Les cinq familles de cartes : terme↔définition, citation↔auteur, et notion→auteurs.",
        ingenieur:"5 types générés par buildQuizCards. def-concept et cite-author supportent le QCM ; les autres restent en flip.",
        symbols:[{kind:"var",name:"concept-def",ref:"index.html:6999"},{kind:"var",name:"def-concept",ref:"index.html:7001"},{kind:"var",name:"cite-author",ref:"index.html:7017"},{kind:"var",name:"author-cite",ref:"index.html:7019"},{kind:"var",name:"notion-authors",ref:"index.html:7033"}] },

    { id:"quiz.leitner", label:"Moteur Leitner", niveau:1, parent:"quiz", domaine:"quiz",
      novice:"La logique de répétition espacée : une bonne réponse espace la carte, un échec la fait revenir vite.",
      ingenieur:"QUIZ_INTERVALS (sprint/long, jours par palier). isDue() = carte due aujourd'hui. onAnswer() promeut/rétrograde le palier, met à jour série + XP et renvoie le récap. pickSession() compose la session (dues triées + nouvelles).",
      symbols:[{kind:"var",name:"QUIZ_INTERVALS",ref:"index.html:7049"},{kind:"fn",name:"isDue",ref:"index.html:7105"},{kind:"fn",name:"onAnswer",ref:"index.html:7118"},{kind:"fn",name:"pickSession",ref:"index.html:7182"},{kind:"fn",name:"cardsForFilter",ref:"index.html:7158"},{kind:"fn",name:"quizStats",ref:"index.html:7233"}] },

    { id:"quiz.state", label:"État & persistance", niveau:1, parent:"quiz", domaine:"quiz",
      novice:"Ce qui garde ta progression de révision même si tu fermes l'onglet.",
      ingenieur:"quizState = état runtime ; loadQuizState()/saveQuizState() lisent/écrivent localStorage philo-quiz (deux horizons, gamification, session active). persistActive() sérialise la session en cours.",
      symbols:[{kind:"var",name:"quizState",ref:"index.html:7058"},{kind:"fn",name:"loadQuizState",ref:"index.html:7067"},{kind:"fn",name:"saveQuizState",ref:"index.html:7080"},{kind:"fn",name:"persistActive",ref:"index.html:7093"},{kind:"key",name:"philo-quiz",ref:"index.html:7069"}] },

    { id:"quiz.views", label:"Vues & session", niveau:1, parent:"quiz", domaine:"quiz",
      novice:"L'écran d'accueil du quiz (niveau, objectif, filtres), le déroulé d'une session et le récap de fin.",
      ingenieur:"renderQuiz() aiguille dashboard/session/end. openQuiz() reconstruit la session active. beginSession()/resumeQuizSession()/requestNewSession() gèrent reprise et nouvelle session (avertissement).",
      symbols:[{kind:"fn",name:"renderQuiz",ref:"index.html:7286"},{kind:"fn",name:"renderQuizDashboard",ref:"index.html:7297"},{kind:"fn",name:"openQuiz",ref:"index.html:7276"},{kind:"fn",name:"closeQuiz",ref:"index.html:7283"},{kind:"fn",name:"beginSession",ref:"index.html:7474"},{kind:"fn",name:"resumeQuizSession",ref:"index.html:7509"},{kind:"fn",name:"requestNewSession",ref:"index.html:7489"},{kind:"fn",name:"renderNewSessionWarning",ref:"index.html:7459"}] },

    { id:"quiz.flip", label:"Cartes flip", niveau:1, parent:"quiz", domaine:"quiz",
      novice:"L'animation qui retourne la carte pour révéler la réponse — et permet de revenir à la question.",
      ingenieur:"renderFlipBody() empile 2 faces (CSS rotateY). revealQuiz() ajoute .flipped (sans re-rendu) ; flipToQuestion() la retire pour relire la question.",
      symbols:[{kind:"fn",name:"renderFlipBody",ref:"index.html:7589"},{kind:"fn",name:"revealQuiz",ref:"index.html:7636"},{kind:"fn",name:"flipToQuestion",ref:"index.html:7649"}] },

    { id:"quiz.qcm", label:"Mode QCM", niveau:1, parent:"quiz", domaine:"quiz",
      novice:"La variante à choix multiples : 4 réponses proposées au lieu de retourner la carte.",
      ingenieur:"prepareCard() pré-calcule les choix ; buildQCMChoices() génère 4 options (3 distracteurs de même catégorie). qcmAnswer() → recordResult() (factorise l'enregistrement Leitner des 2 modes) → advanceQuiz().",
      symbols:[{kind:"fn",name:"prepareCard",ref:"index.html:7523"},{kind:"fn",name:"buildQCMChoices",ref:"index.html:7541"},{kind:"fn",name:"qcmAnswer",ref:"index.html:7663"},{kind:"fn",name:"recordResult",ref:"index.html:7671"},{kind:"fn",name:"advanceQuiz",ref:"index.html:7687"}] },

    { id:"quiz.gamif", label:"Gamification & badges", niveau:1, parent:"quiz", domaine:"quiz",
      novice:"Les points d'expérience, les niveaux, la maîtrise par notion et les badges.",
      ingenieur:"quizLevel()/quizXpInLevel() dérivent le niveau ⭐ des XP. notionMastery() = % maîtrisé par notion ; quizBadges() = 1 badge/notion si toutes ses cartes au palier 5. redoWrong() relance les ratés.",
      symbols:[{kind:"fn",name:"quizLevel",ref:"index.html:7084"},{kind:"fn",name:"quizXpInLevel",ref:"index.html:7085"},{kind:"fn",name:"notionMastery",ref:"index.html:7699"},{kind:"fn",name:"quizBadges",ref:"index.html:7710"},{kind:"fn",name:"redoWrong",ref:"index.html:7759"}] },

  /* ═══════════════ CONTRIBUTION ═══════════════ */
  { id:"contrib", label:"Contribution", niveau:0, parent:null, domaine:"contrib",
    novice:"Les visiteurs peuvent proposer du contenu (une idée d'auteur, un concept, un exemple…). La proposition part en ligne pour être relue avant d'être ajoutée.",
    ingenieur:"Modale de proposition « boîtes ». Génère un texte lisible + un bloc JSON (schéma philo-proposal/v3). Envoi prioritaire Supabase (connecté) sinon mailbox anonyme, repli mailto automatique." },

    { id:"contrib.model", label:"Modèle « boîtes »", niveau:1, parent:"contrib", domaine:"contrib",
      novice:"Une proposition = une ou plusieurs boîtes, chacune avec un menu à deux niveaux et une action (ajout/correction/remarque).",
      ingenieur:"proposalBoxes = boîtes {id, categorie, cible, type, f}. PROPOSAL_SOUSCIBLES mappe catégorie→sous-cibles ; CIBLE_CAT/cibleCat() font l'inverse (et la rétro-compat).",
      symbols:[{kind:"var",name:"proposalBoxes",ref:"index.html:3692"},{kind:"var",name:"PROPOSAL_SOUSCIBLES",ref:"index.html:3645"},{kind:"var",name:"CIBLE_CAT",ref:"index.html:3673"},{kind:"fn",name:"cibleCat",ref:"index.html:3680"}] },

    { id:"contrib.render", label:"Rendu de la modale", niveau:1, parent:"contrib", domaine:"contrib",
      novice:"L'affichage du formulaire de proposition et les boutons « + » dans les fiches.",
      ingenieur:"renderProposal() rend la modale ; renderBoxFields() dispatche les champs par (categorie × cible × type). openProposalFromPlus() ouvre depuis un bouton + (pPlus/pPlusCat).",
      symbols:[{kind:"fn",name:"renderProposal",ref:"index.html:4929"},{kind:"fn",name:"renderBoxFields",ref:"index.html:4200"},{kind:"fn",name:"openProposalFromPlus",ref:"index.html:5066"},{kind:"fn",name:"pPlus",ref:"index.html:5040"},{kind:"fn",name:"pPlusCat",ref:"index.html:5045"}] },

    { id:"contrib.draft", label:"Brouillon", niveau:1, parent:"contrib", domaine:"contrib",
      novice:"Ta proposition en cours est gardée automatiquement, pour ne rien perdre.",
      ingenieur:"draftChanged() persiste le brouillon dans localStorage philo-drafts (et synchronise si connecté). Suspendu pendant l'édition d'un envoi existant.",
      symbols:[{kind:"fn",name:"draftChanged",ref:"index.html:3727"},{kind:"key",name:"philo-drafts",ref:"index.html:3709"}] },

    { id:"contrib.generate", label:"Génération texte + JSON", niveau:1, parent:"contrib", domaine:"contrib",
      novice:"La proposition est transformée en un message lisible accompagné d'un code que le programme des coulisses sait lire.",
      ingenieur:"generateProposalText() produit une partie lisible + un bloc JSON (schéma 'philo-proposal/v3') délimité par [PHILO-PROPOSAL-JSON-START]/END.",
      symbols:[{kind:"fn",name:"generateProposalText",ref:"index.html:4503"},{kind:"var",name:"philo-proposal/v3",ref:"index.html:4494"},{kind:"var",name:"PHILO-PROPOSAL-JSON-START",ref:"index.html:4523"}] },

    { id:"contrib.submit", label:"Envoi", niveau:1, parent:"contrib", domaine:"contrib",
      novice:"L'envoi de la proposition : par ton compte si tu es connecté, sinon en anonyme ; en dernier recours, par e-mail.",
      ingenieur:"submitProposalOnline() aiguille : connecté → sendProposalToSupabase (table contributions) ; sinon → sendProposalOnline (mailbox PythonAnywhere). proposalMailtoFallback() = repli mailto (PROPOSAL_EMAIL).",
      symbols:[{kind:"fn",name:"submitProposalOnline",ref:"index.html:4694"},{kind:"fn",name:"sendProposalToSupabase",ref:"index.html:4631"},{kind:"fn",name:"sendProposalOnline",ref:"index.html:4591"},{kind:"fn",name:"sendProposal",ref:"index.html:4550"},{kind:"fn",name:"proposalMailtoFallback",ref:"index.html:4565"},{kind:"var",name:"PROPOSAL_EMAIL",ref:"index.html:3596"}] },

    { id:"contrib.edit", label:"Édition d'un envoi", niveau:1, parent:"contrib", domaine:"contrib",
      novice:"Tant qu'une proposition n'est pas traitée, tu peux la modifier depuis « Mes propositions ».",
      ingenieur:"editMyContribution() reconstruit les boîtes via boxesFromPayload() ; updateProposalInSupabase() fait l'UPDATE (RLS : seulement statut 'en_attente'). exitEditContrib() restaure le brouillon mis de côté (editDraftBackup).",
      symbols:[{kind:"fn",name:"editMyContribution",ref:"index.html:4760"},{kind:"fn",name:"boxesFromPayload",ref:"index.html:4742"},{kind:"fn",name:"updateProposalInSupabase",ref:"index.html:4709"},{kind:"fn",name:"exitEditContrib",ref:"index.html:4783"},{kind:"var",name:"editingContribId",ref:"index.html:3702"},{kind:"var",name:"myContribCache",ref:"index.html:3704"}] },

  /* ═══════════════ COMPTE / SYNC ═══════════════ */
  { id:"sync", label:"Compte / Sync", niveau:0, parent:null, domaine:"sync",
    novice:"Si tu te connectes, tes révisions, ta position et tes brouillons te suivent d'un appareil à l'autre.",
    ingenieur:"Client Supabase (SB). Auth Google. Préférences (nav/quiz/drafts/mode) synchronisées via la table preferences ; propositions via la table contributions." },

    { id:"sync.client", label:"Client Supabase", niveau:1, parent:"sync", domaine:"sync",
      novice:"La connexion au service en ligne qui stocke comptes et données.",
      ingenieur:"SB = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) — clé anon/publishable (publique). null si la lib n'est pas chargée.",
      symbols:[{kind:"var",name:"SB",ref:"index.html:3616"},{kind:"var",name:"SUPABASE_URL",ref:"index.html:3611"},{kind:"var",name:"SUPABASE_ANON_KEY",ref:"index.html:3612"}] },

    { id:"sync.auth", label:"Authentification", niveau:1, parent:"sync", domaine:"sync",
      novice:"Se connecter avec un compte Google, et se déconnecter.",
      ingenieur:"initAuth() lit la session et s'abonne aux changements ; openAuth() ouvre la modale ; authSignInGoogle()/authSignOut() gèrent la session.",
      symbols:[{kind:"fn",name:"initAuth",ref:"index.html:6109"},{kind:"fn",name:"openAuth",ref:"index.html:6192"},{kind:"fn",name:"authSignInGoogle",ref:"index.html:6321"},{kind:"fn",name:"authSignOut",ref:"index.html:6367"}] },

    { id:"sync.prefs", label:"Préférences cross-appareil", niveau:1, parent:"sync", domaine:"sync",
      novice:"Ce qui fait voyager ta progression et tes réglages entre tes appareils.",
      ingenieur:"prefsBlobForSync() agrège {mode, onboarded, tour, nav, drafts, quiz} ; applyPrefsBlob() adopte le distant (sans téléporter l'utilisateur en pleine lecture) ; syncOnPrefsChange() pousse (debouncé) après une vraie navigation.",
      symbols:[{kind:"fn",name:"prefsBlobForSync",ref:"index.html:6629"},{kind:"fn",name:"applyPrefsBlob",ref:"index.html:6644"},{kind:"fn",name:"syncOnPrefsChange",ref:"index.html:6866"}],
      liens:[{to:"nav.persist",type:"lit",note:"prefsBlobForSync lit philo-nav."},{to:"quiz.state",type:"lit",note:"prefsBlobForSync lit philo-quiz."},{to:"contrib.draft",type:"lit",note:"prefsBlobForSync lit philo-drafts."}] },

    { id:"sync.tables", label:"Tables Supabase", niveau:1, parent:"sync", domaine:"sync",
      novice:"Les deux tableaux en ligne : tes propositions, et tes préférences.",
      ingenieur:"Deux tables PostgREST, protégées par RLS (auth.uid() = user_id).",
      symbols:[{kind:"table",name:"contributions",ref:"index.html:4637"},{kind:"table",name:"preferences",ref:"index.html:6753"}] },
      { id:"sync.tables.contributions", label:"contributions", niveau:2, parent:"sync.tables", domaine:"sync",
        novice:"Le tableau qui stocke les propositions envoyées depuis un compte.",
        ingenieur:"Table 'contributions' {id, user_id, payload, statut…}. Écrite par sendProposalToSupabase/updateProposalInSupabase ; relue côté agrégateur et pour « Mes propositions ».",
        symbols:[{kind:"table",name:"contributions",ref:"index.html:4637"}] },
      { id:"sync.tables.preferences", label:"preferences", niveau:2, parent:"sync.tables", domaine:"sync",
        novice:"Le tableau qui stocke tes réglages et ta progression pour les retrouver ailleurs.",
        ingenieur:"Table 'preferences' {user_id, data, updated_at}. data = blob prefsBlobForSync (nav/quiz/drafts/mode/tour).",
        symbols:[{kind:"table",name:"preferences",ref:"index.html:6753"}] },

  /* ═══════════════ PWA ═══════════════ */
  { id:"pwa", label:"PWA (hors-ligne)", niveau:0, parent:null, domaine:"pwa",
    novice:"Le site s'installe comme une appli et marche sans connexion. Une simple actualisation récupère la dernière version.",
    ingenieur:"manifest.json + sw.js. Cache mixte : réseau-d'abord pour le code (HTML/JS), cache-d'abord pour les assets. Rechargement transparent au changement de Service Worker." },

    { id:"pwa.sw", label:"Service Worker", niveau:1, parent:"pwa", domaine:"pwa",
      novice:"Le petit programme de fond qui garde une copie du site pour le faire marcher hors-ligne.",
      ingenieur:"sw.js : CACHE = 'philo-vN' (à incrémenter à chaque modif d'un fichier précaché). PRECACHE liste les ressources. fetch : réseau-d'abord (code) / cache-d'abord (icône, manifeste, polices).",
      symbols:[{kind:"var",name:"CACHE",ref:"sw.js:12"},{kind:"var",name:"PRECACHE",ref:"sw.js:13"}] },

    { id:"pwa.register", label:"Enregistrement & MAJ", niveau:1, parent:"pwa", domaine:"pwa",
      novice:"Ce qui installe le programme de fond et récupère sans heurt la dernière version.",
      ingenieur:"index.html enregistre sw.js, appelle reg.update() au chargement, et recharge une fois sur 'controllerchange' (garde anti-boucle swReloading).",
      symbols:[{kind:"var",name:"swReloading",ref:"index.html:6941"},{kind:"fn",name:"controllerchange",ref:"index.html:6945"},{kind:"fn",name:"register",ref:"index.html:6952"}],
      note:"controllerchange/register ne sont pas des fonctions nommées mais des appels (addEventListener/serviceWorker.register) ; cités pour le repère de ligne." },

    { id:"pwa.manifest", label:"Manifeste", niveau:1, parent:"pwa", domaine:"pwa",
      novice:"La carte d'identité de l'appli installable (nom, icône, écran de démarrage).",
      ingenieur:"manifest.json : name, start_url, display:standalone, icons (icon.svg).",
      symbols:[{kind:"var",name:"start_url",ref:"manifest.json:6"},{kind:"var",name:"display",ref:"manifest.json:8"}] },

    { id:"pwa.seo", label:"Référencement (sitemap)", niveau:1, parent:"pwa", domaine:"pwa",
      novice:"Le plan du site donné à Google pour qu'il trouve et référence les pages.",
      ingenieur:"sitemap.xml — plan d'URL (urlset) pour les moteurs de recherche.",
      symbols:[{kind:"route",name:"sitemap",ref:"sitemap.xml:2"}] },

  /* ═══════════════ BACKEND AGRÉGATEUR ═══════════════ */
  { id:"backend", label:"Backend agrégateur", niveau:0, parent:null, domaine:"backend",
    novice:"Côté coulisses (sur l'ordinateur de l'enseignant) : un programme récupère les propositions, les fait relire par une IA, puis les présente pour décider quoi garder.",
    ingenieur:"Pipeline Python local (philo-aggregator/) : pull (Supabase/mailbox) → ingest (dédup par signature) → relecture Gemini → dashboard Flask de tri → push statut → export pour intégration manuelle dans data.js." },

    { id:"backend.pipeline", label:"Orchestration", niveau:1, parent:"backend", domaine:"backend",
      novice:"Le chef d'orchestre qui va chercher les propositions et renvoie les décisions.",
      ingenieur:"pipeline.py : pull_and_ingest (mailbox), pull_cloud_and_ingest (Supabase, idempotent via remote_id), sync_cloud (bidirectionnel), push_contribution_status (renvoie statut + explication au contributeur).",
      symbols:[{kind:"fn",name:"pull_and_ingest",ref:"philo-aggregator/pipeline.py:18"},{kind:"fn",name:"pull_cloud_and_ingest",ref:"philo-aggregator/pipeline.py:75"},{kind:"fn",name:"sync_cloud",ref:"philo-aggregator/pipeline.py:242"},{kind:"fn",name:"push_contribution_status",ref:"philo-aggregator/pipeline.py:153"},{kind:"fn",name:"derive_local_status",ref:"philo-aggregator/pipeline.py:140"}] },

    { id:"backend.ingest", label:"Ingestion & dédup", niveau:1, parent:"backend", domaine:"backend",
      novice:"Le tri d'entrée : lit le code d'une proposition, vérifie qu'il est valide, repère les doublons.",
      ingenieur:"ingest.py : extract_json_block (marqueurs), validate_payload (SUPPORTED_SCHEMAS v1/v2/v3), compute_signature (empreinte SHA256 anti-doublon), ingest_text/ingest_payload, run (boucle inbox).",
      symbols:[{kind:"fn",name:"extract_json_block",ref:"philo-aggregator/ingest.py:49"},{kind:"fn",name:"validate_payload",ref:"philo-aggregator/ingest.py:65"},{kind:"var",name:"SUPPORTED_SCHEMAS",ref:"philo-aggregator/ingest.py:62"},{kind:"fn",name:"compute_signature",ref:"philo-aggregator/ingest.py:221"},{kind:"fn",name:"ingest_payload",ref:"philo-aggregator/ingest.py:271"},{kind:"fn",name:"run",ref:"philo-aggregator/ingest.py:427"}] },

    { id:"backend.review", label:"Relecture Gemini", niveau:1, parent:"backend", domaine:"backend",
      novice:"Une IA lit chaque proposition et donne un avis (valable, douteux, à rejeter) avant la décision humaine.",
      ingenieur:"review.py : modèle DEFAULT_MODEL='gemini-flash-latest', SYSTEM_INSTRUCTION (rôle + format JSON). review_box() interroge Gemini (gestion des quotas) ; parse_verdict() extrait le verdict ; run() boucle. Exclut les retours « site » (SITE_CIBLES).",
      symbols:[{kind:"var",name:"DEFAULT_MODEL",ref:"philo-aggregator/review.py:41"},{kind:"var",name:"SYSTEM_INSTRUCTION",ref:"philo-aggregator/review.py:67"},{kind:"fn",name:"parse_verdict",ref:"philo-aggregator/review.py:130"},{kind:"fn",name:"review_box",ref:"philo-aggregator/review.py:222"},{kind:"fn",name:"run",ref:"philo-aggregator/review.py:276"}] },

    { id:"backend.db", label:"Base locale (SQLite)", niveau:1, parent:"backend", domaine:"backend",
      novice:"Le carnet où le programme range les propositions reçues et leur état.",
      ingenieur:"db.py : SQLite proposals.db, tables submissions (1/fichier) et boxes (1/boîte). Statuts (STATUSES), catégories/cibles. update_status() et set_ai_review() font évoluer chaque boîte. get_unreviewed_boxes() exclut SITE_CIBLES.",
      symbols:[{kind:"table",name:"submissions",ref:"philo-aggregator/db.py:83"},{kind:"table",name:"boxes",ref:"philo-aggregator/db.py:98"},{kind:"var",name:"STATUSES",ref:"philo-aggregator/db.py:34"},{kind:"fn",name:"init_db",ref:"philo-aggregator/db.py:234"},{kind:"fn",name:"update_status",ref:"philo-aggregator/db.py:506"},{kind:"fn",name:"set_ai_review",ref:"philo-aggregator/db.py:552"},{kind:"fn",name:"get_unreviewed_boxes",ref:"philo-aggregator/db.py:428"}] },

    { id:"backend.supabase", label:"Client Supabase (serveur)", niveau:1, parent:"backend", domaine:"backend",
      novice:"Le lien entre le programme des coulisses et le tableau en ligne des propositions.",
      ingenieur:"supabase_client.py : TABLE='contributions'. pull_pending()/pull_all() tirent les contributions ; set_status()/set_aggregator_state() renvoient statut et état de travail (clé service_role).",
      symbols:[{kind:"var",name:"TABLE",ref:"philo-aggregator/supabase_client.py:45"},{kind:"fn",name:"pull_pending",ref:"philo-aggregator/supabase_client.py:150"},{kind:"fn",name:"pull_all",ref:"philo-aggregator/supabase_client.py:182"},{kind:"fn",name:"set_status",ref:"philo-aggregator/supabase_client.py:243"},{kind:"fn",name:"set_aggregator_state",ref:"philo-aggregator/supabase_client.py:212"}] },

    { id:"backend.dashboard", label:"Tableau de bord", niveau:1, parent:"backend", domaine:"backend",
      novice:"La page web locale où l'enseignant trie les propositions (garder, corriger, rejeter).",
      ingenieur:"dashboard.py : petit serveur Flask local (port DASHBOARD_PORT, défaut 5002). _run_review_thread() lance la relecture IA en fond ; _card() rend chaque boîte avec ses actions.",
      symbols:[{kind:"fn",name:"run",ref:"philo-aggregator/dashboard.py:875"},{kind:"fn",name:"_run_review_thread",ref:"philo-aggregator/dashboard.py:81"},{kind:"fn",name:"_card",ref:"philo-aggregator/dashboard.py:305"}] },

    { id:"backend.export", label:"Export relecture", niveau:1, parent:"backend", domaine:"backend",
      novice:"L'export d'un fichier texte regroupant les propositions à intégrer à la main dans le contenu.",
      ingenieur:"export.py : génère review_*.txt (boîtes en attente, groupées par section), chaque boîte préfixée [BOX <id>]. FIELD_LABELS mappe les noms de champ.",
      symbols:[{kind:"var",name:"FIELD_LABELS",ref:"philo-aggregator/export.py:32"}] },

    { id:"backend.cli", label:"Ligne de commande", niveau:1, parent:"backend", domaine:"backend",
      novice:"Les commandes tapées au clavier pour piloter le programme (ingest, pull, review, dashboard…).",
      ingenieur:"aggregate.py : point d'entrée. build_parser() déclare les sous-commandes (ingest/pull/pull_cloud/sync/push/review/list/show/dupes/export/mark/note/archive/purge/stats/dashboard) ; main() initialise la base et dispatch.",
      symbols:[{kind:"fn",name:"build_parser",ref:"philo-aggregator/aggregate.py:342"},{kind:"fn",name:"main",ref:"philo-aggregator/aggregate.py:485"}] },

    { id:"backend.view", label:"Affichage terminal", niveau:1, parent:"backend", domaine:"backend",
      novice:"La mise en forme des listes affichées dans le terminal.",
      ingenieur:"view.py : BUCKETS classe chaque cible en section (NOTIONS/AUTEURS/CONCEPTS/RETOURS SITE) ; SECTION_ORDER fixe l'ordre. Les retours « site » sont une section à part (exclue de la relecture Gemini).",
      symbols:[{kind:"var",name:"BUCKETS",ref:"philo-aggregator/view.py:28"},{kind:"var",name:"SECTION_ORDER",ref:"philo-aggregator/view.py:49"}] },

    { id:"backend.config", label:"Config & clients externes", niveau:1, parent:"backend", domaine:"backend",
      novice:"Les réglages secrets (clés, adresses) et le lien vers la boîte aux lettres en ligne.",
      ingenieur:"localenv.py : lecteur .env minimal (get/require) — MAILBOX_URL/SECRET, GEMINI_*, SUPABASE_*. mailbox_client.py : client HTTP du mailbox (pull/ack derrière X-Mailbox-Secret).",
      symbols:[{kind:"fn",name:"get",ref:"philo-aggregator/localenv.py:72"},{kind:"fn",name:"require",ref:"philo-aggregator/localenv.py:85"},{kind:"fn",name:"pull",ref:"philo-aggregator/mailbox_client.py:75"},{kind:"fn",name:"ack",ref:"philo-aggregator/mailbox_client.py:93"}] },

  /* ═══════════════ BOÎTE AUX LETTRES ═══════════════ */
  { id:"mailbox", label:"Boîte aux lettres", niveau:0, parent:null, domaine:"mailbox",
    novice:"Une petite boîte en ligne qui reçoit les propositions des visiteurs non connectés, en attendant que le programme des coulisses vienne les chercher.",
    ingenieur:"Mini-service Flask public (philo-mailbox/, PythonAnywhere) : reçoit les propositions anonymes, les stocke en SQLite, et les sert à l'agrégateur derrière un secret partagé." },

    { id:"mailbox.api", label:"API Flask", niveau:1, parent:"mailbox", domaine:"mailbox",
      novice:"Les adresses web qui reçoivent une proposition et la remettent au programme des coulisses.",
      ingenieur:"app.py : routes publiques/privées. receive_proposal (POST /api/proposals) accepte une soumission ; pull/ack servent l'agrégateur ; _check_secret() valide X-Mailbox-Secret ; add_cors_headers() gère le CORS.",
      symbols:[{kind:"route",name:"receive_proposal",ref:"philo-mailbox/app.py:110"},{kind:"route",name:"pull",ref:"philo-mailbox/app.py:155"},{kind:"route",name:"ack",ref:"philo-mailbox/app.py:168"},{kind:"route",name:"health",ref:"philo-mailbox/app.py:104"},{kind:"fn",name:"_check_secret",ref:"philo-mailbox/app.py:87"},{kind:"fn",name:"add_cors_headers",ref:"philo-mailbox/app.py:70"}] },
      { id:"mailbox.api.proposals", label:"POST /api/proposals", niveau:2, parent:"mailbox.api", domaine:"mailbox",
        novice:"L'adresse qui reçoit une nouvelle proposition anonyme.",
        ingenieur:"receive_proposal() : valide la taille/forme (looks_like_proposal), applique le rate-limit, stocke via add_incoming().",
        symbols:[{kind:"route",name:"receive_proposal",ref:"philo-mailbox/app.py:110"}] },
      { id:"mailbox.api.pull", label:"GET /api/pull", niveau:2, parent:"mailbox.api", domaine:"mailbox",
        novice:"L'adresse privée d'où l'agrégateur récupère les propositions en attente.",
        ingenieur:"pull() : derrière secret, renvoie les propositions non encore tirées (get_unpulled).",
        symbols:[{kind:"route",name:"pull",ref:"philo-mailbox/app.py:155"}] },
      { id:"mailbox.api.ack", label:"POST /api/ack", niveau:2, parent:"mailbox.api", domaine:"mailbox",
        novice:"L'adresse par laquelle l'agrégateur confirme avoir bien reçu, pour ne pas les retirer deux fois.",
        ingenieur:"ack() : derrière secret, marque les ids comme tirés (mark_pulled).",
        symbols:[{kind:"route",name:"ack",ref:"philo-mailbox/app.py:168"}] },

    { id:"mailbox.store", label:"Stockage SQLite", niveau:1, parent:"mailbox", domaine:"mailbox",
      novice:"Le petit carnet où la boîte garde les propositions reçues.",
      ingenieur:"store.py : SQLite mailbox.db, table incoming. add_incoming() insère ; get_unpulled() liste les non-tirées ; mark_pulled() les marque ; init_db() crée la table.",
      symbols:[{kind:"table",name:"incoming",ref:"philo-mailbox/store.py:31"},{kind:"fn",name:"add_incoming",ref:"philo-mailbox/store.py:61"},{kind:"fn",name:"get_unpulled",ref:"philo-mailbox/store.py:75"},{kind:"fn",name:"mark_pulled",ref:"philo-mailbox/store.py:90"},{kind:"fn",name:"init_db",ref:"philo-mailbox/store.py:55"}] },

    { id:"mailbox.util", label:"Anti-abus & détection", niveau:1, parent:"mailbox", domaine:"mailbox",
      novice:"Les garde-fous : limiter le nombre d'envois et vérifier qu'un message ressemble bien à une proposition.",
      ingenieur:"util.py (sans Flask) : RateLimiter (fenêtre glissante), looks_like_proposal() (présence des marqueurs JSON), client_ip().",
      symbols:[{kind:"fn",name:"RateLimiter",ref:"philo-mailbox/util.py:49"},{kind:"fn",name:"looks_like_proposal",ref:"philo-mailbox/util.py:23"}],
      note:"RateLimiter est une classe (class RateLimiter) ; déclarée kind:fn par simplicité du schéma." }

  ],

  /* ── Arêtes transverses : le « grand circuit » des données ───────────── */
  edges: [
    { from:"contrib.submit", to:"sync.tables.contributions", type:"ecrit",
      note:"Connecté : sendProposalToSupabase INSÈRE la proposition dans la table Supabase contributions." },
    { from:"contrib.submit", to:"mailbox.api.proposals", type:"ecrit",
      note:"Anonyme : sendProposalOnline POST /api/proposals → store.add_incoming (mailbox.db). Repli mailto si échec." },
    { from:"backend.pipeline", to:"sync.tables.contributions", type:"lit",
      note:"pull_cloud_and_ingest récupère les contributions en attente depuis Supabase (idempotent via remote_id)." },
    { from:"backend.pipeline", to:"mailbox.api.pull", type:"lit",
      note:"pull_and_ingest tire les propositions anonymes via GET /api/pull, puis confirme par POST /api/ack." },
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
      note:"prefsBlobForSync pousse / applyPrefsBlob adopte le blob {nav, quiz, drafts, mode, tour}." },
    { from:"donnees.liens", to:"front.notion", type:"produit",
      note:"linkTerms rend cliquables notions/concepts/auteurs dans toute la prose rendue (toutes les vues)." },
    { from:"quiz.cards", to:"donnees.globales", type:"lit",
      note:"buildQuizCards dérive 100% des cartes de CONCEPTS / D / AI (aucune donnée redite)." },
    { from:"ux.search", to:"nav.open", type:"navigue",
      note:"Activer un résultat de la recherche ⌘K ouvre la cible via openNotion/openConcept/openAuthor." }
  ]
};
