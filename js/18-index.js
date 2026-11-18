/* js/18-index.js — morceau du script du site. Le build (outils/construire.mjs)
   recolle js/*.js dans l'ORDRE des noms en UN SEUL script, app.js : les
   fonctions restent visibles d'un morceau à l'autre comme avant, et le code
   « de premier niveau » s'exécute dans cet ordre. */
/* ── PAGES DE PRÉSENTATION des onglets (nov. 2026) ────────────────────────
   Notions, Auteurs, Concepts, Repères ont chacun une page « index » : pleine
   largeur, grande recherche, filtre par notion (repliable, « au moins une »
   ou « toutes »), cartes. État : enIndex=true (js/01-donnees-etat.js) avec le
   sbMode de l'onglet ; adresses #/notions, #/auteurs, #/concepts, #/reperes
   (adresseDe / etatDe, js/02-navigation.js). On y arrive par les onglets de
   mode (allerIndex), le lobby, le fil d'Ariane (goMode). Ouvrir une fiche
   remet enIndex=false (les rendus de fiche de js/04-fiches.js le font en tête).
   La BARRE LATÉRALE n'est montrée que sur une fiche : body.sans-barre
   (posée par marquerAccueil) la replie sur le lobby, ces pages et Explorer ;
   la barre du haut reçoit alors les onglets de mode et les boutons du bas de
   la barre (Réviser, Proposer, Réglages, compte).
   Mode édition : les cartes portent les drapeaux ✦ Nouveau / ✎ Modifié (new,
   modified du contenu) et la page un bouton « + Proposer » (pPlusCat), comme
   les fiches ; le CSS existant les cache en mode révision.
   Animations : avecTransition passe par les transitions de vue du navigateur
   (document.startViewTransition) ; css/13-index.css fait glisser la barre
   latérale et la barre du haut quand elles apparaissent ou disparaissent.
   Styles : css/13-index.css. */

/* MODES_INDEX (les onglets qui ont une page de présentation) est défini dans
   js/01-donnees-etat.js : NAV_REPRENDRE (js/17) s'en sert dès le chargement. */
let indexRecherche='';          // texte de la recherche de la page affichée
let indexNotions=new Set();     // notions cochées dans le filtre (vide = toutes)
let indexModeFiltre='or';       // 'or' = au moins une notion cochée ; 'and' = toutes
let indexFiltreOuvert=false;    // panneau du filtre déplié ?

/* avecTransition(fn) — exécute fn (un changement de vue) dans une transition
   de vue du navigateur quand elle existe, sinon directement. Rien d'animé si
   l'élève a demandé à réduire les animations (réglage du système). */
function avecTransition(fn){
  const reduit=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(document.startViewTransition&&!reduit){
    document.documentElement.classList.add('vt');   // coupe la transition CSS de largeur (doublon)
    document.startViewTransition(fn);
  }else fn();
}

/* allerIndex(mode) — ouvre la page de présentation d'un onglet (onglets de la
   barre latérale, barre du haut, lobby). Pour Méthodo et Explorer, qui n'en
   ont pas, ouvre leur page habituelle ; 'accueil' rouvre le lobby. */
function allerIndex(mode){
  if(sbMode===mode&&(enIndex||!MODES_INDEX[mode])) return;
  avecTransition(()=>{
    pushHistory();
    if(mode==='accueil'){ sbMode='accueil'; renderSB(); renderAccueilContent(); return; }
    if(!MODES_INDEX[mode]){ sbMode=mode; enIndex=false; renderSB(); renderCurrentView(); return; }
    if(sbMode!==mode){ indexRecherche=''; indexNotions=new Set(); indexFiltreOuvert=false; }
    sbMode=mode; enIndex=true;
    renderSB(); renderIndexContent();
  });
}

/* indexOuvrir(type, cle) — depuis une carte : ouvre la fiche (enIndex
   repasse à false dans le rendu de la fiche), avec la barre qui glisse. */
function indexOuvrir(type, cle){
  avecTransition(()=>{
    if(type==='methodo'){ pushHistory(); sbMode='methodo'; methodoTopic=cle; renderSB(); renderMethodoContent(); }
    else if(type==='notion'){ pushHistory(); sbMode='notions'; cur=cle; curTab='auteurs'; renderSB(); renderContent(); }
    else if(type==='auteur') openAuthor(cle);
    else openConcept(cle);
  });
}

/* indexFiltrer(k) — coche / décoche une notion du filtre (null : tout
   effacer), puis re-rend. */
function indexFiltrer(k){
  if(k===null) indexNotions=new Set();
  else if(indexNotions.has(k)) indexNotions.delete(k); else indexNotions.add(k);
  renderIndexContent();
}
/* indexModeDeFiltre(m) — « au moins une » ('or') ou « toutes » ('and'). */
function indexModeDeFiltre(m){ indexModeFiltre=m; renderIndexContent(); }
/* indexBasculerFiltre() — déplie / replie le panneau du filtre. */
function indexBasculerFiltre(){ indexFiltreOuvert=!indexFiltreOuvert; renderIndexContent(); }

/* indexChercher(v) — la recherche : ne re-rend que la grille (le champ
   garde le focus et le curseur). */
function indexChercher(v){
  indexRecherche=v;
  const g=document.getElementById('index-grille');
  if(g) g.innerHTML=indexGrilleHTML();
}

/* sansAccents(s) — minuscules sans accents, pour une recherche tolérante. */
function sansAccents(s){ return String(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,''); }

/* indexElements() — les éléments de l'onglet courant, filtrés : {type, cle,
   titre, sous, notions[], couleur, nouveau, modifie}. Même visibilité que la
   barre latérale (hors programme masqué si l'élève l'a choisi). */
function indexElements(){
  const q=sansAccents(indexRecherche.trim());
  let el=[];
  if(sbMode==='methodo'){
    // Les parcours de méthode (METHODO_GUIDE, js/04-fiches.js) : intro, squelette, étapes.
    el=METHODO_TOPICS.map(t=>{ const g=METHODO_GUIDE[t.id];
      return {type:'methodo',cle:t.id,titre:g.titre||t.label,sous:g.etapes.length+' étapes · '+g.squelette.map(s=>s.bloc).join(', '),notions:[],texte:texteBrut(g.intro),long:true,couleur:'var(--color-ocre)'}; });
  }else if(sbMode==='notions'){
    el=notionsVisibles().map(k=>({type:'notion',cle:k,titre:D[k].l,sous:D[k].s||'',notions:[k],couleur:D[k].c,hp:estHP(k),nouveau:D[k].new,modifie:D[k].modified}));
  }else if(sbMode==='auteurs'){
    el=authorsSorted().filter(auteurVisible).map(n=>{
      const f=AM[n]||{};
      const dates=f.naissance!=null?anneeTxt(f.naissance)+(f.mort!=null?' – '+anneeTxt(f.mort):''):'';
      return {type:'auteur',cle:n,titre:n,sous:[dates,f.courant].filter(Boolean).join(' · '),notions:AI[n].notions.filter(notionVisible),texte:f.bio||'',nouveau:f.new,modifie:f.modified};
    });
  }else{
    const src=sbMode==='reperes'?REPERES():realConcepts().filter(conceptVisible);
    el=src.map(c=>({type:'concept',cle:c.id,titre:c.term,sous:c.cat&&c.cat!=='Repère'?c.cat:'',notions:c.notions.filter(k=>D[k]),texte:texteBrut(c.def),nouveau:c.new,modifie:c.modified}));
    el.sort((a,b)=>a.titre.localeCompare(b.titre,'fr'));
  }
  const coche=[...indexNotions];
  return el.filter(x=>(!q||sansAccents(x.titre+' '+x.sous).includes(q))
    &&(!coche.length||(indexModeFiltre==='and'?coche.every(k=>x.notions.includes(k)):coche.some(k=>x.notions.includes(k)))));
}

/* indexGrilleHTML() — les cartes (ou « Aucun résultat »), avec le compteur. */
function indexGrilleHTML(){
  const el=indexElements();
  if(!el.length) return `<p class="idx-vide">Aucun résultat. Essaie un autre mot, ou retire le filtre.</p>`;
  const pts=ks=>ks.slice(0,8).map(k=>`<span class="idx-pt" style="background:${D[k].c}" title="${pEsc(D[k].l)}"></span>`).join('');
  return `<p class="idx-compte">${el.length} résultat${el.length>1?'s':''}</p><div class="idx-grille">`+el.map(x=>
    `<button class="idx-carte${x.nouveau?' is-new':x.modifie?' is-modified':''}" style="--coul:${x.couleur||'var(--color-border-secondary)'}" onclick="indexOuvrir('${x.type}','${pEsc(x.cle).replace(/'/g,"\\'")}')">
      <b>${pEsc(x.titre)}</b>${x.sous?`<small>${pEsc(x.sous)}</small>`:''}
      ${x.nouveau?'<span class="new-badge">'+ico('etincelle')+' Nouveau</span>':x.modifie?'<span class="modified-badge">'+ico('crayon')+' Modifié</span>':''}
      ${x.texte?`<span class="idx-texte">${pEsc(x.long?x.texte:x.texte.slice(0,140))}${!x.long&&x.texte.length>140?'…':''}</span>`:''}
      ${x.type!=='notion'&&x.type!=='methodo'?`<span class="idx-pts">${pts(x.notions)}</span>`:''}${x.hp?'<span class="idx-hp">hors programme</span>':''}
    </button>`).join('')+`</div>`;
}

/* indexFiltreHTML() — le bouton « Filtrer » et, déplié, le panneau : mode
   « au moins une / toutes » et les pastilles de notions. Rien sur Notions. */
function indexFiltreHTML(){
  if(sbMode==='notions'||sbMode==='methodo') return '';
  const n=indexNotions.size;
  const bouton=`<button class="idx-filtrer${n||indexFiltreOuvert?' on':''}" onclick="indexBasculerFiltre()" aria-expanded="${indexFiltreOuvert}">⊟ Filtrer par notion${n?` (${n})`:''}</button>`;
  if(!indexFiltreOuvert) return bouton;
  const choix=(m,l,t)=>`<button class="idx-mode${indexModeFiltre===m?' on':''}" onclick="indexModeDeFiltre('${m}')" title="${t}">${l}</button>`;
  return bouton+`<div class="idx-panneau">
    <div class="idx-modes">${choix('or','Au moins une','Garder ce qui touche au moins une des notions cochées')}${choix('and','Toutes','Garder seulement ce qui touche toutes les notions cochées')}
      ${n?'<button class="idx-mode" onclick="indexFiltrer(null)">Effacer</button>':''}</div>
    <div class="idx-filtre">`+notionsVisibles().map(k=>`<button class="idx-puce${indexNotions.has(k)?' on':''}" style="--coul:${D[k].c}" onclick="indexFiltrer('${k}')">${pEsc(D[k].l)}</button>`).join('')+`</div></div>`;
}

/* renderIndexContent() — la page de présentation de l'onglet courant. */
function renderIndexContent(){
  enIndex=true;
  renderCrumbs();
  const mainEl=document.getElementById('main');
  if(!mainEl.querySelector('.tabs')||!mainEl.querySelector('.main-content')){
    mainEl.innerHTML='<div class="tabs"></div><div class="main-content"></div>';
  }
  mainEl.querySelector('.tabs').innerHTML=backBtnHTML();
  const intro={
    notions:'Les notions du programme de Terminale. Chacune s’ouvre sur ses auteurs, ses textes, ses concepts, des plans de dissertation et des exemples.',
    auteurs:'Les auteurs cités dans les notions, du plus présent au moins présent. Chaque fiche donne leurs idées, citations, œuvres et dialogues.',
    concepts:'Le vocabulaire philosophique, relié aux notions et aux autres concepts. De quoi définir précisément les termes d’un sujet.',
    reperes:'Les repères du programme : des distinctions (absolu / relatif, légal / légitime…) qui servent à problématiser un sujet.',
    methodo:'La méthode pas à pas des deux exercices du bac : comment lire le sujet ou le texte, problématiser, construire le plan et rédiger, avec des phrases toutes prêtes.'
  }[sbMode];
  // Méthodo : deux parcours seulement, donc ni recherche ni filtre, et des cartes larges.
  const avecOutils=sbMode!=='methodo';
  // Mode édition : proposer un nouvel élément (même mécanique que les fiches).
  const proposer=sbMode==='auteurs'?pPlusCat('auteur','','Proposer un auteur')
    :sbMode==='concepts'?pPlusCat('concept','','Proposer un concept'):'';
  const mc=mainEl.querySelector('.main-content');
  const garde=document.activeElement&&document.activeElement.classList.contains('idx-recherche');
  // L'animation d'entrée ne joue qu'en arrivant sur la page, pas quand un
  // filtre la re-rend (mc.dataset.idx retient la page affichée).
  const meme=mc.dataset.idx===sbMode; mc.dataset.idx=sbMode;
  mc.innerHTML=`<div class="idx${meme?' sans-anim':''}">
    <h1 class="idx-titre">${MODES_INDEX[sbMode]}</h1>
    <p class="idx-intro">${intro}</p>
    <div class="idx-outils"${avecOutils?'':' hidden'}>
      <input class="idx-recherche" type="search" placeholder="Rechercher ${sbMode==='notions'?'une notion':sbMode==='auteurs'?'un auteur':sbMode==='reperes'?'un repère':'un concept'}…" value="${pEsc(indexRecherche)}" oninput="indexChercher(this.value)" aria-label="Rechercher">
      ${indexFiltreHTML()}
    </div>
    ${proposer}
    <div id="index-grille"${sbMode==='methodo'?' class="idx-larges"':''}>${indexGrilleHTML()}</div>
    <p class="idx-pied"><a href="${LEGAL_URL}">Informations légales</a></p>
  </div>`;
  if(garde){ const i=mc.querySelector('.idx-recherche'); if(i){ i.focus(); i.setSelectionRange(i.value.length,i.value.length); } }
}
