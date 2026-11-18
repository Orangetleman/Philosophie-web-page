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
      "outils/":           "Outillage Node : construire.mjs (build → data.js, sw.js, pages statiques via lib/pages.mjs), verifier_contenu.mjs (contrôle, avec témoins), lib/ (formats, écriture), banc/ (règles d'accès Supabase sur PGlite)."
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
      symbols:[{kind:"var",name:"TOUR_STEPS",ref:"js/08-visite-guidee.js:216"}] },
      { id:"ux.tour.steps", label:"Étapes & séquence", niveau:2, parent:"ux.tour", domaine:"ux",
        novice:"La liste des étapes de la visite et la façon dont elles s'enchaînent.",
        ingenieur:"TOUR_STEPS = définitions d'étapes. tourState = {i, mode:'core'|'detail'|'full', decision…}. tourSeq() renvoie les indices actifs selon le mode ; toute la navigation opère sur cette séquence.",
        symbols:[{kind:"var",name:"TOUR_STEPS",ref:"js/08-visite-guidee.js:216"},{kind:"var",name:"tourState",ref:"js/08-visite-guidee.js:503"},{kind:"fn",name:"tourSeq",ref:"js/08-visite-guidee.js:510"},{kind:"fn",name:"markTourCore",ref:"js/08-visite-guidee.js:489"}] },
      { id:"ux.tour.control", label:"Contrôle de la visite", niveau:2, parent:"ux.tour", domaine:"ux",
        novice:"Démarrer, terminer, ou relancer la visite.",
        ingenieur:"startTour(i, jumped, mode) lance la visite ; endTour() la ferme ; tourStartIfFirst() la déclenche à la 1re venue (drapeau philo-onboarded).",
        symbols:[{kind:"fn",name:"startTour",ref:"js/08-visite-guidee.js:541"},{kind:"fn",name:"endTour",ref:"js/08-visite-guidee.js:596"},{kind:"fn",name:"tourStartIfFirst",ref:"js/08-visite-guidee.js:912"}],
        liens:[{to:"nav.keys.onboarded",type:"lit",note:"philo-onboarded décide si la visite se lance."}] },
      { id:"ux.tour.fenetres", label:"Fenêtres ouvertes & halo", niveau:2, parent:"ux.tour", domaine:"ux",
        novice:"Pour montrer une option de l'intérieur, la visite ouvre vraiment la fenêtre concernée (quiz, contribution, Réglages), puis la referme. Un léger halo peut aussi signaler un second élément, comme le bouton ⚙ Réglages.",
        ingenieur:"Les setup d'étape ouvrent l'overlay (tourOpenQuiz, tourOpenProposal, tourOpenSettings) ; tourCloseOverlays() les referme tous à chaque changement d'étape, à l'écran de décision et dans endTour. Champ facultatif `halo` d'une étape : positionTourHalo() pose .tour-halo (anneau sans ombre de projecteur) sur l'élément, masqué s'il est hors écran.",
        symbols:[{kind:"fn",name:"tourCloseOverlays",ref:"js/08-visite-guidee.js:188"},{kind:"fn",name:"tourOpenSettings",ref:"js/08-visite-guidee.js:199"},{kind:"fn",name:"tourSettingsRow",ref:"js/08-visite-guidee.js:210"},{kind:"fn",name:"positionTourHalo",ref:"js/08-visite-guidee.js:894"},{kind:"css",name:".tour-halo",ref:"css/05-visite-guidee.css:23"}],
        liens:[{to:"ux.settings",type:"appelle",note:"L'étape « mode édition » ouvre les Réglages (openSettings / closeSettings)."}] },
      { id:"ux.tour.decision", label:"Écran de choix & sauts", niveau:2, parent:"ux.tour", domaine:"ux",
        novice:"Après l'essentiel, l'écran « Tu connais l'essentiel — voir le détail ? » et le saut direct à une partie.",
        ingenieur:"tourShowDecision()/tourContinueDetailed() enchaînent du noyau au détail ; tourGoPart() saute à une partie ; tourShowSidebarMode() bascule réellement la sidebar dans le mode présenté.",
        symbols:[{kind:"fn",name:"tourShowDecision",ref:"js/08-visite-guidee.js:648"},{kind:"fn",name:"tourContinueDetailed",ref:"js/08-visite-guidee.js:668"},{kind:"fn",name:"tourGoPart",ref:"js/08-visite-guidee.js:557"},{kind:"fn",name:"tourShowSidebarMode",ref:"js/08-visite-guidee.js:110"}] },

    { id:"ux.search", label:"Recherche globale ⌘K", niveau:1, parent:"ux", domaine:"ux",
      novice:"La barre de recherche rapide (Ctrl+K ou ⌘K) : elle cherche dans tout le contenu (citations, œuvres, sujets, textes, exemples, définitions), ouvre la bonne page sur le bon onglet et fait briller ce qu'elle a trouvé.",
      ingenieur:"Palette de commande. Index pré-calculé une fois au chargement (≈1 200 entrées) : notions, auteurs, concepts, accroches, et depuis l'étape 3 (oct. 2026) citations, œuvres, sujets, textes, exemples, plus un champ texte (définitions, corps) cherché en dernier rang. paletteSearch classe (libellé, chaîne, texte) et plafonne à PALETTE_PAR_GROUPE par type. ouvrirResultat() ouvre la fiche sur l'onglet voulu et pose pendingCible, que focusAfterRender fait briller à la place de l'en-tête.",
      symbols:[{kind:"var",name:"PALETTE_INDEX",ref:"js/14-recherche.js:39"},{kind:"var",name:"PALETTE_GROUPS",ref:"js/14-recherche.js:148"},{kind:"var",name:"PALETTE_ORDER",ref:"js/14-recherche.js:149"},{kind:"fn",name:"paletteSearch",ref:"js/14-recherche.js:168"},{kind:"fn",name:"ouvrirResultat",ref:"js/14-recherche.js:272"},{kind:"var",name:"PALETTE_PAR_GROUPE",ref:"js/14-recherche.js:151"},{kind:"var",name:"pendingCible",ref:"js/04-fiches.js:16"}],
      liens:[{to:"nav.open",type:"navigue",note:"Activer un résultat ouvre la cible via les points d'entrée open*."}] },

    { id:"ux.settings", label:"Réglages & modes", niveau:1, parent:"ux", domaine:"ux",
      novice:"Le menu ⚙ Réglages, refondu le 15 nov. 2026 : un sommaire, puis cinq cartes (Affichage, Révision, Compte, Mes données, À propos). Chaque carte dit d'abord où on en est ; les explications sont repliées sous « Ce que ça change ».",
      ingenieur:"Overlay #settings-overlay, rendu par renderSettingsBody à partir de briques : rgCarte (section + ligne d'état), rgSegment (choix exclusif), rgInterrupteur (role=switch, aria-checked), rgAller (sommaire). Bascules : applyPhiloMode (body.mode-edition), applyFicheMode (body.mode-fiche), setVoirHP. La carte « Mes données » appelle le module ux.legal (export, effacement, suppression). La visite guidée trouve l'interrupteur du mode édition par son action (tourSettingsRow).",
      symbols:[{kind:"fn",name:"rgCarte",ref:"js/07-affichage-reglages.js:165"},{kind:"fn",name:"rgSegment",ref:"js/07-affichage-reglages.js:153"},{kind:"fn",name:"rgInterrupteur",ref:"js/07-affichage-reglages.js:160"},{kind:"fn",name:"rgAller",ref:"js/07-affichage-reglages.js:170"},{kind:"css",name:"rg-switch",ref:"css/11-reglages.css:38"},{kind:"fn",name:"openSettings",ref:"js/07-affichage-reglages.js:240"},{kind:"fn",name:"renderSettingsBody",ref:"js/07-affichage-reglages.js:172"},{kind:"fn",name:"applyPhiloMode",ref:"js/07-affichage-reglages.js:19"},{kind:"fn",name:"togglePhiloMode",ref:"js/07-affichage-reglages.js:27"},{kind:"fn",name:"applyFicheMode",ref:"js/07-affichage-reglages.js:37"},{kind:"fn",name:"toggleFicheMode",ref:"js/07-affichage-reglages.js:42"}],
      liens:[{to:"nav.keys.mode",type:"ecrit",note:"Le mode révision/édition est persisté dans philo-mode."},{to:"nav.keys.fiche",type:"ecrit",note:"Le mode fiche est persisté dans philo-fiche."}] },

    { id:"ux.legal", label:"Données personnelles & notice légale", niveau:1, parent:"ux", domaine:"ux",
      novice:"Ce qui rend le site conforme au RGPD (15 nov. 2026) : une page « Informations légales », une case à cocher pour accepter les conditions (création de compte, envoi d'une proposition), et dans les Réglages les boutons pour télécharger ses données, les effacer de l'appareil ou supprimer son compte.",
      ingenieur:"Une seule source : contenu/legal.js → globale LEGAL de data.js et page informations-legales/ (pageLegale, outils/lib/legal.mjs). LEGAL_VERSION = date de la dernière entrée de LEGAL.historique ; la version acceptée vit dans user_metadata.cgu_version (+ cgu_date) et dans philo-legal ; verifierAccordLegal la redemande quand elle change. exporterMesDonnees lit l'appareil et, avec un compte, preferences, quiz_progress, contributions, boites (réponses) et votes sous le jeton de la personne. La question 15 du vérificateur (empreinteLegal) refuse un build dont une clé, une adresse externe ou une table n'est pas déclarée. Protocole : docs/protocole-donnees.md.",
      symbols:[{kind:"var",name:"LEGAL_VERSION",ref:"js/12-donnees-legales.js:21"},{kind:"fn",name:"verifierAccordLegal",ref:"js/12-donnees-legales.js:59"},{kind:"fn",name:"accepterAccordLegal",ref:"js/12-donnees-legales.js:97"},{kind:"fn",name:"cguCaseHTML",ref:"js/12-donnees-legales.js:38"},{kind:"fn",name:"exporterMesDonnees",ref:"js/12-donnees-legales.js:139"},{kind:"fn",name:"effacerDonneesAppareil",ref:"js/12-donnees-legales.js:196"},{kind:"fn",name:"supprimerMonCompte",ref:"js/12-donnees-legales.js:214"},{kind:"fn",name:"pageLegale",ref:"outils/lib/legal.mjs:33"},{kind:"fn",name:"empreinteLegal",ref:"outils/lib/legal.mjs:16"},{kind:"fn",name:"effacer_compte",ref:"philo-aggregator/migrations/2026_rgpd.sql:35"},{kind:"fn",name:"purger_comptes_inactifs",ref:"philo-aggregator/migrations/2026_rgpd.sql:91"},{kind:"fn",name:"masquer",ref:"supabase/functions/relire/relecture.js:57"}],
      liens:[{to:"ux.settings",type:"appelle",note:"La carte « Mes données » des Réglages porte les boutons d'export, d'effacement et de suppression."},{to:"nav.keys.legal",type:"ecrit",note:"La version acceptée sur l'appareil."}] },

    { id:"ux.hp", label:"Hors programme : réglage et proposition", niveau:1, parent:"ux", domaine:"ux",
      novice:"Le hors programme est visible par défaut ; à la première visite (après la visite guidée), une petite carte propose de s'en tenir au programme. Le choix se change dans les Réglages et suit le compte.",
      ingenieur:"Étape 5. setVoirHP(v) écrit philo-hp ('1' | '0') et philo-hp-choix, redessine barre latérale, page, Réglages et quiz, puis syncOnPrefsChange (champs hp et hpChoix du blob de préférences). hpInviterSiBesoin() : une fois, s'il existe du hors programme, jamais pendant la visite (rappelée par endTour). Barre latérale : section repliable (philo-hp-replie). Liens dynamiques : lienVersHP + repli alt sur le concept homonyme (« Désir ») quand le hors programme est masqué. Recherche : entrées marquées e.hp.",
      symbols:[{kind:"fn",name:"setVoirHP",ref:"js/07-affichage-reglages.js:100"},{kind:"fn",name:"hpInviterSiBesoin",ref:"js/07-affichage-reglages.js:116"},{kind:"fn",name:"fermerHpInvite",ref:"js/07-affichage-reglages.js:134"},{kind:"fn",name:"lienVersHP",ref:"js/05-liens-dynamiques.js:136"},{kind:"var",name:"HP_CONCEPTS",ref:"js/05-liens-dynamiques.js:134"},{kind:"var",name:"HP_AUTEURS",ref:"js/05-liens-dynamiques.js:135"},{kind:"key",name:"philo-hp",ref:"js/01-donnees-etat.js:214"},{kind:"key",name:"philo-hp-choix",ref:"js/07-affichage-reglages.js:97"},{kind:"key",name:"philo-hp-replie",ref:"js/03-barre-laterale.js:196"}],
      liens:[{to:"donnees.statuts",type:"lit",note:"voirHP, estHP, statuts."},{to:"ux.tour",type:"appelle",note:"La proposition attend la fin de la visite guidée."}] },

    { id:"ux.theme", label:"Thème clair et taille du texte", niveau:1, parent:"ux", domaine:"ux",
      novice:"Dans ⚙ Réglages : thème sombre, clair (fond papier) ou automatique, et trois tailles de texte pour la zone de lecture.",
      ingenieur:"Étape 6. philo-theme ('sombre' par défaut | 'clair' | 'auto') posé sur <html data-theme> par un petit script en tête d'index.html (pas d'éclair au chargement), puis par appliquerAffichage ; les couleurs sont des variables CSS redéfinies pour :root[data-theme=clair] et pour auto sous prefers-color-scheme: light (css/01-base.css). themeEffectif résout « auto » ; un écouteur matchMedia suit le système. philo-texte ('normal' | 'grand' | 'tres-grand') : zoom de .main-content. setTheme / setTailleTexte enregistrent, redessinent et synchronisent (champs theme et texte des préférences).",
      symbols:[{kind:"fn",name:"themeEffectif",ref:"js/07-affichage-reglages.js:56"},{kind:"fn",name:"appliquerAffichage",ref:"js/07-affichage-reglages.js:63"},{kind:"fn",name:"setTheme",ref:"js/07-affichage-reglages.js:74"},{kind:"fn",name:"setTailleTexte",ref:"js/07-affichage-reglages.js:81"},{kind:"key",name:"philo-theme",ref:"js/07-affichage-reglages.js:48"},{kind:"key",name:"philo-texte",ref:"js/07-affichage-reglages.js:50"}],
      liens:[{to:"ux.settings",type:"appelle",note:"Deux lignes de réglages à choix unique."}] },

    { id:"ux.accueil", label:"Page d'accueil et identité visuelle", niveau:1, parent:"ux", domaine:"ux",
      novice:"La page qu'on voit en arrivant sur le site sans lien précis : une accroche, « Reprendre où j'en étais », les notions (dont une notion du jour en grand), les derniers sujets du bac et les nouveautés. Elle porte aussi l'identité visuelle du site (piste A « Bibliothèque », nov. 2026) : bruns chauds, accent ocre, titres en Literata.",
      ingenieur:"Nov. 2026. js/17-accueil.js : sbMode='accueil', rendu par renderAccueilContent ; accueilAuDemarrage (appelée par js/99-demarrage.js) y bascule à la racine sans #/… ni page d'entrée. NAV_REPRENDRE lit philo-nav au chargement ; persistNav n'écrit PAS philo-nav sur l'accueil, et la position d'un autre appareil (synchro) y alimente « Reprendre » au lieu de faire quitter l'accueil (accueilPositionDistante), pour que « Reprendre » désigne une fiche. Adresse : la racine sans # (adresseDe renvoie ''), popstate y ramène. C'est un « lobby » plein écran : marquerAccueil (appelée par renderCrumbs) pose body.en-accueil, qui cache barre latérale, barre du haut, onglets et bandeau ; l'accueil a sa propre en-tête (accueilAller vers chaque mode). Onglet « Accueil » dans la barre latérale pour y revenir (ouvrirAccueil). Styles : css/12-accueil.css ; jetons --color-ocre et --font-titre dans css/01-base.css ; Literata servie depuis polices/ (précache). Maquette : docs/maquettes/accueil-piste-a.html.",
      symbols:[{kind:"fn",name:"renderAccueilContent",ref:"js/17-accueil.js:108"},{kind:"fn",name:"accueilAuDemarrage",ref:"js/17-accueil.js:42"},{kind:"fn",name:"accueilPositionDistante",ref:"js/17-accueil.js:32"},{kind:"fn",name:"marquerAccueil",ref:"js/17-accueil.js:78"},{kind:"fn",name:"accueilAller",ref:"js/17-accueil.js:70"},{kind:"fn",name:"ouvrirAccueil",ref:"js/17-accueil.js:49"},{kind:"var",name:"NAV_REPRENDRE",ref:"js/17-accueil.js:23"},{kind:"key",name:"philo-nav",ref:"js/17-accueil.js:12"}],
      liens:[{to:"ux.explorer",type:"appelle",note:"Sujets du bac et nouveautés renvoient vers Explorer."},{to:"ux.theme",type:"lit",note:"Couleurs du thème (variables CSS)."}] },

    { id:"ux.index", label:"Pages de présentation des onglets", niveau:1, parent:"ux", domaine:"ux",
      novice:"Cliquer sur Notions, Auteurs, Concepts ou Repères ouvre d'abord une page de présentation en pleine largeur : une grande recherche, un filtre par notion et des cartes. La barre de gauche se replie en douceur et ne revient qu'à l'ouverture d'une fiche ; ses boutons du bas (Réviser, Proposer, Réglages, compte) passent alors dans la barre du haut, avec les onglets.",
      ingenieur:"Nov. 2026. js/18-index.js : enIndex (js/01-donnees-etat.js) + sbMode d'un des MODES_INDEX ; allerIndex (onglets de la barre, de la barre du haut, goMode, lobby), renderIndexContent, indexElements / indexGrilleHTML, indexChercher, indexFiltrer, indexOuvrir. Adresses #/notions, #/auteurs, #/concepts, #/reperes (adresseDe, etatDe). enIndex entre dans navStateNow, sameNav, pushHistory, goBack, applyNavState ; les rendus de fiche (renderContent, renderAuthorContent, renderConceptContent) le remettent à false ; persistNav n'écrit pas philo-nav sur une page de présentation. body.sans-barre (marquerAccueil) : lobby, présentation, Explorer ; la barre se replie par transition de largeur (css/13-index.css) ; index.html : .topbar-modes et .topbar-hors-barre. La Méthodo a aussi sa page (#/methodo : une carte par parcours de METHODO_GUIDE, sans recherche ni filtre) ; la barre latérale n'y apparaît qu'un parcours ouvert. Filtre repliable (indexFiltreHTML) : « au moins une » ou « toutes » (indexModeFiltre). Mode édition : drapeaux new / modified sur les cartes et pPlusCat (auteur, concept). Animations : avecTransition (document.startViewTransition) ; la barre latérale et la barre du haut glissent (::view-transition-new/old, css/13-index.css). Visite guidée : tourShowAccueil, tourShowIndex (lobby puis pages de présentation).",
      symbols:[{kind:"fn",name:"allerIndex",ref:"js/18-index.js:46"},{kind:"fn",name:"renderIndexContent",ref:"js/18-index.js:149"},{kind:"fn",name:"indexElements",ref:"js/18-index.js:95"},{kind:"fn",name:"indexGrilleHTML",ref:"js/18-index.js:121"},{kind:"fn",name:"indexOuvrir",ref:"js/18-index.js:60"},{kind:"fn",name:"avecTransition",ref:"js/18-index.js:35"},{kind:"fn",name:"indexFiltreHTML",ref:"js/18-index.js:136"},{kind:"fn",name:"tourShowIndex",ref:"js/08-visite-guidee.js:85"},{kind:"fn",name:"tourShowAccueil",ref:"js/08-visite-guidee.js:84"},{kind:"var",name:"MODES_INDEX",ref:"js/01-donnees-etat.js:68"},{kind:"var",name:"enIndex",ref:"js/01-donnees-etat.js:69"}],
      liens:[{to:"ux.accueil",type:"appelle",note:"Le lobby mène aux pages de présentation."}] },

    { id:"ux.explorer", label:"Explorer : frise et graphe", niveau:1, parent:"ux", domaine:"ux",
      novice:"Un sixième onglet de la barre latérale. La frise situe les auteurs dans le temps (une barre par vie, couleur du courant) ; le graphe dessine les dialogues entre auteurs, les relations entre concepts ou les liens entre notions.",
      ingenieur:"Étape 6. js/15-explorer.js : sbMode='explorer', explorerTopic ('frise' | 'graphe' | 'sujets' | 'nouveautes' | 'propositions'), adresses #/explorer/…, renderExplorerContent. Frise : AM.naissance / AM.mort (question 13 du vérificateur), sections par période de naissance (FRISE_PERIODES), axe propre à chaque section. Graphe : grapheDonnees (AM.dialogues, CONCEPTS.relations, D.liens ; nœuds sans lien écartés), grapheDisposer (forces de Fruchterman et Reingold, départ fixe donc dessin stable, points gardés dans le cadre), SVG avec zoom et déplacement par viewBox (grapheZoom, grapheBrancher), liste textuelle des relations. Propositions (nov. 2026, lot A3) : propositionsHTML lit la fonction publique propositions() (sujets publiés depuis /admin/), voterProposition appelle voter(). Le démarrage a été renuméroté js/99-demarrage.js pour s'exécuter après ce morceau.",
      symbols:[{kind:"fn",name:"renderExplorerContent",ref:"js/15-explorer.js:32"},{kind:"var",name:"EXPLORER_TOPICS",ref:"js/15-explorer.js:19"},{kind:"fn",name:"friseHTML",ref:"js/15-explorer.js:70"},{kind:"var",name:"FRISE_PERIODES",ref:"js/15-explorer.js:58"},{kind:"fn",name:"grapheDonnees",ref:"js/15-explorer.js:126"},{kind:"fn",name:"grapheDisposer",ref:"js/15-explorer.js:171"},{kind:"fn",name:"grapheHTML",ref:"js/15-explorer.js:204"},{kind:"fn",name:"grapheBrancher",ref:"js/15-explorer.js:262"},{kind:"fn",name:"grapheZoom",ref:"js/15-explorer.js:250"},{kind:"fn",name:"propositionsHTML",ref:"js/15-explorer.js:380"},{kind:"fn",name:"voterProposition",ref:"js/15-explorer.js:411"}],
      liens:[{to:"donnees.globales.AM",type:"lit",note:"Dates, courants et dialogues des auteurs."},{to:"donnees.statuts",type:"lit",note:"Le hors programme masqué l'est aussi ici."}] },

    { id:"ux.bac", label:"Sujets du bac, nouveautés, fiche imprimable", niveau:1, parent:"ux", domaine:"ux",
      novice:"Les sujets réellement tombés au bac depuis 2021 (Explorer, onglet Dissertations de chaque notion, fiche des auteurs dont un texte est tombé, recherche) ; un journal daté des nouveautés, qui remplace pour les visiteurs les badges « Nouveau » ; et une fiche de révision à imprimer pour chaque notion.",
      ingenieur:"Étape 6. contenu/sujets-bac.js → SUJETS_BAC (sujetsCanoniques dans le build : {sources, sujets:[{annee, date, voie, type, q | auteur+oeuvre, notions}]}) ; contenu/nouveautes.js → NOUVEAUTES ; question 14 du vérificateur. Affichage : sujetsHTML et nouveautesHTML (Explorer), sujetBacHTML, sujetsDeNotion, sujetsDAuteur, ouvrirAdresse. Badges « Nouveau / Modifié » et leurs teintes réservés à body.mode-edition (css/01-base.css). Fiche imprimable : ficheImpressionHTML et imprimerFiche (js/16-impression.js), feuille @media print css/10-impression.css.",
      symbols:[{kind:"var",name:"SUJETS_BAC",ref:"data.js:397"},{kind:"var",name:"NOUVEAUTES",ref:"data.js:398"},{kind:"fn",name:"sujetsCanoniques",ref:"outils/construire.mjs:133"},{kind:"fn",name:"sujetsHTML",ref:"js/15-explorer.js:310"},{kind:"fn",name:"sujetBacHTML",ref:"js/15-explorer.js:296"},{kind:"fn",name:"sujetsDeNotion",ref:"js/15-explorer.js:306"},{kind:"fn",name:"nouveautesHTML",ref:"js/15-explorer.js:336"},{kind:"fn",name:"ouvrirAdresse",ref:"js/15-explorer.js:331"},{kind:"fn",name:"ficheImpressionHTML",ref:"js/16-impression.js:16"},{kind:"fn",name:"imprimerFiche",ref:"js/16-impression.js:50"}],
      liens:[{to:"ux.explorer",type:"appelle",note:"Deux onglets de plus dans Explorer."}] },

    { id:"ux.mobile", label:"Tiroir & gestes mobile", niveau:1, parent:"ux", domaine:"ux",
      novice:"Sur téléphone, le menu de gauche devient un tiroir qu'on ouvre avec le bouton ☰ ou en glissant le doigt depuis le bord.",
      ingenieur:"Responsive ≤700px : sidebar en tiroir (voile .sb-backdrop, fermeture clic/Échap/sélection) + gestes tactiles (balayage depuis le bord gauche).",
      symbols:[{kind:"fn",name:"initSidebarDrawer",ref:"js/08-visite-guidee.js:931"},{kind:"fn",name:"initSidebarSwipe",ref:"js/08-visite-guidee.js:967"},{kind:"css",name:".sb-backdrop",ref:"css/07-mobile.css:35"}] },

  /* ═══════════════ FRONT — rendu ═══════════════ */
  { id:"front", label:"Front (rendu)", niveau:0, parent:null, domaine:"front",
    novice:"Ce qui s'affiche à l'écran : le menu de gauche, la fiche d'une notion et ses onglets, les fiches d'auteur et de concept, le guide de méthode, le fil d'Ariane en haut.",
    ingenieur:"Couche de rendu : fonctions render* qui réécrivent #sb (sidebar) et #main selon l'état courant (sbMode, cur, curTab…). Aucune donnée propre — consomme D / AI / CONCEPTS." },

    { id:"front.sidebar", label:"Barre latérale", niveau:1, parent:"front", domaine:"front",
      novice:"Le menu de gauche avec ses cinq entrées : Notions, Auteurs, Concepts, Repères, Méthodo.",
      ingenieur:"renderSB() rend la sidebar selon sbMode (5 modes). Listes filtrables pour concepts/repères. Les onglets s'enroulent sur plusieurs rangées (flex-wrap).",
      symbols:[{kind:"fn",name:"renderSB",ref:"js/03-barre-laterale.js:80"}] },
      { id:"front.sidebar.render", label:"renderSB()", niveau:2, parent:"front.sidebar", domaine:"front",
        novice:"La fonction qui dessine le menu de gauche.",
        ingenieur:"renderSB() : onglets de mode + barre de recherche/filtres + liste de l'item actif. sbMode ∈ notions|auteurs|concepts|reperes|methodo (déclarée par let dans index.html, section B).",
        symbols:[{kind:"fn",name:"renderSB",ref:"js/03-barre-laterale.js:80"},{kind:"fn",name:"goMode",ref:"js/04-fiches.js:628"}] },
      { id:"front.sidebar.lists", label:"Listes Concepts / Repères", niveau:2, parent:"front.sidebar", domaine:"front",
        novice:"La liste filtrable des concepts, et celle des repères du programme.",
        ingenieur:"renderSBConceptsList() (exclut les repères) et renderSBReperesList() (seulement les repères). Recherche dédiée repereSearch.",
        symbols:[{kind:"fn",name:"renderSBConceptsList",ref:"js/03-barre-laterale.js:359"},{kind:"fn",name:"renderSBReperesList",ref:"js/03-barre-laterale.js:403"},{kind:"var",name:"repereSearch",ref:"js/01-donnees-etat.js:61"}] },
      { id:"front.sidebar.tabs", label:"Onglets de notion", niveau:2, parent:"front.sidebar", domaine:"front",
        novice:"Les onglets d'une notion : Auteurs, Textes, Concepts, Dissertations, Exemples.",
        ingenieur:"NOTION_TABS fixe l'ordre des onglets. curTab/curConceptSubTab/curExempleSubTab (déclarées par let dans index.html, section B) mémorisent l'onglet et le sous-onglet actifs.",
        symbols:[{kind:"var",name:"NOTION_TABS",ref:"js/02-navigation.js:75"}] },
      { id:"front.sidebar.search", label:"Recherche & effacement", niveau:2, parent:"front.sidebar", domaine:"front",
        novice:"Les barres de recherche du menu, avec une croix (ou un clic droit) pour tout effacer d'un coup.",
        ingenieur:"sbSearchInput() filtre la liste et affiche/masque la croix ; clearSidebarSearch() vide ; searchCtxClear() fait pareil au clic droit. clearPaletteSearch() vide la palette ⌘K. Bouton CSS .sb-search-clear.",
        symbols:[{kind:"fn",name:"sbSearchInput",ref:"js/03-barre-laterale.js:57"},{kind:"fn",name:"clearSidebarSearch",ref:"js/03-barre-laterale.js:68"},{kind:"fn",name:"searchCtxClear",ref:"js/03-barre-laterale.js:78"},{kind:"fn",name:"clearPaletteSearch",ref:"js/14-recherche.js:234"},{kind:"css",name:".sb-search-clear",ref:"js/03-barre-laterale.js:61"}] },

    { id:"front.notion", label:"Vue notion", niveau:1, parent:"front", domaine:"front",
      novice:"La fiche d'une notion (ex. la conscience) avec sa définition et ses onglets.",
      ingenieur:"renderContent() rend la notion courante (cur) : définition + onglets auteurs/textes/concepts/diss/exemples. Regroupe les cartes auteur par nom, trie par « popularité ».",
      symbols:[{kind:"fn",name:"renderContent",ref:"js/04-fiches.js:889"}],
      liens:[{to:"donnees.liens",type:"appelle",note:"Toute la prose passe par linkTerms() pour devenir cliquable."}] },
      { id:"front.notion.render", label:"renderContent()", niveau:2, parent:"front.notion", domaine:"front",
        novice:"La fonction qui dessine la fiche d'une notion.",
        ingenieur:"renderContent() : lit D[cur], construit les onglets, délègue le tri auteur à compareAuthors. La carte auteur multi-idées s'élargit sur 2 colonnes (.ac-multi).",
        symbols:[{kind:"fn",name:"renderContent",ref:"js/04-fiches.js:889"}] },

    { id:"front.auteur", label:"Fiche auteur", niveau:1, parent:"front", domaine:"front",
      novice:"La page d'un philosophe : ses idées, ses œuvres, ses citations et ses dialogues avec d'autres auteurs.",
      ingenieur:"renderAuthorContent() rend l'auteur courant (curAuthor) à partir de l'index AI[name] et des métadonnées AM[name]. Onglets idées/œuvres/citations/dialogues.",
      symbols:[{kind:"fn",name:"renderAuthorContent",ref:"js/04-fiches.js:708"}] },

    { id:"front.concept", label:"Fiche concept & repère", niveau:1, parent:"front", domaine:"front",
      novice:"La page d'un concept (ex. l'aliénation) ou d'un repère du programme, avec sa définition et ses liens.",
      ingenieur:"renderConceptContent() rend le concept courant (curConcept). Un repère EST un concept (même renderer), seulement rangé à part. Section « Relations & distinctions » (sortantes + entrantes calculées).",
      symbols:[{kind:"fn",name:"renderConceptContent",ref:"js/04-fiches.js:238"},{kind:"var",name:"curConcept",ref:"js/01-donnees-etat.js:50"}] },

    { id:"front.methodo", label:"Guide méthodo", niveau:1, parent:"front", domaine:"front",
      novice:"Le guide de méthode (dissertation et explication de texte) : un mode d'emploi, pas une fiche de cours.",
      ingenieur:"renderMethodoContent() : squelette visuel de la copie + étapes dépliables avec « phrases toutes prêtes ». Données dans METHODO_GUIDE (pas dans data.js).",
      symbols:[{kind:"fn",name:"renderMethodoContent",ref:"js/04-fiches.js:431"},{kind:"var",name:"METHODO_GUIDE",ref:"js/04-fiches.js:347"},{kind:"var",name:"METHODO_TOPICS",ref:"js/04-fiches.js:342"},{kind:"var",name:"methodoTopic",ref:"js/01-donnees-etat.js:65"}] },

    { id:"front.crumbs", label:"Fil d'Ariane & aiguillage", niveau:1, parent:"front", domaine:"front",
      novice:"Le chemin cliquable en haut de page (« Notions › Conscience › Auteurs ») et le choix de la bonne vue à afficher.",
      ingenieur:"renderCrumbs() rend le fil d'Ariane et appelle persistNav(). renderCurrentView() aiguille vers le bon render* selon sbMode (même logique que goBack).",
      symbols:[{kind:"fn",name:"renderCrumbs",ref:"js/04-fiches.js:553"},{kind:"fn",name:"renderCurrentView",ref:"js/02-navigation.js:79"}],
      liens:[{to:"nav.persist",type:"appelle",note:"renderCrumbs() persiste la position via persistNav()."}] },

    { id:"front.focus", label:"Surbrillance d'arrivée", niveau:1, parent:"front", domaine:"front",
      novice:"Quand tu suis un lien, la cible « brille » un instant pour te montrer où tu as atterri.",
      ingenieur:"focusAfterRender() fait briller l'en-tête (ou la carte/concept ciblé) après chaque open*. scrollAndFlash() ouvre les <details> ancêtres, attend une mise en page stable, centre puis relance l'animation.",
      symbols:[{kind:"fn",name:"focusAfterRender",ref:"js/04-fiches.js:51"},{kind:"fn",name:"scrollAndFlash",ref:"js/04-fiches.js:30"}] },

  /* ═══════════════ DONNÉES — data.js ═══════════════ */
  { id:"donnees", label:"Données", niveau:0, parent:null, domaine:"donnees",
    novice:"La matière du site : toutes les notions, auteurs, concepts et repères du programme. C'est là qu'on ajoute ou corrige le contenu.",
    ingenieur:"data.js (produit par le build depuis contenu/) expose des globales (D, KEYS, AM, CONCEPTS, PROGRAMME) déjà au format canonique ; le code (js/) en dérive l'index auteurs (AI), le tri, l'étiquette « Au programme » et le moteur de liens (linkTerms)." },

    { id:"donnees.verif", label:"Vérificateur du contenu", niveau:1, parent:"donnees", domaine:"donnees",
      novice:"Le contrôle qui relit tout le contenu avant chaque envoi : doublons, auteurs sans biographie, citations mal guillemetées, renvois à un cours… et qui prouve qu'il voit vraiment les fautes.",
      ingenieur:"outils/verifier_contenu.mjs (Node seul, oct. 2026, modèle verifier_corpus.py de Fiches BUT) : charger() exécute data.js dans un bac à sable vm ; QUESTIONS = 13 contrôles {err, warn} (11e, étape 4 : le programme officiel est couvert ; 12e, étape 5 : minimum d'une notion hors programme ; 13e, étape 6 : dates des auteurs ; 14e : sujets du bac et nouveautés) ; TEMOINS = une faute glissée par question (--temoins) ; sortie « cohérent » (0) ou « À CORRIGER » (1). Lancé par .githooks/pre-commit quand data.js est commité. Règles : docs/protocole-contenu.md.",
      symbols:[{kind:"fn",name:"charger",ref:"outils/verifier_contenu.mjs:42"},{kind:"var",name:"QUESTIONS",ref:"outils/verifier_contenu.mjs:91"},{kind:"var",name:"TEMOINS",ref:"outils/verifier_contenu.mjs:330"},{kind:"fn",name:"main",ref:"outils/verifier_contenu.mjs:353"}],
      liens:[{to:"donnees.globales",type:"lit",note:"Lit D, KEYS, AM, CONCEPTS, PROGRAMME (et AUTHOR_ALIASES de js/)."}] },
    { id:"donnees.globales", label:"Globales data.js", niveau:1, parent:"donnees", domaine:"donnees",
      novice:"Les grandes listes du contenu : notions, auteurs, concepts, couleurs.",
      ingenieur:"Constantes globales (script classique, pas de module) consommées directement par index.html.",
      symbols:[{kind:"var",name:"D",ref:"data.js:6"},{kind:"var",name:"KEYS",ref:"data.js:35"},{kind:"var",name:"AM",ref:"data.js:36"},{kind:"var",name:"CONCEPTS",ref:"data.js:171"},{kind:"var",name:"PROGRAMME",ref:"data.js:395"},{kind:"var",name:"CC",ref:"js/01-donnees-etat.js:16"}] },
      { id:"donnees.globales.D", label:"D (notions)", niveau:2, parent:"donnees.globales", domaine:"donnees",
        novice:"Toutes les notions du programme (la conscience, le bonheur, la justice…) avec leur contenu.",
        ingenieur:"D = objet { cléNotion: {c,l,s,def, auteurs[], textes[], plans[], exemples[], accroches[], liens[], diss[]} }. KEYS = Object.keys(D) fixe l'ordre.",
        symbols:[{kind:"var",name:"D",ref:"data.js:6"},{kind:"var",name:"KEYS",ref:"data.js:35"}] },
      { id:"donnees.globales.AM", label:"AM (métadonnées auteurs)", niveau:2, parent:"donnees.globales", domaine:"donnees",
        novice:"La fiche d'identité de chaque philosophe : bio, courant, période, thèmes, dialogues.",
        ingenieur:"AM = { nom: {bio, courant, periode, themes[], dialogues[]} }. Peut contenir des alias courts (ex. 'Tzara').",
        symbols:[{kind:"var",name:"AM",ref:"data.js:36"}] },
      { id:"donnees.globales.CONCEPTS", label:"CONCEPTS (glossaire + repères)", niveau:2, parent:"donnees.globales", domaine:"donnees",
        novice:"Le glossaire des concepts clés, et les repères du programme (paires à distinguer).",
        ingenieur:"CONCEPTS = [ {id, term, cat, def, auteur?, notions[], liens{}, relations[]} ]. Les repères (cat:'Repère') sont des concepts comme les autres, rangés à part.",
        symbols:[{kind:"var",name:"CONCEPTS",ref:"data.js:171"}] },
      { id:"donnees.globales.CC", label:"CC (couleurs des courants)", niveau:2, parent:"donnees.globales", domaine:"donnees",
        novice:"La couleur associée à chaque courant philosophique (rationalisme, stoïcisme…).",
        ingenieur:"CC = { 'Courant': '#couleur' }. Dans le code (js/01-donnees-etat.js), pas dans data.js. Un courant absent de CC s'affiche en gris (#888).",
        symbols:[{kind:"var",name:"CC",ref:"js/01-donnees-etat.js:16"}] },
      { id:"donnees.globales.PROGRAMME", label:"PROGRAMME (liste officielle)", niveau:2, parent:"donnees.globales", domaine:"donnees",
        novice:"Le programme officiel de terminale : ses 17 notions et les 84 auteurs qui peuvent tomber à l'explication de texte.",
        ingenieur:"Étape 4 (oct. 2026). Source : contenu/programme.js (PROGRAMME({source, notions, auteurs:{période:[nom | {bo, fiches}]}})). Le build (programmeCanonique) l'écrit dans data.js sous la forme {source, notions[], auteurs:[{bo, periode, fiches[]}]}. Les repères n'y sont pas (déjà marqués cat:'Repère').",
        symbols:[{kind:"var",name:"PROGRAMME",ref:"data.js:395"},{kind:"fn",name:"programmeCanonique",ref:"outils/construire.mjs:147"}] },

    { id:"donnees.normalize", label:"Build : sources → data.js", niveau:1, parent:"donnees", domaine:"donnees",
      novice:"Le contenu s'écrit dans des fichiers rangés (un par notion, un par auteur) ; un petit programme les assemble dans le fichier que le site charge, en remettant au passage l'ancien contenu au format actuel.",
      ingenieur:"Étape 3 (oct. 2026) : outils/construire.mjs charge contenu/ (NOTION, AUTEUR, CONCEPT, REPERE, ORDRE dans un bac à sable vm), convertit les anciens formats (outils/lib/formats.mjs : auteur à plat → ideas, axes → plans, tensions → relations), écrit data.js (généré, versionné), recalcule CACHE et PRECACHE de sw.js (empreinte du contenu), puis lance verifier_contenu.mjs. --controle : vérifie sans écrire (hook de commit). Le site ne convertit plus rien au chargement.",
      symbols:[{kind:"fn",name:"chargerSources",ref:"outils/construire.mjs:79"},{kind:"fn",name:"assembler",ref:"outils/construire.mjs:119"},{kind:"fn",name:"ecrireData",ref:"outils/construire.mjs:157"},{kind:"var",name:"PRECACHE",ref:"outils/construire.mjs:55"},{kind:"fn",name:"normaliserNotion",ref:"outils/lib/formats.mjs:59"},{kind:"fn",name:"normaliserAuteur",ref:"outils/lib/formats.mjs:30"},{kind:"fn",name:"normaliserConcept",ref:"outils/lib/formats.mjs:70"}] },

    { id:"donnees.pagesStatiques", label:"Pages statiques (référencement)", niveau:1, parent:"donnees", domaine:"donnees",
      novice:"Pour que Google et les assistants IA lisent les fiches, le build écrit aussi une vraie page web par notion et par auteur (texte déjà présent, sans JavaScript), avec leur titre, leur résumé et un plan du site.",
      ingenieur:"Nov. 2026 : outils/lib/pages.mjs (genererPages, pure) produit notions/<slug>/index.html (slug avec article : la-liberte), auteurs/<slug>/index.html, fiches/index.html (sommaire), sitemap.xml, robots.txt et llms.txt. Chaque page : title, meta description, canonical, Open Graph, JSON-LD (LearningResource + Article / ProfilePage + Person, BreadcrumbList), Depuis nov. 2026 (pages d'entrée), les pages notions/ et auteurs/ sont l'APP elle-même : pageApp part d'index.html (gabarit), y met <base href="/">, les métadonnées de la fiche, <body data-entree=“notion:<clé>|auteur:<nom>”> et la fiche pré-rendue avec les classes de l'app (sbPrerendu, fil d'Ariane, onglets, en-tête, définition, cartes d'auteurs) : un miroir exact de l'onglet par défaut. fiches/ (pageSommaire) suit le même gabarit ; fiche.css a disparu. construire.mjs écrit les pages et retire les orphelines ; --controle les compare. Côté app : PAGES_STATIQUES (data.js, via cheminsPages) donne les adresses ; les notions de la barre latérale sont des <a href> vers ces pages (clic normal intercepté), le titre de notion est un <h1>, et piedNotionHTML ajoute sous chaque fiche une présentation et des liens. index.html a deux zones PRERENDU (dans #sb et .main-content) que le build remplit (prerenduAccueil, injecterPrerendu) : h1 et liens lisibles sans JS, remplacés par l'app au démarrage. TITRE_ACCUEIL garde le titre d'index.html tant qu'on n'a pas navigué. vercel.json : trailingSlash.",
      symbols:[{kind:"fn",name:"genererPages",ref:"outils/lib/pages.mjs:293"},{kind:"fn",name:"pageNotion",ref:"outils/lib/pages.mjs:132"},{kind:"fn",name:"pageAuteur",ref:"outils/lib/pages.mjs:172"},{kind:"var",name:"SLUG_NOTION",ref:"outils/lib/pages.mjs:26"},{kind:"var",name:"DOSSIERS_PAGES",ref:"outils/construire.mjs:63"},{kind:"fn",name:"pageApp",ref:"outils/lib/pages.mjs:92"},{kind:"fn",name:"sbPrerendu",ref:"outils/lib/pages.mjs:270"},{kind:"fn",name:"prerenduAccueil",ref:"outils/lib/pages.mjs:260"},{kind:"fn",name:"injecterPrerendu",ref:"outils/construire.mjs:241"},{kind:"fn",name:"cheminsPages",ref:"outils/lib/pages.mjs:281"},{kind:"var",name:"PAGES_STATIQUES",ref:"data.js:402"},{kind:"fn",name:"piedNotionHTML",ref:"js/04-fiches.js:1163"},{kind:"var",name:"TITRE_ACCUEIL",ref:"js/02-navigation.js:272"}] },

    { id:"donnees.programme", label:"Étiquette « Au programme »", niveau:1, parent:"donnees", domaine:"donnees",
      novice:"Un petit badge vert sur la fiche et la carte des auteurs de la liste officielle : ce sont eux qui peuvent tomber à l'explication de texte.",
      ingenieur:"Étape 4 (oct. 2026). PROG_AUTEURS[nom de fiche] = {bo, periode}, construit depuis PROGRAMME ; progBadgeHTML(nom, court) rend le badge (.prog-badge, css/01-base.css) dans l'en-tête de renderAuthorContent et, en version courte, sur les cartes d'auteur d'une notion (renderContent). Les trois statuts complets sont calculés depuis l'étape 5 (donnees.statuts).",
      symbols:[{kind:"var",name:"PROG_AUTEURS",ref:"js/01-donnees-etat.js:189"},{kind:"fn",name:"progBadgeHTML",ref:"js/01-donnees-etat.js:196"}],
      liens:[{to:"donnees.globales.PROGRAMME",type:"lit",note:"Liste officielle des auteurs, construite par le build."}] },

    { id:"donnees.statuts", label:"Statuts : programme, hors liste, hors programme", niveau:1, parent:"donnees", domaine:"donnees",
      novice:"Chaque notion, auteur ou concept sait s'il est au programme du bac, hors de la liste des auteurs (citable en dissertation), ou hors programme (pour aller plus loin). Rien ne s'écrit à la main : c'est calculé à partir de la liste officielle.",
      ingenieur:"Étape 5 (oct. 2026). PROG_NOTIONS = notions de PROGRAMME ; estHP(k) ; KEYS_HP (notions hors programme, en fin d'ORDRE) ; statutAuteur(nom) = programme (PROG_AUTEURS) | hors-liste (au moins une notion du programme) | hors-programme ; statutConcept(c) = hors-programme si toutes ses notions le sont (un repère jamais). voirHP() lit le réglage ; notionVisible / auteurVisible / conceptVisible / notionsVisibles() filtrent les listes. Badges : hpBadgeHTML, statutAuteurHTML. Fiche notion HP : hpNoticeHTML ; sources : sourcesHTML (champ sources[], exigé par la question 12 du vérificateur).",
      symbols:[{kind:"var",name:"PROG_NOTIONS",ref:"js/01-donnees-etat.js:217"},{kind:"fn",name:"estHP",ref:"js/01-donnees-etat.js:218"},{kind:"var",name:"KEYS_HP",ref:"js/01-donnees-etat.js:219"},{kind:"fn",name:"voirHP",ref:"js/01-donnees-etat.js:220"},{kind:"fn",name:"notionsVisibles",ref:"js/01-donnees-etat.js:222"},{kind:"fn",name:"statutAuteur",ref:"js/01-donnees-etat.js:223"},{kind:"fn",name:"statutConcept",ref:"js/01-donnees-etat.js:229"},{kind:"fn",name:"hpBadgeHTML",ref:"js/01-donnees-etat.js:238"},{kind:"fn",name:"statutAuteurHTML",ref:"js/01-donnees-etat.js:243"},{kind:"fn",name:"hpNoticeHTML",ref:"js/04-fiches.js:875"},{kind:"fn",name:"sourcesHTML",ref:"js/04-fiches.js:884"}],
      liens:[{to:"donnees.globales.PROGRAMME",type:"lit",note:"Une notion absente de PROGRAMME.notions est hors programme."}] },

    { id:"donnees.index", label:"Index auteurs (AI)", niveau:1, parent:"donnees", domaine:"donnees",
      novice:"Une table qui regroupe, pour chaque auteur, toutes les notions où il apparaît.",
      ingenieur:"buildAI() construit AI = { nom: {notions[], entries[]} } depuis D. Stocke une COPIE des idées pour ne pas muter D lors des fusions de doublons.",
      symbols:[{kind:"fn",name:"buildAI",ref:"js/01-donnees-etat.js:97"},{kind:"var",name:"AI",ref:"js/01-donnees-etat.js:119"}] },

    { id:"donnees.tri", label:"Tri « popularité » auteurs", niveau:1, parent:"donnees", domaine:"donnees",
      novice:"L'ordre des cartes d'auteur : les plus transversaux et les plus attendus au bac passent devant.",
      ingenieur:"compareAuthors() trie en cascade : (1) nb de notions couvertes (authorPopularity), (2) score « importance bac » (authorBacScore + bonus manuel BAC_BONUS), (3) alphabétique.",
      symbols:[{kind:"fn",name:"compareAuthors",ref:"js/01-donnees-etat.js:178"},{kind:"fn",name:"authorPopularity",ref:"js/01-donnees-etat.js:163"},{kind:"fn",name:"authorBacScore",ref:"js/01-donnees-etat.js:167"},{kind:"var",name:"BAC_BONUS",ref:"js/01-donnees-etat.js:146"}] },

    { id:"donnees.reperes", label:"Repères vs concepts", niveau:1, parent:"donnees", domaine:"donnees",
      novice:"Le tri qui sépare les repères du programme du reste du glossaire.",
      ingenieur:"isRepere(c) = c.cat==='Repère'. REPERES() peuple l'onglet Repères ; realConcepts() = le glossaire (tout sauf les repères).",
      symbols:[{kind:"fn",name:"isRepere",ref:"js/01-donnees-etat.js:75"},{kind:"fn",name:"REPERES",ref:"js/01-donnees-etat.js:76"},{kind:"fn",name:"realConcepts",ref:"js/01-donnees-etat.js:77"}] },

    { id:"donnees.liens", label:"Liens dynamiques (linkTerms)", niveau:1, parent:"donnees", domaine:"donnees",
      novice:"Ce qui rend cliquables, dans n'importe quel texte, les noms de notions, de concepts et d'auteurs.",
      ingenieur:"linkTerms(html) détecte notions (.nterm) / concepts (.cterm) / auteurs (.aterm) et les rend cliquables. LINK_MAP est l'index des termes ; AUTHOR_ALIASES rattache les anciennes graphies au nom canonique. Étape 6 : jamais de lien vers la page affichée (lienSoi), une même cible une seule fois par bloc de texte, liens atteignables au clavier (tabindex, role=link, activation par Entrée) ; inkOnDark ajuste la couleur de notion au thème (éclaircie en sombre, foncée en clair).",
      symbols:[{kind:"fn",name:"linkTerms",ref:"js/05-liens-dynamiques.js:149"},{kind:"fn",name:"lienSoi",ref:"js/05-liens-dynamiques.js:142"},{kind:"fn",name:"inkOnDark",ref:"js/05-liens-dynamiques.js:101"},{kind:"var",name:"LINK_MAP",ref:"js/05-liens-dynamiques.js:28"},{kind:"var",name:"AUTHOR_ALIASES",ref:"js/05-liens-dynamiques.js:50"}] },

  /* ═══════════════ NAVIGATION / PERSISTANCE ═══════════════ */
  { id:"nav", label:"Navigation / persistance", niveau:0, parent:null, domaine:"nav",
    novice:"Le site se souvient de l'endroit où tu en es : si tu actualises, tu reviens au même point, et le bouton Retour marche même après.",
    ingenieur:"État de position (sbMode/cur/curTab/curAuthor/curConcept/methodoTopic) sérialisé dans localStorage. Pile d'historique persistée. Points d'entrée open* + surbrillance d'arrivée." },

    { id:"nav.history", label:"Historique « Retour »", niveau:1, parent:"nav", domaine:"nav",
      novice:"La pile des pages visitées, pour le bouton ← Retour — qui survit même à une actualisation.",
      ingenieur:"navHistory empile un snapshot avant chaque navigation (pushHistory). goBack() dépile et restaure. updateBackBtn() rafraîchit le bouton et persiste la pile (philo-navhist).",
      symbols:[{kind:"var",name:"navHistory",ref:"js/02-navigation.js:13"},{kind:"fn",name:"pushHistory",ref:"js/02-navigation.js:25"},{kind:"fn",name:"goBack",ref:"js/02-navigation.js:42"},{kind:"fn",name:"updateBackBtn",ref:"js/02-navigation.js:59"}] },

    { id:"nav.state", label:"État de position", niveau:1, parent:"nav", domaine:"nav",
      novice:"La photo de « où tu es » dans le site, vérifiée avant d'être ré-appliquée.",
      ingenieur:"navStateNow() capture {sbMode,cur,curTab,curConceptSubTab,curExempleSubTab,curAuthor,curAuthorTab,curConcept,methodoTopic}. applyNavState() valide (la cible doit exister) avant d'appliquer. navTouched : l'utilisateur a-t-il navigué ici ? (cf. adoption distante).",
      symbols:[{kind:"fn",name:"navStateNow",ref:"js/02-navigation.js:90"},{kind:"fn",name:"applyNavState",ref:"js/02-navigation.js:121"},{kind:"fn",name:"sameNav",ref:"js/02-navigation.js:97"},{kind:"fn",name:"navEntryValid",ref:"js/02-navigation.js:169"},{kind:"var",name:"navTouched",ref:"js/02-navigation.js:20"}],
      note:"sbMode/cur/curTab/curAuthor/curAuthorTab sont déclarées par let en tête du script d'index.html (section B) ; elles vivaient dans data.js jusqu'en oct. 2026." },

    { id:"nav.adresses", label:"Adresses de page (#/…)", niveau:1, parent:"nav", domaine:"nav",
      novice:"Chaque page a son adresse : on peut l'envoyer à quelqu'un, la mettre en favori, et le bouton « précédent » du navigateur ramène à la page d'avant.",
      ingenieur:"Étape 3 (oct. 2026). adresseDe(état) ↔ etatDe(#/…) : #/notion/<clé>[/<onglet>], #/auteur/<nom>[/<onglet>], #/concept/<id>, #/repere/<id>, #/methodo/<parcours>. majAdresse() (appelée par persistNav à chaque rendu) : pushState après une navigation (navAdresseEnAttente, posé par pushHistory), sinon replaceState ; ne touche pas une URL portant un jeton Supabase (adresseProtegee). popstate rejoue l'adresse ; restoreNavFromAddress() au démarrage fait gagner un lien partagé sur la position mémorisée. shareUrl() partage l'adresse de la page. Pages d'entrée (nov. 2026) : entreeDePage() lit data-entree (ou ?depuis=, repli hors ligne de sw.js) et restoreNavFromAddress l'applique ; une fiche qui a sa page s'affiche à son vrai chemin (cheminDe, urlDe : pushState vers /notions/<slug>/, sinon /#/…), popstate lit aussi le chemin (etatDeChemin) ; urlComplete sert au partage et à l'impression. Une page d'entrée est un miroir exact de l'onglet par défaut. Le sommaire fiches/ est aussi une page d'entrée (data-entree=“fiches”) : l'app y garde le contenu pré-rendu jusqu'à la 1re navigation.",
      symbols:[{kind:"fn",name:"adresseDe",ref:"js/02-navigation.js:215"},{kind:"fn",name:"etatDe",ref:"js/02-navigation.js:231"},{kind:"fn",name:"majAdresse",ref:"js/02-navigation.js:337"},{kind:"fn",name:"restoreNavFromAddress",ref:"js/02-navigation.js:390"},{kind:"fn",name:"titrePage",ref:"js/02-navigation.js:251"},{kind:"fn",name:"entreeDePage",ref:"js/02-navigation.js:288"},{kind:"fn",name:"etatDeChemin",ref:"js/02-navigation.js:301"},{kind:"fn",name:"cheminDe",ref:"js/02-navigation.js:314"},{kind:"fn",name:"urlDe",ref:"js/02-navigation.js:323"},{kind:"fn",name:"urlComplete",ref:"js/02-navigation.js:331"},{kind:"var",name:"navAdresseEnAttente",ref:"js/02-navigation.js:212"}],
      liens:[{to:"nav.persist",type:"appelle",note:"persistNav appelle majAdresse."}] },

    { id:"nav.persist", label:"Persistance locale", niveau:1, parent:"nav", domaine:"nav",
      novice:"Ce qui écrit ta position et ton historique dans le navigateur pour les retrouver au prochain démarrage.",
      ingenieur:"persistNav() écrit philo-nav à chaque rendu (via renderCrumbs). Au démarrage, restoreNavFromStorage() ré-applique la position et restoreNavHistory() recharge la pile.",
      symbols:[{kind:"fn",name:"persistNav",ref:"js/02-navigation.js:108"},{kind:"fn",name:"restoreNavFromStorage",ref:"js/02-navigation.js:162"},{kind:"fn",name:"restoreNavHistory",ref:"js/02-navigation.js:183"}] },

    { id:"nav.open", label:"Points d'entrée open*", niveau:1, parent:"nav", domaine:"nav",
      novice:"Les fonctions qui ouvrent une notion, un auteur ou un concept (depuis un lien ou la recherche).",
      ingenieur:"openNotion()/openConcept()/openAuthor() posent l'état (cur/curConcept/curAuthor + sbMode) puis rendent la vue et déclenchent la surbrillance.",
      symbols:[{kind:"fn",name:"openNotion",ref:"js/03-barre-laterale.js:462"},{kind:"fn",name:"openConcept",ref:"js/03-barre-laterale.js:441"},{kind:"fn",name:"openAuthor",ref:"js/04-fiches.js:646"}],
      liens:[{to:"front.notion",type:"navigue",note:"openNotion → renderContent()"},{to:"front.focus",type:"appelle",note:"chaque open* finit par focusAfterRender()."}] },

    { id:"nav.cross", label:"Liens croisés ciblés", niveau:1, parent:"nav", domaine:"nav",
      novice:"Suivre un lien qui ouvre une notion ET met en valeur exactement le concept, l'auteur ou l'accroche d'où tu viens.",
      ingenieur:"openNotionFromConcept/openNotionFromAuthor/openNotionAccroche posent un drapeau pending* que focusAfterRender() consomme pour viser la bonne carte/mention.",
      symbols:[{kind:"fn",name:"openNotionFromConcept",ref:"js/04-fiches.js:129"},{kind:"fn",name:"openNotionFromAuthor",ref:"js/04-fiches.js:142"},{kind:"fn",name:"openNotionAccroche",ref:"js/04-fiches.js:154"},{kind:"var",name:"pendingConceptMention",ref:"js/04-fiches.js:13"},{kind:"var",name:"pendingAuthorMention",ref:"js/04-fiches.js:14"},{kind:"var",name:"pendingAccroche",ref:"js/04-fiches.js:15"}] },

    { id:"nav.keys", label:"Clés localStorage", niveau:1, parent:"nav", domaine:"nav",
      novice:"Les petits dossiers où le navigateur range ta position, ton historique, tes modes d'affichage et le fait que tu as vu la visite.",
      ingenieur:"Cinq clés de stockage local pour la navigation et l'affichage.",
      symbols:[{kind:"key",name:"philo-nav",ref:"js/02-navigation.js:16"},{kind:"key",name:"philo-navhist",ref:"js/02-navigation.js:66"},{kind:"key",name:"philo-mode",ref:"index.html:59"},{kind:"key",name:"philo-fiche",ref:"js/07-affichage-reglages.js:36"},{kind:"key",name:"philo-onboarded",ref:"index.html:61"}] },
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
        symbols:[{kind:"key",name:"philo-mode",ref:"index.html:59"}] },
      { id:"nav.keys.onboarded", label:"philo-onboarded", niveau:2, parent:"nav.keys", domaine:"nav",
        novice:"Le fait que tu as déjà vu la visite guidée.",
        ingenieur:"localStorage 'philo-onboarded' = drapeau de 1re visite (tourStartIfFirst).",
        symbols:[{kind:"key",name:"philo-onboarded",ref:"index.html:61"}] },
      { id:"nav.keys.legal", label:"philo-legal", niveau:2, parent:"nav.keys", domaine:"nav",
        novice:"La version des conditions d'utilisation déjà acceptée sur cet appareil.",
        ingenieur:"localStorage 'philo-legal' = AAAA-MM-JJ (legalRetenir). Sert de relais quand le jeton du compte retarde, et permet de signaler un changement de notice à un visiteur qui avait proposé du contenu (verifierAccordLegal).",
        symbols:[{kind:"key",name:"philo-legal",ref:"js/12-donnees-legales.js:14"}] },
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
        symbols:[{kind:"var",name:"concept-def",ref:"js/04-fiches.js:274"},{kind:"var",name:"def-concept",ref:"js/13-quiz.js:30"},{kind:"var",name:"cite-author",ref:"js/13-quiz.js:31"},{kind:"var",name:"author-cite",ref:"js/13-quiz.js:32"},{kind:"var",name:"notion-authors",ref:"js/13-quiz.js:33"}] },

    { id:"quiz.leitner", label:"Moteur Leitner", niveau:1, parent:"quiz", domaine:"quiz",
      novice:"La logique de répétition espacée : une bonne réponse espace la carte, un échec la fait revenir vite. Les cartes nouvelles sont tirées au hasard, toutes notions mêlées.",
      ingenieur:"QUIZ_INTERVALS (sprint/long, jours par palier). isDue() = carte due aujourd'hui. onAnswer() promeut/rétrograde le palier, met à jour série + XP et renvoie le récap. pickSession() compose la session (dues triées par palier, puis nouvelles TIRÉES AU HASARD depuis la v4 ; avant, l'ordre du fichier redonnait toujours les mêmes 15 cartes). isDue/cardsForFilter/pickSession/quizStats reçoivent l'état lu une fois (st) au lieu de relire le stockage pour chaque carte.",
      symbols:[{kind:"var",name:"QUIZ_INTERVALS",ref:"js/13-quiz.js:190"},{kind:"fn",name:"isDue",ref:"js/13-quiz.js:295"},{kind:"fn",name:"onAnswer",ref:"js/13-quiz.js:308"},{kind:"fn",name:"pickSession",ref:"js/13-quiz.js:400"},{kind:"fn",name:"cardsForFilter",ref:"js/13-quiz.js:351"},{kind:"fn",name:"quizStats",ref:"js/13-quiz.js:456"}] },

    { id:"quiz.state", label:"État & persistance", niveau:1, parent:"quiz", domaine:"quiz",
      novice:"Ce qui garde ta progression de révision même si tu fermes l'onglet.",
      ingenieur:"quizState = état runtime ; loadQuizState()/saveQuizState() lisent/écrivent localStorage philo-quiz (deux horizons, gamification, session active, et depuis la v4 activeAt/resetAt/epoch pour la fusion entre appareils). migrateQuizState() convertit les anciens ids de cartes (marqueur idv=2). persistActive() sérialise la session en cours. todayStr() = date LOCALE (avant : UTC).",
      symbols:[{kind:"var",name:"quizState",ref:"js/13-quiz.js:199"},{kind:"fn",name:"migrateQuizState",ref:"js/13-quiz.js:212"},{kind:"fn",name:"loadQuizState",ref:"js/13-quiz.js:244"},{kind:"fn",name:"saveQuizState",ref:"js/13-quiz.js:260"},{kind:"fn",name:"todayStr",ref:"js/13-quiz.js:264"},{kind:"fn",name:"persistActive",ref:"js/13-quiz.js:281"},{kind:"key",name:"philo-quiz",ref:"index.html:68"}] },

    { id:"quiz.views", label:"Vues & session", niveau:1, parent:"quiz", domaine:"quiz",
      novice:"L'écran d'accueil du quiz (niveau, objectif, filtres), le déroulé d'une session et le récap de fin.",
      ingenieur:"renderQuiz() aiguille dashboard/session/end. openQuiz() reconstruit la session active. beginSession()/resumeQuizSession()/requestNewSession() gèrent reprise et nouvelle session (avertissement).",
      symbols:[{kind:"fn",name:"renderQuiz",ref:"js/13-quiz.js:509"},{kind:"fn",name:"renderQuizDashboard",ref:"js/13-quiz.js:520"},{kind:"fn",name:"openQuiz",ref:"js/13-quiz.js:499"},{kind:"fn",name:"closeQuiz",ref:"js/13-quiz.js:506"},{kind:"fn",name:"beginSession",ref:"js/13-quiz.js:705"},{kind:"fn",name:"resumeQuizSession",ref:"js/13-quiz.js:740"},{kind:"fn",name:"requestNewSession",ref:"js/13-quiz.js:720"},{kind:"fn",name:"renderNewSessionWarning",ref:"js/13-quiz.js:690"}] },

    { id:"quiz.flip", label:"Cartes flip", niveau:1, parent:"quiz", domaine:"quiz",
      novice:"L'animation qui retourne la carte pour révéler la réponse — et permet de revenir à la question.",
      ingenieur:"renderFlipBody() empile 2 faces (CSS rotateY). revealQuiz() ajoute .flipped (sans re-rendu) ; flipToQuestion() la retire pour relire la question.",
      symbols:[{kind:"fn",name:"renderFlipBody",ref:"js/13-quiz.js:826"},{kind:"fn",name:"revealQuiz",ref:"js/13-quiz.js:894"},{kind:"fn",name:"flipToQuestion",ref:"js/13-quiz.js:907"}] },

    { id:"quiz.qcm", label:"Mode QCM", niveau:1, parent:"quiz", domaine:"quiz",
      novice:"La variante à choix multiples : 4 réponses proposées au lieu de retourner la carte.",
      ingenieur:"prepareCard() pré-calcule les choix ; buildQCMChoices() génère 4 options (3 distracteurs de même catégorie). qcmAnswer() → recordResult() (factorise l'enregistrement Leitner des 2 modes) → advanceQuiz().",
      symbols:[{kind:"fn",name:"prepareCard",ref:"js/13-quiz.js:757"},{kind:"fn",name:"buildQCMChoices",ref:"js/13-quiz.js:776"},{kind:"fn",name:"qcmAnswer",ref:"js/13-quiz.js:921"},{kind:"fn",name:"recordResult",ref:"js/13-quiz.js:932"},{kind:"fn",name:"advanceQuiz",ref:"js/13-quiz.js:945"}] },

    { id:"quiz.gamif", label:"Gamification & badges", niveau:1, parent:"quiz", domaine:"quiz",
      novice:"Les points d'expérience, les niveaux, la maîtrise par notion et les badges.",
      ingenieur:"quizLevel()/quizXpInLevel() dérivent le niveau ⭐ des XP. notionMastery() = % maîtrisé par notion (une carte compte pour toutes ses notions) ; quizBadges() = 1 badge/notion quand QUIZ_BADGE_PCT (80 %) de ses cartes sont mémorisées (palier ≥ 4 ; avant la v4 : toutes au palier 5). redoWrong() relance les ratés.",
      symbols:[{kind:"fn",name:"quizLevel",ref:"js/13-quiz.js:270"},{kind:"fn",name:"quizXpInLevel",ref:"js/13-quiz.js:271"},{kind:"fn",name:"notionMastery",ref:"js/13-quiz.js:958"},{kind:"var",name:"QUIZ_BADGE_PCT",ref:"js/13-quiz.js:971"},{kind:"fn",name:"quizBadges",ref:"js/13-quiz.js:972"},{kind:"fn",name:"redoWrong",ref:"js/13-quiz.js:1022"}] },

    { id:"quiz.hp", label:"Hors programme dans le quiz", niveau:1, parent:"quiz", domaine:"quiz",
      novice:"Les cartes des notions hors programme ne sont pas proposées par défaut : on révise le bac. Un bouton « + Hors programme » les ajoute, et cocher une notion hors programme suffit aussi.",
      ingenieur:"Étape 5. carteEstHP(c) : toutes les notions de la carte sont HP. carteQuizVisible(c) (dans cardsForFilter) : visible si HP affiché ET (philo-quiz-hp, propre à l'appareil, ou notion HP cochée). notionsDuQuiz() borne les boutons, la maîtrise par notion et les badges.",
      symbols:[{kind:"fn",name:"carteEstHP",ref:"js/13-quiz.js:368"},{kind:"fn",name:"carteQuizVisible",ref:"js/13-quiz.js:371"},{kind:"fn",name:"quizInclureHP",ref:"js/13-quiz.js:369"},{kind:"fn",name:"toggleQuizHP",ref:"js/13-quiz.js:370"},{kind:"fn",name:"notionsDuQuiz",ref:"js/13-quiz.js:378"},{kind:"key",name:"philo-quiz-hp",ref:"js/13-quiz.js:365"}],
      liens:[{to:"donnees.statuts",type:"lit",note:"estHP, voirHP."}] },

    { id:"quiz.reread", label:"Relire la fiche", niveau:1, parent:"quiz", domaine:"quiz",
      novice:"Le bouton qui, depuis une carte, ouvre la fiche d'où elle vient (concept, citations de l'auteur ou notion), sans perdre la session.",
      ingenieur:"quizReread() (v4, idée reprise de Fiches BUT) : persistActive() puis closeQuiz(), et openConcept / openAuthor (onglet Citations) / openNotion selon la carte. Une carte QCM déjà répondue est passée pour ne pas être rejouée.",
      symbols:[{kind:"fn",name:"quizReread",ref:"js/13-quiz.js:878"}],
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
      symbols:[{kind:"fn",name:"renderProposal",ref:"js/06-contribution.js:1505"},{kind:"fn",name:"renderBoxFields",ref:"js/06-contribution.js:635"},{kind:"fn",name:"openProposalFromPlus",ref:"js/06-contribution.js:1655"},{kind:"fn",name:"pPlus",ref:"js/06-contribution.js:1629"},{kind:"fn",name:"pPlusCat",ref:"js/06-contribution.js:1634"}] },

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
      symbols:[{kind:"fn",name:"submitProposalOnline",ref:"js/06-contribution.js:1180"},{kind:"fn",name:"sendProposalToSupabase",ref:"js/06-contribution.js:1022"},{kind:"fn",name:"sendProposalAnonSupabase",ref:"js/06-contribution.js:1055"},{kind:"fn",name:"sendProposal",ref:"js/06-contribution.js:985"},{kind:"fn",name:"proposalMailtoFallback",ref:"js/06-contribution.js:1000"},{kind:"var",name:"PROPOSAL_EMAIL",ref:"js/06-contribution.js:36"}] },

    { id:"contrib.edit", label:"Édition d'un envoi", niveau:1, parent:"contrib", domaine:"contrib",
      novice:"Tant qu'une proposition n'est pas traitée, tu peux la modifier depuis « Mes propositions ».",
      ingenieur:"editMyContribution() reconstruit les boîtes via boxesFromPayload() ; updateProposalInSupabase() fait l'UPDATE (RLS : seulement statut 'en_attente'). exitEditContrib() restaure le brouillon mis de côté (editDraftBackup).",
      symbols:[{kind:"fn",name:"editMyContribution",ref:"js/06-contribution.js:1247"},{kind:"fn",name:"boxesFromPayload",ref:"js/06-contribution.js:1229"},{kind:"fn",name:"updateProposalInSupabase",ref:"js/06-contribution.js:1196"},{kind:"fn",name:"exitEditContrib",ref:"js/06-contribution.js:1270"},{kind:"var",name:"editingContribId",ref:"js/06-contribution.js:137"},{kind:"var",name:"myContribCache",ref:"js/06-contribution.js:139"}] },
    { id:"contrib.suivi", label:"Suivi et réponses", niveau:1, parent:"contrib", domaine:"contrib",
      novice:"Sans compte, une proposition reçoit un numéro de suivi ; avec ou sans compte, « Mes propositions » montre où en est chaque partie et la réponse de l'éditeur.",
      ingenieur:"Nov. 2026 (lot A3). sendProposalAnonSupabase tire un numéro (nouveauNumeroSuivi, 12 caractères), n'envoie que son sha256 (empreinteSuivi → contributions.suivi_empreinte) et le garde dans philo-suivis (garderSuivi). renderSuivis l'interroge par la fonction publique suivre() ; ajouterSuivi pour un numéro venu d'ailleurs. renderMyContributions lit aussi la table boites : etatBoitesLabel (même règle qu'AdminModele.vuContributeur, essai dans outils/essais_admin.mjs) et boitesSuiviHTML.",
      symbols:[{kind:"fn",name:"nouveauNumeroSuivi",ref:"js/06-contribution.js:1097"},{kind:"fn",name:"empreinteSuivi",ref:"js/06-contribution.js:1105"},{kind:"fn",name:"renderSuivis",ref:"js/06-contribution.js:1397"},{kind:"fn",name:"etatBoitesLabel",ref:"js/06-contribution.js:1372"},{kind:"key",name:"philo-suivis",ref:"js/06-contribution.js:1050"}],
      liens:[{to:"sync.tables.admin",type:"lit",note:"suivre(numéro) et la table boites."}] },

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
      ingenieur:"initAuth() lit la session et s'abonne aux changements ; openAuth() ouvre la modale ; authSignInGoogle()/authSignOut() gèrent la session ; verifierAdmin() demande à la base (admin_sujets) si le compte est admin et ajoute alors le lien « 🛠 Administration » vers /admin/.",
      symbols:[{kind:"fn",name:"initAuth",ref:"js/09-compte.js:25"},{kind:"fn",name:"openAuth",ref:"js/09-compte.js:141"},{kind:"fn",name:"authSignInGoogle",ref:"js/09-compte.js:297"},{kind:"fn",name:"authSignOut",ref:"js/09-compte.js:343"},{kind:"fn",name:"verifierAdmin",ref:"js/09-compte.js:128"}] },

    { id:"sync.prefs", label:"Préférences cross-appareil", niveau:1, parent:"sync", domaine:"sync",
      novice:"Ce qui fait voyager ta progression et tes réglages entre tes appareils.",
      ingenieur:"prefsBlobForSync() agrège {mode, tour, nav, drafts} (le quiz a sa propre table, cf. sync.quiz) ; applyPrefsBlob() adopte le distant (sans téléporter l'utilisateur en pleine lecture) ; syncOnPrefsChange() pousse (debouncé) après une vraie navigation. Dernière écriture gagne.",
      symbols:[{kind:"fn",name:"prefsBlobForSync",ref:"js/11-synchro.js:81"},{kind:"fn",name:"applyPrefsBlob",ref:"js/11-synchro.js:100"},{kind:"fn",name:"syncOnPrefsChange",ref:"js/11-synchro.js:406"}],
      liens:[{to:"nav.persist",type:"lit",note:"prefsBlobForSync lit philo-nav."},{to:"contrib.draft",type:"lit",note:"prefsBlobForSync lit philo-drafts."}] },

    { id:"sync.quiz", label:"Progression du quiz cross-appareil", niveau:1, parent:"sync", domaine:"sync",
      novice:"Ce qui fait que tes révisions faites sur le téléphone et sur l'ordinateur s'additionnent au lieu de s'écraser, même hors ligne.",
      ingenieur:"Depuis la v4 : mergeQuiz() fusionne carte par carte (révision la plus récente gagne), en oubliant ce qui précède une remise à zéro datée (epoch, resetAt) ; syncOnLogin()/syncOnFocus() fusionnent au lieu d'adopter le distant, puis renvoient la fusion si quizDiffers() ; syncDirty compte ce qui reste à envoyer, syncFlush() l'envoie quand la page se cache, et l'évènement « online » relance une synchro.",
      symbols:[{kind:"fn",name:"mergeQuiz",ref:"js/11-synchro.js:181"},{kind:"fn",name:"syncOnLogin",ref:"js/11-synchro.js:244"},{kind:"fn",name:"syncOnFocus",ref:"js/11-synchro.js:417"},{kind:"var",name:"syncDirty",ref:"js/11-synchro.js:334"},{kind:"fn",name:"syncPushQuiz",ref:"js/11-synchro.js:336"},{kind:"fn",name:"syncFlush",ref:"js/11-synchro.js:377"},{kind:"fn",name:"quizDiffers",ref:"js/11-synchro.js:388"}],
      liens:[{to:"quiz.state",type:"lit",note:"Lit et réécrit philo-quiz (fusion)."},{to:"sync.tables.quiz_progress",type:"ecrit",note:"Upsert du blob quiz."}] },

    { id:"sync.banc", label:"Banc d'essai des règles d'accès", niveau:1, parent:"sync", domaine:"sync",
      novice:"Une fausse base de données, montée sur l'ordinateur, sur laquelle on vérifie que personne ne peut lire ou modifier ce qui ne lui appartient pas.",
      ingenieur:"outils/banc/banc_schema.mjs (oct. 2026) : PGlite + decor_supabase.sql (rôles et droits par défaut de Supabase, auth.uid()) ; joue ORDRE (les migrations) puis ses essais (23 en nov. 2026) sous un rôle via sous(), chacun avec un témoin qui retire la règle. A révélé que le REVOKE colonne de 2026_aggregator_state.sql ne cachait rien.",
      symbols:[{kind:"var",name:"ORDRE",ref:"outils/banc/banc_schema.mjs:30"},{kind:"var",name:"ESSAIS",ref:"outils/banc/banc_schema.mjs:67"},{kind:"fn",name:"sous",ref:"outils/banc/banc_schema.mjs:51"}],
      liens:[{to:"sync.tables",type:"lit",note:"Éprouve les règles des tables Supabase."}] },

    { id:"sync.tables", label:"Tables Supabase", niveau:1, parent:"sync", domaine:"sync",
      novice:"Les tableaux en ligne : tes propositions et l'état de leur relecture, tes préférences, ta progression au quiz, les sujets de la page Propositions et les votes.",
      ingenieur:"Tables PostgREST, protégées par RLS (auth.uid() = user_id) ; depuis nov. 2026, boites, sujets et votes (2026_administration.sql) ne s'écrivent que par des fonctions SECURITY DEFINER. Schéma versionné depuis oct. 2026 dans philo-aggregator/migrations/ (2026_schema_base.sql, reconstitué depuis le code ; droits colonne par colonne sur contributions : 2026_contributions_colonnes.sql), éprouvé par outils/banc/banc_schema.mjs (PGlite, un témoin par essai).",
      symbols:[{kind:"table",name:"contributions",ref:"js/06-contribution.js:1028"},{kind:"table",name:"preferences",ref:"js/11-synchro.js:253"},{kind:"table",name:"quiz_progress",ref:"js/11-synchro.js:252"}] },
      { id:"sync.tables.quiz_progress", label:"quiz_progress", niveau:2, parent:"sync.tables", domaine:"sync",
        novice:"Le tableau qui stocke ta progression au quiz pour la retrouver sur un autre appareil.",
        ingenieur:"Table 'quiz_progress' {user_id, data, updated_at}. data = l'objet philo-quiz entier (quizBlobForSync).",
        symbols:[{kind:"table",name:"quiz_progress",ref:"js/11-synchro.js:252"}] },
      { id:"sync.tables.contributions", label:"contributions", niveau:2, parent:"sync.tables", domaine:"sync",
        novice:"Le tableau qui stocke les propositions envoyées depuis un compte.",
        ingenieur:"Table 'contributions' {id, user_id, payload, statut…}. Écrite par sendProposalToSupabase/updateProposalInSupabase ; relue côté agrégateur et pour « Mes propositions ».",
        symbols:[{kind:"table",name:"contributions",ref:"js/06-contribution.js:1028"}] },
      { id:"sync.tables.boites", label:"boites", niveau:2, parent:"sync.tables", domaine:"sync",
        novice:"Le tableau où chaque partie d'une proposition a son état (en attente, validée, intégrée, refusée), la réponse de l'éditeur et une note interne.",
        ingenieur:"Table 'boites' {id (n° montré dans /admin/), contribution, rang, statut, lue_le, note, reponse, sujet, ia_*, integration} (2026_administration.sql, nov. 2026). Une ligne par payload.boxes[rang], créée par le déclencheur contributions_boites (boites_aligner) ; contribution_recalculer réécrit contributions.statut à chaque changement. Le contributeur lit statut et réponse de ses boîtes (droits colonne). Remplace aggregator_state.",
        symbols:[{kind:"table",name:"boites",ref:"philo-aggregator/migrations/2026_administration.sql:50"},{kind:"fn",name:"boites_aligner",ref:"philo-aggregator/migrations/2026_administration.sql:182"},{kind:"fn",name:"contribution_recalculer",ref:"philo-aggregator/migrations/2026_administration.sql:131"}] },
      { id:"sync.tables.sujets", label:"sujets et votes", niveau:2, parent:"sync.tables", domaine:"sync",
        novice:"Les demandes regroupées par l'éditeur, montrées sur la page Propositions quand il les publie, et les votes des comptes.",
        ingenieur:"Tables 'sujets' {titre, description, etat, publie, reponse} et 'votes' {sujet, user_id, valeur ±1} (2026_administration.sql). Public : propositions() (sujets publiés, score = demandes + pour − contre, mon_vote), voter(sujet, valeur) pour un compte. Votes effacés avec le compte (cascade).",
        symbols:[{kind:"table",name:"sujets",ref:"philo-aggregator/migrations/2026_administration.sql:32"},{kind:"table",name:"votes",ref:"philo-aggregator/migrations/2026_administration.sql:88"},{kind:"fn",name:"propositions",ref:"philo-aggregator/migrations/2026_administration.sql:520"},{kind:"fn",name:"voter",ref:"philo-aggregator/migrations/2026_administration.sql:546"}] },
      { id:"sync.tables.admin", label:"fonctions de /admin/", niveau:2, parent:"sync.tables", domaine:"sync",
        novice:"Les portes réservées à l'éditeur pour trier, répondre, regrouper et importer le compte rendu d'intégration ; et le suivi d'un envoi sans compte par son numéro.",
        ingenieur:"SECURITY DEFINER gardées par is_admin() : admin_boites, admin_maj_boite, admin_supprimer_boite, admin_sujets, admin_enregistrer_sujet, admin_supprimer_sujet, admin_importer_integration (compte rendu philo-integration/v1, idempotent par commit). Public : suivre(code) compare sha256 du numéro à contributions.suivi_empreinte.",
        symbols:[{kind:"fn",name:"admin_boites",ref:"philo-aggregator/migrations/2026_administration.sql:273"},{kind:"fn",name:"admin_maj_boite",ref:"philo-aggregator/migrations/2026_administration.sql:309"},{kind:"fn",name:"admin_importer_integration",ref:"philo-aggregator/migrations/2026_administration.sql:446"},{kind:"fn",name:"suivre",ref:"philo-aggregator/migrations/2026_administration.sql:574"}] },
      { id:"sync.tables.preferences", label:"preferences", niveau:2, parent:"sync.tables", domaine:"sync",
        novice:"Le tableau qui stocke tes réglages et ta progression pour les retrouver ailleurs.",
        ingenieur:"Table 'preferences' {user_id, data, updated_at}. data = blob prefsBlobForSync (nav/drafts/mode/tour).",
        symbols:[{kind:"table",name:"preferences",ref:"js/11-synchro.js:253"}] },

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
      symbols:[{kind:"var",name:"swReloading",ref:"js/99-demarrage.js:40"},{kind:"var",name:"controllerchange",ref:"js/99-demarrage.js:33"},{kind:"var",name:"register",ref:"js/09-compte.js:413"}],
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
      symbols:[{kind:"route",name:"urlset",ref:"sitemap.xml:3"}] },
    { id:"seo.robots", label:"robots.txt", niveau:1, parent:"seo", domaine:"seo",
      novice:"Les consignes pour les robots des moteurs : ce qu'ils peuvent explorer.",
      ingenieur:"robots.txt (nom exact attendu par les moteurs ; s'appelait robot.txt, donc jamais lu, jusqu'en oct. 2026) : User-agent / Allow + un pointeur Sitemap vers sitemap.xml.",
      symbols:[{kind:"route",name:"User-agent",ref:"robots.txt:4"}] },

  /* ═══════════════ BACKEND AGRÉGATEUR ═══════════════ */
  { id:"backend", label:"Administration des propositions", niveau:0, parent:null, domaine:"backend",
    novice:"Côté coulisses : la page /admin/ où l'on trie les propositions, une IA qui donne un premier avis, un message Discord à chaque arrivée, et l'aller-retour avec Claude pour les intégrer au site. Tout tourne en ligne, sur Supabase : plus de programme à lancer sur le PC.",
    ingenieur:"Depuis le chantier Administration (nov. 2026, lots A1 à A6) : base Supabase (tables boites, sujets, votes ; fonctions admin_* gardées par is_admin(), 2026_administration.sql), page admin/ (tri, sujets, À intégrer : export philo-export/v1, import philo-integration/v1, docs/protocole-integration.md), fonctions Deno relire (Gemini) et prevenir (Discord). L'ancien agrégateur Python local (pipeline, SQLite, dashboard Flask) et la page triage/ ont été retirés au lot A6." },

    { id:"backend.admin", label:"Page /admin/", niveau:1, parent:"backend", domaine:"backend",
      novice:"La page où l'éditeur trie les propositions, la même sur ordinateur et téléphone, en ligne et en local. Elle a remplacé le tableau de bord Python et la page de triage (lot A6).",
      ingenieur:"admin/ (nov. 2026, lot A2) : index.html charge data.js (titres des notions), lib/supabase.js, modele.js (AdminModele : filtrer, champsLisibles, vuContributeur, depuis, erreur ; éprouvé par outils/essais_admin.mjs), essai.js (AdminEssai : fausses données, /admin/?essai) et admin.js (état, rendre(), gestes, clavier V/R/A/J/K, #n°). Tout passe par les fonctions admin_* (2026_administration.sql). Hors du service worker du site et de robots.txt.",
      symbols:[{kind:"fn",name:"rendre",ref:"admin/admin.js:148"},{kind:"fn",name:"changer",ref:"admin/admin.js:579"},{kind:"fn",name:"suivreAdresse",ref:"admin/admin.js:666"},{kind:"fn",name:"filtrer",ref:"admin/modele.js:93"},{kind:"fn",name:"champsLisibles",ref:"admin/modele.js:136"},{kind:"fn",name:"vuContributeur",ref:"admin/modele.js:202"},{kind:"fn",name:"exporter",ref:"admin/modele.js:405"},{kind:"fn",name:"lireCompteRendu",ref:"admin/modele.js:434"},{kind:"fn",name:"ongletIntegrer",ref:"admin/admin.js:440"},{kind:"fn",name:"appliquer",ref:"admin/admin.js:515"}],
      liens:[{to:"sync.tables.admin",type:"lit",note:"Lit et écrit les boîtes et les sujets par les fonctions admin_*."}] },
    { id:"backend.prevenir", label:"Message Discord", niveau:1, parent:"backend", domaine:"backend",
      novice:"À chaque proposition nouvelle, un message arrive dans le salon Discord de l'administrateur, avec le lien vers la boîte dans /admin/. Il ne contient ni le texte proposé ni le nom de la personne.",
      ingenieur:"supabase/functions/prevenir (nov. 2026, lot A5 ; Deno). Appelée par un Database Webhook (INSERT sur public.boites) avec l'en-tête x-prevenir = PREVENIR_SECRET ; ne prévient que pour la boîte de rang 0 ; poste « n° et lien /admin/#n° » sur DISCORD_WEBHOOK_URL. Déployée avec --no-verify-jwt.",
      symbols:[] },
    { id:"backend.relire", label:"Relecture IA (Supabase)", niveau:1, parent:"backend", domaine:"backend",
      novice:"Le bouton « Relire avec l'IA » de /admin/ demande à Gemini un premier avis sur les propositions en attente. Il tourne chez Supabase : plus besoin du PC.",
      ingenieur:"supabase/functions/relire (nov. 2026, lot A4 ; Deno). index.ts : vérifie l'admin (jeton → app_admins), choisit les boîtes (ids, sinon en attente jamais relues hors 'site', 8 par appel), appelle generateContent (GEMINI_API_KEY, GEMINI_MODEL), écrit boites.ia_verdict / ia_avis / ia_message / ia_le et contributions.avis_ia. relecture.js (pur, outils/essais_relecture.mjs) : CONSIGNE (celle de review.py), texteBoite (anonyme, masquer), lireVerdict, avisContributeur, attenteQuota. Doublons dans /admin/ : AdminModele.doublons (signature, inclusion de nom, ressemblance = Ratcliff-Obershelp comme difflib).",
      symbols:[{kind:"fn",name:"demanderAGemini",ref:"supabase/functions/relire/index.ts:51"},{kind:"fn",name:"texteBoite",ref:"supabase/functions/relire/relecture.js:65"},{kind:"fn",name:"lireVerdict",ref:"supabase/functions/relire/relecture.js:87"},{kind:"fn",name:"doublons",ref:"admin/modele.js:324"},{kind:"fn",name:"ressemblance",ref:"admin/modele.js:297"}],
      liens:[{to:"sync.tables.boites",type:"ecrit",note:"Avis de l'IA, boîte par boîte."}] },
  ],

  /* ── Arêtes transverses : le « grand circuit » des données ───────────── */
  edges: [
    { from:"contrib.submit", to:"sync.tables.contributions", type:"ecrit",
      note:"Connecté : sendProposalToSupabase INSÈRE la proposition dans la table Supabase contributions." },
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
