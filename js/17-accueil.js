/* js/17-accueil.js — morceau du script du site. Le build (outils/construire.mjs)
   recolle js/*.js dans l'ORDRE des noms en UN SEUL script, app.js : les
   fonctions restent visibles d'un morceau à l'autre comme avant, et le code
   « de premier niveau » s'exécute dans cet ordre. */
/* ── PAGE D'ACCUEIL (nov. 2026, piste A « Bibliothèque ») ────────────────
   sbMode='accueil' : la vue affichée quand on arrive sur le site SANS
   adresse précise (racine, sans #/… ni page d'entrée ; cf. accueilAuDemarrage
   appelée par js/99-demarrage.js). On y revient par l'onglet « Accueil » de
   la barre latérale ou le bouton Retour.
   Contenu, tiré des données (rien d'écrit à la main qui vieillirait) :
     · accroche + deux entrées : découvrir (1re notion) / réviser (quiz) ;
     · « Reprendre » : la dernière page ouverte, lue dans philo-nav AU
       CHARGEMENT (NAV_REPRENDRE), avant que l'accueil ne s'affiche ;
     · les notions, dont une « notion du jour » en grand (change chaque jour,
       la même pour tout le monde) ;
     · les derniers sujets tombés au bac et les dernières nouveautés.
   Aucune donnée nouvelle : philo-nav existe déjà (js/02-navigation.js), et
   l'accueil ne l'écrit PAS (persistNav l'ignore), pour que « Reprendre »
   désigne toujours une vraie fiche. Styles : css/12-accueil.css. */

/* NAV_REPRENDRE — la position mémorisée au chargement (ou null). Lue ici,
   au premier niveau, donc avant le démarrage (99) et avant tout rendu. */
let NAV_REPRENDRE=(()=>{   // let : une position distante peut la remplacer
  try{ const s=JSON.parse(localStorage.getItem('philo-nav')||'null');
       return s&&s.sbMode&&s.sbMode!=='accueil'&&!s.enIndex&&navEntryValid(s)?s:null; }
  catch(e){ return null; }
})();

/* accueilPositionDistante(nav) — la synchro (js/11-synchro.js) a reçu la
   position d'un autre appareil alors qu'on est sur l'accueil : au lieu d'y
   emmener l'élève d'autorité, elle devient la cible de « Reprendre ». */
function accueilPositionDistante(nav){
  if(!nav||nav.sbMode==='accueil'||nav.enIndex||!navEntryValid(nav)) return;
  NAV_REPRENDRE=nav;
  if(sbMode==='accueil') renderAccueilContent();
}

/* accueilAuDemarrage() — au démarrage : bascule sur l'accueil si l'on arrive
   à la racine du site sans adresse (#/…) ni page d'entrée (/notions/…,
   /auteurs/…, /fiches/). Une actualisation sur une fiche garde sa fiche,
   puisque son adresse #/… est dans l'URL. */
function accueilAuDemarrage(){
  if(location.hash||PAGE_ENTREE||document.body.dataset.entree) return;
  if(etatDeChemin(location.pathname)||/[?&]depuis=/.test(location.search)) return;
  sbMode='accueil';
}

/* ouvrirAccueil() — l'onglet « Accueil » de la barre latérale. */
function ouvrirAccueil(){ allerIndex('accueil'); }   // transition comprise (js/18-index.js)

/* accueilOuvrirNotion(k) — depuis l'accueil, ouvre une notion (onglet Auteurs). */
function accueilOuvrirNotion(k){
  if(!D[k]) return;
  indexOuvrir('notion', k);   // même chemin qu'une carte : la barre latérale glisse
}

/* accueilReprendre() — rouvre la page mémorisée (NAV_REPRENDRE). */
function accueilReprendre(){
  if(!NAV_REPRENDRE) return;
  avecTransition(()=>{ pushHistory(); applyNavState(NAV_REPRENDRE); renderSB(); renderCurrentView(); });
}

/* accueilExplorer(t) — ouvre un sujet du mode Explorer (sujets, nouveautés). */
function accueilExplorer(t){
  avecTransition(()=>{ pushHistory(); sbMode='explorer'; explorerTopic=t; renderSB(); renderExplorerContent(); });
}

/* accueilAller(mode) — depuis l'en-tête du lobby : entre dans l'app sur un
   mode de la barre latérale (notions, auteurs, concepts, méthodo, explorer). */
function accueilAller(mode){
  allerIndex(mode);   // transition et historique compris (js/18-index.js)
}

/* marquerAccueil() — pose ou retire body.en-accueil selon la vue : sur
   l'accueil, le CSS (css/12-accueil.css) cache le cadre de l'app (barre
   latérale, barre du haut, onglets, bandeau) pour en faire un « lobby ».
   Appelée par renderCrumbs, que toutes les vues appellent. */
function marquerAccueil(){
  if(!(enIndex&&MODES_INDEX[sbMode])){ const mc=document.querySelector('#main .main-content'); if(mc) delete mc.dataset.idx; }
  document.body.classList.toggle('en-accueil', sbMode==='accueil');
  // Nov. 2026 : la barre latérale n'est montrée que sur une fiche (notion,
  // auteur, concept, repère) et dans la Méthodo ; ailleurs, body.sans-barre
  // la replie avec une animation (css/13-index.css).
  document.body.classList.toggle('sans-barre', sbMode==='accueil'||sbMode==='explorer'||(enIndex&&!!MODES_INDEX[sbMode]));   // Méthodo comprise depuis qu'elle a sa page
  document.querySelectorAll('.topbar-mode').forEach(b=>b.classList.toggle('on', b.dataset.mode===sbMode));
}

/* libelleNav(s) — nom lisible d'une position mémorisée, pour « Reprendre ». */
function libelleNav(s){
  const ongN={auteurs:'Auteurs',textes:'Textes',concepts:'Concepts',diss:'Dissertations',exemples:'Exemples'};
  const ongA={idees:'Idées',citations:'Citations',oeuvres:'Œuvres',dialogues:'Dialogues'};
  if(s.sbMode==='notions') return {t:D[s.cur].l, d:'Notion · onglet '+(ongN[s.curTab]||'Auteurs')};
  if(s.sbMode==='auteurs') return {t:s.curAuthor, d:'Auteur · '+(ongA[s.curAuthorTab]||'Idées')};
  if(s.sbMode==='concepts'||s.sbMode==='reperes'){
    const c=CONCEPTS.find(x=>x&&x.id===s.curConcept);
    return {t:c?c.term:'Concept', d:s.sbMode==='reperes'?'Repère':'Concept'};
  }
  if(s.sbMode==='methodo') return {t:'Méthodo', d:'Guide de méthode'};
  const x=EXPLORER_TOPICS.find(x=>x.id===s.explorerTopic);
  return {t:x?x.label:'Explorer', d:'Explorer'};
}

/* texteBrut(h) — le texte d'un fragment HTML (définitions avec <span class='kw'>). */
function texteBrut(h){ const d=document.createElement('div'); d.innerHTML=h||''; return d.textContent; }

/* renderAccueilContent() — rend la page d'accueil dans .main-content.
   Même squelette que les autres vues (.tabs avec Retour + .main-content). */
function renderAccueilContent(){
  renderCrumbs();
  const mainEl=document.getElementById('main');
  if(!mainEl.querySelector('.tabs')||!mainEl.querySelector('.main-content')){
    mainEl.innerHTML='<div class="tabs"></div><div class="main-content"></div>';
  }
  mainEl.querySelector('.tabs').innerHTML='';   // lobby : pas d'onglets (masqués par body.en-accueil)
  const mc=mainEl.querySelector('.main-content');

  // Notions du programme seulement (le hors programme reste dans la barre latérale),
  // dans l'ordre du site (KEYS), pas l'ordre alphabétique de PROGRAMME.
  const notions=KEYS.filter(k=>PROG_NOTIONS.has(k));
  const nbAuteurs=(PROGRAMME.auteurs||[]).length;
  // Notion du jour : jour depuis 1970 modulo le nombre de notions.
  const jour=Math.floor(Date.now()/864e5);
  const vedette=notions[jour%notions.length];
  const premiere=notions[0];

  // ── Accroche + « Reprendre » (ou, à la 1re visite, « Comment ça marche »)
  let carte;
  if(NAV_REPRENDRE){
    const l=libelleNav(NAV_REPRENDRE);
    carte=`<div class="acc-carte" role="button" tabindex="0" onclick="accueilReprendre()" onkeydown="if(event.key==='Enter')accueilReprendre()">
      <p class="acc-petit">Reprendre où j'en étais</p><b>${pEsc(l.t)}</b><small>${pEsc(l.d)}</small></div>`;
  }else{
    carte=`<div class="acc-carte" role="button" tabindex="0" onclick="toggleHelpMenu(event)" onkeydown="if(event.key==='Enter')toggleHelpMenu(event)">
      <p class="acc-petit">Première visite ?</p><b>Visite guidée</b><small>Deux minutes pour voir comment le site est rangé.</small></div>`;
  }

  // ── Grille des notions, la vedette en premier
  const carteN=(k,v)=>{
    const n=D[k];
    return `<a class="acc-n${v?' vedette':''}" href="${pEsc(PAGES_STATIQUES.notions[k]||'#/notion/'+k)}" style="--coul:${n.c}"
      onclick="event.preventDefault();accueilOuvrirNotion('${k}')">
      ${v?'<p class="acc-petit">Notion du jour</p>':''}<b>${pEsc(n.l)}</b><small>${pEsc(n.s||'')}</small>
      ${v?`<div class="acc-def">${pEsc(texteBrut(n.def).slice(0,240))}…</div>`:''}</a>`;
  };
  const grille=[vedette,...notions.filter(k=>k!==vedette)].map(k=>carteN(k,k===vedette)).join('');

  // ── Derniers sujets (dissertations : ceux qui ont une question)
  const sujets=(SUJETS_BAC.sujets||[]).filter(x=>x.q).slice(0,4).map(x=>
    `<div class="acc-ligne" onclick="accueilExplorer('sujets')"><div class="acc-l1">« ${pEsc(x.q)} »</div><small>${pEsc(x.date)} · voie ${pEsc(x.voie)}</small></div>`).join('');

  // ── Dernières nouveautés
  const nouv=(NOUVEAUTES||[]).slice(0,4).map(x=>{
    const d=new Date(x.date+'T12:00:00').toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'});
    return `<div class="acc-ligne" onclick="accueilExplorer('nouveautes')"><div class="acc-l1">${pEsc(x.titre)}</div><small>${d}</small></div>`;
  }).join('');

  // En-tête PROPRE au lobby : la barre latérale et la barre du haut sont
  // masquées (body.en-accueil, posée par marquerAccueil) ; on entre dans l'app
  // par ces liens, une notion, ou les boutons de l'accroche.
  const lien=(l,m)=>`<button class="acc-nav-l" onclick="accueilAller('${m}')">${l}</button>`;
  const entete=`<header class="acc-entete"><span class="acc-logo">Philo<span>.</span> Terminale</span>
    <nav class="acc-nav">${lien('Notions','notions')}${lien('Auteurs','auteurs')}${lien('Concepts','concepts')}${lien('Méthodo','methodo')}${lien('Explorer','explorer')}<button class="acc-nav-l" onclick="openQuiz()">Quiz</button><button class="acc-nav-l" onclick="openPalette()" aria-label="Rechercher">🔍</button></nav></header>`;
  mc.innerHTML=entete+`<div class="acc">
    <div class="acc-hero">
      <div>
        <h1>Les ${notions.length} notions du bac de philo, expliquées et reliées.</h1>
        <p class="acc-chapo">${notions.length} notions, ${nbAuteurs} auteurs du programme, des concepts reliés entre eux et les sujets tombés depuis 2021. Pour découvrir sans rien connaître, ou pour réviser avant l'écrit.</p>
        <button class="acc-btn p" onclick="accueilOuvrirNotion('${premiere}')">Je découvre : ${pEsc(D[premiere].l.toLowerCase())}</button><button class="acc-btn" onclick="openQuiz()">Je révise : le quiz</button>
      </div>
      ${carte}
    </div>
    <section class="acc-section"><h2>Les notions</h2><div class="acc-notions">${grille}</div></section>
    <section class="acc-section acc-deux">
      <div><h2>Tombé au bac</h2>${sujets}<button class="acc-plus" onclick="accueilExplorer('sujets')">Tous les sujets →</button></div>
      <div><h2>Nouveautés</h2>${nouv}<button class="acc-plus" onclick="accueilExplorer('nouveautes')">Tout le journal →</button></div>
    </section>
  </div>`;
}
