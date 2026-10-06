/* js/03-barre-laterale.js — morceau du script du site. Le build (outils/construire.mjs)
   recolle js/*.js dans l'ORDRE des noms en UN SEUL script, app.js : les
   fonctions restent visibles d'un morceau à l'autre comme avant, et le code
   « de premier niveau » s'exécute dans cet ordre. */
/* ── renderSB ────────────────────────────────────────────────── */
let authorSearch='';
let authorFilter=new Set(); // empty = all
let filterOpen=false;
let filterMode='or'; // 'or' | 'and'

/* authorsFiltered() — applique la recherche texte ET le filtre par notions.
   Recherche : porte UNIQUEMENT sur le nom de l'auteur (pas sur le courant
   ni la biographie) — comportement le plus prévisible pour l'utilisateur. */
function authorsFiltered(){
  const q=authorSearch.trim().toLowerCase();
  return authorsSorted().filter(name=>{
    if(!auteurVisible(name)) return false;   // étape 5 : hors programme masqué
    const entry=AI[name];
    const matchSearch=!q||name.toLowerCase().includes(q);
    let matchFilter=true;
    if(authorFilter.size>0){
      if(filterMode==='or') matchFilter=entry.notions.some(k=>authorFilter.has(k));
      else matchFilter=[...authorFilter].every(k=>entry.notions.includes(k));
    }
    return matchSearch&&matchFilter;
  });
}

/* toggleFilter(k) — coche/décoche la notion k dans le filtre des auteurs,
   puis reconstruit la sidebar. */
function toggleFilter(k){
  if(authorFilter.has(k)) authorFilter.delete(k); else authorFilter.add(k);
  renderSB();
}

/* ── F. RENDU — SIDEBAR ──────────────────────────────────────────────

   renderSB() reconstruit la sidebar entière à chaque changement de mode.
   Elle contient deux zones :
     · .sb-fixed  : onglets de mode (Notions / Auteurs / Concepts) + barre
                    de recherche + panneau de filtre — toujours visible
     · .sidebar-list : liste scrollable des items (notions, auteurs ou concepts)

   Selon sbMode, elle appelle ensuite :
     · renderSBList()         → liste des notions (mode 'notions')
     · renderSBList()         → liste des auteurs (mode 'auteurs')
     · renderSBConceptsList() → liste des concepts (mode 'concepts')        */

/* ── Barres de recherche de la sidebar : saisie, effacement, clic droit ──
   Trois barres partagent le même comportement (auteurs / concepts / repères).
   `which` ∈ 'author' | 'concept' | 'repere' identifie la variable d'état et la
   fonction de rendu de liste à rafraîchir. */

/* sbSearchInput(el, which) — appelé à chaque frappe : met à jour la variable
   d'état, ne re-rend QUE la liste (pas toute la sidebar, pour la perf) et
   ajuste la visibilité de la croix d'effacement de ce champ. */
function sbSearchInput(el, which){
  if(which==='author'){ authorSearch=el.value; renderSBList(); }
  else if(which==='concept'){ conceptSearch=el.value; renderSBConceptsList(); }
  else if(which==='repere'){ repereSearch=el.value; renderSBReperesList(); }
  const btn=el.parentNode.querySelector('.sb-search-clear');
  if(btn) btn.style.display=el.value?'flex':'none';
}

/* clearSidebarSearch(which) — vide la barre concernée et refait le rendu
   complet de la sidebar (qui réécrit le champ vide + masque la croix), puis
   redonne le focus au champ pour enchaîner une nouvelle saisie. */
function clearSidebarSearch(which){
  if(which==='author') authorSearch='';
  else if(which==='concept') conceptSearch='';
  else if(which==='repere') repereSearch='';
  renderSB();
  const inp=document.querySelector('.sb-search'); if(inp) inp.focus();
}

/* searchCtxClear(e, which) — clic droit sur la barre : on bloque le menu
   contextuel natif du navigateur et on vide le champ à la place. */
function searchCtxClear(e, which){ e.preventDefault(); clearSidebarSearch(which); return false; }

function renderSB(){
  const sb=document.getElementById('sb');

  // ── Zone fixe : sb-tabs toujours en haut ──────────────────────
  let fixed=sb.querySelector('.sb-fixed');
  if(!fixed){
    fixed=document.createElement('div');
    fixed.className='sb-fixed';
    sb.innerHTML='';
    sb.appendChild(fixed);
  }
  // 5 onglets de mode. « Concepts » et « Repères » partagent la MÊME fiche
  // (renderConceptContent + curConcept) mais des listes disjointes : le
  // glossaire « Concepts » exclut les repères, l'onglet « Repères » ne
  // montre QU'EUX. En entrant dans un mode, on recale curConcept pour
  // qu'il pointe sur une fiche présente dans la liste de ce mode.
  // « Méthodo » est à part : un GUIDE de méthodologie (renderMethodoContent),
  // pas une fiche concept. (Les onglets s'enroulent sur plusieurs lignes —
  // cf. CSS .sb-tabs/.sb-tab — pour rester tous visibles dans la sidebar.)
  fixed.innerHTML=`<div class="sb-tabs" style="gap:1px;padding:8px 0 6px">
    <div class="sb-tab${sbMode==='notions'?' active':''}" onclick="sbMode='notions';renderSB();renderContent()" style="font-size:9px">Notions</div>
    <div class="sb-tab${sbMode==='auteurs'?' active':''}" onclick="if(sbMode!=='auteurs'){sbMode='auteurs';if(!curAuthor)curAuthor=authorsSorted()[0];curAuthorTab='idees';renderSB();renderAuthorContent();}" style="font-size:9px">Auteurs</div>
    <div class="sb-tab${sbMode==='concepts'?' active':''}" onclick="if(sbMode!=='concepts'){sbMode='concepts';const c0=realConcepts().find(c=>c.id===curConcept)||realConcepts()[0];if(c0)curConcept=c0.id;renderSB();renderConceptContent();}" style="font-size:9px">Concepts</div>
    <div class="sb-tab${sbMode==='reperes'?' active':''}" onclick="if(sbMode!=='reperes'){sbMode='reperes';const r0=REPERES().find(c=>c.id===curConcept)||REPERES()[0];if(r0)curConcept=r0.id;renderSB();renderConceptContent();}" style="font-size:9px" title="Repères du programme : les distinctions conceptuelles (absolu/relatif, légal/légitime…)">Repères</div>
    <div class="sb-tab${sbMode==='methodo'?' active':''}" onclick="if(sbMode!=='methodo'){sbMode='methodo';renderSB();renderMethodoContent();}" style="font-size:9px" title="Méthode pas à pas : dissertation et explication de texte">Méthodo</div>
  </div>`;

  // ── Bouton « 🎯 Réviser » (mode quiz) : AU-DESSUS de .sb-propose ──
  // Toujours visible (révision ET édition). Créé une seule fois, conservé.
  let quizBtn=sb.querySelector('.sb-quiz');
  if(!quizBtn){
    quizBtn=document.createElement('button');
    quizBtn.className='sb-quiz';
    quizBtn.innerHTML='🎯 Réviser';
    quizBtn.title='Réviser en cartes (quiz à répétition espacée)';
    quizBtn.onclick=openQuiz;
    sb.appendChild(quizBtn);
  }

  // ── Bouton de contribution : entre les onglets de mode et la liste ──
  // Créé une seule fois, puis conservé entre les rendus (comme .sb-fixed).
  let propose=sb.querySelector('.sb-propose');
  if(!propose){
    propose=document.createElement('button');
    propose.className='sb-propose';
    propose.innerHTML='💡 Proposer du contenu';
    propose.title='Proposer un ajout, une correction ou une remarque';
    propose.onclick=openProposal;
    sb.appendChild(propose);
  }

  let list=sb.querySelector('.sidebar-list');
  if(!list){
    list=document.createElement('div');
    list.className='sidebar-list';
    sb.appendChild(list);
  }
  list.innerHTML='';

  // ── Bouton « ⚙ Réglages » (bas de la sidebar, persistant) ──
  // Regroupe les fonctions NON nécessaires à la révision (bascule du mode
  // d'affichage, etc.). Remplace l'ancien bouton « Mode » peu lisible.
  let settingsBtn=sb.querySelector('.sb-settings');
  if(!settingsBtn){
    settingsBtn=document.createElement('button');
    settingsBtn.className='sb-settings';
    settingsBtn.innerHTML='⚙ Réglages';
    settingsBtn.title='Réglages (mode d\'affichage…)';
    settingsBtn.onclick=openSettings;
    sb.appendChild(settingsBtn);
  }
  // new (comptes) : zone compte, tout en bas, persistante comme le reste.
  // Déconnecté → DEUX boutons (Se connecter / Créer un compte) ; connecté →
  // un seul (nom → profil). Contenu et visibilité gérés par renderAccountBtn().
  let acctWrap=sb.querySelector('.sb-account-wrap');
  if(!acctWrap){
    acctWrap=document.createElement('div');
    acctWrap.className='sb-account-wrap';
    sb.appendChild(acctWrap);
  }
  renderAccountBtn();   // remplit la zone selon l'état (connecté / déconnecté)
  applyPhiloMode();   // met à jour le libellé selon l'état actuel
  applyFicheMode();   // applique le « mode fiche » (lecture compressée) si actif

  if(sbMode==='notions'){
    const ajouterNotion=k=>{
      const el=document.createElement('div');
      el.className='nb'+(k===cur?' active':'')+(estHP(k)?' nb-hp':'');
      el.innerHTML=`<span class="dot" style="background:${D[k].c}"></span>${D[k].l}`;
      el.onclick=()=>{pushHistory();cur=k;curTab='auteurs';sbMode='notions';renderSB();renderContent()};
      list.appendChild(el);
    };
    KEYS.filter(k=>!estHP(k)).forEach(ajouterNotion);
    // Étape 5 : les notions hors programme, dans une section à part en bas de
    // la liste, repliable (état mémorisé dans « philo-hp-replie »). Rien du
    // tout si le hors programme est masqué dans les Réglages. La notion
    // ouverte reste visible même section repliée.
    if(KEYS_HP.length && voirHP()){
      let replie=false; try{ replie=localStorage.getItem('philo-hp-replie')==='1'; }catch(e){}
      const tete=document.createElement('button');
      tete.className='sb-hp-head';
      tete.setAttribute('aria-expanded', String(!replie));
      tete.title='Notions qui ne sont pas au programme de terminale : pour aller plus loin';
      tete.innerHTML=`<span>Hors programme (${KEYS_HP.length})</span><span class="sb-hp-caret">${replie?'▸':'▾'}</span>`;
      tete.onclick=()=>{ try{ localStorage.setItem('philo-hp-replie', replie?'0':'1'); }catch(e){} renderSB(); };
      list.appendChild(tete);
      KEYS_HP.filter(k=>!replie||k===cur).forEach(ajouterNotion);
    }
  } else if(sbMode==='auteurs'){
    // Search row (fixe dans la zone fixe, en dessous des sb-tabs)
    let searchRow=fixed.querySelector('.sb-search-row');
    if(!searchRow){
      searchRow=document.createElement('div');
      searchRow.className='sb-search-row';
      fixed.appendChild(searchRow);
    }
    searchRow.innerHTML=`
      <div class="sb-search-field">
        <input class="sb-search" type="text" placeholder="Rechercher…" value="${authorSearch.replace(/"/g,'&quot;')}"
          oninput="sbSearchInput(this,'author')" oncontextmenu="searchCtxClear(event,'author')" />
        <button class="sb-search-clear" style="display:${authorSearch?'flex':'none'}" title="Effacer (clic droit aussi)" aria-label="Effacer la recherche" onclick="clearSidebarSearch('author')">✕</button>
      </div>
      <button class="sb-filter-btn${(authorFilter.size>0)||filterOpen?' active':''}" onclick="filterOpen=!filterOpen;renderSB()" title="Filtrer par notion">⊟</button>`;
    // Filter panel (dans la zone scrollable)
    if(filterOpen){
      const fp=document.createElement('div');
      fp.className='filter-panel open';
      const checks=notionsVisibles().map(k=>{   // étape 5 : sans les notions HP masquées
        const checked=authorFilter.has(k);
        return `<div class="filter-notion-item" onclick="toggleFilter('${k}')">
          <div class="filter-notion-check${checked?' checked':''}" style="${checked?`background:${D[k].c};color:#fff`:''}">${checked?'✓':''}</div>
          <span class="filter-notion-label">${D[k].l}</span>
          <span style="width:6px;height:6px;border-radius:50%;background:${D[k].c};flex-shrink:0;margin-left:auto"></span>
        </div>`;
      }).join('');
      fp.innerHTML=`<div class="filter-panel-title">Filtrer par notion</div>
        <div style="display:flex;gap:3px;margin-bottom:8px">
          <button class="filter-action-btn" title="Un auteur apparaît s'il traite au moins une des notions cochées" style="${filterMode==='or'?'background:var(--color-background-secondary);color:var(--color-text-primary);border-color:var(--color-border-secondary)':''}"
            onclick="filterMode='or';renderSB()">Au moins une</button>
          <button class="filter-action-btn" title="Un auteur n'apparaît que s'il traite toutes les notions cochées simultanément" style="${filterMode==='and'?'background:var(--color-background-secondary);color:var(--color-text-primary);border-color:var(--color-border-secondary)':''}"
            onclick="filterMode='and';renderSB()">Toutes</button>
        </div>
        <div class="filter-notions">${checks}</div>
        <div class="filter-actions">
          <button class="filter-action-btn" onclick="authorFilter=new Set(notionsVisibles());renderSB()">Sélect. tout</button>
          <button class="filter-action-btn" onclick="authorFilter=new Set();renderSB()">Effacer</button>
        </div>`;
      list.appendChild(fp);
    }
    const listWrap=document.createElement('div');
    listWrap.id='sb-author-list';
    list.appendChild(listWrap);
    renderSBList();
  } else if(sbMode==='concepts'){
    // Concepts
    let searchRow=fixed.querySelector('.sb-search-row');
    if(!searchRow){
      searchRow=document.createElement('div');
      searchRow.className='sb-search-row';
      fixed.appendChild(searchRow);
    }
    searchRow.innerHTML=`
      <div class="sb-search-field">
        <input class="sb-search" type="text" placeholder="Rechercher…" value="${conceptSearch.replace(/"/g,'&quot;')}"
          oninput="sbSearchInput(this,'concept')" oncontextmenu="searchCtxClear(event,'concept')" />
        <button class="sb-search-clear" style="display:${conceptSearch?'flex':'none'}" title="Effacer (clic droit aussi)" aria-label="Effacer la recherche" onclick="clearSidebarSearch('concept')">✕</button>
      </div>
      <button class="sb-filter-btn${(conceptFilter.size>0)||conceptFilterOpen?' active':''}" onclick="conceptFilterOpen=!conceptFilterOpen;renderSB()" title="Filtrer par notion">⊟</button>`;
    if(conceptFilterOpen){
      const cfp=document.createElement('div');
      cfp.className='filter-panel open';
      const cChecks=notionsVisibles().map(k=>{
        const checked=conceptFilter.has(k);
        return `<div class="filter-notion-item" onclick="toggleConceptFilter('${k}')">
          <div class="filter-notion-check${checked?' checked':''}" style="${checked?`background:${D[k].c};color:#fff`:''}">${checked?'✓':''}</div>
          <span class="filter-notion-label">${D[k].l}</span>
          <span style="width:6px;height:6px;border-radius:50%;background:${D[k].c};flex-shrink:0;margin-left:auto"></span>
        </div>`;
      }).join('');
      cfp.innerHTML=`<div class="filter-panel-title">Filtrer par notion</div>
        <div style="display:flex;gap:3px;margin-bottom:8px">
          <button class="filter-action-btn" title="Un concept apparaît s'il est lié à au moins une des notions cochées" style="${conceptFilterMode==='or'?'background:var(--color-background-secondary);color:var(--color-text-primary);border-color:var(--color-border-secondary)':''}"
            onclick="conceptFilterMode='or';renderSB()">Au moins une</button>
          <button class="filter-action-btn" title="Un concept n'apparaît que s'il est lié à toutes les notions cochées simultanément" style="${conceptFilterMode==='and'?'background:var(--color-background-secondary);color:var(--color-text-primary);border-color:var(--color-border-secondary)':''}"
            onclick="conceptFilterMode='and';renderSB()">Toutes</button>
        </div>
        <div class="filter-notions">${cChecks}</div>
        <div class="filter-actions">
          <button class="filter-action-btn" onclick="conceptFilter=new Set(notionsVisibles());renderSB()">Sélect. tout</button>
          <button class="filter-action-btn" onclick="conceptFilter=new Set();renderSB()">Effacer</button>
        </div>`;
      list.appendChild(cfp);
    }
    const listWrap=document.createElement('div');
    listWrap.id='sb-concept-list';
    list.appendChild(listWrap);
    renderSBConceptsList();
  } else if(sbMode==='reperes'){
    // ── Repères : liste des repères (cat:'Repère') ──
    // Recherche seule (pas de filtre par notion : les repères forment une
    // liste de référence stable et courte). Même carte .cb que les concepts.
    let searchRow=fixed.querySelector('.sb-search-row');
    if(!searchRow){
      searchRow=document.createElement('div');
      searchRow.className='sb-search-row';
      fixed.appendChild(searchRow);
    }
    searchRow.innerHTML=`
      <div class="sb-search-field">
        <input class="sb-search" type="text" placeholder="Rechercher un repère…" value="${repereSearch.replace(/"/g,'&quot;')}"
          oninput="sbSearchInput(this,'repere')" oncontextmenu="searchCtxClear(event,'repere')" />
        <button class="sb-search-clear" style="display:${repereSearch?'flex':'none'}" title="Effacer (clic droit aussi)" aria-label="Effacer la recherche" onclick="clearSidebarSearch('repere')">✕</button>
      </div>`;
    const listWrap=document.createElement('div');
    listWrap.id='sb-reperes-list';
    list.appendChild(listWrap);
    renderSBReperesList();
  } else {
    // ── Méthodo (guide) : liste des deux parcours méthodologiques ──
    // Pas de recherche : la liste est minuscule (Dissertation / Explication
    // de texte). Un clic choisit le parcours rendu dans la zone principale.
    METHODO_TOPICS.forEach(t=>{
      const el=document.createElement('div');
      el.className='nb'+(t.id===methodoTopic?' active':'');
      el.innerHTML=`<span class="dot" style="background:var(--color-accent-quiz,#4f9dff)"></span>${t.label}`;
      el.onclick=()=>{methodoTopic=t.id;renderSB();renderMethodoContent();};
      list.appendChild(el);
    });
  }
}

/* toggleConceptFilter(k) — coche/décoche la notion k dans le filtre des
   concepts, puis reconstruit la sidebar. */
function toggleConceptFilter(k){
  if(conceptFilter.has(k)) conceptFilter.delete(k); else conceptFilter.add(k);
  renderSB();
}

/* renderSBConceptsList() — filtre, trie et affiche la liste des concepts.
   Filtres cumulables : recherche texte + notions cochées.
   Recherche : porte UNIQUEMENT sur le terme du concept (pas sur la
   catégorie ni la définition) — comportement le plus prévisible.
   Tri : par nombre de notions traitées (décroissant). Les concepts
   transversaux (liés à plusieurs notions) apparaissent donc en haut.
   On ne compte que les notions VALIDES (présentes dans D), exactement
   comme le rendu des pastilles — ainsi le tri correspond toujours au
   nombre de badges visibles, même si une clé erronée traîne dans data.
   À nombre égal, l'ordre du tableau CONCEPTS est conservé (tri stable). */
function renderSBConceptsList(){
  const wrap=document.getElementById('sb-concept-list');
  if(!wrap) return;
  const q=conceptSearch.trim().toLowerCase();
  // 1. Filtrage : recherche sur le terme ET filtre par notions (si actif).
  //    On part de realConcepts() : les repères (cat:'Repère') sont rangés
  //    dans l'onglet « Méthodo », pas dans le glossaire général.
  const list=realConcepts().filter(c=>{
    if(!conceptVisible(c)) return false;   // étape 5 : hors programme masqué
    const matchSearch=!q||c.term.toLowerCase().includes(q);
    let matchFilter=true;
    if(conceptFilter.size>0){
      if(conceptFilterMode==='or') matchFilter=c.notions.some(k=>conceptFilter.has(k));
      else matchFilter=[...conceptFilter].every(k=>c.notions.includes(k));
    }
    return matchSearch&&matchFilter;
  // 2. Tri : par nombre de notions VALIDES traitées (décroissant)
  }).sort((a,b)=>b.notions.filter(k=>D[k]).length-a.notions.filter(k=>D[k]).length);
  if(!list.length){wrap.innerHTML=`<div style="padding:10px 4px;font-size:11px;color:var(--color-text-tertiary);text-align:center">Aucun résultat</div>`;return;}
  // Compteur TOUJOURS affiché : total de concepts, ou « filtrés / total »
  // quand une recherche/un filtre est actif (repères exclus du total).
  const hasFilter=q||(conceptFilter.size>0);
  const total=realConcepts().filter(conceptVisible).length;
  const countTxt=hasFilter
    ?`${list.length} / ${total} concepts`
    :`${total} concept${total>1?'s':''}`;
  wrap.innerHTML=`<div class="sb-results-count">${countTxt}</div>`;
  list.forEach(c=>{
    const el=document.createElement('div');
    el.className='cb'+(c.id===curConcept?' active':'');
    const bdgs=c.notions.map(k=>D[k]?`<span class="ab-bdg" style="background:${D[k].c}" title="${D[k].l}"></span>`:'').join('');
    el.innerHTML=`<div class="cb-term">${c.term}</div><div class="ab-badges" style="margin-top:3px">${bdgs}</div>`;
    el.onclick=()=>{curConcept=c.id;renderSBConceptsList();renderConceptContent()};
    wrap.appendChild(el);
  });
}

/* renderSBReperesList() — filtre et affiche la liste des REPÈRES (sbMode
   'reperes'). Mêmes cartes .cb que les concepts, mais :
     · source = REPERES() (les concepts cat:'Repère' uniquement) ;
     · recherche sur le terme seule (pas de filtre par notion) ;
     · tri ALPHABÉTIQUE par terme (liste de référence, pas de notion-count).
   La fiche affichée au clic est la même que pour un concept
   (renderConceptContent + curConcept) : un repère EST un concept. */
function renderSBReperesList(){
  const wrap=document.getElementById('sb-reperes-list');
  if(!wrap) return;
  const q=repereSearch.trim().toLowerCase();
  const all=REPERES();
  const list=all
    .filter(c=>!q||c.term.toLowerCase().includes(q))
    .sort((a,b)=>a.term.localeCompare(b.term,'fr'));
  if(!list.length){wrap.innerHTML=`<div style="padding:10px 4px;font-size:11px;color:var(--color-text-tertiary);text-align:center">Aucun repère</div>`;return;}
  // Compteur : total de repères, ou « filtrés / total » si recherche active.
  const countTxt=q?`${list.length} / ${all.length} repères`:`${all.length} repère${all.length>1?'s':''}`;
  wrap.innerHTML=`<div class="sb-results-count">${countTxt}</div>`;
  list.forEach(c=>{
    const el=document.createElement('div');
    el.className='cb'+(c.id===curConcept?' active':'');
    const bdgs=c.notions.map(k=>D[k]?`<span class="ab-bdg" style="background:${D[k].c}" title="${D[k].l}"></span>`:'').join('');
    el.innerHTML=`<div class="cb-term">${c.term}</div><div class="ab-badges" style="margin-top:3px">${bdgs}</div>`;
    el.onclick=()=>{curConcept=c.id;renderSBReperesList();renderConceptContent()};
    wrap.appendChild(el);
  });
}

/* CONCEPT_TO_NOTION — table de correspondance pour les concepts
   dont l'id commence par "notion-" : un clic sur ces concepts
   redirige vers la notion du programme, non vers une fiche concept.
   Ex : "notion-conscience" → ouvre D["conscience"] dans sbMode='notions'. */
const CONCEPT_TO_NOTION={
  'notion-conscience':'conscience','notion-liberté':'liberte','notion-justice':'justice',
  'notion-etat':'etat','notion-travail':'travail','notion-technique':'technique',
  'notion-nature':'nature','notion-bonheur':'bonheur','notion-art':'art',
  'notion-temps':'temps','notion-langage':'langage','notion-raison':'raison',
  'notion-science':'science','notion-religion':'religion','notion-verite':'verite',
  'notion-inconscient':'inconscient'
};

/* openConcept(id) — point d'entrée des liens .cterm et des cartes concept
   de la sidebar. Si l'id est une entrée "notion-*", redirige vers la vue
   notion. Sinon, ouvre la fiche concept dans la zone principale.       */
function openConcept(id){
  const notionKey=CONCEPT_TO_NOTION[id];
  if(notionKey&&D[notionKey]){
    pushHistory();
    cur=notionKey; curTab='auteurs'; sbMode='notions';
    renderSB(); renderContent();
    focusAfterRender();   // surbrillance d'arrivée (retour contributeur)
    return;
  }
  pushHistory();
  // Un repère ouvre l'onglet « Repères » (où il est listé), un concept
  // ordinaire l'onglet « Concepts » : la sidebar reste cohérente avec la
  // fiche affichée. La fiche elle-même est rendue par renderConceptContent.
  const c=CONCEPTS.find(x=>x&&x.id===id);
  sbMode=isRepere(c)?'reperes':'concepts'; curConcept=id;
  renderSB(); renderConceptContent();
  focusAfterRender();   // surbrillance d'arrivée (retour contributeur)
}

/* openNotion(key) — ouvre une notion du programme (clé de D).
   Point d'entrée des liens .nterm générés dans le texte par linkTerms. */
function openNotion(key){
  if(!D[key]) return;
  pushHistory();
  cur=key; curTab='auteurs'; sbMode='notions';
  renderSB(); renderContent();
  focusAfterRender();   // surbrillance d'arrivée (retour contributeur)
}
