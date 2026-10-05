/* js/08-visite-guidee.js — morceau du script du site. Le build (outils/construire.mjs)
   recolle js/*.js dans l'ORDRE des noms en UN SEUL script, app.js : les
   fonctions restent visibles d'un morceau à l'autre comme avant, et le code
   « de premier niveau » s'exécute dans cet ordre. */
/* ══════════════════════════════════════════════════════════════════
   VISITE GUIDÉE (onboarding nouvelle génération)
   ──────────────────────────────────────────────────────────────────
   Remplace l'ancien overlay « 4 conseils ». Visite pas-à-pas à projecteur :
   un voile assombrit toute la page, un « trou » lumineux met en valeur
   l'élément décrit, une bulle explique + propose Précédent / Suivant /
   Passer cette partie / Tout passer.

   Principe « visite pilotée » : pendant la visite, la PAGE N'EST PAS
   interactive (le voile .tour-blocker capte les clics) ; c'est la visite
   qui met l'appli dans le bon état à chaque étape (sélection d'une notion,
   ouverture du tiroir sur mobile, passage temporaire en mode édition,
   OUVERTURE du mode révision ou de la modale de contribution pour les
   détailler de l'intérieur…), puis pointe l'élément réel. Le ménage des
   fenêtres ainsi ouvertes est fait par tourCloseOverlays() à chaque
   changement d'étape et à la fin.

   Déclenchement : automatiquement à la 1re visite (drapeau localStorage
   'philo-tour-v1'), et à la demande via le bouton « ? » (haut-droite).

   Deux façons d'entrer, deux jeux de sorties (pour rester clair) :
     · Déroulé guidé (1re visite / « Refaire tout ») : on avance aux boutons.
       Le clic dans le sombre est inerte SAUF sur la dernière page (où il
       ferme), et il n'y a pas de croix.
     · Accès direct à une partie via le menu « ? » (tourState.jumped) : on
       est en révision ciblée → une CROIX sur la bulle et le clic dans le
       sombre ferment la visite à tout moment.

   Chaque étape de TOUR_STEPS :
     part      → identifiant de « partie » (progression + saut de partie +
                 accès direct depuis le menu d'aide)
     title     → titre court de la bulle
     text      → explication (HTML simple : <b> autorisé)
     side       → 'sidebar' | 'main' : gère le tiroir burger sur mobile
     center    → true : carte centrée sans cible (bienvenue / récap / fin)
     setup     → met l'appli dans l'état voulu avant de pointer
     target    → fonction renvoyant l'élément à mettre en valeur (ou null)
     nextLabel → libellé personnalisé du bouton Suivant
   ══════════════════════════════════════════════════════════════════ */

// Libellés lisibles des parties (sert d'en-tête de bulle + menu d'aide).
// Ordre : on présente « Proposer » AVANT « Mon compte », car la partie compte
// renvoie aux propositions (statut « Mes propositions ») — déjà vues alors.
const TOUR_PARTS={welcome:'Bienvenue',fiches:'Les fiches',liens:'Les liens',
  nav:'Naviguer',partage:'Partager',reviser:'Réviser',proposer:'Proposer',
  compte:'Mon compte',end:''};

// Couleur d'accent par partie : sert à ENCADRER les pastilles de progression
// (un cadre coloré par thème, cf. tourProgressHTML). Teintes distinctes et
// lisibles sur fond sombre — une par partie de TOUR_PARTS.
const TOUR_PART_COLORS={welcome:"#9aa0b5",fiches:"#5b8def",liens:"#3fb6a8",
  nav:"#e0a458",partage:"#d8c24a",reviser:"#e06b9b",proposer:"#b07fe0",
  compte:"#57bfd6",end:"#6fcf97"};

// Garantit qu'une fiche de NOTION est affichée (état de départ commun à la
// plupart des étapes : sidebar en mode « notions », contenu d'une notion).
function tourShowNotion(){
  sbMode='notions';
  if(!D[cur]) cur=KEYS[0];
  renderSB(); renderContent();
}

/* tourShowTab(tab) — comme tourShowNotion, mais bascule EN PLUS sur un onglet
   précis de la fiche (curTab) afin que la visite détaille chaque onglet en
   montrant réellement son contenu (Auteurs, Textes, Concepts, Diss, Exemples). */
function tourShowTab(tab){
  sbMode='notions';
  if(!D[cur]) cur=KEYS[0];
  curTab=tab;
  renderSB(); renderContent();
}

/* tourTabEl(label) — renvoie le bouton d'onglet de la fiche dont le libellé
   correspond. Robuste à l'ordre et au bouton « ← Retour » qui précède les
   onglets. Repli sur la barre d'onglets entière si introuvable. */
function tourTabEl(label){
  return Array.from(document.querySelectorAll('.tabs .tab'))
    .find(t=>t.textContent.trim()===label) || document.querySelector('.tabs');
}

/* tourShowSidebarMode(mode) — bascule la sidebar dans l'un de ses cinq modes
   (notions / auteurs / concepts / reperes / methodo) pour la visite, en
   s'assurant qu'un item est bien sélectionné (sinon la liste pointerait dans
   le vide), puis rend la sidebar ET le contenu correspondant. Sert à PRÉSENTER
   chaque porte d'entrée en montrant réellement sa LISTE — pas seulement le
   bouton d'onglet (retour utilisateur BOX 17 : « tu dis Auteurs, tu présentes
   les auteurs »). Reproduit la logique des onclick des sb-tab (recalage de
   curAuthor / curConcept selon la liste active du mode). */
function tourShowSidebarMode(mode){
  sbMode=mode;
  if(mode==='auteurs'){
    if(!curAuthor) curAuthor=authorsSorted()[0];
    curAuthorTab='idees';
    renderSB(); renderAuthorContent();
  } else if(mode==='concepts'){
    const c0=realConcepts().find(c=>c.id===curConcept)||realConcepts()[0];
    if(c0) curConcept=c0.id;
    renderSB(); renderConceptContent();
  } else if(mode==='reperes'){
    const r0=REPERES().find(c=>c.id===curConcept)||REPERES()[0];
    if(r0) curConcept=r0.id;
    renderSB(); renderConceptContent();
  } else if(mode==='methodo'){   // guide de méthodologie (pas une fiche)
    renderSB(); renderMethodoContent();
  } else {                       // 'notions' (défaut)
    if(!D[cur]) cur=KEYS[0];
    renderSB(); renderContent();
  }
}

/* tourBoxEl(sel, tabLabel) — pour la visite des onglets de la fiche : renvoie
   la PREMIÈRE « boîte » de contenu réellement affichée dans la zone principale
   (la carte, pas le bouton d'onglet) afin que le projecteur zoome sur un
   exemple concret de ce qu'on trouve dans l'onglet (retour utilisateur :
   « zoomer sur une boîte, pas sur le titre de l'onglet »). `sel` peut lister
   plusieurs classes (ex. plans + sujets de l'onglet Dissertations). Repli sur
   le bouton d'onglet via tourTabEl si l'onglet courant n'a aucune boîte
   (notion sans contenu pour cet onglet). */
function tourBoxEl(sel, tabLabel){
  const list=sel.split(',').map(s=>'.main-content '+s.trim()).join(',');
  return document.querySelector(list) || tourTabEl(tabLabel);
}

/* ── Étapes qui ENTRENT dans une fenêtre (quiz / contribution) ───────────
   La visite reste « pilotée » : le voile capte les clics, mais on ouvre
   réellement la fenêtre concernée pour la détailler de l'intérieur. Ces
   setups sont idempotents (rappelés à chaque étape de la partie) ; le
   ménage entre parties est fait par tourCloseOverlays(). */

/* tourOpenQuiz() — ouvre le mode révision sur son tableau de bord. openQuiz
   lit l'état sauvegardé et n'écrit rien : la progression de l'élève n'est
   jamais modifiée par la visite. */
function tourOpenQuiz(){ openQuiz(); }

/* tourOpenProposal() — ouvre la modale de contribution en vue ÉDITION. On
   force le mode édition le temps de la visite (champs et bouton visibles) ;
   openProposal garantit au moins une boîte SANS effacer une saisie existante. */
function tourOpenProposal(){
  document.body.classList.add('mode-edition');
  proposalView='edit';
  openProposal();
}

/* tourOpenProposalPreview() — comme tourOpenProposal mais bascule sur la vue
   APERÇU (étape « Aperçu et envoi »). */
function tourOpenProposalPreview(){
  tourOpenProposal();
  proposalView='preview';
  renderProposal();
}

/* tourProposalSelect(n) — renvoie le n-ième menu déroulant (.psel) de la
   1re boîte de la modale (0 = Catégorie, 1 = Préciser, 2 = Type d'action).
   Repli sur la boîte entière si ce menu n'existe pas (ex. catégorie « site »
   où le 3e menu est masqué), pour toujours mettre en valeur quelque chose. */
function tourProposalSelect(n){
  const b=document.querySelector('#proposal-overlay .pbox');
  if(!b) return null;
  return b.querySelectorAll('.psel')[n] || b;
}

/* tourCloseOverlays() — referme les fenêtres que la visite a pu ouvrir
   (contribution, mode révision) avant de changer d'étape, pour repartir
   d'un écran propre. Idempotent ; les étapes qui en ont besoin les
   rouvrent ensuite via leur `setup` (close + open dans la même frame =
   aucun clignotement). */
function tourCloseOverlays(){
  const pov=document.getElementById('proposal-overlay'); if(pov) pov.classList.remove('open');
  const qov=document.getElementById('quiz-overlay');     if(qov) qov.classList.remove('open');
}

const TOUR_STEPS=[
  // ── Partie 0 : Bienvenue (carte centrée, sans projecteur) ──
  { part:'welcome', center:true, title:'🏛️ Bienvenue !',
    text:"Tu viens d'arriver sur un <b>outil de fiches de philo</b> pour le bac : "
        +"notions, auteurs et concepts du programme de Terminale, reliés entre eux, "
        +"avec une <b>révision active</b> en cartes. Petit tour du propriétaire ?",
    nextLabel:'Commencer ▶' },

  // ── Partie 1 : Les fiches ──
  { part:'fiches', side:'sidebar', title:'Cinq portes d’entrée',
    text:"Tout en haut de la barre latérale, <b>cinq onglets</b> ouvrent l’outil "
        +"sous plusieurs angles : <b>Notions</b>, <b>Auteurs</b>, <b>Concepts</b>, "
        +"<b>Repères</b> (les distinctions du programme) et <b>Méthodo</b> "
        +"(la méthode pas à pas de la dissertation et de l’explication de texte).",
    setup:tourShowNotion, target:()=>document.querySelector('.sb-tabs') },
  // Chaque porte d'entrée est PRÉSENTÉE en basculant réellement la sidebar dans
  // son mode (tourShowSidebarMode) puis en mettant en valeur sa LISTE, pas le
  // simple bouton d'onglet (retour utilisateur BOX 17 : « tu dis Notions, tu
  // présentes les notions ; tu dis Auteurs, tu présentes les auteurs… »).
  { part:'fiches', side:'sidebar', title:'Les Notions',
    text:"Voici la liste des <b>notions</b> du programme (la conscience, la nature, l’art…). "
        +"C’est le point de départ le plus naturel.",
    setup:()=>tourShowSidebarMode('notions'), target:()=>document.querySelector('#sb .sidebar-list') },
  { part:'fiches', side:'sidebar', title:'Les Auteurs',
    text:"Tu préfères entrer par un <b>philosophe</b> ? Cet onglet liste les auteurs et, pour "
        +"chacun, ses idées clés et les notions qu’il a traitées.",
    setup:()=>tourShowSidebarMode('auteurs'), target:()=>document.querySelector('#sb .sidebar-list') },
  { part:'fiches', side:'sidebar', title:'Les Concepts',
    text:"Le <b>glossaire</b> des termes techniques (le déterminisme, l’aliénation…), avec leur "
        +"définition et leurs liens vers les notions et les autres concepts.",
    setup:()=>tourShowSidebarMode('concepts'), target:()=>document.querySelector('#sb .sidebar-list') },
  { part:'fiches', side:'sidebar', title:'Les Repères',
    text:"Les <b>repères du programme</b> : les distinctions à maîtriser pour analyser un sujet "
        +"(absolu/relatif, légal/légitime, en fait/en droit…), chacune avec sa définition et un exemple.",
    setup:()=>tourShowSidebarMode('reperes'), target:()=>document.querySelector('#sb .sidebar-list') },
  { part:'fiches', side:'sidebar', title:'La Méthodo',
    text:"Le <b>guide de méthode</b> : comment analyser un sujet, problématiser, bâtir un plan et "
        +"rédiger une <b>dissertation</b> ou une <b>explication de texte</b> — avec un squelette "
        +"visuel de la copie et des phrases toutes prêtes, étape par étape.",
    setup:()=>tourShowSidebarMode('methodo'), target:()=>document.querySelector('#sb .sidebar-list') },
  // — Au cœur du projet : le DÉTAIL d'une fiche de notion. On montre la
  //   définition, le volet « Approfondir », puis CHAQUE onglet (en basculant
  //   réellement dessus via tourShowTab) avec ce qu'on y trouve. Pensé mobile :
  //   textes courts ; positionTourStep recentre chaque cible à l'écran.
  { part:'fiches', side:'main', title:'Le cœur : la fiche de notion',
    text:"Voici une <b>fiche de notion</b>, le cœur de l’outil. Tout en haut, sa "
        +"<b>définition</b> pose les bases : sens du mot, enjeux et premières distinctions.",
    setup:tourShowNotion, target:()=>document.querySelector('.def-box') },
  { part:'fiches', side:'main', title:'Approfondir la notion',
    text:"Sous la définition, le volet <b>« Approfondir la notion »</b> se déroule : "
        +"précisions, distinctions fines et repères pour aller plus loin que l’essentiel.",
    setup:()=>{ tourShowNotion(); const d=document.querySelector('.def-box details'); if(d) d.open=true; },
    target:()=>document.querySelector('.def-box details')||document.querySelector('.def-box') },
  { part:'fiches', side:'main', title:'Les onglets de la fiche',
    text:"Sous la définition, <b>cinq onglets</b> organisent tout le reste : <b>Auteurs</b>, "
        +"<b>Textes</b>, <b>Concepts</b>, <b>Dissertations</b> et <b>Exemples</b>. "
        +"Passons-les en revue.",
    setup:tourShowNotion, target:()=>document.querySelector('.tabs') },
  { part:'fiches', side:'main', title:'Onglet Auteurs',
    text:"Les <b>philosophes majeurs</b> sur cette notion : pour chacun, ses <b>idées clés</b> "
        +"(classées par œuvre) et ses <b>citations</b>. Ta matière première pour argumenter.",
    setup:()=>tourShowTab('auteurs'), target:()=>tourBoxEl('.ac','Auteurs') },
  { part:'fiches', side:'main', title:'Onglet Textes',
    text:"Les <b>extraits clés</b> du programme, avec leur référence. À relire pour citer un "
        +"texte précis et montrer que tu connais les œuvres au programme.",
    setup:()=>tourShowTab('textes'), target:()=>tourBoxEl('.ti2','Textes') },
  { part:'fiches', side:'main', title:'Onglet Concepts',
    text:"Les <b>concepts clés</b> liés à la notion, en <b>deux sous-onglets</b> : ceux qui "
        +"<b>éclairent la notion</b>, puis les <b>liens entre concepts</b> (oppositions, "
        +"distinctions…). Le vocabulaire technique attendu de toi.",
    setup:()=>tourShowTab('concepts'), target:()=>tourBoxEl('.concept-card','Concepts') },
  { part:'fiches', side:'main', title:'Onglet Dissertations',
    text:"De quoi <b>composer</b> : les <b>notions voisines</b> à mobiliser, des <b>plans "
        +"détaillés</b> (problématique + 3 axes déroulables, avec sous-parties, auteurs et "
        +"références) et des <b>sujets</b> pour t’entraîner.",
    setup:()=>tourShowTab('diss'), target:()=>tourBoxEl('.plan-card, .dq','Dissertations') },
  { part:'fiches', side:'main', title:'Onglet Exemples',
    text:"Deux sous-onglets. <b>Exemples</b> : des cas concrets (œuvres, sciences, "
        +"actualité…) à <b>réinvestir</b> pour illustrer un argument. <b>Accroches</b> : des "
        +"<b>phrases d’ouverture rédigées</b>, prêtes à recopier pour <b>amorcer</b> une "
        +"dissertation (cherchables aussi via Ctrl + K).",
    setup:()=>tourShowTab('exemples'), target:()=>tourBoxEl('.ex-card','Exemples') },

  // ── Partie 2 : Les liens dynamiques ──
  { part:'liens', side:'main', title:'Tout est relié',
    text:"Les <b>termes colorés</b> dans les textes sont cliquables : notions, auteurs et concepts "
        +"forment un <b>graphe</b>. Un clic t’emmène à la fiche correspondante — explore de proche "
        +"en proche, sans jamais te perdre.",
    setup:tourShowNotion,
    target:()=>document.querySelector('.main-content .nterm, .main-content .cterm, .main-content .aterm')
            ||document.querySelector('.def-box') },

  // ── Partie 3 : Naviguer / revenir en arrière ──
  // Volontairement CONCIS (retour utilisateur) : une phrase par outil de
  // navigation, et l'étape « Réglages & aide » présentée sous forme de LISTE
  // plutôt qu'en pavé. Le « mode fiche » y figure → il entre ainsi dans le NOYAU.
  { part:'nav', side:'main', title:'Le fil d’Ariane',
    text:"En haut, le <b>fil d’Ariane</b> montre où tu te trouves : clique un niveau pour y remonter.",
    setup:tourShowNotion, target:()=>document.getElementById('crumbs') },
  { part:'nav', side:'main', title:'Revenir en arrière',
    text:"Le bouton <b>← Retour</b> te ramène à la page précédente — pratique après avoir suivi un lien.",
    setup:tourShowNotion, target:()=>document.querySelector('.back-btn') },
  { part:'nav', side:'main', title:'Chercher partout (Ctrl + K)',
    text:"Ce bouton, ou le raccourci <b>Ctrl + K</b> (⌘ + K sur Mac), ouvre la <b>recherche globale</b> : "
        +"tape une notion, un auteur ou un concept et saute droit à sa fiche.",
    setup:tourShowNotion, target:()=>document.getElementById('topbar-search') },
  { part:'nav', side:'sidebar', title:'Réglages & aide',
    text:"Tout en bas de la barre, <b>⚙ Réglages</b> regroupe deux options :"
        +"<ul class='tour-list'>"
        +"<li><b>Mode fiche</b> : compresse chaque fiche d’auteur en une <b>synthèse courte</b>, pour réviser vite.</li>"
        +"<li><b>Mode édition</b> : fait apparaître les boutons <b>+</b> pour proposer des corrections.</li>"
        +"</ul>"
        +"Et le bouton <b>?</b>, en haut à droite, rouvre cette visite quand tu veux.",
    setup:()=>tourShowSidebarMode('notions'), target:()=>document.querySelector('.sb-settings') },

  // ── Partie 4 : Partager l'outil ──
  // Pointe le bouton de partage de la barre du haut puis décrit la fenêtre
  // (QR code à scanner, lien à copier, partage natif du téléphone). On ne fait
  // que DÉSIGNER le bouton : la visite ne l'ouvre pas, pour rester simple.
  { part:'partage', side:'main', title:'Partager l’outil',
    text:"Le bouton <b>🔗 Partager</b> ouvre une fenêtre pour transmettre le site à un camarade : "
        +"un <b>QR code</b> à scanner, le <b>lien à copier</b>, et — sur téléphone — le <b>partage "
        +"direct</b> (messages, mail…). De quoi réviser à plusieurs.",
    setup:tourShowNotion, target:()=>document.getElementById('topbar-share') },

  // ── Partie 5 : Réviser (le quiz) ──
  // On OUVRE réellement le mode révision pendant la visite : la 1re étape
  // pointe le bouton (quiz fermé), les suivantes pilotent l'overlay ouvert
  // (setup:tourOpenQuiz) et mettent en valeur chaque réglage du tableau de bord.
  { part:'reviser', side:'sidebar', title:'Réviser activement',
    text:"Le bouton <b>🎯 Réviser</b> ouvre le <b>mode révision</b> : un quiz en cartes que le site "
        +"fabrique tout seul à partir des fiches. Ouvrons-le pour le visiter.",
    setup:tourShowNotion, target:()=>document.querySelector('.sb-quiz') },
  { part:'reviser', side:'main', title:'Ton niveau et tes points',
    text:"Tout en haut, ton <b>niveau</b> et tes <b>XP</b> : tu en gagnes à chaque bonne réponse. "
        +"Un petit ressort de jeu pour réviser un peu chaque jour.",
    setup:tourOpenQuiz, target:()=>document.querySelector('#quiz-overlay .quiz-level') },
  { part:'reviser', side:'main', title:'Ta mémorisation',
    text:"Ce pourcentage, c’est la part de tes cartes <b>bien ancrées</b>. Chaque carte gravit "
        +"<b>5 paliers</b> : une bonne réponse la fait monter (elle revient moins souvent), une "
        +"erreur la fait redescendre. C’est la <b>répétition espacée</b>.",
    setup:tourOpenQuiz, target:()=>document.querySelector('#quiz-overlay .quiz-mastery') },
  { part:'reviser', side:'main', title:'Sprint ou long terme',
    text:"Choisis ton <b>rythme</b> : <b>⚡ Sprint</b> resserre les révisions (avant un contrôle), "
        +"<b>📅 Long terme</b> les espace pour ancrer durablement. Chaque rythme garde sa propre "
        +"progression.",
    setup:tourOpenQuiz, target:()=>document.querySelector('#quiz-overlay .quiz-horizon') },
  { part:'reviser', side:'main', title:'Cartes ou QCM',
    text:"Deux formats au choix : <b>🃏 Cartes</b> (tu retournes la carte pour vérifier) ou "
        +"<b>📝 QCM</b> (choix multiples). Prends celui qui t’aide le plus à mémoriser.",
    setup:tourOpenQuiz, target:()=>document.querySelector('#quiz-overlay .quiz-mode-toggle') },
  { part:'reviser', side:'main', title:'Cibler une révision',
    text:"Tu peux <b>filtrer</b> : une ou plusieurs notions, un type de question, ou seulement "
        +"<b>tes ratés</b>. Idéal pour retravailler un point précis.",
    setup:tourOpenQuiz, target:()=>document.querySelector('#quiz-overlay .quiz-filters') },
  { part:'reviser', side:'main', title:'Lancer la session',
    text:"Ce bouton démarre la <b>session du jour</b> : le site choisit les cartes à revoir "
        +"maintenant. Une session interrompue se <b>reprend</b> là où tu l’avais laissée.",
    setup:tourOpenQuiz, target:()=>document.querySelector('#quiz-overlay .quiz-start') },
  { part:'reviser', side:'main', title:'Un objectif par jour',
    text:"Fixe un <b>objectif quotidien</b> (10, 20 ou 50 cartes) et garde ta <b>série</b> 🔥 en "
        +"révisant un peu chaque jour. Le vrai secret, c’est la régularité.",
    setup:tourOpenQuiz, target:()=>document.querySelector('#quiz-overlay .quiz-goal-pick') },

  // ── Partie 6 : Proposer / éditer ──
  // Présentée AVANT « Mon compte » : la partie compte renvoie au suivi des
  // propositions (« Mes propositions »), qu'il faut donc avoir déjà vues.
  // Les 2 premières étapes restent dans la barre latérale (mode édition +
  // bouton) ; les suivantes OUVRENT la modale de contribution (tourOpenProposal)
  // et détaillent les 3 menus en cascade, les champs, l'empilement et l'envoi.
  { part:'proposer', side:'sidebar', title:'Réglages → mode édition',
    text:"Dans <b>⚙ Réglages</b>, tu peux passer en <b>mode édition</b> : il fait apparaître partout "
        +"de petits boutons <b>+</b> sur les cartes (cachés par défaut pour un rendu épuré), pour "
        +"proposer des corrections ciblées.",
    setup:tourShowNotion, target:()=>document.querySelector('.sb-settings') },
  { part:'proposer', side:'sidebar', title:'Proposer du contenu',
    text:"En mode édition, <b>💡 Proposer du contenu</b> ouvre une fenêtre pour suggérer un "
        +"<b>ajout</b>, une <b>correction</b> ou une <b>remarque</b>. Ouvrons-la pour la découvrir.",
    // On force l'affichage du bouton (caché en mode révision) le temps de
    // l'étape ; endTour()/renderTourStep() restaurent le mode réel ensuite.
    setup:()=>{ tourShowNotion(); document.body.classList.add('mode-edition'); },
    target:()=>document.querySelector('.sb-propose') },
  { part:'proposer', side:'main', title:'Une « boîte » = une idée',
    text:"Chaque proposition tient dans une <b>boîte</b>. Tu peux en <b>empiler plusieurs</b> dans "
        +"un même envoi (par exemple un auteur et un exemple).",
    setup:tourOpenProposal, target:()=>document.querySelector('#proposal-overlay .pbox') },
  { part:'proposer', side:'main', title:'À quoi ça touche ?',
    text:"Premier menu, la <b>catégorie</b> : une <b>notion</b>, un <b>auteur</b>, un <b>concept</b>, "
        +"ou un retour sur <b>le site</b> lui-même (un bug, une idée de fonctionnalité).",
    setup:tourOpenProposal, target:()=>tourProposalSelect(0) },
  { part:'proposer', side:'main', title:'Préciser',
    text:"Le deuxième menu <b>précise</b> : pour un auteur, par exemple, s’agit-il d’une citation, "
        +"d’un dialogue avec un autre auteur, de sa biographie… La fenêtre adapte alors les champs "
        +"à remplir.",
    setup:tourOpenProposal, target:()=>tourProposalSelect(1) },
  { part:'proposer', side:'main', title:'Que veux-tu faire ?',
    text:"Le troisième menu, l’<b>action</b> : <b>ajouter</b> du contenu, <b>corriger</b> une erreur "
        +"ou laisser une <b>remarque</b>. (Pour un retour sur le site, ce menu disparaît : c’est "
        +"toujours une remarque.)",
    setup:tourOpenProposal, target:()=>tourProposalSelect(2) },
  { part:'proposer', side:'main', title:'Remplir les champs',
    text:"En dessous s’affichent les <b>champs</b> correspondants. Remplis seulement ce que tu sais : "
        +"pas besoin d’être exhaustif, l’essentiel suffit.",
    setup:tourOpenProposal, target:()=>{ const b=document.querySelector('#proposal-overlay .pbox'); return b?(b.querySelector('.pbox-fields')||b):null; } },
  { part:'proposer', side:'main', title:'Empiler des boîtes',
    text:"Avec <b>+ Ajouter une boîte</b>, tu proposes plusieurs choses d’un coup. Chaque boîte "
        +"reste indépendante des autres.",
    setup:tourOpenProposal, target:()=>document.querySelector('#proposal-overlay .pbox-add') },
  { part:'proposer', side:'main', title:'Aperçu et envoi',
    text:"Enfin, l’<b>aperçu</b> te montre exactement ce qui sera transmis, puis tu <b>envoies</b> "
        +"(en ligne, ou par email en repli). Ta proposition est <b>relue</b> avant d’être publiée.",
    setup:tourOpenProposalPreview, target:()=>document.querySelector('#proposal-overlay .pactions') },

  // ── Partie 7 : Mon compte (facultatif — synchronisation & suivi) ──
  // Pointe le bouton .sb-account (toujours visible) puis récapitule les
  // bénéfices, en renvoyant aux propositions VUES juste avant. La visite ne
  // CLIQUE pas le bouton : aucun risque si Supabase n'est pas encore configuré,
  // on ne fait que le désigner.
  { part:'compte', side:'sidebar', title:'Un compte (facultatif)',
    text:"Tout en bas de la barre latérale, tu peux <b>créer un compte</b>. Ce n’est pas "
        +"obligatoire pour réviser, mais ça débloque deux choses bien pratiques.",
    setup:tourShowNotion, target:()=>document.querySelector('.sb-account') },
  { part:'compte', center:true, title:'Sync & suivi',
    text:"<b>1.</b> Ta <b>révision</b> (progression, série, objectif) te suit sur <b>tous tes "
        +"appareils</b> — commence sur l’ordi, continue sur le téléphone.<br>"
        +"<b>2.</b> Les <b>propositions</b> qu’on vient de voir sont reliées à ton compte : suis "
        +"leur <b>statut</b> (en attente, intégrée, refusée) via le bouton <b>📋 Mes propositions</b>, "
        +"qui apparaît en haut de la page une fois connecté.<br>"
        +"Tu restes maître de tes données : on peut se <b>déconnecter</b> ou <b>supprimer son "
        +"compte</b> à tout moment." },

  // ── Fin ──
  // Un FOCUS dédié sur le bouton « ? » (rouvrir la visite) — demandé : au moins
  // un projecteur réel sur ce bouton, ici en fin de parcours. Puis la carte
  // finale (PWA installable + hors-ligne), centrée.
  { part:'end', side:'main', title:'Revenir à la visite',
    text:"Ce bouton <b>?</b>, en haut à droite, <b>rouvre cette visite</b> quand tu veux — "
        +"en entier ou directement sur une partie précise. Tu peux donc y revenir sans crainte.",
    setup:tourShowNotion, target:()=>document.getElementById('help-btn') },
  { part:'end', center:true, title:'C’est parti 🎓',
    text:"Voilà l’essentiel ! 💡 Astuce : le site s’<b>installe</b> comme une appli "
        +"(menu du navigateur → « Installer ») et fonctionne <b>hors-ligne</b> — pratique "
        +"pour réviser dans le train. Bonnes révisions !",
    nextLabel:'Terminer' },
];

// NOYAU de la visite (1er passage) : l'essentiel pour savoir naviguer. Marqué
// par step.core. Le 1er passage joue UNIQUEMENT ces étapes puis propose la
// « visite détaillée » (le reste). On marque ici, sans alourdir chaque étape :
//   • accueil, liens dynamiques, navigation → core ;
//   • les 5 portes d'entrée (fiches, côté sidebar) → core ;
//   • la 1re étape de « réviser » (intro) → core ; le détail vient après.
(function markTourCore(){
  const coreParts=new Set(['welcome','liens','nav']);
  let reviserSeen=false;
  TOUR_STEPS.forEach(s=>{
    if(coreParts.has(s.part)) s.core=true;
    else if(s.part==='fiches' && s.side==='sidebar') s.core=true;
    else if(s.part==='reviser' && !reviserSeen){ s.core=true; reviserSeen=true; }
  });
})();

// État interne : index de l'étape courante (-1 = visite fermée), cache du
// DOM, `jumped` (true = accès direct à une partie → croix + clic sombre pour
// sortir), `mode` (core | detail | full) et `decision` (vrai pendant l'écran
// « continuer la visite détaillée ? » entre le noyau et le détail).
const tourState={i:-1, dom:null, jumped:false, mode:'full', decision:false};

/* tourSeq() — indices des étapes ACTIVES selon le mode :
   • core   → seulement les étapes du noyau (step.core) ;
   • detail → seulement les approfondissements (!step.core) ;
   • full   → toutes. La navigation (suivant/précédent/passer) opère sur cette
   séquence ; le noyau et le détail s'enchaînent ainsi sans réordonner le tableau. */
function tourSeq(){
  const m=tourState.mode;
  const all=TOUR_STEPS.map((s,k)=>k);
  if(m==='core')   return all.filter(k=>TOUR_STEPS[k].core);
  if(m==='detail') return all.filter(k=>!TOUR_STEPS[k].core);
  return all;
}

/* buildTourDOM() — crée (une seule fois) les éléments de la visite :
   le voile bloquant, le projecteur et la bulle. Réutilisés ensuite. */
function buildTourDOM(){
  if(tourState.dom) return tourState.dom;
  const blocker=document.createElement('div'); blocker.className='tour-blocker';
  const spot=document.createElement('div'); spot.className='tour-spot';
  const bubble=document.createElement('div'); bubble.className='tour-bubble';
  // Clic dans le sombre → fermeture conditionnelle (cf. tourBlockerClick).
  blocker.addEventListener('click',tourBlockerClick);
  document.body.appendChild(blocker);
  document.body.appendChild(spot);
  document.body.appendChild(bubble);
  return tourState.dom={blocker,spot,bubble};
}

/* startTour(i, jumped) — démarre la visite à l'index i (0 = depuis le début).
   `jumped` (défaut false) = entrée par accès direct à une partie : active la
   croix et le clic-sombre pour sortir. Ferme le menu d'aide et le tiroir
   pour partir d'un état propre. */
function startTour(i, jumped, mode){
  closeHelpMenu();
  closeSidebar();
  buildTourDOM();
  tourState.mode=mode||'full';     // 'core' (1er passage) | 'detail' | 'full'
  tourState.decision=false;
  tourState.i=(i|0);
  tourState.jumped=!!jumped;
  document.addEventListener('keydown',tourKey);
  window.addEventListener('resize',tourReposition);
  renderTourStep();
}

/* tourGoPart(part) — va directement à la 1re étape d'une partie (menu d'aide).
   Entrée « ciblée » → jumped=true (croix + clic-sombre pour sortir) ; mode FULL
   pour que toutes les parties soient accessibles. */
function tourGoPart(part){
  const idx=TOUR_STEPS.findIndex(s=>s.part===part);
  if(idx>=0) startTour(idx, true, 'full');
}

/* ── Bandeau d'avertissement « contenu en construction » ─────────────────────
   Réapparaît à CHAQUE chargement (aucune persistance, contrairement à
   l'onboarding) ; deux façons de disparaître : la croix (dismissNotice) ou,
   à défaut, automatiquement au bout d'une minute (timer posé par initNotice).
   Le mot souligné ouvre la partie « Proposer / éditer » de la visite guidée. */
let noticeTimer=null;   // id du minuteur d'auto-fermeture (null si déjà fermé)

/* dismissNotice() — ferme le bandeau (anim de sortie puis retrait du DOM) et
   annule le minuteur d'auto-fermeture s'il court encore. */
function dismissNotice(){
  const b=document.getElementById('notice-banner');
  if(noticeTimer){ clearTimeout(noticeTimer); noticeTimer=null; }
  if(!b) return;
  b.classList.add('hide');                 // transition opacity/translate
  setTimeout(()=>{ if(b&&b.parentNode) b.remove(); },300);
}

/* noticeOpenContribTour() — depuis le mot souligné : ferme le bandeau et ouvre
   la partie « participation active » du tutoriel. */
function noticeOpenContribTour(){
  dismissNotice();
  tourGoPart('proposer');
}

/* initNotice() — au chargement : arme la disparition automatique à 30 s. Le
   bandeau est présent par défaut dans le HTML → visible à chaque rechargement. */
function initNotice(){
  if(!document.getElementById('notice-banner')) return;
  noticeTimer=setTimeout(dismissNotice,30000);
}

/* endTour() — termine la visite : masque le DOM, retire les écouteurs,
   restaure le mode réel (un mode édition temporaire a pu être posé) et
   mémorise que la visite a été vue (plus d'auto-affichage). */
function endTour(){
  document.removeEventListener('keydown',tourKey);
  window.removeEventListener('resize',tourReposition);
  clearTimeout(tourState.posT1); clearTimeout(tourState.posT2);   // annule les repositionnements en attente
  if(tourState.dom){
    tourState.dom.blocker.classList.remove('open','dim');
    tourState.dom.spot.style.display='none';
    tourState.dom.bubble.style.display='none';
  }
  tourState.i=-1;
  tourCloseOverlays();                           // referme quiz/contribution ouverts par la visite
  applyPhiloMode();                              // restaure le mode (édition tempo)
  try{ localStorage.setItem('philo-tour-v1','1'); }catch(e){}
  syncOnPrefsChange();                           // new (Phase 2) : « visite vue » suit le compte
}

/* tourNext() — avance dans la SÉQUENCE ACTIVE (tourSeq(), filtrée par le mode).
   En fin de séquence : en mode « core » (1er passage), on propose la visite
   détaillée via l'écran de décision ; sinon on termine. Ne fait rien pendant
   l'écran de décision (qui a ses propres boutons). */
function tourNext(){
  if(tourState.decision) return;
  const seq=tourSeq(), pos=seq.indexOf(tourState.i);
  if(pos>=0 && pos<seq.length-1){ tourState.i=seq[pos+1]; renderTourStep(); return; }
  if(tourState.mode==='core') return tourShowDecision();
  endTour();
}
/* tourPrev() — recule d'une étape dans la séquence active (jamais sous la 1re). */
function tourPrev(){
  if(tourState.decision) return;
  const seq=tourSeq(), pos=seq.indexOf(tourState.i);
  if(pos>0){ tourState.i=seq[pos-1]; renderTourStep(); }
}
function tourSkipAll(){ endTour(); }
/* tourSkipPart() — saute jusqu'à la 1re étape de la PARTIE SUIVANTE dans la
   séquence active (ou propose la visite détaillée / termine s'il n'en reste pas). */
function tourSkipPart(){
  const curStep=TOUR_STEPS[tourState.i]; if(!curStep) return;
  const seq=tourSeq(); let p=seq.indexOf(tourState.i)+1;
  while(p<seq.length && TOUR_STEPS[seq[p]].part===curStep.part) p++;
  if(p>=seq.length) return tourState.mode==='core' ? tourShowDecision() : endTour();
  tourState.i=seq[p]; renderTourStep();
}
/* tourShowDecision() — fin du NOYAU (1er passage) : écran « Tu connais
   l'essentiel — veux-tu la visite détaillée ? ». Voile uniforme (pas de
   projecteur), bulle centrée. tourState.decision=true le temps de l'écran ;
   ses boutons appellent tourContinueDetailed() (poursuivre) ou endTour(). */
function tourShowDecision(){
  tourState.decision=true;
  const {blocker,spot,bubble}=buildTourDOM();
  applyPhiloMode();                              // restaure le mode réel
  tourCloseOverlays();                           // referme un overlay d'étape éventuel
  if(window.innerWidth<=700) document.body.classList.remove('sb-open');
  blocker.classList.add('open','dim');           // assombri uniforme, pas de spot
  spot.style.display='none';
  bubble.style.display='block';
  bubble.innerHTML=tourBubbleHTML(null);         // la branche décision ignore l'argument
  // Centrer après un frame (la bulle doit être remplie pour mesurer sa taille).
  requestAnimationFrame(()=>{
    const vw=window.innerWidth, vh=window.innerHeight;
    bubble.style.left=Math.max(8,(vw-bubble.offsetWidth)/2)+'px';
    bubble.style.top=Math.max(8,(vh-bubble.offsetHeight)/2)+'px';
  });
}
/* tourContinueDetailed() — « Oui, voir le détail » : enchaîne sur la visite
   détaillée (mode 'detail' = toutes les étapes HORS noyau) depuis sa 1re étape. */
function tourContinueDetailed(){
  tourState.decision=false;
  tourState.mode='detail';
  const seq=tourSeq();
  if(!seq.length) return endTour();
  tourState.i=seq[0];
  renderTourStep();
}
/* tourKey(e) — Échap quitte la visite. */
function tourKey(e){ if(e.key==='Escape') endTour(); }
/* tourBlockerClick() — clic sur le voile sombre. Ne ferme la visite que
   dans les cas voulus (sinon on ignore, pour ne pas sortir par accident
   pendant le déroulé guidé) : sur la DERNIÈRE étape, ou en accès direct à
   une partie (tourState.jumped). */
function tourBlockerClick(){
  if(tourState.i<0 || tourState.decision) return;     // décision : choisir via les boutons
  if(tourState.jumped) return endTour();
  const seq=tourSeq();
  if(seq.indexOf(tourState.i)===seq.length-1)         // dernière étape de la séquence active
    return tourState.mode==='core' ? tourShowDecision() : endTour();
}
/* tourReposition() — recalcule la position de l'élément courant (resize) :
   la bulle de décision (recentrée) ou l'étape pointée (projecteur + bulle). */
function tourReposition(){
  if(tourState.decision){ tourShowDecision(); return; }
  if(tourState.i>=0) positionTourStep();
}

/* renderTourStep() — affiche l'étape courante : prépare l'état de l'appli,
   remplit la bulle, puis (au frame suivant, le rendu/scroll étant à jour)
   positionne projecteur + bulle. */
function renderTourStep(){
  const step=TOUR_STEPS[tourState.i]; if(!step) return endTour();
  const {blocker,bubble}=buildTourDOM();
  // 1. Repartir du mode réel (annule un mode édition temporaire éventuel) et
  //    refermer les fenêtres ouvertes par une étape précédente (quiz /
  //    contribution) ; l'étape rouvrira la sienne via son `setup`. Puis gérer
  //    le tiroir mobile selon la cible, et appliquer l'état propre à l'étape.
  applyPhiloMode();
  tourCloseOverlays();
  if(window.innerWidth<=700){
    if(step.side==='sidebar') document.body.classList.add('sb-open');
    else document.body.classList.remove('sb-open');
  }
  if(step.setup) step.setup();
  // 2. Construire la bulle (contenu + contrôles).
  blocker.classList.add('open');
  bubble.style.display='block';
  bubble.innerHTML=tourBubbleHTML(step);
  // 3. Positionner en PLUSIEURS passes (cf. tourSchedulePosition) : le tiroir
  //    mobile (transform .25s) et l'ouverture d'un overlay glissent encore au
  //    prochain frame, ce qui fausserait getBoundingClientRect (projecteur hors
  //    champ). On repositionne donc aussi APRÈS ces transitions.
  tourSchedulePosition();
}

/* tourSchedulePosition() — planifie plusieurs recalculs de position : tout de
   suite (frame courant), puis après le glissement du tiroir mobile (~0,25 s) et
   un dernier filet de sécurité pour un reflow tardif. Sans ces passes, une
   cible dans la barre latérale (mode mobile) était mesurée pendant que le
   tiroir glissait encore → projecteur invisible jusqu'au changement d'étape. */
function tourSchedulePosition(){
  clearTimeout(tourState.posT1); clearTimeout(tourState.posT2);
  requestAnimationFrame(positionTourStep);
  tourState.posT1=setTimeout(positionTourStep,140);  // milieu de transition
  tourState.posT2=setTimeout(positionTourStep,340);  // après la fin (>250ms)
}

/* tourProgressHTML(curIdx) — pastilles de progression GROUPÉES par partie :
   chaque thème forme un cadre arrondi à sa couleur (cf. TOUR_PART_COLORS),
   fond très transparent + contour léger ; la partie en cours reçoit un
   contour plus net (classe .cur). Une pastille par étape, à l'état
   done / cur / à venir. Les couleurs translucides sont obtenues en suffixant
   un alpha hexadécimal à la couleur de la partie (ex. #5b8def + "26"). */
function tourProgressHTML(curIdx){
  // 1. Ne montrer QUE les étapes de la séquence active (mode core/detail/full) :
  //    en noyau, on n'affiche pas les pastilles des approfondissements (et vice
  //    versa). Les regrouper par partie, en conservant l'ordre du tableau.
  const seq=tourSeq();
  const curPos=seq.indexOf(curIdx);            // position de l'étape courante DANS la séquence
  const groups=[];
  seq.forEach(k=>{
    const s=TOUR_STEPS[k];
    const last=groups[groups.length-1];
    if(!last || last.part!==s.part) groups.push({part:s.part, dots:[k]});
    else last.dots.push(k);
  });
  // 2. Un cadre coloré par groupe ; pastilles done/cur/à venir à l'intérieur.
  //    Le cadre est CLIQUABLE (saute à cette partie) et porte data-label = nom
  //    de la partie, affiché au survol/focus (cf. CSS .tour-pgroup::after).
  //    role/tabindex/onkeydown rendent l'accès au clavier (Entrée/Espace) possible.
  return groups.map(grp=>{
    const c=TOUR_PART_COLORS[grp.part]||"#9aa0b5";
    const isCur=grp.dots.indexOf(curIdx)>=0;
    const label=TOUR_PARTS[grp.part]||'Fin';   // 'end' a un libellé vide → « Fin »
    // Cadre : contour net + fond plus marqué pour la partie courante.
    const frame=isCur ? `border:1px solid ${c};background:${c}26`
                      : `border:0.5px solid ${c}59;background:${c}12`;
    // done/cur/à venir : comparé sur la POSITION dans la séquence active, pas
    // sur l'index brut (les deux divergent en mode core/detail).
    const dots=grp.dots.map(k=>{ const p=seq.indexOf(k);
      return `<span class="tour-dot${p<curPos?' done':p===curPos?' cur':''}"></span>`; }).join('');
    return `<span class="tour-pgroup${isCur?' cur':''}" style="--pc:${c};${frame}" `
      +`role="button" tabindex="0" data-label="${label}" aria-label="Aller à : ${label}" `
      +`onclick="tourJumpPart('${grp.part}')" `
      +`onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();tourJumpPart('${grp.part}')}">`
      +`${dots}</span>`;
  }).join('');
}

/* tourJumpPart(part) — depuis les pastilles de progression : va directement à
   la 1re étape de la partie cliquée, SANS changer le contexte (tourState.jumped)
   ni redémarrer la visite. Permet de circuler librement entre les parties. */
function tourJumpPart(part){
  if(tourState.i<0 || tourState.decision) return;   // visite fermée / écran de décision
  // 1re étape de cette partie DANS la séquence active (les pastilles n'affichent
  // que des parties présentes dans la séquence → l'index existe forcément).
  const seq=tourSeq();
  const idx=seq.find(k=>TOUR_STEPS[k].part===part);
  if(idx!=null){ tourState.i=idx; renderTourStep(); }
}

/* tourBubbleHTML(step) — HTML de la bulle : en-tête de partie, titre, texte,
   pastilles de progression (encadrées par thème, cf. tourProgressHTML) et
   barre de contrôles. */
function tourBubbleHTML(step){
  // Écran de DÉCISION (entre noyau et détail) : choix binaire, pas d'étape.
  if(tourState.decision) return tourDecisionHTML();
  // Position dans la SÉQUENCE ACTIVE (et non l'index brut) : « premier » et
  // « dernier » dépendent du mode (core/detail/full).
  const seq=tourSeq(), pos=seq.indexOf(tourState.i);
  const first=pos<=0, last=pos===seq.length-1;
  const partLabel=TOUR_PARTS[step.part]||'';
  const dots=tourProgressHTML(tourState.i);
  // Existe-t-il une partie suivante DANS LA SÉQUENCE (pour « Passer cette partie ») ?
  let hasNextPart=false;
  for(let p=pos+1;p<seq.length;p++){ if(TOUR_STEPS[seq[p]].part!==step.part){ hasNextPart=true; break; } }
  // En fin de NOYAU, « Suivant » mène à l'écran de décision → libellé adapté.
  const nextDefault=last?(tourState.mode==='core'?'Continuer ▶':'Terminer'):'Suivant ▶';
  const prevBtn=first?'':`<button class="tour-btn tour-btn-prev" onclick="tourPrev()">◀ Précédent</button>`;
  const nextBtn=`<button class="tour-btn tour-btn-next" onclick="tourNext()">${step.nextLabel||nextDefault}</button>`;
  const skipPart=(step.part!=='welcome'&&step.part!=='end'&&hasNextPart)
    ?`<button class="tour-link" onclick="tourSkipPart()">Passer cette partie</button>`:'';
  const skipAll=last?'':`<button class="tour-link" onclick="tourSkipAll()">${first?'Passer la visite':'Tout passer'}</button>`;
  // Croix : seulement en accès direct à une partie (révision ciblée).
  const closeBtn=tourState.jumped?`<button class="tour-close" onclick="endTour()" aria-label="Fermer la visite" title="Fermer">×</button>`:'';
  return `${closeBtn}${partLabel?`<div class="tour-part">${partLabel}</div>`:''}
    <div class="tour-title">${step.title}</div>
    <div class="tour-text">${step.text}</div>
    <div class="tour-progress">${dots}</div>
    <div class="tour-ctrl">${prevBtn}${nextBtn}<span class="tour-skip">${skipPart}${skipAll}</span></div>`;
}

/* tourDecisionHTML() — bulle de l'écran de décision (fin du noyau) : on rassure
   (« tu connais l'essentiel »), on rappelle où relancer la visite (bouton ?),
   puis deux choix : poursuivre la visite détaillée, ou s'arrêter là. */
function tourDecisionHTML(){
  return `<div class="tour-part">Visite express terminée</div>
    <div class="tour-title">Tu connais l’essentiel 👍</div>
    <div class="tour-text">Tu sais maintenant <b>naviguer</b> (notions, auteurs, concepts, repères, méthodo) et <b>réviser</b>. Veux-tu poursuivre avec la <b>visite détaillée</b> ? Elle couvre les onglets d’une fiche, le <b>partage</b>, toutes les options du <b>quiz</b>, comment <b>proposer du contenu</b> et le <b>compte</b>. Tu pourras de toute façon la relancer à tout moment via le bouton <b>?</b> en haut à droite.</div>
    <div class="tour-ctrl tour-ctrl-decision">
      <button class="tour-btn tour-btn-next" onclick="tourContinueDetailed()">Oui, voir le détail ▶</button>
      <button class="tour-link" onclick="endTour()">Non merci, j’ai compris</button>
    </div>`;
}

/* positionTourStep() — place le projecteur autour de la cible et la bulle
   à côté. Étape « center » (ou cible introuvable) : voile assombri uniforme
   + bulle centrée. */
function positionTourStep(){
  const step=TOUR_STEPS[tourState.i]; if(!step) return;
  const {blocker,spot,bubble}=tourState.dom;
  const el=(!step.center&&step.target)?step.target():null;
  if(el){ try{ el.scrollIntoView({block:'center',inline:'nearest'}); }catch(e){} }
  const vw=window.innerWidth, vh=window.innerHeight;
  const bw=bubble.offsetWidth, bh=bubble.offsetHeight;
  if(!el){
    // Carte centrée : pas de projecteur, voile uniforme.
    blocker.classList.add('dim'); spot.style.display='none';
    bubble.style.left=Math.max(8,(vw-bw)/2)+'px';
    bubble.style.top=Math.max(8,(vh-bh)/2)+'px';
    return;
  }
  blocker.classList.remove('dim');
  const r=el.getBoundingClientRect();
  const pad=6;
  // Rectangle du projecteur, BORNÉ au viewport. Une cible plus grande que
  // l'écran (ex. longue liste de filtres du quiz sur mobile) garderait sinon
  // un projecteur débordant qui « éclaire tout » et pousse la bulle hors champ.
  let st=r.top-pad, sl=r.left-pad, sw=r.width+pad*2, sh=r.height+pad*2;
  if(st<6){ sh+=st-6; st=6; }
  if(sl<6){ sw+=sl-6; sl=6; }
  if(st+sh>vh-6) sh=vh-6-st;
  if(sl+sw>vw-6) sw=vw-6-sl;
  spot.style.display='block';
  spot.style.top=st+'px'; spot.style.left=sl+'px';
  spot.style.width=Math.max(0,sw)+'px'; spot.style.height=Math.max(0,sh)+'px';
  // Placement de la bulle, calculé sur le rectangle BORNÉ (rl/rr/rt/rb) : à
  // droite si la cible est à gauche (sidebar), sinon dessous, sinon dessus,
  // sinon centré.
  const gap=14;
  let top, left;
  const rl=sl, rr=sl+sw, rt=st, rb=st+sh;
  const roomRight=rr+gap+bw<=vw-8, roomBelow=rb+gap+bh<=vh-8, roomAbove=rt-gap-bh>=8;
  if(rl<vw*0.34 && roomRight){
    left=rr+gap; top=tourClamp(rt,8,vh-bh-8);
  } else if(roomBelow){
    top=rb+gap; left=tourClamp(rl,8,vw-bw-8);
  } else if(roomAbove){
    top=rt-gap-bh; left=tourClamp(rl,8,vw-bw-8);
  } else {
    top=Math.max(8,(vh-bh)/2); left=Math.max(8,(vw-bw)/2);
  }
  bubble.style.top=top+'px';
  bubble.style.left=left+'px';
}
function tourClamp(v,min,max){ return Math.max(min,Math.min(max,v)); }

/* tourStartIfFirst() — auto-affichage de la visite à la toute 1re venue
   (drapeau localStorage 'philo-tour-v1'). En navigation privée où l'accès
   au stockage lève, on considère « déjà vu » pour ne pas gêner. */
function tourStartIfFirst(){
  let seen; try{ seen=localStorage.getItem('philo-tour-v1'); }catch(e){ seen='1'; }
  // 1re venue : on joue d'abord le NOYAU (mode 'core'), puis on propose la
  // visite détaillée. Une relance manuelle (bouton ?) part, elle, en mode complet.
  if(!seen) startTour(0, false, 'core');
}

/* ── Bouton d'aide « ? » : ouvre/ferme le menu ─────────────────────── */
function toggleHelpMenu(e){
  if(e) e.stopPropagation();
  const m=document.getElementById('help-menu');
  if(m) m.classList.toggle('open');
}
function closeHelpMenu(){ const m=document.getElementById('help-menu'); if(m) m.classList.remove('open'); }
// Un clic hors du menu (et hors du bouton) le referme.
document.addEventListener('click',e=>{
  const m=document.getElementById('help-menu');
  if(m&&m.classList.contains('open')&&!m.contains(e.target)&&e.target.id!=='help-btn') closeHelpMenu();
});
(function initSidebarDrawer(){
  document.getElementById('sb-burger').addEventListener('click',toggleSidebar);
  document.getElementById('sb-backdrop').addEventListener('click',closeSidebar);
  // Délégation des clics sur le fil d'Ariane (un seul écouteur).
  document.getElementById('crumbs').addEventListener('click',e=>{
    const c=e.target.closest('.crumb');
    if(!c||c.classList.contains('current')) return;
    const act=c.dataset.act, arg=c.dataset.arg||'';
    pushHistory();
    if(act==='mode') goMode(arg);
    else if(act==='tab'){ curTab=arg; renderContent(); }
    else if(act==='authortab'){ curAuthorTab=arg; renderAuthorContent(); }
    else if(act==='subtab'){ curConceptSubTab=arg; renderContent(); }
  });
  // Délégation : sélection d'une notion/auteur/concept → ferme le tiroir
  // (uniquement en mode mobile — on ne change rien sur desktop).
  document.getElementById('sb').addEventListener('click',e=>{
    if(window.innerWidth>700) return;
    if(e.target.closest && e.target.closest('.nb,.ab,.cb')) closeSidebar();
  });
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'&&document.body.classList.contains('sb-open')) closeSidebar();
  });
})();

/* initSidebarSwipe() — ouvrir/fermer le tiroir au doigt (mobile).
   Geste reconnu : un balayage horizontal franc.
     • tiroir FERMÉ : le geste ne s'arme que s'il démarre tout au bord
       gauche de l'écran (≤ EDGE px) — ainsi on n'interfère pas avec le
       défilement ni les boutons ; un balayage vers la DROITE l'ouvre.
     • tiroir OUVERT : n'importe quel départ compte ; un balayage vers la
       GAUCHE le ferme.
   Validation au touchend : amplitude |dx| ≥ MIN px ET mouvement surtout
   horizontal (|dx| > |dy|) — sinon c'est un scroll vertical, on ignore.
   Inactif sur grand écran (> 700 px) ou si une surcouche est ouverte
   (quiz, modale de proposition, onboarding) pour ne pas voler le geste. */
(function initSidebarSwipe(){
  const EDGE=28, MIN=55;          // seuils en pixels : zone de bord / amplitude mini
  let x0=0,y0=0,armed=false;      // origine du toucher + geste éligible ?
  // Vrai si une surcouche plein écran capte déjà l'attention de l'utilisateur.
  function overlayOpen(){
    const q=document.getElementById('quiz-overlay');
    const p=document.getElementById('proposal-overlay');
    return (q&&q.classList.contains('open'))||(p&&p.classList.contains('open'))||
           (typeof tourState!=='undefined'&&tourState&&tourState.i>=0);
  }
  document.addEventListener('touchstart',e=>{
    armed=false;
    if(window.innerWidth>700||overlayOpen()||e.touches.length!==1) return;
    const t=e.touches[0], open=document.body.classList.contains('sb-open');
    // Fermé : on n'arme qu'au bord gauche. Ouvert : n'importe où.
    if(!open&&t.clientX>EDGE) return;
    x0=t.clientX; y0=t.clientY; armed=true;
  },{passive:true});
  document.addEventListener('touchend',e=>{
    if(!armed) return;
    armed=false;
    const t=e.changedTouches[0], dx=t.clientX-x0, dy=t.clientY-y0;
    if(Math.abs(dx)<MIN||Math.abs(dx)<=Math.abs(dy)) return;   // pas assez franc / trop vertical
    const open=document.body.classList.contains('sb-open');
    if(!open&&dx>0) toggleSidebar();        // bord gauche → droite : ouvrir
    else if(open&&dx<0) closeSidebar();     // vers la gauche : fermer
  },{passive:true});
})();
