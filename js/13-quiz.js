/* js/13-quiz.js — morceau du script du site. Le build (outils/construire.mjs)
   recolle js/*.js dans l'ORDRE des noms en UN SEUL script, app.js : les
   fonctions restent visibles d'un morceau à l'autre comme avant, et le code
   « de premier niveau » s'exécute dans cet ordre. */
/* ══════════════════════════════════════════════════════════════════
   K. MODE QUIZ — révision active (répétition espacée, type Leitner)
   ──────────────────────────────────────────────────────────────────
   Tout est dérivé des données existantes (CONCEPTS / D / AI) : aucune
   redite de contenu. Le quiz vit dans un overlay plein écran (#quiz-overlay)
   séparé de renderContent/crumbs/tabs.

   Vues : 'dashboard' (accueil) · 'session' (cartes) · 'end' (score).
   Persistance : localStorage 'philo-quiz' (voir loadQuizState).
   ══════════════════════════════════════════════════════════════════ */

/* stripHtml(s) — retire les balises HTML d'une définition/idée pour
   l'afficher en texte brut sur une carte (les def contiennent du <strong>,
   <details>… qu'on ne veut pas montrer tels quels au recto/verso). */
function stripHtml(s){
  const d=document.createElement('div');
  d.innerHTML=String(s||'');
  // On ignore le contenu des <details> profonds : on ne garde que le 1er niveau lisible.
  d.querySelectorAll('details').forEach(x=>x.remove());
  return (d.textContent||'').replace(/\s+/g,' ').trim();
}

/* ── K.1 DONNÉES — buildQuizCards() ──────────────────────────────────
   Construit la liste des cartes une fois pour toutes. 4 types :
     C1 'concept-def'    : recto = terme,        verso = définition
     C2 'def-concept'    : recto = définition (terme MASQUÉ), verso = terme (bon QCM)
     C3 'cite-author'    : recto = citation,     verso = auteur — œuvre
     C3 'author-cite'    : recto = auteur — œuvre, verso = citation
     C4 'notion-authors' : recto = notion,       verso = 4 auteurs majeurs + thèse courte
   Chaque carte : {id stable, type, notion (1re), notions (toutes), recto,
   verso, qLabel, meta, pair}. L'id sert de clé de progression : il doit
   rester STABLE quand on modifie les données.

   v4 (octobre 2026) — corrections issues du diagnostic (docs/diagnostic-2026-10.md § 2.1) :
   • l'id d'une carte de citation vient du TEXTE de la citation (empreinte
     quizHash) et non plus de sa position (n° d'idée, n° de citation) : ajouter
     ou réordonner une idée ne fait plus glisser la mémoire d'une carte à une
     autre. QUIZ_LEGACY garde la table « ancien id → nouvel id » pour migrer la
     progression existante (migrateQuizState) ;
   • une même citation rangée sous plusieurs notions ne donne plus qu'UNE carte
     (son champ notions les liste toutes) ;
   • seules les citations EXACTES (entre guillemets « … ») font des cartes : une
     reformulation sans guillemets n'est pas une citation ;
   • la carte « Quel concept ? » n'existe que si le terme a pu être masqué dans
     la définition (avant : 56 % des définitions contenaient la réponse). */

/* quizHash(s) — empreinte courte et stable d'un texte (FNV-1a 32 bits, en base 36). */
function quizHash(s){
  let h=0x811c9dc5;
  for(let i=0;i<s.length;i++){ h^=s.charCodeAt(i); h=Math.imul(h,0x01000193)>>>0; }
  return h.toString(36);
}
/* quizFold(s) — texte normalisé pour comparer : minuscules, sans accents, sans
   guillemets ni ponctuation, espaces réduits. Sert à l'empreinte des citations
   (une retouche typographique ne change pas l'id) et au contrôle du masquage. */
function quizFold(s){
  return String(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'')
    .replace(/[«»“”"'’.,;:!?…()\[\]—–-]/g,' ').replace(/\s+/g,' ').trim();
}
/* quizQuoted(txt) — extrait la ou les parties CITÉES (« … » ou “ … ”) d'un
   texte de citation, sans le commentaire qui les suit. Renvoie '' s'il n'y a
   aucune citation exacte (simple reformulation) : pas de carte dans ce cas. */
function quizQuoted(txt){
  return (String(txt||'').match(/«[^»]+»|“[^”]+”/g)||[]).map(p=>p.trim()).join(' / ');
}
/* quizMaskTerm(def, term) — remplace le terme (et ses variantes : pôles d'un
   repère « A / B », mot entre parenthèses) par un blanc dans une définition
   en texte brut. Les mots de la MÊME FAMILLE sont masqués aussi, sinon ils
   trahissent la réponse (« légitimité », « illégitime » pour Légitime) :
   • un mot de 7 lettres ou plus perd sa dernière lettre et accepte toute
     terminaison (transcendant → transcendance, immanent → immanence) ;
   • un mot de 4 lettres ou plus accepte un préfixe négatif (in-, im-, il-,
     ir-) et toute terminaison (légal → illégalité) ;
   • un mot plus court n'accepte que le pluriel (« fin » ne masque pas « infini »).
   Renvoie {html, leaked} : html est échappé et prêt à afficher ; leaked=true
   si le terme reste lisible malgré tout (par ex. écrit avec d'autres accents) :
   la carte « Quel concept ? » est alors écartée, la carte inverse reste. */
function quizMaskTerm(def, term){
  const L='A-Za-zÀ-ÖØ-öø-ÿ0-9', W='a-zà-öø-ÿ';
  const variants=String(term||'').split(/\s*\/\s*|\s*[()]\s*/).map(v=>v.trim()).filter(v=>v.length>=3);
  if(!variants.includes(term)) variants.unshift(term);
  variants.sort((a,b)=>b.length-a.length);   // « en puissance » avant « puissance »
  const wordPat=w=>{
    const bare=w.replace(/\\/g,'');           // longueur sans les échappements
    if(!/[A-Za-zÀ-ÖØ-öø-ÿ]$/.test(w)) return w;   // finit par « ) » ou autre : tel quel
    if(bare.length>=7) return '(?:in|im|il|ir)?'+w.slice(0,-1)+'['+W+']*';
    if(bare.length>=4) return '(?:in|im|il|ir)?'+w+'['+W+']*';
    return w+'(?:s|x|es)?';
  };
  const reOf=v=>new RegExp('(?<!['+L+'])'+v.replace(/[.*+?^${}()|[\]\\]/g,'\\$&').split(/\s+/).map(wordPat).join('\\s+')+'(?!['+L+'])','gi');
  let out=def;
  variants.forEach(v=>{ out=out.replace(reOf(v),'\u0001'); });
  // Contrôle : le terme se lit-il encore, une fois accents et casse effacés ?
  const folded=quizFold(out);
  const leaked=variants.filter(v=>v.length>=4).some(v=>reOf(quizFold(v)).test(folded));
  const esc=out.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
  return {html:esc.replace(/\u0001/g,'<span class="quiz-mask" aria-label="mot masqué"></span>'), leaked};
}
/* quizThesis(it) — la thèse d'une idée en une phrase courte (texte brut) :
   la synthèse rédigée (it.fiche) si elle existe, sinon la 1re phrase de
   l'idée ; coupée à ~150 caractères pour que la carte reste lisible. */
function quizThesis(it){
  let s=stripHtml((it&&(it.fiche||it.i))||'');
  const m=s.match(/^(.{40,}?[.!?])(\s|$)/);
  if(m) s=m[1];
  return s.length>150?s.slice(0,149).replace(/\s+\S*$/,'')+'…':s;
}

const QUIZ_LEGACY={};   // ancien id de carte C3 (positionnel, avant v4) → nouvel id stable
function buildQuizCards(){
  const cards=[];
  // C1 + C2 : concept ↔ définition. Les DEUX sens partagent la même « paire »
  // (pair = même concept sous-jacent) ; pickSession n'en gardera qu'un par
  // session pour ne pas montrer le concept ET sa définition d'affilée.
  CONCEPTS.forEach(c=>{
    const def=stripHtml(c.def);
    if(!c.term||!def) return;
    const notions=(c.notions||[]).filter(k=>D[k]);
    const notion=notions[0];
    const pair='cpt:'+c.id, meta={cat:c.cat,conceptId:c.id};
    cards.push({id:'c1:'+c.id,type:'concept-def',notion,notions,recto:c.term,verso:def,
      qLabel:'Définis ce concept',meta,pair});
    const masked=quizMaskTerm(def,c.term);   // la question ne doit pas contenir la réponse
    if(!masked.leaked) cards.push({id:'c2:'+c.id,type:'def-concept',notion,notions,recto:masked.html,verso:c.term,
      qLabel:'Quel concept ?',meta,pair});
  });
  // C3 : citation ↔ auteur (LES DEUX sens) depuis AI[name].entries[k].ideas[].citations[].
  // Les deux sens d'une même citation partagent la même « paire » (base) :
  // une seule direction par session (cf. retour « les cartes se répètent »).
  const byBase={};
  Object.keys(AI).forEach(name=>{
    const ent=AI[name].entries;
    Object.keys(ent).forEach(k=>{
      (ent[k].ideas||[]).forEach((idea,ii)=>{
        const work=idea.w||'';
        const who=name+(work?' — '+work:'');
        (idea.citations||[]).forEach((cit,ci)=>{
          const oldBase='c3:'+name+':'+k+':'+ii+':'+ci;   // id d'avant v4 (position)
          const txt=quizQuoted(stripHtml(cit));
          if(!txt) return;                                // reformulation : pas une citation exacte
          const base='c3:'+name+':'+quizHash(quizFold(txt));
          QUIZ_LEGACY[oldBase+':a']=base+':a'; QUIZ_LEGACY[oldBase+':b']=base+':b';
          if(byBase[base]){                               // même citation sous une autre notion
            byBase[base].forEach(c=>{ if(!c.notions.includes(k)) c.notions.push(k); });
            return;
          }
          const meta={author:name,work};
          const a={id:base+':a',type:'cite-author',notion:k,notions:[k],recto:txt,verso:who,
            qLabel:'Qui a dit cela ?',meta,pair:base};
          const b={id:base+':b',type:'author-cite',notion:k,notions:[k],recto:who,verso:txt,
            qLabel:'Cite une de ses formules',meta,pair:base};
          byBase[base]=[a,b]; cards.push(a,b);
        });
      });
    });
  });
  // C4 : notion → auteurs majeurs et leur thèse (auto-évaluation). Avant v4 :
  // 5 auteurs avec leur idée ENTIÈRE, une réponse de 900 px sur téléphone.
  // Désormais 4 auteurs au plus, dans l'ordre des cartes de la notion
  // (compareAuthors), avec une thèse courte (quizThesis).
  KEYS.forEach(k=>{
    const names=[];
    (D[k].auteurs||[]).forEach(a=>{ if(!names.includes(a.n)) names.push(a.n); });
    names.sort(compareAuthors);
    const auts=names.slice(0,4).map(n=>{
      const idea=((AI[n]&&AI[n].entries[k]&&AI[n].entries[k].ideas)||[])[0]||{};
      const th=quizThesis(idea);
      return '<b>'+n+'</b>'+(idea.w?' ('+idea.w+')':'')+(th?' : '+th:'');
    });
    if(auts.length) cards.push({id:'c4:'+k,type:'notion-authors',notion:k,notions:[k],
      recto:D[k].l+(D[k].s?' — '+D[k].s:''),verso:auts.join('<br><br>'),
      qLabel:'Auteurs majeurs et leur thèse',meta:{},pair:'c4:'+k});
  });
  return cards;
}
const QUIZ_CARDS=buildQuizCards();
// Index id→carte pour retrouver une carte par sa clé de progression.
const QUIZ_BY_ID={}; QUIZ_CARDS.forEach(c=>QUIZ_BY_ID[c.id]=c);

/* ── K.2 MOTEUR LEITNER — double horizon ─────────────────────────────
   2 horizons indépendants, chacun conservant SA progression :
     sprint (≈2 sem) : intervalles [0,1,2,4,7] jours pour boîtes 1→5
     long   (≈2 mois): intervalles [0,2,5,14,30] jours
   Une carte « due » = jours depuis lastSeen ≥ intervalle de sa boîte.
   « Maîtrisé » = boîte ≥ 4. */
const QUIZ_INTERVALS={sprint:[0,1,2,4,7],long:[0,2,5,14,30]};
const QUIZ_SESSION_N=15;      // taille de session par défaut
const QUIZ_DEFAULT_GOAL=20;   // objectif quotidien par défaut (v3 le rendra réglable)
const DAY_MS=86400000;

// État runtime de l'overlay. La SESSION en cours est aussi sauvegardée dans
// localStorage (philo-quiz.active) pour survivre à un refresh ; ici on garde
// en plus l'objet carte reconstruit + l'état d'affichage (révélé, QCM…).
// Filtres MULTIPLES : deux ensembles (notions, types) + drapeau « ratés ».
let quizState={view:'dashboard',horizon:'sprint',mode:'cards',
  notionFilters:new Set(),typeFilters:new Set(),wrongOnly:false,
  session:null,idx:0,results:null,revealed:false,
  qcmData:null,qcmAnswered:false,qcmChosen:null,confirmNew:false};

/* migrateQuizState(s) — v4 : remplace les anciens ids de cartes de citation
   (positionnels) par les ids stables (table QUIZ_LEGACY) dans la progression
   des deux rythmes, dans la session en cours et dans ses ratés. Si deux
   anciens ids mènent à la même carte (citation rangée sous deux notions), on
   garde la révision la plus récente. Idempotent (marqueur s.idv=2) ; appelé à
   chaque lecture (loadQuizState) et sur le bloc distant avant une fusion
   (mergeQuiz), pour qu'un état venu d'une ancienne version soit converti aussi.
   Modifie s et le renvoie. */
function migrateQuizState(s){
  if(!s || s.idv===2) return s;
  const mapId=id=>QUIZ_LEGACY[id]||id;
  if(s.byHorizon) ['sprint','long'].forEach(h=>{
    const src=s.byHorizon[h]||{}, out={};
    Object.keys(src).forEach(id=>{
      const nid=mapId(id), p=src[id], cur=out[nid];
      if(!cur || ((p&&p.lastSeen)||0)>(cur.lastSeen||0)) out[nid]=p;
    });
    s.byHorizon[h]=out;
  });
  if(s.active && Array.isArray(s.active.ids)){
    s.active.ids=s.active.ids.map(mapId);
    const r=s.active.results;
    if(r && Array.isArray(r.wrongIds)) r.wrongIds=r.wrongIds.map(mapId);
  }
  s.idv=2;
  return s;
}

/* loadQuizState() — lit/garantit la structure persistée 'philo-quiz'.
   Champs : byHorizon (progression Leitner par horizon), daily (objectif+streak),
   gamif (XP + niveau, transversal aux horizons), prefs (ne plus avertir),
   active (session en cours sérialisée : ids + position).
   v4 — champs de synchro : activeAt (date de la dernière écriture de
   « active », pour savoir quelle session garder à la fusion), resetAt
   (date de remise à zéro de chaque rythme) et epoch (date de la dernière
   remise à zéro TOTALE) : à la fusion de deux appareils, toute révision plus
   ancienne qu'une remise à zéro est oubliée, au lieu de ressusciter.
   Chaque appel relit et décode le stockage : les fonctions de lecture
   (isDue, pickSession, quizStats…) reçoivent donc l'état en paramètre au lieu
   de le relire carte par carte (864 décodages par affichage avant v4). */
function loadQuizState(){
  let s={};
  try{ s=JSON.parse(localStorage.getItem('philo-quiz')||'{}'); }catch(e){ s={}; }
  if(!s.byHorizon) s.byHorizon={};
  if(!s.byHorizon.sprint) s.byHorizon.sprint={};
  if(!s.byHorizon.long) s.byHorizon.long={};
  if(!s.horizon) s.horizon='sprint';
  if(!s.daily) s.daily={date:'',count:0,goal:QUIZ_DEFAULT_GOAL,streak:0,lastDate:''};
  if(!s.gamif) s.gamif={xp:0,level:1};                 // gamification (v3)
  if(!s.prefs) s.prefs={dontWarnNewSession:false};     // préférences
  if(s.active===undefined) s.active=null;              // session reprenable
  if(!s.activeAt) s.activeAt=0;                        // v4 : date d'écriture de « active »
  if(!s.resetAt) s.resetAt={sprint:0,long:0};          // v4 : remise à zéro d'un rythme
  if(!s.epoch) s.epoch=0;                              // v4 : remise à zéro totale
  return migrateQuizState(s);                          // v4 : anciens ids de cartes → ids stables
}
function saveQuizState(s){ localStorage.setItem('philo-quiz',JSON.stringify(s)); syncOnQuizChange(); }   // new (Phase 2) : reporte la progression vers le compte si connecté
/* todayStr() — date LOCALE du jour (AAAA-MM-JJ). Avant v4 : toISOString(),
   c'est-à-dire la date en temps universel ; en France, le « jour » changeait
   donc à 1 h ou 2 h du matin (objectif du jour et série faussés). */
function todayStr(){
  const d=new Date();
  return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
}

/* ── Gamification : XP → niveau (100 XP par niveau). ──────────────── */
function quizLevel(xp){ return Math.floor((xp||0)/100)+1; }      // niveau courant
function quizXpInLevel(xp){ return (xp||0)%100; }                // XP dans le niveau (0..99)

/* quizSessionActive() — true s'il reste des cartes à jouer dans la session. */
function quizSessionActive(){
  return !!(quizState.session && quizState.idx < quizState.session.length);
}
/* persistActive() — sérialise (ou efface) la session en cours dans localStorage,
   pour pouvoir la REPRENDRE après un refresh / une réouverture de l'overlay.
   activeAt date l'écriture (v4) : à la fusion de deux appareils, c'est la
   session écrite en dernier qui gagne, y compris une session TERMINÉE (null). */
function persistActive(){
  const st=loadQuizState();
  st.active=quizSessionActive()
    ? {ids:quizState.session.map(c=>c.id),idx:quizState.idx,mode:quizState.mode,
       horizon:quizState.horizon,results:quizState.results}
    : null;
  st.activeAt=Date.now();
  saveQuizState(st);
}

/* isDue(card, horizon, st) — true si la carte (déjà vue) est à réviser
   aujourd'hui. Une carte jamais vue n'est pas « due » ici : pickSession
   l'ajoute via le quota de nouvelles cartes. st = état déjà lu (v4 : évite de
   relire le stockage pour chaque carte) ; relu s'il est absent. */
function isDue(card,horizon,st){
  st=st||loadQuizState();
  const p=st.byHorizon[horizon][card.id];
  if(!p) return false;
  const box=Math.min(Math.max(p.box||1,1),5);
  const days=(Date.now()-(p.lastSeen||0))/DAY_MS;
  return days>=QUIZ_INTERVALS[horizon][box-1];
}

/* onAnswer(id, ok) — enregistre une réponse : succès → boîte+1 (max 5),
   échec → boîte 1 ; met à jour lastSeen/seen/correct + compteur quotidien +
   XP/niveau (gamification). RENVOIE {gain, promoted, newlyMastered, box,
   leveledUp} pour que l'écran de fin montre la progression de la session. */
function onAnswer(id,ok){
  const st=loadQuizState();
  const h=quizState.horizon;
  const p=st.byHorizon[h][id]||{box:1,lastSeen:0,seen:0,correct:0};
  const oldBox=p.box||1;
  p.box=ok?Math.min(oldBox+1,5):1;
  p.lastSeen=Date.now();
  p.seen=(p.seen||0)+1;
  if(ok) p.correct=(p.correct||0)+1;
  st.byHorizon[h][id]=p;
  // ── XP : 10 pour une bonne réponse (1 pour l'effort sinon), + bonus de
  //    promotion de boîte (+5), + bonus de 1re maîtrise (+25) et de boîte 5 (+25).
  const promoted=ok&&p.box>oldBox;
  const newlyMastered=ok&&oldBox<4&&p.box>=4;
  const newlyBox5=ok&&oldBox<5&&p.box===5;
  let gain=ok?10:1;
  if(promoted) gain+=5;
  if(newlyMastered) gain+=25;
  if(newlyBox5) gain+=25;
  const lvlBefore=quizLevel(st.gamif.xp);
  st.gamif.xp=(st.gamif.xp||0)+gain;
  st.gamif.level=quizLevel(st.gamif.xp);
  const leveledUp=st.gamif.level>lvlBefore;
  // ── Compteur quotidien + streak (réinitialisé chaque jour).
  const t=todayStr();
  if(st.daily.date!==t){
    // Nouveau jour : streak +1 si le dernier jour actif était hier, sinon reset à 1.
    const wasYesterday=st.daily.date && (new Date(t)-new Date(st.daily.date))<=DAY_MS*1.5;
    st.daily.streak=wasYesterday?(st.daily.streak||0)+1:1;
    st.daily.date=t; st.daily.count=0;
  }
  st.daily.count=(st.daily.count||0)+1;
  saveQuizState(st);
  return {gain,promoted,newlyMastered,box:p.box,leveledUp};
}

/* cardsForFilter() — applique les filtres MULTIPLES du dashboard.
   Logique : OU à l'intérieur d'une catégorie (plusieurs notions = l'une OU
   l'autre), ET entre catégories (notion(s) ET type(s) ET « ratés »).
   Ensembles vides = pas de restriction sur cette catégorie.
   Une carte appartient à TOUTES ses notions (c.notions, v4) : un concept ou
   une citation rangés sous deux notions répondent aux deux filtres.
   st = état déjà lu (relu s'il est absent). */
function cardsForFilter(st){
  st=st||loadQuizState(); const h=quizState.horizon;
  const nf=quizState.notionFilters, tf=quizState.typeFilters;
  return QUIZ_CARDS.filter(c=>{
    if(nf.size && !(c.notions||[c.notion]).some(k=>nf.has(k))) return false;
    if(tf.size && !tf.has(c.type)) return false;
    if(quizState.wrongOnly){ const p=st.byHorizon[h][c.id]; if(!(p&&p.box<=1&&p.seen>0)) return false; }
    return true;
  });
}
/* Helpers de bascule des filtres (un clic = ajout/retrait). */
function clearQuizFilters(){ quizState.notionFilters.clear(); quizState.typeFilters.clear(); quizState.wrongOnly=false; renderQuiz(); }
function toggleQuizWrong(){ quizState.wrongOnly=!quizState.wrongOnly; renderQuiz(); }
function toggleNotionFilter(k){ const s=quizState.notionFilters; s.has(k)?s.delete(k):s.add(k); renderQuiz(); }
function toggleTypeFilter(t){ const s=quizState.typeFilters; s.has(t)?s.delete(t):s.add(t); renderQuiz(); }
function quizFiltersEmpty(){ return quizState.notionFilters.size===0 && quizState.typeFilters.size===0 && !quizState.wrongOnly; }

/* pickSession(n, st) — construit une session de n cartes :
   1) les cartes DUES, triées par boîte ascendante (priorité aux fragiles),
      au hasard à boîte égale ;
   2) complétées par des cartes JAMAIS VUES, TIRÉES AU HASARD dans tout le
      filtre (v4). Avant, elles venaient dans l'ordre du fichier : chaque
      nouvelle session reprenait les 15 mêmes concepts, et il fallait une
      quinzaine de sessions avant de voir une citation. Le tirage au hasard
      mélange d'office les notions et les types, au prorata de leur nombre ;
   en ne gardant qu'UNE carte par « paire » (pair) : on évite ainsi de voir
   les deux sens d'un même concept/citation dans la même session (retour
   « les cartes se répètent »). La 1re rencontrée gagne = la plus prioritaire
   (boîte la plus basse, due avant fraîche). Léger mélange final.
   st = état déjà lu (relu s'il est absent). */
function pickSession(n,st){
  n=n||QUIZ_SESSION_N;
  st=st||loadQuizState(); const h=quizState.horizon, prog=st.byHorizon[h];
  const pool=cardsForFilter(st);
  const shuffle=a=>{ for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; };
  // sort() est stable : mélanger AVANT de trier laisse le hasard départager une même boîte.
  const due=shuffle(pool.filter(c=>isDue(c,h,st)))
    .sort((a,b)=>((prog[a.id].box||1)-(prog[b.id].box||1)));
  const fresh=shuffle(pool.filter(c=>!prog[c.id]));
  // Dédup DOUBLE pour ne jamais montrer deux fois « la même carte » dans une
  // session (retours BOX 14 puis BOX 33) :
  //   1. par PAIRE  → écarte le sens inverse d'un même item (recto/verso) ;
  //   2. par CONTENU → écarte une carte dont la QUESTION (type + recto) est
  //      déjà présente sous une AUTRE paire. Indispensable : une même citation
  //      rangée sous plusieurs notions (ex. Descartes « maîtres et possesseurs
  //      de la nature » en nature ET technique), ou deux fiches concept de même
  //      terme, produisent des cartes au contenu identique mais de paires
  //      différentes — que la seule dédup par paire laissait passer.
  const norm=s=>(s||'').replace(/\s+/g,' ').trim().toLowerCase();
  // En mode QCM, seules certaines directions donnent un vrai QCM (déf→concept,
  // citation→auteur). Sans ce correctif, la dédup par paire gardait la direction
  // « retournement » (concept→déf) et le QCM n'apparaissait JAMAIS. On PRÉFÈRE
  // donc la variante éligible AU SEIN d'une paire (même item, même priorité de
  // révision : on échange juste le SENS), par remplacement de l'entrée déjà prise.
  const qcm=quizState.mode==='qcm';
  const QCM_OK=c=>c.type==='def-concept'||c.type==='cite-author';
  const seenPairs={}, seenContent={}, pick=[];
  due.concat(fresh).forEach(c=>{
    const pkey=c.pair||c.id;
    const ckey=c.type+'|'+norm(c.recto);
    if(pkey in seenPairs){
      // Paire déjà retenue : en QCM, si cette variante est éligible et que celle
      // gardée ne l'est pas, on échange (la carte devient un QCM, sans changer
      // l'item ni sa place dans la file).
      if(qcm && QCM_OK(c)){
        const idx=seenPairs[pkey], old=pick[idx];
        if(old && !QCM_OK(old) && !seenContent[ckey]){
          delete seenContent[old.type+'|'+norm(old.recto)];
          pick[idx]=c; seenContent[ckey]=1;
        }
      }
      return;
    }
    if(pick.length>=n) return;
    if(seenContent[ckey]) return;
    seenPairs[pkey]=pick.length; seenContent[ckey]=1; pick.push(c);
  });
  // Léger mélange (Fisher-Yates partiel).
  for(let i=pick.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[pick[i],pick[j]]=[pick[j],pick[i]];}
  return pick;
}

/* quizStats(st) — % de maîtrise (boîte≥4) sur le filtre courant + comptes.
   sessionN = taille RÉELLE de la prochaine session (après dédoublonnage des
   paires), et non plus due+fresh plafonné, qui annonçait parfois plus de
   cartes qu'il n'en venait. st = état déjà lu (relu s'il est absent). */
function quizStats(st){
  st=st||loadQuizState(); const h=quizState.horizon;
  const pool=cardsForFilter(st);
  let mastered=0,seen=0;
  pool.forEach(c=>{const p=st.byHorizon[h][c.id];if(p){seen++;if(p.box>=4)mastered++;}});
  const due=pool.filter(c=>isDue(c,h,st)).length;
  const fresh=pool.filter(c=>!st.byHorizon[h][c.id]).length;
  const pct=pool.length?Math.round(mastered/pool.length*100):0;
  return {total:pool.length,mastered,seen,due,fresh,pct,
    sessionN:pickSession(QUIZ_SESSION_N,st).length};
}

/* ── K.3 OUVERTURE / FERMETURE ───────────────────────────────────── */
/* syncRuntimeQuizFromStorage(opts) — aligne l'état RUNTIME du quiz (quizState)
   sur ce qui est en localStorage : horizon courant + RECONSTRUCTION de la
   session en cours (« active »).
   Indispensable après une ADOPTION distante (un autre appareil a poussé sa
   progression) : sans cela, la session reprise et le bon horizon n'apparaissent
   qu'après avoir refermé puis rouvert l'overlay (seul openQuiz reconstruisait).
   opts.keepLive : ne casse PAS une session déjà en cours de lecture sur CET
   appareil (on n'interrompt pas le joueur). */
function syncRuntimeQuizFromStorage(opts){
  opts=opts||{};
  if(opts.keepLive && quizSessionActive()) return;   // une partie est jouée ici : on n'y touche pas
  const st=loadQuizState();
  quizState.horizon=st.horizon||'sprint';
  const a=st.active;
  if(a && a.ids && a.idx<a.ids.length){
    // Session reprenable (la nôtre après refresh, ou celle d'un autre appareil).
    quizState.session=a.ids.map(id=>QUIZ_BY_ID[id]).filter(Boolean);
    quizState.idx=Math.min(a.idx,quizState.session.length);
    quizState.mode=a.mode||quizState.mode;
    quizState.horizon=a.horizon||quizState.horizon;
    quizState.results=a.results||{ok:0,ko:0,wrongIds:[],xp:0,promoted:0,mastered:0,leveledUp:false};
  } else {
    // Plus rien à reprendre (session terminée / effacée ailleurs) : on nettoie
    // le runtime pour ne pas afficher un « Reprendre » fantôme.
    quizState.session=null; quizState.idx=0;
  }
}
/* openQuiz() — ouvre l'overlay sur le dashboard. Si une session était en
   cours (sauvegardée dans philo-quiz.active), elle est RECONSTRUITE pour
   pouvoir être reprise — y compris après un refresh de la page. */
function openQuiz(){
  quizState.confirmNew=false;
  syncRuntimeQuizFromStorage();   // horizon + reconstruction de la session en cours
  quizState.view='dashboard';
  document.getElementById('quiz-overlay').classList.add('open');
  renderQuiz();
}
function closeQuiz(){ document.getElementById('quiz-overlay').classList.remove('open'); }

/* ── K.4 RENDU (dispatch par vue) ─────────────────────────────────── */
function renderQuiz(){
  const b=document.getElementById('quiz-body');
  if(quizState.view==='session') b.innerHTML=renderQuizSession();
  else if(quizState.view==='end') b.innerHTML=renderQuizEnd();
  else b.innerHTML=renderQuizDashboard();
}

/* renderQuizDashboard() — accueil : niveau/XP (gamification v3), maîtrise
   globale, horizon, format (Cartes/QCM), filtres MULTI-SÉLECTION, lancement
   (reprise OU nouvelle session avec avertissement), objectif du jour (v3),
   barres de maîtrise par notion (v2) et badges (v3). */
function renderQuizDashboard(){
  const st=loadQuizState();   // lu UNE fois, puis transmis (v4)
  const s=quizStats(st);
  const nf=quizState.notionFilters, tf=quizState.typeFilters;   // filtres actifs (Sets)
  // Filtres multi-sélection : un bouton est « active » s'il est dans l'ensemble.
  const notionBtns=KEYS.map(k=>`<button class="${nf.has(k)?'active':''}" onclick="toggleNotionFilter('${k}')">${D[k].l}</button>`).join('');
  const typeLabels={'concept-def':'Concept→déf','def-concept':'Déf→concept','cite-author':'Citation→auteur','author-cite':'Auteur→citation','notion-authors':'Notion→auteurs'};
  const typeBtns=Object.keys(typeLabels).map(t=>`<button class="${tf.has(t)?'active':''}" onclick="toggleTypeFilter('${t}')">${typeLabels[t]}</button>`).join('');
  // v3 — gamification : niveau courant + XP dans le niveau (0..99).
  const xp=st.gamif.xp||0, lvl=quizLevel(xp), inLvl=quizXpInLevel(xp);
  // v3 — objectif quotidien (réglable) + barre de progression du jour.
  const goal=st.daily.goal||QUIZ_DEFAULT_GOAL;
  const dayCount=st.daily.date===todayStr()?(st.daily.count||0):0;
  const dayPct=Math.min(100,Math.round(dayCount/goal*100));
  // v2 — barres de maîtrise par notion (triées décroissant).
  const nm=notionMastery(st).sort((a,b)=>b.pct-a.pct);
  const nmHtml=nm.map(x=>`<div class="quiz-ns-row">
      <span class="quiz-ns-name">${D[x.k].l}</span>
      <span class="quiz-ns-bar"><span class="quiz-ns-fill" style="width:${x.pct}%;background:${D[x.k].c}"></span></span>
      <span class="quiz-ns-pct">${x.pct}%</span>
    </div>`).join('');
  // v3 — badges (1 par notion ; acquis à 80 % de cartes mémorisées depuis v4).
  const badges=quizBadges(st);
  const earned=badges.filter(b=>b.earned);
  const badgesHtml=(earned.length?earned:badges).slice(0,12).map(b=>`<span class="quiz-badge${b.earned?' earned':''}">${b.earned?'🏅':'🔒'} ${b.label}</span>`).join('');
  // Bloc de lancement adaptatif : avertissement, ou reprise + nouvelle, ou simple lancement.
  const canResume=quizSessionActive();
  const launchHtml = quizState.confirmNew
    ? renderNewSessionWarning()
    : (canResume
       ? `<button class="quiz-start" onclick="resumeQuizSession()">▶ Reprendre la session (${quizState.idx+1}/${quizState.session.length})</button>
          <button class="quiz-start quiz-start-alt" onclick="requestNewSession()">🆕 Nouvelle session${s.sessionN<1?'':' ('+s.sessionN+' cartes)'}</button>`
       : `<button class="quiz-start" ${s.sessionN<1?'disabled':''} onclick="requestNewSession()">
            ${s.sessionN<1?'Rien à réviser ici 🎉':'Session du jour ('+s.sessionN+' cartes)'}
          </button>`);
  return `
  <div class="quiz-top">
    <div class="quiz-title">🎯 Réviser</div>
    <button class="quiz-close" onclick="closeQuiz()" aria-label="Fermer">×</button>
  </div>
  <div class="quiz-level">
    <div class="quiz-level-top">
      <span class="quiz-level-badge">⭐ Niveau ${lvl}</span>
      <span class="quiz-level-xp">${xp} XP · ${inLvl}/100 vers le niveau ${lvl+1}</span>
    </div>
    <div class="quiz-level-bar"><div class="quiz-level-fill" style="width:${inLvl}%"></div></div>
  </div>
  <div class="quiz-mastery">
    <div class="quiz-mastery-pct">${s.pct}%</div>
    <div class="quiz-mastery-lbl">mémorisé (${s.mastered}/${s.total} cartes bien ancrées)</div>
    <div class="quiz-bar"><div class="quiz-bar-fill" style="width:${s.pct}%"></div></div>
  </div>
  <details class="quiz-help"><summary>❓ Comment fonctionne la révision&nbsp;?</summary>
    <div class="quiz-help-body">
      <p>Chaque carte gravit <b>5 paliers de mémorisation</b>. Quand tu réponds «&nbsp;je savais&nbsp;», la carte <b>monte d'un palier</b> et reviendra <b>moins souvent</b>&nbsp;; si tu te trompes, elle <b>redescend au palier&nbsp;1</b> et revient vite. C'est la <b>répétition espacée</b>&nbsp;: on revoit surtout ce qu'on maîtrise mal, et de plus en plus rarement ce qu'on connaît.</p>
      <p>Une carte est comptée comme <b>mémorisée</b> à partir du palier&nbsp;4. Le pourcentage en haut = la part de tes cartes aux paliers&nbsp;4-5.</p>
      <p>Deux rythmes au choix&nbsp;: <b>⚡ Sprint</b> (révisions resserrées sur ≈2&nbsp;semaines, avant un contrôle) et <b>📅 Long terme</b> (espacées sur ≈2&nbsp;mois, pour ancrer durablement). Chaque rythme garde sa propre progression.</p>
    </div>
  </details>
  <div>
    <div class="quiz-section-lbl">Horizon de révision</div>
    <div class="quiz-horizon">
      <button class="${quizState.horizon==='sprint'?'active':''}" onclick="setQuizHorizon('sprint')">⚡ Sprint <span style="opacity:.7">(≈2 sem.)</span></button>
      <button class="${quizState.horizon==='long'?'active':''}" onclick="setQuizHorizon('long')">📅 Long terme <span style="opacity:.7">(≈2 mois)</span></button>
    </div>
  </div>
  <div>
    <div class="quiz-section-lbl">Format</div>
    <div class="quiz-mode-toggle quiz-horizon">
      <button class="${quizState.mode==='cards'?'active':''}" onclick="setQuizMode('cards')">🃏 Cartes</button>
      <button class="${quizState.mode==='qcm'?'active':''}" onclick="setQuizMode('qcm')">📝 QCM</button>
    </div>
    ${quizState.mode==='qcm'?`<div class="quiz-meta-lbl" style="margin-top:5px">En QCM, la session privilégie les cartes à choix (Définition→concept, Citation→auteur) ; les rares autres restent à retourner.</div>`:''}
  </div>
  <div>
    <div class="quiz-section-lbl">Filtrer ${quizFiltersEmpty()?'':`<button class="quiz-reset" style="float:right;margin:0" onclick="clearQuizFilters()">tout effacer</button>`}</div>
    <div class="quiz-filters">
      <button class="${quizState.wrongOnly?'active':''}" onclick="toggleQuizWrong()">Mes ratés</button>
      ${notionBtns}${typeBtns}
    </div>
  </div>
  ${launchHtml}
  <div>
    <div class="quiz-goal-row">
      <div class="quiz-section-lbl">Objectif du jour</div>
      <div class="quiz-goal-pick">
        ${[10,20,50].map(n=>`<button class="${goal===n?'active':''}" onclick="setQuizGoal(${n})">${n}</button>`).join('')}
      </div>
    </div>
    <div class="quiz-day-bar"><div class="quiz-day-fill" style="width:${dayPct}%"></div></div>
    <div class="quiz-meta-lbl" style="text-align:center;margin-top:5px">${dayCount}/${goal} cartes aujourd'hui · 🔥 ${st.daily.streak||0} j d'affilée</div>
  </div>
  <div class="quiz-meta-row">
    <div><div class="quiz-meta-num">${s.due}</div><div class="quiz-meta-lbl">à revoir</div></div>
    <div><div class="quiz-meta-num">${s.fresh}</div><div class="quiz-meta-lbl">nouvelles</div></div>
    <div><div class="quiz-meta-num">${s.seen}</div><div class="quiz-meta-lbl">déjà vues</div></div>
  </div>
  <details><summary class="quiz-section-lbl" style="cursor:pointer">Maîtrise par notion</summary>
    <div class="quiz-notion-stats" style="margin-top:8px">${nmHtml||'<div class="quiz-meta-lbl">Pas encore de données.</div>'}</div>
  </details>
  <details><summary class="quiz-section-lbl" style="cursor:pointer">Badges (${earned.length}/${badges.length})</summary>
    <div class="quiz-badges" style="margin-top:8px">${badgesHtml}</div>
  </details>
  <details class="quiz-help"><summary>💾 Ma progression est-elle sauvegardée&nbsp;?</summary>
    <div class="quiz-help-body">
      ${authUser ? `
      <p><b>Oui — et surtout, elle te suit d'un appareil à l'autre&nbsp;!</b> Tu es connecté&nbsp;: ta progression complète (niveau, cartes, série, objectif <b>et même la session en cours</b>) est enregistrée <b>sur ton compte</b> à chaque réponse.</p>
      <p>📱➡️💻 C'est tout l'intérêt du compte&nbsp;: commence à réviser sur ton <b>téléphone</b> dans le bus, reprends <b>exactement où tu en étais</b> sur l'<b>ordinateur</b> à la maison — il suffit d'être connecté avec le même compte. Une copie reste aussi sur cet appareil, donc <b>même hors-ligne tout fonctionne</b>&nbsp;: la synchro se fait dès le retour en ligne, et c'est <b>la version la plus récente qui gagne</b>.</p>
      <p>👉 Pareil pour tes <b>brouillons de proposition</b> et tes <b>réglages</b> (mode, objectif)&nbsp;: ils voyagent avec ton compte.</p>
      ` : `
      <p><b>Oui — mais pour l'instant sur cet appareil uniquement</b> (ce navigateur). Elle est enregistrée <b>à chaque réponse</b> et survit si tu actualises la page, fermes l'onglet ou éteins l'appareil.</p>
      <p>📱➡️💻 <b>Pour la retrouver sur TOUS tes appareils</b> — réviser sur le téléphone puis continuer sur l'ordinateur, sans rien reperdre — il n'y a qu'une chose à faire&nbsp;: <b>crée un compte ou connecte-toi</b> (boutons en bas de la barre latérale). Ta progression complète (cartes, série, session en cours), tes brouillons et tes réglages sont alors <b>sauvegardés en ligne et synchronisés partout</b>. Bonne nouvelle&nbsp;: ta progression actuelle sera <b>fusionnée</b> avec ton compte — rien n'est perdu.</p>
      <p>⚠️ Sans compte, tu perdrais ta progression en cas d'effacement des données de navigation, de <b>navigation privée</b>, ou de changement de navigateur/appareil.</p>
      `}
    </div>
  </details>
  <button class="quiz-reset" onclick="resetQuizHorizon()">Réinitialiser le rythme «&nbsp;${quizState.horizon==='sprint'?'Sprint':'Long terme'}&nbsp;»</button>
  <button class="quiz-reset" onclick="resetAllQuiz()">Tout réinitialiser (niveau, XP &amp; les 2 rythmes)</button>
  `;
}

/* setQuizHorizon(h) — change l'horizon courant et le persiste. */
function setQuizHorizon(h){
  quizState.horizon=h;
  const st=loadQuizState(); st.horizon=h; saveQuizState(st);
  renderQuiz();
}
/* resetQuizHorizon() — efface la progression de CARTES de l'horizon courant
   uniquement (l'autre rythme, le niveau et les XP sont conservés). Si une
   session de ce rythme est en cours, on l'abandonne (devenue incohérente).
   v4 : la date de remise à zéro (resetAt) est gardée, pour que la fusion avec
   un autre appareil oublie les révisions antérieures au lieu de les ramener. */
function resetQuizHorizon(){
  const lbl=quizState.horizon==='sprint'?'Sprint':'Long terme';
  if(!confirm('Réinitialiser la progression des cartes du rythme « '+lbl+' » ?\n(Ton niveau, tes XP et l\'autre rythme sont conservés.)')) return;
  const st=loadQuizState();
  st.byHorizon[quizState.horizon]={};
  st.resetAt[quizState.horizon]=Date.now();
  if(quizState.horizon===(st.active&&st.active.horizon)){ st.active=null; st.activeAt=Date.now(); }   // session de ce rythme invalidée
  saveQuizState(st);
  quizState.session=null; quizState.idx=0; quizState.results=null;
  quizState.view='dashboard';                                             // jamais rester sur une session vidée
  renderQuiz();
}
/* resetAllQuiz() — remet TOUT à zéro : cartes des DEUX rythmes, niveau, XP,
   série, objectif et session en cours. Action irréversible.
   v4 : au lieu d'effacer simplement la clé 'philo-quiz', on écrit un état
   VIERGE daté (epoch = maintenant). La synchro fusionne désormais carte par
   carte : sans cette date, la progression d'un autre appareil reviendrait à
   la prochaine fusion ; avec elle, tout ce qui précède est oublié partout.
   saveQuizState() propage aussi la remise à zéro au compte. */
function resetAllQuiz(){
  if(!confirm('Tout réinitialiser ?\nCela efface ta progression sur les DEUX rythmes, ton niveau, tes XP, ta série et tes objectifs. Action irréversible.')) return;
  localStorage.removeItem('philo-quiz');                 // loadQuizState() recréera les valeurs par défaut
  const now=Date.now(), st=loadQuizState();
  st.epoch=now; st.resetAt={sprint:now,long:now}; st.activeAt=now;
  saveQuizState(st);                                     // écrit l'état vierge daté + synchro
  quizState.session=null; quizState.idx=0; quizState.results=null; quizState.confirmNew=false;
  quizState.notionFilters.clear(); quizState.typeFilters.clear(); quizState.wrongOnly=false;
  quizState.horizon='sprint'; quizState.mode='cards'; quizState.revealed=false;
  quizState.view='dashboard';
  renderQuiz();
}

/* renderNewSessionWarning() — panneau d'avertissement avant d'écraser une
   session en cours par une nouvelle. La progression Leitner déjà enregistrée
   (carte par carte) est conservée ; seul le SCORE de la session est perdu.
   Case « ne plus afficher » → mémorisée dans prefs.dontWarnNewSession. */
function renderNewSessionWarning(){
  return `<div class="quiz-warn">
    <div class="quiz-warn-txt">⚠️ Une session est en cours. En démarrer une nouvelle l'abandonnera. Rassure-toi : ta progression déjà enregistrée (carte par carte) est conservée — seul le score de cette session-ci sera remis à zéro.</div>
    <label class="quiz-warn-check"><input type="checkbox" id="quiz-dontwarn"> Ne plus afficher cet avertissement</label>
    <div class="quiz-warn-btns">
      <button class="quiz-no" onclick="cancelNewSession()">Annuler</button>
      <button class="quiz-yes" onclick="confirmNewSession()">Nouvelle session</button>
    </div>
  </div>`;
}

/* beginSession() — tire une nouvelle session et bascule en vue 'session'.
   Cœur du démarrage : appelé directement (pas de session en cours) ou après
   confirmation de l'avertissement. Initialise le récap (XP, progressions…)
   et persiste la session pour qu'elle survive à un refresh. */
function beginSession(){
  const sess=pickSession();
  if(!sess.length) return;
  quizState.session=sess; quizState.idx=0; quizState.revealed=false;
  quizState.results={ok:0,ko:0,wrongIds:[],xp:0,promoted:0,mastered:0,leveledUp:false};
  quizState.confirmNew=false;
  quizState.view='session';
  persistActive();        // sauvegarde la session (reprenable après refresh)
  prepareCard();          // pré-calcule le QCM de la 1re carte si besoin
  renderQuiz();
}

/* requestNewSession() — demande de nouvelle session. Si une session est en
   cours ET que l'avertissement n'est pas désactivé, on affiche d'abord le
   panneau de confirmation ; sinon on démarre directement. */
function requestNewSession(){
  const st=loadQuizState();
  if(quizSessionActive() && !st.prefs.dontWarnNewSession){
    quizState.confirmNew=true; renderQuiz(); return;
  }
  beginSession();
}

/* confirmNewSession() — confirme l'abandon : mémorise éventuellement
   « ne plus afficher » (case cochée), puis démarre la nouvelle session. */
function confirmNewSession(){
  const cb=document.getElementById('quiz-dontwarn');
  if(cb&&cb.checked){ const st=loadQuizState(); st.prefs.dontWarnNewSession=true; saveQuizState(st); }
  beginSession();
}

/* cancelNewSession() — referme le panneau d'avertissement (retour dashboard). */
function cancelNewSession(){ quizState.confirmNew=false; renderQuiz(); }

/* resumeQuizSession() — reprend la session en cours là où on l'avait laissée. */
function resumeQuizSession(){
  if(!quizSessionActive()) return;
  quizState.view='session'; quizState.revealed=false;
  prepareCard(); renderQuiz();
}

/* quitSession() — quitte la session (retour dashboard) SANS la perdre :
   elle reste reprenable (persistActive l'a déjà sauvegardée). */
function quitSession(){
  quizState.view='dashboard';
  persistActive();
  renderQuiz();
}

/* prepareCard() — prépare la carte courante : en mode QCM, et si le type
   s'y prête (def→concept ou citation→auteur), génère 4 choix une fois pour
   toutes (évite de re-mélanger à chaque re-rendu). Sinon qcmData=null. */
function prepareCard(){
  const card=quizState.session[quizState.idx];
  quizState.qcmAnswered=false; quizState.qcmChosen=null;
  const isQCM=quizState.mode==='qcm'&&(card.type==='def-concept'||card.type==='cite-author');
  quizState.qcmData=isQCM?buildQCMChoices(card):null;
}

/* buildQCMChoices(card) — construit {choices[4], correct} : la bonne réponse
   + 3 distracteurs tirés d'autres cartes DU MÊME TYPE.
   RÈGLE (retour contributeur) : les 4 propositions doivent appartenir à la
   même FAMILLE de réponse. Pour def-concept, on ne mélange jamais un repère
   (paire « A / B ») avec un concept simple : distracteurs du même côté de la
   partition repère/concept, en privilégiant la même catégorie (cat).
   Pour cite-author (v4) : les choix sont des NOMS d'auteurs seuls (l'œuvre et
   la date allongeaient les choix et aidaient à deviner ; elles s'affichent
   après la réponse), et un distracteur n'est JAMAIS le même auteur : avant,
   « Freud, une œuvre » pouvait côtoyer « Freud, une autre œuvre », soit deux
   bonnes réponses dont une seule comptée. On privilégie les auteurs d'une
   même notion. */
function buildQCMChoices(card){
  let correct, answers;
  if(card.type==='cite-author'){
    correct=card.meta.author;
    const others=QUIZ_CARDS.filter(c=>c.type==='cite-author'&&c.meta.author!==correct);
    const near=others.filter(c=>c.notions.some(k=>card.notions.includes(k)));
    const names=list=>[...new Set(list.map(c=>c.meta.author))];
    answers=names(near).length>=3?names(near):names(others);
  } else {
    correct=card.verso;
    // Cartes du même TYPE (même sens de question) avec une réponse différente.
    const same=QUIZ_CARDS.filter(c=>c.type===card.type&&c.verso!==correct);
    // Famille = même côté de la partition repère / non-repère (jamais croisée).
    const isRep=!!(card.meta&&card.meta.cat==='Repère');
    const family=same.filter(c=>(!!(c.meta&&c.meta.cat==='Repère'))===isRep);
    // Plus fin : même catégorie exacte si on en a assez ; sinon, reste la famille.
    const near=family.filter(c=>c.meta&&c.meta.cat===card.meta.cat);
    answers=[...new Set((near.length>=3?near:family).map(c=>c.verso))];
  }
  // Distracteurs uniques, différents de la bonne réponse, tirés au hasard.
  const uniq=answers.filter(a=>a!==correct);
  for(let i=uniq.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[uniq[i],uniq[j]]=[uniq[j],uniq[i]];}
  const choices=[correct].concat(uniq.slice(0,3));
  for(let i=choices.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[choices[i],choices[j]]=[choices[j],choices[i]];}
  return {choices,correct};
}

/* renderQuizSession() — dispatch carte : QCM (si qcmData) ou carte flip 3D. */
function renderQuizSession(){
  const sess=quizState.session, i=quizState.idx, card=sess[i];
  const isQCM=!!quizState.qcmData;
  return `
  <div class="quiz-top">
    <div class="quiz-title">🎯 Réviser</div>
    <button class="quiz-close" onclick="closeQuiz()" aria-label="Fermer">×</button>
  </div>
  <div class="quiz-progress">Carte ${i+1} / ${sess.length}${isQCM?' · QCM':''}</div>
  ${isQCM?renderQCMBody(card):renderFlipBody(card)}
  <button class="quiz-quit" onclick="quitSession()">Quitter la session</button>
  `;
}

/* renderFlipBody(card) — carte à retournement 3D : face avant (recto +
   « Révéler »), face arrière (verso + « ↩ Revoir la question »). Les 2 faces
   sont empilées ; revealQuiz()/flipToQuestion() (dé)posent .flipped sur
   l'élément existant → animation rotateY, sans re-rendu.
   Les boutons ❌/✅ sont placés SOUS la carte (`.quiz-answer-row`) : ils
   apparaissent une fois la réponse révélée et RESTENT visibles même si on
   retourne la carte pour relire la question.
   v4 : la face réponse propose aussi « Relire la fiche » (quizReread). */
function renderFlipBody(card){
  const notionLbl=card.notion&&D[card.notion]?D[card.notion].l:'';
  const rev=quizState.revealed;                          // réponse déjà vue ?
  const flipped=rev?' flipped':'';                       // face affichée au (re)rendu
  return `<div class="quiz-flip"><div class="quiz-flip-inner${flipped}">
    <div class="quiz-card quiz-face-front">
      <div class="quiz-card-qlabel">${card.qLabel}</div>
      <div class="quiz-card-recto">${card.recto}</div>
      ${notionLbl?`<div class="quiz-card-notion">${notionLbl}</div>`:''}
      <div class="quiz-actions"><button class="quiz-reveal" onclick="revealQuiz()">${rev?'Voir la réponse →':'Révéler'}</button></div>
    </div>
    <div class="quiz-card quiz-face-back">
      <div class="quiz-card-qlabel">Réponse</div>
      <div class="quiz-card-verso" style="border-top:none;padding-top:0">${card.verso}</div>
      <div class="quiz-actions"><button class="quiz-reveal quiz-reflip" onclick="flipToQuestion()">↩ Revoir la question</button><button class="quiz-reveal quiz-reflip" onclick="quizReread()">📖 Relire la fiche</button></div>
    </div>
  </div></div>
  <div class="quiz-actions quiz-answer-row${rev?'':' hidden'}">
    <button class="quiz-no" onclick="answerQuiz(false)">❌ Je ne savais pas</button>
    <button class="quiz-yes" onclick="answerQuiz(true)">✅ Je savais</button>
  </div>`;
}

/* renderQCMBody(card) — question + 4 choix. Après réponse : surligne la
   bonne (vert) et, si erreur, le choix cliqué (rouge) ; bouton « Suivant ».
   v4 : après une réponse à « Qui a dit cela ? », la source complète
   (auteur — œuvre) s'affiche, et « Relire la fiche » mène à la fiche. */
function renderQCMBody(card){
  const q=quizState.qcmData, answered=quizState.qcmAnswered, chosen=quizState.qcmChosen;
  const notionLbl=card.notion&&D[card.notion]?D[card.notion].l:'';
  const choicesHtml=q.choices.map((ch,ix)=>{
    let cls='quiz-choice';
    if(answered){ if(ch===q.correct) cls+=' good'; else if(ix===chosen) cls+=' bad'; }
    return `<button class="${cls}" ${answered?'disabled':''} onclick="qcmAnswer(${ix})">${ch}</button>`;
  }).join('');
  const src=(answered&&card.type==='cite-author')?`<div class="quiz-card-notion">${card.verso}</div>`:'';
  return `<div class="quiz-card">
    <div class="quiz-card-qlabel">${card.qLabel}</div>
    <div class="quiz-card-recto" style="font-size:15px">${card.recto}</div>
    ${notionLbl?`<div class="quiz-card-notion">${notionLbl}</div>`:''}
    <div class="quiz-choices">${choicesHtml}</div>
    ${src}
    ${answered?`<button class="quiz-next" onclick="advanceQuiz()">Suivant →</button>
      <button class="quiz-quit" onclick="quizReread()">📖 Relire la fiche</button>`:''}
  </div>`;
}

/* quizReread() — « Relire la fiche » (v4, idée reprise du quiz de Fiches
   BUT) : ferme le quiz SANS perdre la session, qui reste reprenable, et ouvre
   la fiche d'où vient la carte : le concept, l'onglet Citations de l'auteur,
   ou la notion. Une carte QCM déjà répondue est comptée : on passe à la
   suivante avant de sortir, pour ne pas la jouer deux fois à la reprise. */
function quizReread(){
  const card=quizState.session&&quizState.session[quizState.idx];
  if(!card) return;
  if(quizState.qcmAnswered){ quizState.idx++; quizState.qcmAnswered=false; }
  quizState.revealed=false; quizState.view='dashboard';
  persistActive(); closeQuiz();
  if(card.meta&&card.meta.conceptId) openConcept(card.meta.conceptId);
  else if(card.meta&&card.meta.author){ openAuthor(card.meta.author); curAuthorTab='citations'; renderAuthorContent(); }
  else if(card.notion) openNotion(card.notion);
}

/* revealQuiz() — montre la réponse (face arrière) : .flipped sur l'élément
   existant → animation rotateY. À la 1re révélation, on bascule le libellé du
   bouton avant en « Voir la réponse → » et on affiche les boutons ❌/✅ sous
   la carte. Idempotent : rejoue le retournement quand on était revenu sur la
   question (sert alors de « Voir la réponse → »). */
function revealQuiz(){
  const wasRevealed=quizState.revealed;
  quizState.revealed=true;
  const inner=document.querySelector('.quiz-flip-inner');
  if(!inner){ renderQuiz(); return; }
  inner.classList.add('flipped');
  if(!wasRevealed){
    const fb=document.querySelector('.quiz-face-front .quiz-reveal'); if(fb) fb.textContent='Voir la réponse →';
    const row=document.querySelector('.quiz-answer-row'); if(row) row.classList.remove('hidden');
  }
}
/* flipToQuestion() — retourne la carte côté question pour la RELIRE, sans
   masquer les boutons ❌/✅ déjà révélés (simple retrait de .flipped). */
function flipToQuestion(){
  const inner=document.querySelector('.quiz-flip-inner'); if(inner) inner.classList.remove('flipped');
}

/* answerQuiz(ok) — réponse en mode flip : enregistre puis avance. */
function answerQuiz(ok){
  const card=quizState.session[quizState.idx];
  recordResult(card,ok);
  advanceQuiz();
}

/* qcmAnswer(ix) — réponse en mode QCM : compare au correct, enregistre,
   re-rend pour afficher le feedback (vert/rouge). N'avance PAS tout de
   suite (l'élève voit la correction, puis clique « Suivant »). */
function qcmAnswer(ix){
  if(quizState.qcmAnswered) return;
  quizState.qcmChosen=ix; quizState.qcmAnswered=true;
  const card=quizState.session[quizState.idx];
  recordResult(card, quizState.qcmData.choices[ix]===quizState.qcmData.correct);
  renderQuiz();
}

/* recordResult(card,ok) — met à jour le moteur Leitner (via onAnswer) ET
   cumule le récap de session : score, XP gagnés, cartes progressées de boîte,
   nouvelles cartes maîtrisées, montée de niveau. */
function recordResult(card,ok){
  const r=onAnswer(card.id,ok);
  const res=quizState.results;
  if(ok) res.ok++; else { res.ko++; res.wrongIds.push(card.id); }
  res.xp+=r.gain;
  if(r.promoted) res.promoted++;
  if(r.newlyMastered) res.mastered++;
  if(r.leveledUp) res.leveledUp=true;
}

/* advanceQuiz() — passe à la carte suivante (prépare son QCM) ou termine.
   persistActive() sauvegarde la nouvelle position (reprise après refresh) ;
   en fin de session, elle efface l'« active » car plus rien n'est reprenable. */
function advanceQuiz(){
  quizState.idx++; quizState.revealed=false;
  if(quizState.idx>=quizState.session.length){ quizState.view='end'; persistActive(); renderQuiz(); return; }
  persistActive(); prepareCard(); renderQuiz();
}

/* setQuizMode(m) — bascule Cartes ↔ QCM (runtime, non persisté). */
function setQuizMode(m){ quizState.mode=m; renderQuiz(); }
/* setQuizGoal(n) — règle l'objectif quotidien (persisté). */
function setQuizGoal(n){ const st=loadQuizState(); st.daily.goal=n; saveQuizState(st); renderQuiz(); }

/* notionMastery(st) — % de cartes maîtrisées (boîte≥4) par notion, horizon
   courant. Une carte compte pour chacune de ses notions (c.notions, v4). */
function notionMastery(st){
  st=st||loadQuizState(); const h=quizState.horizon;
  return KEYS.map(k=>{
    const cards=QUIZ_CARDS.filter(c=>(c.notions||[c.notion]).includes(k));
    let m=0; cards.forEach(c=>{const p=st.byHorizon[h][c.id]; if(p&&p.box>=4)m++;});
    return {k,total:cards.length,pct:cards.length?Math.round(m/cards.length*100):0};
  }).filter(x=>x.total>0);
}

/* quizBadges(st) — 1 badge par notion, pour l'horizon courant : acquis quand
   80 % de ses cartes sont MÉMORISÉES (palier ≥ 4). Avant v4, il fallait
   TOUTES les cartes au palier 5, soit une cinquantaine par notion : badge
   hors d'atteinte, donc sans effet. */
const QUIZ_BADGE_PCT=80;
function quizBadges(st){
  const nm=notionMastery(st);
  return KEYS.map(k=>{
    const x=nm.find(m=>m.k===k);
    return {k,label:D[k].l,earned:!!(x&&x.pct>=QUIZ_BADGE_PCT)};
  });
}

/* renderQuizEnd() — écran de fin GAMIFIÉ : score + récap de progression
   (XP gagnés, cartes progressées, nouvelles maîtrisées), montée de niveau
   éventuelle, barres niveau + objectif du jour, refaire les ratés + retour.
   Objectif : donner le sentiment d'avoir avancé sur quelque chose. */
function renderQuizEnd(){
  const r=quizState.results, tot=r.ok+r.ko;
  const hasWrong=r.wrongIds.length>0;
  const st=loadQuizState();
  const xp=st.gamif.xp||0, lvl=quizLevel(xp), inLvl=quizXpInLevel(xp);
  const goal=st.daily.goal||QUIZ_DEFAULT_GOAL;
  const dayCount=st.daily.date===todayStr()?(st.daily.count||0):0;
  const dayPct=Math.min(100,Math.round(dayCount/goal*100));
  const goalReached=dayCount>=goal;
  return `
  <div class="quiz-top">
    <div class="quiz-title">🎯 Session terminée</div>
    <button class="quiz-close" onclick="closeQuiz()" aria-label="Fermer">×</button>
  </div>
  <div class="quiz-end">
    <div class="quiz-end-score">${r.ok} / ${tot}</div>
    <div class="quiz-end-lbl">${r.ok===tot?'Sans-faute, bravo ! 🎉':'Continue, la répétition fait le maître.'}</div>
    ${r.leveledUp?`<div class="quiz-levelup">🎉 Niveau ${lvl} atteint !</div>`:''}
    <div class="quiz-end-stats">
      <div class="quiz-end-stat"><div class="quiz-end-num">+${r.xp}</div><div class="quiz-meta-lbl">XP gagnés</div></div>
      <div class="quiz-end-stat"><div class="quiz-end-num">${r.promoted}</div><div class="quiz-meta-lbl">cartes en progrès</div></div>
      <div class="quiz-end-stat"><div class="quiz-end-num">${r.mastered}</div><div class="quiz-meta-lbl">nouvelles maîtrisées</div></div>
    </div>
    <div class="quiz-end-level">
      <div class="quiz-meta-lbl" style="text-align:center">⭐ Niveau ${lvl} · ${inLvl}/100 XP</div>
      <div class="quiz-day-bar"><div class="quiz-day-fill" style="width:${inLvl}%;background:var(--color-accent-quiz)"></div></div>
    </div>
    <div class="quiz-end-level">
      <div class="quiz-meta-lbl" style="text-align:center">${goalReached?'🎯 Objectif du jour atteint ! ':''}${dayCount}/${goal} cartes aujourd'hui · 🔥 ${st.daily.streak||0} j d'affilée</div>
      <div class="quiz-day-bar"><div class="quiz-day-fill" style="width:${dayPct}%"></div></div>
    </div>
    ${hasWrong?`<button class="quiz-start" onclick="redoWrong()">Refaire les ${r.wrongIds.length} ratés</button>`:''}
    <button class="quiz-reveal" onclick="quitSession()">Retour</button>
  </div>
  `;
}
/* redoWrong() — relance une session limitée aux cartes ratées (récap remis à
   zéro, session persistée pour rester reprenable). */
function redoWrong(){
  const ids=quizState.results.wrongIds;
  const sess=ids.map(id=>QUIZ_BY_ID[id]).filter(Boolean);
  quizState.session=sess; quizState.idx=0; quizState.revealed=false;
  quizState.results={ok:0,ko:0,wrongIds:[],xp:0,promoted:0,mastered:0,leveledUp:false};
  quizState.view='session'; persistActive(); prepareCard(); renderQuiz();
}

/* Câblage : touche Échap ferme l'overlay quiz s'il est ouvert. */
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&document.getElementById('quiz-overlay').classList.contains('open')) closeQuiz();
});
