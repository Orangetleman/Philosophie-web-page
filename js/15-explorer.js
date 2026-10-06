/* js/15-explorer.js — morceau du script du site. Le build (outils/construire.mjs)
   recolle js/*.js dans l'ORDRE des noms en UN SEUL script, app.js : les
   fonctions restent visibles d'un morceau à l'autre comme avant, et le code
   « de premier niveau » s'exécute dans cet ordre. */
/* ── EXPLORER : frise des auteurs et graphe des idées (étape 6, oct. 2026) ──
   Un mode de la barre latérale (sbMode='explorer'), sur le modèle de Méthodo :
   deux sujets (explorerTopic), rendus dans la zone principale par
   renderExplorerContent. Adresses : #/explorer/frise, #/explorer/graphe.
   · Frise : les auteurs des notions, groupés par période de naissance, une
     barre par vie (naissance → mort, AM.naissance / AM.mort), couleur du
     courant. Filtres : programme seulement, une notion.
   · Graphe : trois réseaux déjà présents dans les données. Dialogues entre
     auteurs (AM.dialogues), relations entre concepts (CONCEPTS.relations),
     liens entre notions (D.liens). Disposition par forces (un ressort par
     lien, une répulsion entre nœuds), calculée ici, sans bibliothèque.
     Zoom et déplacement à la souris, au doigt ou aux boutons ; un clic ouvre
     la fiche ; la liste des relations est aussi donnée en texte.
   Le hors programme masqué dans les Réglages l'est aussi ici.             */
const EXPLORER_TOPICS=[
  {id:'frise', label:'Frise des auteurs'},
  {id:'graphe', label:'Graphe des idées'},
];
let friseProgramme=false, friseNotion='';          // filtres de la frise
let grapheMode='auteurs', grapheNotion='';         // réseau affiché et notion filtrée

/* renderExplorerContent() — en-tête commun (onglets Frise / Graphe) puis le
   sujet courant. */
function renderExplorerContent(){
  renderCrumbs();
  const mainEl=document.getElementById('main');
  if(!mainEl.querySelector('.tabs')||!mainEl.querySelector('.main-content')){
    mainEl.innerHTML='<div class="tabs"></div><div class="main-content"></div>';
  }
  const tabsEl=mainEl.querySelector('.tabs'), mc=mainEl.querySelector('.main-content');
  tabsEl.innerHTML=backBtnHTML()+EXPLORER_TOPICS.map(t=>`<div class="tab${explorerTopic===t.id?' active':''}" onclick="explorerTopic='${t.id}';renderSB();renderExplorerContent()">${t.label}</div>`).join('');
  mc.innerHTML=explorerTopic==='graphe'?grapheHTML():friseHTML();
  if(explorerTopic==='graphe') grapheBrancher();
}

/* optionsNotions(val) — les <option> d'un filtre par notion (notions visibles). */
function optionsNotions(val){
  return `<option value="">Toutes les notions</option>`+notionsVisibles().map(k=>`<option value="${k}"${k===val?' selected':''}>${D[k].l}${estHP(k)?' (hors programme)':''}</option>`).join('');
}
/* anneeTxt(a) — « 1724 », « 428 av. J.-C. ». */
function anneeTxt(a){ return a<0?(-a)+' av. J.-C.':String(a); }

/* ── Frise ─────────────────────────────────────────────────────────── */
// Périodes, par année de NAISSANCE ; pas de graduation adapté à chacune.
const FRISE_PERIODES=[
  {l:'Antiquité', de:-800, a:476, pas:100},
  {l:'Moyen Âge', de:476, a:1453, pas:100},
  {l:'Renaissance et âge classique (XVe–XVIIe s.)', de:1453, a:1700, pas:25},
  {l:'Lumières (XVIIIe s.)', de:1700, a:1800, pas:25},
  {l:'XIXe siècle', de:1800, a:1900, pas:25},
  {l:'XXe et XXIe siècles', de:1900, a:3000, pas:25},
];

/* friseHTML() — filtres, puis une section par période : un axe gradué
   propre à la période (pour que les siècles creux ne prennent pas de place)
   et une ligne par auteur. */
function friseHTML(){
  const an=new Date().getFullYear();
  const noms=Object.keys(AI).filter(n=>{
    const m=AM[n]; if(!m||!Number.isInteger(m.naissance)) return false;
    if(!auteurVisible(n)) return false;
    if(friseProgramme && statutAuteur(n)!=='programme') return false;
    if(friseNotion && !AI[n].notions.includes(friseNotion)) return false;
    return true;
  }).sort((a,b)=>AM[a].naissance-AM[b].naissance||a.localeCompare(b,'fr'));
  let html=`<div class="explorer-intro">Situer les auteurs les uns par rapport aux autres : qui a pu lire qui, qui écrivait en même temps. Chaque barre va de la naissance à la mort ; sa couleur est celle du courant.</div>
  <div class="explorer-filtres">
    <label class="explorer-check"><input type="checkbox"${friseProgramme?' checked':''} onchange="friseProgramme=this.checked;renderExplorerContent()"> Auteurs au programme seulement</label>
    <select aria-label="Filtrer par notion" onchange="friseNotion=this.value;renderExplorerContent()">${optionsNotions(friseNotion)}</select>
    <span class="explorer-compte">${noms.length} auteur${noms.length>1?'s':''}</span>
  </div>`;
  if(!noms.length) return html+`<div class="explorer-vide">Aucun auteur pour ce filtre.</div>`;
  FRISE_PERIODES.forEach(p=>{
    const liste=noms.filter(n=>AM[n].naissance>=p.de&&AM[n].naissance<p.a);
    if(!liste.length) return;
    const fin=n=>AM[n].mort===null?an:AM[n].mort;
    const debut=Math.floor(Math.min(...liste.map(n=>AM[n].naissance))/p.pas)*p.pas;
    const finAxe=Math.ceil(Math.max(...liste.map(fin))/p.pas)*p.pas;
    const pos=a=>((a-debut)/(finAxe-debut)*100).toFixed(2)+'%';
    let graduations='';
    // Deux formes de chaque graduation : longue (« 600 av. J.-C. ») et courte
    // (« −600 »), et une sur deux marquée « impaire » : sur téléphone, on
    // n'affiche que la forme courte d'une graduation sur deux (css/09).
    let gi=0;
    for(let a=debut;a<=finAxe;a+=p.pas,gi++) graduations+=`<span class="frise-grad${gi%2?' frise-grad-impaire':''}" style="left:${pos(a)}"><span class="fg-long">${anneeTxt(a)}</span><span class="fg-court">${a<0?'−'+(-a):a}</span></span>`;
    html+=`<section class="frise-periode"><h3 class="frise-titre">${p.l}</h3>
      <div class="frise-ligne frise-axe"><span class="frise-nom"></span><span class="frise-piste">${graduations}</span></div>`;
    liste.forEach(n=>{
      const m=AM[n], col=CC[m.courant]||'#888', vivant=m.mort===null;
      const dates=(m.datesApprox?'vers ':'')+anneeTxt(m.naissance)+' – '+(vivant?'':anneeTxt(m.mort));
      const prog=statutAuteur(n)==='programme';
      const safe=n.replace(/'/g,"\\'");
      html+=`<div class="frise-ligne">
        <span class="frise-nom${prog?' frise-prog':''}" role="link" tabindex="0" onclick="openAuthor('${safe}')" onkeydown="if(event.key==='Enter')openAuthor('${safe}')" title="${prog?'Au programme · ':''}${m.courant||''}">${n}</span>
        <span class="frise-piste"><span class="frise-barre${vivant?' frise-vivant':''}${m.datesApprox?' frise-approx':''}" style="left:${pos(m.naissance)};width:calc(${pos(fin(n))} - ${pos(m.naissance)});background:${col}" title="${n} (${dates})"></span><span class="frise-dates" style="left:calc(${pos(fin(n))} + 4px)">${dates}</span></span>
      </div>`;
    });
    html+=`</section>`;
  });
  html+=`<div class="explorer-note">Noms en gras : auteurs au programme. Pointillés : dates approximatives. Barre ouverte : auteur vivant.</div>`;
  return html;
}

/* ── Graphe ────────────────────────────────────────────────────────── */
const GRAPHE_MODES={auteurs:'Dialogues entre auteurs', concepts:'Relations entre concepts', notions:'Liens entre notions'};
const GRAPHE_TYPES={oppose:"s'oppose à", prolonge:'prolonge', repond:'répond à', complete:'complète', distinction:'se distingue de', implique:'implique', lien:'est liée à'};
let grapheVue=null;   // {x,y,w,h} : la portion du dessin affichée (zoom, déplacement)
let grapheBoite=null; // la vue d'origine (pour « recentrer »)

/* grapheDonnees() — {noeuds:[{id,label,col,ouvrir}], aretes:[{de,vers,type,desc}]}
   pour le mode et la notion choisis. Les nœuds sans aucun lien sont écartés
   (ils encombreraient le dessin sans rien montrer). */
function grapheDonnees(){
  const noeuds=new Map(), aretes=[], vues=new Set();
  const ajouter=(de,vers,type,desc)=>{
    if(de===vers) return;
    const cle=[de,vers].sort().join('|')+'|'+type;
    if(vues.has(cle)) return; vues.add(cle);
    aretes.push({de,vers,type,desc:desc||''});
  };
  const dansNotion=ns=>!grapheNotion||ns.includes(grapheNotion);
  if(grapheMode==='auteurs'){
    const ok=n=>AI[n]&&auteurVisible(n)&&dansNotion(AI[n].notions);
    Object.keys(AI).filter(ok).forEach(n=>{
      ((AM[n]||{}).dialogues||[]).forEach(d=>{
        const v=AI[d.auteur]?d.auteur:AUTHOR_ALIASES[d.auteur];
        if(!v||!AI[v]||!auteurVisible(v)) return;
        if(grapheNotion && !ok(v) && !ok(n)) return;
        ajouter(n,v,d.dir,d.sujet);
      });
    });
    aretes.forEach(a=>[a.de,a.vers].forEach(n=>{ if(!noeuds.has(n)){ const sn=n.replace(/'/g,"\\'"); noeuds.set(n,{id:n,label:n,col:CC[(AM[n]||{}).courant]||'#888',ouvrir:`openAuthor('${sn}')`}); } }));
  } else if(grapheMode==='concepts'){
    const parId={}; CONCEPTS.forEach(c=>{ parId[c.id]=c; });
    CONCEPTS.filter(c=>!isRepere(c)&&conceptVisible(c)&&dansNotion(c.notions||[])).forEach(c=>{
      (c.relations||[]).forEach(r=>{
        const v=r.to&&parId[r.to]; if(!v||isRepere(v)||!conceptVisible(v)) return;
        ajouter(c.id,v.id,r.type,r.desc);
      });
    });
    aretes.forEach(a=>[a.de,a.vers].forEach(id=>{ if(!noeuds.has(id)){ const c=parId[id], k=(c.notions||[]).find(x=>D[x]); noeuds.set(id,{id,label:c.term,col:k?D[k].c:'#888',ouvrir:`openConcept('${id}')`}); } }));
  } else {
    const parLibelle={}; KEYS.forEach(k=>{ parLibelle[D[k].l]=k; });
    notionsVisibles().forEach(k=>{
      (D[k].liens||[]).forEach(l=>{ const v=D[l]?l:parLibelle[l]; if(v&&notionVisible(v)) ajouter(k,v,'lien',''); });
    });
    aretes.forEach(a=>[a.de,a.vers].forEach(k=>{ if(!noeuds.has(k)) noeuds.set(k,{id:k,label:D[k].l,col:D[k].c,ouvrir:`openNotion('${k}')`,hp:estHP(k)}); }));
  }
  return {noeuds:[...noeuds.values()], aretes};
}

/* grapheDisposer(noeuds, aretes, W, H) — disposition par forces
   (Fruchterman et Reingold, 1991) : les nœuds se repoussent, les liens les
   rapprochent comme des ressorts, une légère gravité garde l'ensemble
   groupé ; la « température » (pas maximal) décroît à chaque tour. Départ
   en cercle, dans un ordre fixe : le même graphe donne toujours le même
   dessin. */
function grapheDisposer(noeuds, aretes, W, H){
  const n=noeuds.length; if(!n) return;
  noeuds.forEach((nd,i)=>{ const a=2*Math.PI*i/n; nd.x=W/2+W*0.4*Math.cos(a); nd.y=H/2+H*0.4*Math.sin(a); });
  const idx=new Map(noeuds.map((nd,i)=>[nd.id,i]));
  const k=Math.sqrt(W*H/n)*0.75;
  let t=W/8;
  for(let it=0; it<350; it++){
    const dx=new Float64Array(n), dy=new Float64Array(n);
    for(let i=0;i<n;i++) for(let j=i+1;j<n;j++){
      let ex=noeuds[i].x-noeuds[j].x, ey=noeuds[i].y-noeuds[j].y;
      const d=Math.hypot(ex,ey)||0.01, f=k*k/d; ex/=d; ey/=d;
      dx[i]+=ex*f; dy[i]+=ey*f; dx[j]-=ex*f; dy[j]-=ey*f;
    }
    aretes.forEach(a=>{
      const i=idx.get(a.de), j=idx.get(a.vers);
      let ex=noeuds[i].x-noeuds[j].x, ey=noeuds[i].y-noeuds[j].y;
      const d=Math.hypot(ex,ey)||0.01, f=d*d/k; ex/=d; ey/=d;
      dx[i]-=ex*f; dy[i]-=ey*f; dx[j]+=ex*f; dy[j]+=ey*f;
    });
    for(let i=0;i<n;i++){
      dx[i]+=(W/2-noeuds[i].x)*0.12; dy[i]+=(H/2-noeuds[i].y)*0.12;   // gravité vers le centre
      const d=Math.hypot(dx[i],dy[i])||1, m=Math.min(d,t);
      // Les points restent dans le cadre (sinon un petit groupe isolé, repoussé
      // au loin, forcerait à dézoomer tout le dessin).
      noeuds[i].x=Math.min(W-30, Math.max(30, noeuds[i].x+dx[i]/d*m));
      noeuds[i].y=Math.min(H-20, Math.max(20, noeuds[i].y+dy[i]/d*m));
    }
    t=Math.max(t*0.985, 0.5);
  }
}

/* grapheHTML() — filtres, le dessin SVG (liens puis nœuds), la légende et la
   liste textuelle des relations. */
function grapheHTML(){
  const {noeuds, aretes}=grapheDonnees();
  let html=`<div class="explorer-intro">Le site s'appelle « Graphe Philosophie » : voici les liens qu'il contient. Survole un point pour voir ses relations, clique pour ouvrir sa fiche. Molette ou boutons pour zoomer, glisser pour se déplacer.</div>
  <div class="explorer-filtres">
    <select aria-label="Réseau affiché" onchange="grapheMode=this.value;grapheVue=null;renderExplorerContent()">${Object.keys(GRAPHE_MODES).map(m=>`<option value="${m}"${m===grapheMode?' selected':''}>${GRAPHE_MODES[m]}</option>`).join('')}</select>
    ${grapheMode!=='notions'?`<select aria-label="Filtrer par notion" onchange="grapheNotion=this.value;grapheVue=null;renderExplorerContent()">${optionsNotions(grapheNotion)}</select>`:''}
    <span class="explorer-compte">${noeuds.length} points · ${aretes.length} liens</span>
  </div>`;
  if(!aretes.length) return html+`<div class="explorer-vide">Aucune relation pour ce filtre.</div>`;
  const W=1000, H=Math.max(560, Math.min(1100, 260+noeuds.length*9));
  grapheDisposer(noeuds, aretes, W, H);
  const xs=noeuds.map(n=>n.x), ys=noeuds.map(n=>n.y), marge=60;
  grapheBoite={x:Math.min(...xs)-marge, y:Math.min(...ys)-marge, w:Math.max(...xs)-Math.min(...xs)+2*marge+80, h:Math.max(...ys)-Math.min(...ys)+2*marge};
  if(!grapheVue) grapheVue=Object.assign({}, grapheBoite);
  const deg={}; aretes.forEach(a=>{ deg[a.de]=(deg[a.de]||0)+1; deg[a.vers]=(deg[a.vers]||0)+1; });
  const pos={}; noeuds.forEach(n=>{ pos[n.id]=n; });
  const fleche=t=>(t==='prolonge'||t==='repond'||t==='implique')?` marker-end="url(#gf-${t})"`:'';
  const lignes=aretes.map((a,i)=>{
    const p=pos[a.de], q=pos[a.vers], r=5+Math.sqrt(deg[a.vers]||1)*2;
    const d=Math.hypot(q.x-p.x,q.y-p.y)||1, x2=q.x-(q.x-p.x)/d*(r+3), y2=q.y-(q.y-p.y)/d*(r+3);   // la flèche s'arrête au bord du point
    return `<line class="g-arete g-${a.type}" data-de="${pEscAttr(a.de)}" data-vers="${pEscAttr(a.vers)}" x1="${p.x.toFixed(1)}" y1="${p.y.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"${fleche(a.type)}><title>${pEscAttr(pos[a.de].label+' '+GRAPHE_TYPES[a.type]+' '+pos[a.vers].label+(a.desc?' : '+stripHtml(a.desc):''))}</title></line>`;
  }).join('');
  const points=noeuds.map(n=>{
    const r=5+Math.sqrt(deg[n.id]||1)*2;
    return `<g class="g-noeud${n.hp?' g-hp':''}" data-id="${pEscAttr(n.id)}" tabindex="0" role="link" aria-label="${pEscAttr(n.label)}" onclick="${n.ouvrir}" onkeydown="if(event.key==='Enter')${n.ouvrir.replace(/"/g,'&quot;')}">
      <circle cx="${n.x.toFixed(1)}" cy="${n.y.toFixed(1)}" r="${r.toFixed(1)}" fill="${n.col}"/>
      <text x="${(n.x+r+3).toFixed(1)}" y="${(n.y+4).toFixed(1)}">${n.label}</text></g>`;
  }).join('');
  const marq=['prolonge','repond','implique'].map(t=>`<marker id="gf-${t}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="g-fleche g-${t}"/></marker>`).join('');
  const v=grapheVue;
  html+=`<div class="graphe-cadre">
    <div class="graphe-boutons"><button onclick="grapheZoom(0.8)" aria-label="Zoomer">+</button><button onclick="grapheZoom(1.25)" aria-label="Dézoomer">−</button><button onclick="grapheRecentrer()" aria-label="Recentrer" title="Recentrer">⤢</button></div>
    <svg id="graphe-svg" viewBox="${v.x} ${v.y} ${v.w} ${v.h}" role="group" aria-label="${GRAPHE_MODES[grapheMode]}"><defs>${marq}</defs><g class="g-aretes">${lignes}</g><g class="g-noeuds">${points}</g></svg>
  </div>`;
  const types=[...new Set(aretes.map(a=>a.type))];
  html+=`<div class="graphe-legende">${types.map(t=>`<span><i class="g-leg g-${t}"></i>${GRAPHE_TYPES[t]}</span>`).join('')}${grapheMode==='notions'?'<span><i class="g-leg-hp"></i>notion hors programme</span>':''}</div>`;
  html+=`<details class="graphe-liste"><summary>Les ${aretes.length} relations, en liste</summary><ul>${aretes.map(a=>`<li><span role="link" tabindex="0" class="g-lienliste" onclick="${pos[a.de].ouvrir}">${pos[a.de].label}</span> ${GRAPHE_TYPES[a.type]} <span role="link" tabindex="0" class="g-lienliste" onclick="${pos[a.vers].ouvrir}">${pos[a.vers].label}</span>${a.desc?' : '+stripHtml(a.desc):''}</li>`).join('')}</ul></details>`;
  return html;
}

/* pEscAttr(s) — texte sûr dans un attribut ou un <title> SVG. */
function pEscAttr(s){ return String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;'); }

/* grapheAppliquerVue() / grapheZoom(f) / grapheRecentrer() — le zoom et le
   déplacement modifient seulement le viewBox du SVG. */
function grapheAppliquerVue(){ const s=document.getElementById('graphe-svg'); if(s&&grapheVue) s.setAttribute('viewBox',`${grapheVue.x} ${grapheVue.y} ${grapheVue.w} ${grapheVue.h}`); }
function grapheZoom(f, cx, cy){
  const v=grapheVue; if(!v) return;
  cx=cx??v.x+v.w/2; cy=cy??v.y+v.h/2;
  const w=Math.min(Math.max(v.w*f, 120), grapheBoite.w*3), h=w*v.h/v.w;
  grapheVue={x:cx-(cx-v.x)*w/v.w, y:cy-(cy-v.y)*h/v.h, w, h};
  grapheAppliquerVue();
}
function grapheRecentrer(){ grapheVue=Object.assign({}, grapheBoite); grapheAppliquerVue(); }

/* grapheBrancher() — après le rendu : molette (zoom autour du pointeur),
   glisser (déplacement, souris et doigt), survol ou focus d'un point (mise
   en valeur de ses voisins). */
function grapheBrancher(){
  const svg=document.getElementById('graphe-svg'); if(!svg) return;
  const versDessin=(ev)=>{ const r=svg.getBoundingClientRect(), v=grapheVue; return [v.x+(ev.clientX-r.left)/r.width*v.w, v.y+(ev.clientY-r.top)/r.height*v.h]; };
  svg.addEventListener('wheel',ev=>{ ev.preventDefault(); const [x,y]=versDessin(ev); grapheZoom(ev.deltaY>0?1.12:0.89, x, y); },{passive:false});
  let glisse=null;
  svg.addEventListener('pointerdown',ev=>{ if(ev.target.closest('.g-noeud')) return; glisse={x:ev.clientX, y:ev.clientY, v:Object.assign({},grapheVue)}; svg.setPointerCapture(ev.pointerId); svg.classList.add('g-glisse'); });
  svg.addEventListener('pointermove',ev=>{
    if(!glisse) return;
    const r=svg.getBoundingClientRect();
    grapheVue=Object.assign({}, glisse.v, {x:glisse.v.x-(ev.clientX-glisse.x)/r.width*glisse.v.w, y:glisse.v.y-(ev.clientY-glisse.y)/r.height*glisse.v.h});
    grapheAppliquerVue();
  });
  const fin=()=>{ glisse=null; svg.classList.remove('g-glisse'); };
  svg.addEventListener('pointerup',fin); svg.addEventListener('pointercancel',fin);
  // Mise en valeur des voisins d'un point survolé ou atteint au clavier.
  const voisins={};
  svg.querySelectorAll('.g-arete').forEach(l=>{ const a=l.dataset.de, b=l.dataset.vers; (voisins[a]||=new Set()).add(b); (voisins[b]||=new Set()).add(a); });
  const allumer=id=>{
    svg.classList.add('g-actif');
    svg.querySelectorAll('.g-noeud').forEach(g=>g.classList.toggle('g-voisin', g.dataset.id===id||(voisins[id]&&voisins[id].has(g.dataset.id))));
    svg.querySelectorAll('.g-arete').forEach(l=>l.classList.toggle('g-voisin', l.dataset.de===id||l.dataset.vers===id));
  };
  const eteindre=()=>{ svg.classList.remove('g-actif'); svg.querySelectorAll('.g-voisin').forEach(e=>e.classList.remove('g-voisin')); };
  svg.querySelectorAll('.g-noeud').forEach(g=>{
    g.addEventListener('mouseenter',()=>allumer(g.dataset.id)); g.addEventListener('focus',()=>allumer(g.dataset.id));
    g.addEventListener('mouseleave',eteindre); g.addEventListener('blur',eteindre);
  });
}
