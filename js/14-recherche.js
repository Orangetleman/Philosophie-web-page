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
   par notion / auteur / concept / accroche, avec libellé, sous-titre,
   pastille de couleur et chaîne de recherche normalisée (norm).
   Depuis l'étape 3 (oct. 2026), la recherche porte aussi sur le TEXTE :
   champ `texte` (normalisé) = définition d'une notion ou d'un concept, corps
   d'un texte ou d'un exemple ; et cinq types de plus : citation, œuvre,
   sujet (dissertations et plans), texte, exemple. Un résultat mène à sa
   fiche, sur le bon onglet, et fait briller l'élément trouvé (ouvrirResultat). */
const PALETTE_INDEX=(function(){
  const out=[];
  // Notions : couleur = D[k].c ; sous-titre = question d'accroche (texte nu).
  KEYS.forEach(k=>{
    const sub=stripHtml(D[k].s||'');
    out.push({type:'notion', id:k, label:D[k].l, sub:sub,
      color:D[k].c, norm:paletteNorm(D[k].l+' '+sub), texte:paletteNorm(stripHtml(D[k].def||''))});
  });
  // Auteurs : couleur = courant (CC) ; sous-titre = courant philosophique.
  // Les autres formes du nom (AUTHOR_ALIASES : « Occam », « Simone de
  // Beauvoir »…) entrent dans la chaîne de recherche (étape 4).
  const aliasDe={};
  Object.keys(AUTHOR_ALIASES).forEach(al=>{ (aliasDe[AUTHOR_ALIASES[al]]=aliasDe[AUTHOR_ALIASES[al]]||[]).push(al); });
  Object.keys(AI).forEach(name=>{
    const courant=(AM[name]||{}).courant||'';
    out.push({type:'auteur', id:name, label:name, sub:courant,
      color:CC[courant]||'#888', norm:paletteNorm(name+' '+courant+' '+(aliasDe[name]||[]).join(' '))});
  });
  // Concepts : couleur = 1re notion liée (si fichée) ; sous-titre = catégorie.
  CONCEPTS.forEach(c=>{
    const col=(c.notions&&c.notions[0]&&D[c.notions[0]])?D[c.notions[0]].c:'#888';
    out.push({type:'concept', id:c.id, label:c.term, sub:c.cat||'',
      color:col, norm:paletteNorm(c.term+' '+(c.cat||'')), texte:paletteNorm(stripHtml(c.def||''))});
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
  // ── Plein texte (étape 3). `cible` dit où ouvrir et quoi faire briller.
  const court=t=>t.length>88?t.slice(0,87)+'…':t;
  // Citations et œuvres : depuis l'index des auteurs (AI), notion par notion.
  const oeuvresVues={};
  Object.keys(AI).forEach(name=>{
    const col=CC[(AM[name]||{}).courant]||'#888';
    Object.keys(AI[name].entries).forEach(k=>{
      (AI[name].entries[k].ideas||[]).forEach(it=>{
        (it.citations||[]).forEach(c=>{
          const txt=stripHtml(c); if(!txt) return;
          out.push({type:'citation', id:name+'|'+k, label:court(txt), sub:name+' · '+D[k].l, color:col,
            norm:paletteNorm(txt+' '+name), cible:{auteur:name, onglet:'citations', sel:'.cit-card', extrait:txt}});
        });
        const w=stripHtml(it.w||''), cle=name+'|'+w;
        if(w&&!oeuvresVues[cle]){
          oeuvresVues[cle]=1;
          out.push({type:'oeuvre', id:cle, label:court(w), sub:name, color:col,
            norm:paletteNorm(w+' '+name), cible:{auteur:name, onglet:'oeuvres', sel:'.oeuvre-card', extrait:w}});
        }
      });
    });
  });
  // Sujets (questions simples et plans rédigés), textes, exemples : par notion.
  KEYS.forEach(k=>{
    const n=D[k], col=n.c;
    (n.diss||[]).forEach(d=>{
      const q=stripHtml(typeof d==='object'?d.q:d); if(!q) return;
      out.push({type:'sujet', id:k, label:court(q), sub:n.l, color:col, norm:paletteNorm(q),
        cible:{notion:k, onglet:'diss', sel:'.dq', extrait:q}});
    });
    (n.plans||[]).forEach(pl=>{
      const q=stripHtml(pl.q||''); if(!q) return;
      out.push({type:'sujet', id:k, label:court(q), sub:n.l+' · plan', color:col, norm:paletteNorm(q),
        cible:{notion:k, onglet:'diss', sel:'.plan-card', extrait:q}});
    });
    (n.textes||[]).forEach(t=>{
      const ti=stripHtml(t.n||''); if(!ti) return;
      out.push({type:'texte', id:k, label:court(ti), sub:n.l, color:col, norm:paletteNorm(ti),
        texte:paletteNorm(stripHtml(t.t||'')), cible:{notion:k, onglet:'textes', sel:'.ti2', extrait:ti}});
    });
    (n.exemples||[]).forEach(x=>{
      const ti=stripHtml(x.tit||''); if(!ti) return;
      out.push({type:'exemple', id:k, label:court(ti), sub:n.l+(x.tag?' · '+x.tag:''), color:col,
        norm:paletteNorm(ti+' '+(x.tag||'')), texte:paletteNorm(stripHtml(x.body||'')),
        cible:{notion:k, onglet:'exemples', sel:'.ex-card', extrait:ti}});
    });
  });
  // Sujets tombés au bac (étape 6) : ouvrent Explorer › Sujets du bac.
  SUJETS_BAC.sujets.forEach((x,i)=>{
    const lab=x.type==='explication'?'Explication : '+x.auteur+', '+stripHtml(x.oeuvre):x.q;
    out.push({type:'sujet', id:(x.notions||[])[0]||'', label:court(lab), sub:'Bac '+x.annee+' · voie '+x.voie,
      color:'#888', norm:paletteNorm(lab+' bac '+x.annee), cible:{explorer:'sujets'}});
  });
  return out;
})();

// Étape 5 : chaque entrée sait si elle relève du hors programme (e.hp), d'après
// sa notion ou le statut de son auteur ou concept ; paletteSearch l'écarte
// quand le hors programme est masqué, et la signale sinon.
PALETTE_INDEX.forEach(e=>{
  const t=e.type, id=String(e.id);
  e.hp = t==='notion' ? estHP(id)
       : t==='auteur' ? HP_AUTEURS.has(id)
       : t==='concept' ? HP_CONCEPTS.has(id)
       : t==='accroche' ? estHP(id.slice(0,id.lastIndexOf('#')))
       : t==='citation' ? estHP(id.slice(id.indexOf('|')+1))
       : t==='oeuvre' ? HP_AUTEURS.has(id.slice(0,id.indexOf('|')))
       : estHP(id);                       // sujet, texte, exemple : id = clé de notion
  if(e.hp) e.sub=(e.sub?e.sub+' · ':'')+'hors programme';
});

const PALETTE_GROUPS={notion:'Notions', auteur:'Auteurs', concept:'Concepts', citation:'Citations', oeuvre:'Œuvres', sujet:'Sujets de dissertation', texte:'Textes', exemple:'Exemples', accroche:'Accroches'};
const PALETTE_ORDER={notion:0, auteur:1, concept:2, citation:3, oeuvre:4, sujet:5, texte:6, exemple:7, accroche:8};
const PALETTE_BASE={notion:1, auteur:1, concept:1, accroche:1};   // types montrés quand la saisie est vide
const PALETTE_PAR_GROUPE=8;                                       // résultats affichés par type, au plus

/* État runtime. paletteResults = liste à plat des résultats affichés (dans
   l'ordre des groupes) ; paletteSel = index sélectionné au clavier. */
let paletteResults=[]; let paletteSel=0;

/* paletteQuery() — lit la saisie courante du champ. */
function paletteQuery(){ const i=document.getElementById('palette-input'); return i?i.value:''; }

/* paletteSearch(q) — entrées correspondant à q, classées par pertinence :
   0 le libellé COMMENCE par q, 1 la chaîne de recherche commence par q,
   2 q est dans le libellé ou la chaîne, 3 q n'est que dans le TEXTE (une
   définition, le corps d'un texte ou d'un exemple). Regroupées par type
   (notions, auteurs, concepts, citations, œuvres, sujets, textes, exemples,
   accroches), PALETTE_PAR_GROUPE par type au plus, pour qu'un type très
   fourni (les citations) ne cache pas les autres.
   Sans requête : les notions, auteurs, concepts et accroches (40 au plus). */
function paletteSearch(q){
  const n=paletteNorm(q.trim());
  const vus=voirHP()?PALETTE_INDEX:PALETTE_INDEX.filter(e=>!e.hp);   // étape 5
  if(!n) return vus.filter(e=>PALETTE_BASE[e.type]).slice(0,40);
  const hits=vus
    .map(e=>{
      const i=e.norm.indexOf(n);
      if(i>=0) return {e, rank:(paletteNorm(e.label).startsWith(n)?0:(i===0?1:2))};
      return (e.texte&&e.texte.includes(n))?{e, rank:3}:null;
    })
    .filter(Boolean)
    .sort((a,b)=>(PALETTE_ORDER[a.e.type]-PALETTE_ORDER[b.e.type])||(a.rank-b.rank))   // sort stable
    .map(x=>x.e);
  const parType={};
  return hits.filter(e=>(parType[e.type]=(parType[e.type]||0)+1)<=PALETTE_PAR_GROUPE);
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
  else if(e.cible) ouvrirResultat(e.cible);
}

/* ouvrirResultat(c) — ouvre un résultat « plein texte » (étape 3) : la fiche
   de l'auteur ou la notion, sur le bon onglet. pendingCible dit à
   focusAfterRender (appelée par open*, au prochain affichage, donc APRÈS le
   changement d'onglet ci-dessous) de faire briller l'élément (c.sel) dont le
   texte contient le début de l'extrait, au lieu de l'en-tête. */
function ouvrirResultat(c){
  if(c.explorer){ pushHistory(); sbMode='explorer'; explorerTopic=c.explorer; renderSB(); renderExplorerContent(); return; }   // étape 6
  pendingCible={sel:c.sel, extrait:c.extrait};
  if(c.auteur){ openAuthor(c.auteur); curAuthorTab=c.onglet; renderAuthorContent(); }
  else if(c.notion){
    openNotion(c.notion); curTab=c.onglet;
    if(c.onglet==='exemples') curExempleSubTab='exemples';
    renderContent();
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
