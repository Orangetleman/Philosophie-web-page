/* js/14-recherche.js — morceau du script du site. Le build (outils/construire.mjs)
   recolle js/*.js dans l'ORDRE des noms en UN SEUL script, app.js : les
   fonctions restent visibles d'un morceau à l'autre comme avant, et le code
   « de premier niveau » s'exécute dans cet ordre. */
/* ══════════════════════════════════════════════════════════════════
   L. PALETTE DE RECHERCHE GLOBALE (Ctrl/⌘+K)
   ──────────────────────────────────────────────────────────────────
   Recherche transversale et instantanée sur les notions (D), les auteurs
   (AI) et les concepts (CONCEPTS). Ouverte par le bouton .topbar-search ou
   le raccourci Ctrl/⌘+K ; navigation clavier ↑/↓/Entrée/Échap. Activer un
   résultat route vers openNotion / openAuthor / openConcept puis ferme la
   palette. Elle COMPLÈTE la recherche par mode de la sidebar (conservée
   telle quelle, avec ses filtres et ses modes de circulation).
   ══════════════════════════════════════════════════════════════════ */

/* paletteNorm(s) — normalise pour comparaison : minuscules + accents
   retirés (NFD), espaces conservés. Même principe que slugify, sans
   compacter les espaces (on veut comparer « jean paul sartre »). */
function paletteNorm(s){
  return String(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
}

/* paletteEsc(s) — échappe les caractères HTML sensibles avant injection
   via innerHTML (les libellés sont des données de confiance, mais on
   reste prudent pour & < > et les guillemets dans un attribut). */
function paletteEsc(s){
  return String(s==null?'':s).replace(/[&<>"']/g,
    c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

/* PALETTE_INDEX — index plat construit UNE fois au chargement : une entrée
   par notion / auteur / concept, avec libellé, sous-titre, pastille de
   couleur et chaîne de recherche normalisée (norm). */
const PALETTE_INDEX=(function(){
  const out=[];
  // Notions : couleur = D[k].c ; sous-titre = question d'accroche (texte nu).
  KEYS.forEach(k=>{
    const sub=stripHtml(D[k].s||'');
    out.push({type:'notion', id:k, label:D[k].l, sub:sub,
      color:D[k].c, norm:paletteNorm(D[k].l+' '+sub)});
  });
  // Auteurs : couleur = courant (CC) ; sous-titre = courant philosophique.
  Object.keys(AI).forEach(name=>{
    const courant=(AM[name]||{}).courant||'';
    out.push({type:'auteur', id:name, label:name, sub:courant,
      color:CC[courant]||'#888', norm:paletteNorm(name+' '+courant)});
  });
  // Concepts : couleur = 1re notion liée (si fichée) ; sous-titre = catégorie.
  CONCEPTS.forEach(c=>{
    const col=(c.notions&&c.notions[0]&&D[c.notions[0]])?D[c.notions[0]].c:'#888';
    out.push({type:'concept', id:c.id, label:c.term, sub:c.cat||'',
      color:col, norm:paletteNorm(c.term+' '+(c.cat||''))});
  });
  // Accroches : phrases d'ouverture rangées dans l'onglet Exemples > Accroches
  //   de chaque notion. id = "clé#index" (la clé ne contient pas de '#') →
  //   paletteActivate route vers openNotionAccroche(clé, index). Label = texte
  //   nu de l'accroche ; sous-titre = notion + type ; recherche = texte+source.
  KEYS.forEach(k=>{
    (D[k].accroches||[]).forEach((a,ai)=>{
      const txt=stripHtml(a.t||'');
      // Libellé affiché tronqué (les accroches sont de vraies phrases) ; la
      // chaîne de recherche (norm) garde le texte complet + source.
      const label=txt.length>88?txt.slice(0,87)+'…':txt;
      out.push({type:'accroche', id:k+'#'+ai, label:label, sub:D[k].l+(a.type?' · '+a.type:''),
        color:D[k].c, norm:paletteNorm(txt+' '+(a.src||'')+' '+D[k].l+' '+(a.type||''))});
    });
  });
  return out;
})();

const PALETTE_GROUPS={notion:'Notions', auteur:'Auteurs', concept:'Concepts', accroche:'Accroches'};
const PALETTE_ORDER={notion:0, auteur:1, concept:2, accroche:3};

/* État runtime. paletteResults = liste à plat des résultats affichés (dans
   l'ordre des groupes) ; paletteSel = index sélectionné au clavier. */
let paletteResults=[]; let paletteSel=0;

/* paletteQuery() — lit la saisie courante du champ. */
function paletteQuery(){ const i=document.getElementById('palette-input'); return i?i.value:''; }

/* paletteSearch(q) — entrées correspondant à q, classées par pertinence
   (libellé qui COMMENCE par q, puis match en tête de la chaîne, puis
   simple inclusion), regroupées par type (notion → auteur → concept).
   Sans requête : tout l'index, dans son ordre naturel. Plafonné à 40. */
function paletteSearch(q){
  const n=paletteNorm(q.trim());
  let hits;
  if(!n){
    hits=PALETTE_INDEX.slice();
  } else {
    hits=PALETTE_INDEX
      .map(e=>{ const i=e.norm.indexOf(n);
        return i<0?null:{e, rank:(paletteNorm(e.label).startsWith(n)?0:(i===0?1:2))}; })
      .filter(Boolean)
      .sort((a,b)=>a.rank-b.rank)   // sort stable : conserve l'ordre d'index à rang égal
      .map(x=>x.e);
  }
  // Regroupe par type (sort stable → pertinence conservée dans chaque groupe).
  return hits.sort((a,b)=>PALETTE_ORDER[a.type]-PALETTE_ORDER[b.type]).slice(0,40);
}

/* renderPalette() — recalcule les résultats selon la saisie et peint la
   liste groupée ; borne la sélection et fait défiler l'élément choisi. */
function renderPalette(){
  const box=document.getElementById('palette-results');
  paletteResults=paletteSearch(paletteQuery());
  if(paletteSel>=paletteResults.length) paletteSel=paletteResults.length-1;
  if(paletteSel<0) paletteSel=0;
  if(!paletteResults.length){
    box.innerHTML='<div class="cmdp-empty">Aucun résultat.</div>';
    return;
  }
  let html=''; let lastType=null;
  paletteResults.forEach((e,ix)=>{
    if(e.type!==lastType){ html+=`<div class="cmdp-group">${PALETTE_GROUPS[e.type]}</div>`; lastType=e.type; }
    const sel=ix===paletteSel?' sel':'';
    const sub=e.sub?`<span class="cmdp-sub">${paletteEsc(e.sub)}</span>`:'';
    html+=`<div class="cmdp-item${sel}" role="option" data-ix="${ix}" aria-selected="${ix===paletteSel}">`
      +`<span class="cmdp-dot" style="background:${paletteEsc(e.color)}"></span>`
      +`<span class="cmdp-label">${paletteEsc(e.label)}</span>${sub}</div>`;
  });
  box.innerHTML=html;
  const cur=box.querySelector('.cmdp-item.sel');
  if(cur) cur.scrollIntoView({block:'nearest'});
}

/* openPalette() — ouvre la palette : reset saisie + sélection, rend la
   liste (tout l'index au départ), focus le champ. */
function openPalette(){
  const ov=document.getElementById('palette-overlay');
  const inp=document.getElementById('palette-input');
  inp.value=''; paletteSel=0;
  ov.classList.add('open');
  renderPalette();
  paletteSyncClear();   // champ vidé → croix masquée
  inp.focus();
}

/* closePalette() — referme la palette. */
function closePalette(){ document.getElementById('palette-overlay').classList.remove('open'); }

/* paletteSyncClear() — affiche/masque la croix d'effacement selon que le champ
   contient ou non du texte. */
function paletteSyncClear(){
  const inp=document.getElementById('palette-input'); const btn=document.getElementById('palette-clear');
  if(inp&&btn) btn.style.display=inp.value?'flex':'none';
}

/* clearPaletteSearch() — vide la recherche globale (croix ou clic droit),
   recalcule la liste (tout l'index) et redonne le focus pour ressaisir. */
function clearPaletteSearch(){
  const inp=document.getElementById('palette-input'); if(!inp) return;
  inp.value=''; paletteSel=0; renderPalette(); paletteSyncClear(); inp.focus();
}

/* paletteIsOpen() — la palette est-elle visible ? */
function paletteIsOpen(){ return document.getElementById('palette-overlay').classList.contains('open'); }

/* paletteMove(d) — déplace la sélection clavier de d (±1), avec bouclage. */
function paletteMove(d){
  if(!paletteResults.length) return;
  paletteSel=(paletteSel+d+paletteResults.length)%paletteResults.length;
  renderPalette();
}

/* paletteActivate() — ouvre le résultat sélectionné via le bon point
   d'entrée (notion / auteur / concept) puis ferme la palette. */
function paletteActivate(){
  const e=paletteResults[paletteSel];
  if(!e) return;
  closePalette();
  if(e.type==='notion') openNotion(e.id);
  else if(e.type==='auteur') openAuthor(e.id);
  else if(e.type==='concept') openConcept(e.id);
  else if(e.type==='accroche'){
    // id = "clé#index" → ouvre la notion sur Exemples > Accroches et fait
    // briller la carte ciblée.
    const h=e.id.lastIndexOf('#');
    openNotionAccroche(e.id.slice(0,h), +e.id.slice(h+1));
  }
}

/* Câblage des interactions de la palette (saisie, clavier, clic, raccourci). */
(function(){
  const inp=document.getElementById('palette-input');
  const res=document.getElementById('palette-results');
  const ov=document.getElementById('palette-overlay');
  if(!inp||!res||!ov) return;   // garde-fou si le DOM change
  // Saisie : recalcule, repart du 1er résultat et affiche la croix si non vide.
  inp.addEventListener('input',()=>{ paletteSel=0; renderPalette(); paletteSyncClear(); });
  // Clic droit dans le champ : pas de menu natif, on vide la recherche.
  inp.addEventListener('contextmenu',e=>{ e.preventDefault(); clearPaletteSearch(); });
  // Clavier DANS le champ : flèches, Entrée, Échap.
  inp.addEventListener('keydown',e=>{
    if(e.key==='ArrowDown'){ e.preventDefault(); paletteMove(1); }
    else if(e.key==='ArrowUp'){ e.preventDefault(); paletteMove(-1); }
    else if(e.key==='Enter'){ e.preventDefault(); paletteActivate(); }
    else if(e.key==='Escape'){ e.preventDefault(); closePalette(); }
  });
  // Clic sur un résultat (délégué) : sélectionne puis active.
  res.addEventListener('click',e=>{
    const it=e.target.closest('.cmdp-item'); if(!it) return;
    paletteSel=+it.dataset.ix; paletteActivate();
  });
  // Clic sur le voile (hors panneau) : ferme.
  ov.addEventListener('click',e=>{ if(e.target===ov) closePalette(); });
  // Raccourci global Ctrl/⌘+K : bascule l'ouverture de la palette.
  document.addEventListener('keydown',e=>{
    if((e.ctrlKey||e.metaKey)&&(e.key==='k'||e.key==='K')){
      e.preventDefault();
      paletteIsOpen()?closePalette():openPalette();
    }
  });
})();
