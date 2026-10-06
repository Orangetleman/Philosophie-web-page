/* js/04-fiches.js — morceau du script du site. Le build (outils/construire.mjs)
   recolle js/*.js dans l'ORDRE des noms en UN SEUL script, app.js : les
   fonctions restent visibles d'un morceau à l'autre comme avant, et le code
   « de premier niveau » s'exécute dans cet ordre. */
/* ── Surbrillance d'arrivée des liens dynamiques (retour contributeur) ──────
   Quand on suit un lien dynamique, on signale où l'on atterrit :
     · en règle générale, on fait briller l'en-tête (.notion-head) de la fiche
       ouverte — c'est le repère « tu es ici » ;
     · cas spécial : une notion ouverte DEPUIS une fiche concept fait briller la
       1re mention de ce concept dans le contenu de la notion (et défile dessus).
   Mécanique : pendingConceptMention porte l'id du concept source (consommé une
   seule fois) ; focusAfterRender() l'applique après le rendu. */
let pendingConceptMention=null;   // id de concept à repérer dans la notion, ou null
let pendingAuthorMention=null;    // nom d'auteur à repérer dans la notion (pastille de notion d'une fiche auteur), ou null
let pendingAccroche=null;
let pendingCible=null;            // élément à faire briller après une recherche plein texte ({sel, extrait})         // index d'accroche à faire briller (recherche globale), ou null

/* scrollAndFlash(el) — amène el dans la vue puis le fait briller ~1,6 s.
   Deux fiabilisations par rapport à une version naïve :
     · si la cible est dans un <details> replié (ex. mention de concept logée
       dans le panneau « Approfondir la notion »), on OUVRE ses ancêtres
       <details> — sinon scrollIntoView défile vers un élément masqué et l'on
       a l'impression que « ça ne marche pas » ou que ça vise le mauvais repère ;
     · on attend que la mise en page soit STABLE (double requestAnimationFrame)
       avant de défiler : juste après une réécriture de .main-content, les
       hauteurs ne sont pas encore fiables et un défilement immédiat atterrit à
       côté — c'est la cause des ratés intermittents.
   On retire/rajoute la classe (avec reflow) pour relancer l'animation même si
   l'élément la portait déjà. */
function scrollAndFlash(el){
  if(!el) return false;
  // 1) Déplier les <details> ancêtres pour que la cible soit réellement visible.
  for(let p=el.parentElement;p;p=p.parentElement){
    if(p.tagName==='DETAILS' && !p.open) p.open=true;
  }
  // 2) Défiler + faire briller une fois la mise en page stabilisée.
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    try{ el.scrollIntoView({behavior:'smooth',block:'center'}); }catch(e){}
    el.classList.remove('flash-target');
    void el.offsetWidth;             // force un reflow → l'animation repart de zéro
    el.classList.add('flash-target');
    setTimeout(()=>{ if(el) el.classList.remove('flash-target'); },1700);
  }));
  return true;
}

/* focusAfterRender() — après le rendu d'une fiche (notion / concept / auteur),
   applique la surbrillance d'arrivée. Le requestAnimationFrame garantit que le
   DOM fraîchement injecté existe avant qu'on cherche la cible ; scrollAndFlash
   s'occupe ensuite d'attendre une mise en page stable avant de défiler. */
function focusAfterRender(){
  requestAnimationFrame(()=>{
    const mainEl=document.getElementById('main');
    if(!mainEl) return;
    // 0 bis) Résultat « plein texte » de la recherche globale (étape 3) : on
    //    fait briller l'élément trouvé (citation, œuvre, texte, exemple, sujet)
    //    AU LIEU de l'en-tête — deux surbrillances, l'œil ne sait où regarder.
    if(pendingCible){
      const c=pendingCible; pendingCible=null;   // consommé
      const cle=paletteNorm(c.extrait).slice(0,40);
      const el=[...mainEl.querySelectorAll(c.sel)].find(x=>paletteNorm(x.textContent).includes(cle));
      if(el){ scrollAndFlash(el); return; }
    }
    // 0) Notion ouverte depuis la recherche globale sur une accroche → on fait
    //    briller la carte d'accroche ciblée (sous-onglet « Accroches »).
    if(pendingAccroche!==null){
      const ai=pendingAccroche; pendingAccroche=null;   // consommé
      const card=mainEl.querySelector('.accroche-card[data-acc="'+ai+'"]');
      if(card){ scrollAndFlash(card); return; }
    }
    // 1) Notion ouverte depuis une fiche concept → on vise le concept.
    if(pendingConceptMention){
      const id=pendingConceptMention; pendingConceptMention=null;   // consommé
      const sel='.cterm[onclick*="openConcept(\''+id+'\')"]';
      // a) Mention VISIBLE dans la prose courante (offsetParent non nul = hors
      //    <details> replié) → on la fait briller dans son contexte argumentatif.
      const inProse=[...mainEl.querySelectorAll(sel)];
      const visible=inProse.find(el=>el.offsetParent!==null);
      if(visible){ scrollAndFlash(visible); return; }
      // b) Concept non mentionné dans la prose visible : le lien notion↔concept
      //    est de toute façon documenté dans l'onglet « Concepts » de la notion
      //    (le concept Y FIGURE FORCÉMENT puisqu'on vient de sa pastille
      //    « Notions concernées »). On bascule donc sur cet onglet et on fait
      //    briller SA CARTE — au lieu de pointer le simple titre de la notion,
      //    qui n'apprend rien sur le concept.
      if(sbMode==='notions' && D[cur] && curTab!=='concepts'){
        curTab='concepts'; curConceptSubTab='concepts';
        renderContent();   // recrée contenu + fil d'Ariane
        requestAnimationFrame(()=>{
          const term=document.querySelector('#main .concept-card .cc-term[onclick*="openConcept(\''+id+'\')"]');
          const card=term?term.closest('.concept-card'):null;
          if(card){ scrollAndFlash(card); return; }
          const h2=document.querySelector('#main .notion-head'); if(h2) scrollAndFlash(h2);
        });
        return;
      }
      // c) Dernier recours : mention cachée dans un <details> (scrollAndFlash
      //    l'ouvrira), sinon on retombe sur l'en-tête plus bas.
      if(inProse[0]){ scrollAndFlash(inProse[0]); return; }
    }
    // 1bis) Notion ouverte depuis une fiche AUTEUR (pastille de notion) → on
    //        fait briller la CARTE de cet auteur dans l'onglet « Auteurs ».
    if(pendingAuthorMention){
      const name=pendingAuthorMention; pendingAuthorMention=null;   // consommé
      // S'assurer d'être sur l'onglet Auteurs (où vivent les cartes .ac).
      if(sbMode==='notions' && D[cur] && curTab!=='auteurs'){
        curTab='auteurs'; renderContent();
      }
      // Repérer la carte par le nom exact du lien auteur (.an-link). On compare
      // le texte plutôt qu'un sélecteur d'attribut, robuste aux apostrophes.
      requestAnimationFrame(()=>{
        const link=[...mainEl.querySelectorAll('.ac .an-link')]
          .find(el=>el.textContent.trim()===name);
        const card=link?link.closest('.ac'):null;
        if(card){ scrollAndFlash(card); return; }
        const h2=mainEl.querySelector('.notion-head'); if(h2) scrollAndFlash(h2);
      });
      return;
    }
    // 2) Sinon : on fait briller l'en-tête de la fiche (repère d'arrivée).
    const head=mainEl.querySelector('.notion-head');
    if(head) scrollAndFlash(head);
  });
}

/* openNotionFromConcept(key, conceptId) — ouvre la notion `key` et programme la
   surbrillance de la 1re mention du concept `conceptId` dans son contenu.
   Utilisé par les pastilles « Notions concernées » de la fiche concept. */
function openNotionFromConcept(key, conceptId){
  if(!D[key]) return;
  pushHistory();
  pendingConceptMention=conceptId;
  cur=key; curTab='auteurs'; sbMode='notions';
  renderSB(); renderContent();
  focusAfterRender();
}

/* openNotionFromAuthor(key, authorName) — ouvre la notion `key` sur l'onglet
   « Auteurs » et programme la surbrillance de la CARTE de cet auteur dans la
   notion. Utilisé par les pastilles de notion (« Bonheur → ») des cartes
   d'idée d'une fiche auteur, pour retrouver d'un clic où l'auteur intervient. */
function openNotionFromAuthor(key, authorName){
  if(!D[key]) return;
  pushHistory();
  pendingAuthorMention=authorName;
  cur=key; curTab='auteurs'; sbMode='notions';
  renderSB(); renderContent();
  focusAfterRender();
}

/* openNotionAccroche(key, ai) — ouvre la notion `key` directement sur l'onglet
   Exemples, sous-onglet « Accroches », et fait briller l'accroche d'indice `ai`.
   Utilisé par la recherche globale (Ctrl+K) sur les résultats de type accroche. */
function openNotionAccroche(key, ai){
  if(!D[key]) return;
  pushHistory();
  pendingAccroche=ai;
  cur=key; curTab='exemples'; curExempleSubTab='accroches'; sbMode='notions';
  renderSB(); renderContent();
  focusAfterRender();
}

/* relTypeLabel(t) — libellé lisible d'un type de relation entre concepts.
   Utilisé par l'onglet Concepts d'une notion et par la fiche concept. */
function relTypeLabel(t){
  return {oppose:"s'oppose à",prolonge:'prolonge',complete:'complète',repond:'répond à',
          distinction:'se distingue de',implique:'implique'}[t]||t;
}

/* planCardHTML(p) — rend une carte « plan de dissertation ».
   La carte est elle-même un <details> DÉROULABLE : on ne voit que le sujet
   (summary), et on déplie le plan pour lire son développement (divulgation
   progressive — évite le mur de texte quand une notion a plusieurs plans).
   Structure dépliée : sujet (q) → problématisation (intro) → problématique
   (pb) → 3 axes I/II/III. Chaque axe a des sous-parties (A/B/C) rendues en
   <details> DÉROULABLE (arguments, auteurs, référence, mini-limite) et se
   clôt par sa LIMITE (transition marquée vers l'axe suivant).
   Tolère tous les champs vides : les plans issus de la migration
   automatique (migrated:true) n'ont que les arguments remplis.
   Utilise la notion courante `cur` (global) pour les boutons « + ».      */
function planCardHTML(p){
  const ROMAN=['I','II','III','IV','V','VI'];
  const LETTERS=['A','B','C','D','E','F'];
  const statusCls=p.new?' is-new':p.modified?' is-modified':'';
  const nb=p.new?`<span class="new-badge">✦ Nouveau</span>`:'';
  const mb=p.modified?`<span class="modified-badge">✎ Modifié</span>`:'';
  const mig=p.migrated?`<span class="plan-migr" title="Plan converti automatiquement depuis l'ancien format — à enrichir (problématisation, titres d'axes, limites)">↻ à enrichir</span>`:'';
  // CORPS du plan (problématisation + problématique + axes). Construit à
  // part car la carte est désormais DÉROULABLE : le développement est
  // replié par défaut, on ne montre que le sujet (summary). Divulgation
  // progressive — on déplie le plan qu'on veut réellement travailler.
  let body='';
  if(p.intro) body+=`<div class="plan-intro"><span class="plan-lbl">Problématisation —</span> ${linkTerms('<span>'+p.intro+'</span>')}</div>`;
  if(p.pb) body+=`<div class="plan-pb"><span class="plan-lbl">Problématique —</span> ${linkTerms('<span>'+p.pb+'</span>')}</div>`;
  (p.axes||[]).forEach((ax,i)=>{
    body+=`<div class="plan-axe">
      <div class="plan-axe-head">${ROMAN[i]||(i+1)}. ${ax.t?linkTerms('<span>'+ax.t+'</span>'):'<span class="plan-todo">(titre de l\'axe à préciser)</span>'}</div>`;
    (ax.sps||[]).forEach((sp,j)=>{
      const letter=LETTERS[j]||(j+1);
      // Corps COMPLET de la sous-partie (jamais tronqué) : arguments +
      // auteurs + référence + mini-limite.
      let spBody='';
      if(sp.args) spBody+=`<div class="plan-sp-args">${linkTerms('<span>'+sp.args+'</span>')}</div>`;
      if(sp.auteurs) spBody+=`<div class="plan-sp-meta"><span class="plan-lbl">Auteurs —</span> ${linkTerms('<span>'+sp.auteurs+'</span>')}</div>`;
      if(sp.ref) spBody+=`<div class="plan-sp-ref">${linkTerms('<span>'+sp.ref+'</span>')}</div>`;
      if(sp.limite) spBody+=`<div class="plan-sp-limite"><span class="plan-lbl">Limite —</span> ${linkTerms('<span>'+sp.limite+'</span>')}</div>`;
      if(sp.t){
        // Sous-partie TITRÉE → repliable (<details>) : le titre, entier, sert
        // de résumé. Aucune troncature.
        body+=`<details class="plan-sp"><summary><span class="plan-sp-letter">${letter}.</span> ${linkTerms('<span>'+sp.t+'</span>')}</summary>
          <div class="plan-sp-body">${spBody}</div></details>`;
      }else{
        // Sous-partie SANS titre (ex. plan migré) → contenu affiché EN ENTIER,
        // directement, sans repli ni « … ».
        body+=`<div class="plan-sp plan-sp-flat"><span class="plan-sp-letter">${letter}.</span>
          <div class="plan-sp-body">${spBody||'<span class="plan-todo">(sous-partie à compléter)</span>'}</div></div>`;
      }
    });
    if(ax.limite) body+=`<div class="plan-axe-limite"><span class="plan-lbl">Limite de l'axe —</span> ${linkTerms('<span>'+ax.limite+'</span>')}</div>`;
    body+=`</div>`;
  });
  body+=pPlus('correction','plan',cur,p.q||'plan');
  // Carte DÉROULABLE : le sujet (plan-q) sert de résumé cliquable ; le
  // <details> est replié par défaut. Tout le contenu reste intact à
  // l'intérieur (rien n'est tronqué), seulement masqué tant qu'on ne
  // déplie pas. Le bouton « + » de correction vit dans le corps déplié.
  return `<details class="plan-card${statusCls}">
    <summary class="plan-q">${linkTerms('<span>'+(p.q||'(sujet à préciser)')+'</span>')} ${nb}${mb}${mig}</summary>
    <div class="plan-card-body">${body}</div>
  </details>`;
}

/* ── G. RENDU — FICHES ───────────────────────────────────────────────

   renderConceptContent() — affiche la fiche d'un concept du glossaire.
   Contenu : titre, catégorie, définition, auteur(s) associé(s),
   tensions conceptuelles, notion-pills (liens vers les notions liées). */
function renderConceptContent(){
  renderCrumbs();
  const mainEl=document.getElementById('main');
  if(!mainEl.querySelector('.tabs')||!mainEl.querySelector('.main-content')){
    mainEl.innerHTML='<div class="tabs"></div><div class="main-content"></div>';
  }
  const tabsEl=mainEl.querySelector('.tabs');
  const mc=mainEl.querySelector('.main-content');
  tabsEl.innerHTML=backBtnHTML(); // bouton retour seul dans la barre

  const c=CONCEPTS.find(x=>x.id===curConcept);
  if(!c){mc.innerHTML='';return;}

  // Notion pills. Au clic, on ouvre la notion ET on fait briller la 1re mention
  // de CE concept dans son contenu (openNotionFromConcept — retour contributeur).
  const safeCid=c.id.replace(/'/g,"\\'");
  const notionPills=c.notions.map(k=>{
    const nd=D[k]; if(!nd) return '';
    return `<span class="notion-pill" style="color:${nd.c};border-color:${nd.c}40;background:${nd.c}12"
      onclick="openNotionFromConcept('${k}','${safeCid}')">${nd.l} →</span>`;
  }).join('');

  // Auteur link
  const autLink=c.auteur?c.auteur.split('/').map(a=>{
    const name=a.trim();
    return AI[name]?`<span class="an-link" onclick="openAuthor('${name.replace(/'/g,"\\'")}')"> ${name}</span>`:` ${name}`;
  }).join(' /'):'' ;

  let html=`
<div class="notion-head">
  <div>
    <div class="concept-title">${c.term}</div>
    ${c.cat?`<span class="concept-cat-badge facet-clickable" title="Voir les concepts de cette catégorie" onclick="openFacet('cat','${String(c.cat).replace(/'/g,"\\'")}')">${c.cat}</span>`:''}
  </div>
</div>
<div class="concept-def-box">${linkTerms(c.def)}${pPlus('correction','concept',c.notions.join(','),c.term,'')}</div>`;

  if(c.auteur) html+=`<div class="concept-section"><div class="concept-section-title">Auteur(s) associé(s)</div><div style="font-size:12px;color:var(--color-text-secondary)">${autLink}</div></div>`;

  // Relations & distinctions (système UNIFIÉ) : on agrège
  //   · les relations SORTANTES (c.relations) — vers un concept (r.to),
  //     vers un terme libre (r.term), ou une distinction (desc seule) ;
  //   · les relations ENTRANTES (autres concepts pointant vers c.id),
  //     pour que le lien soit visible des deux côtés sans double saisie.
  // NB : `cur` (clé de notion) n'est PAS utilisé ici — locales selfTerm/other.
  const rels=[];
  (c.relations||[]).forEach(r=>{
    if(r.to){
      const tg=CONCEPTS.find(x=>x.id===r.to);
      if(tg) rels.push({kind:'concept',other:tg,type:r.type,desc:r.desc,dir:'out'});
      else   rels.push({kind:'free',term:r.to,type:r.type,desc:r.desc});   // id orphelin → terme libre
    }else{
      rels.push({kind:'free',term:r.term||'',type:r.type,desc:r.desc});    // distinction / terme libre
    }
  });
  CONCEPTS.forEach(x=>{
    if(x.id===c.id) return;
    (x.relations||[]).forEach(r=>{ if(r.to===c.id) rels.push({kind:'concept',other:x,type:r.type,desc:r.desc,dir:'in'}); });
  });
  // Section TOUJOURS affichée (même vide) pour porter le bouton « Proposer
  // un lien » et permettre de contribuer.
  html+=`<div class="concept-section"><div class="concept-section-title">Relations &amp; distinctions</div>`;
  if(!rels.length) html+=`<div style="color:var(--color-text-tertiary);font-size:12px;padding:4px 0 8px">Aucune relation référencée pour l'instant.</div>`;
  rels.forEach(r=>{
    const selfTerm=`<span class="cc-term" style="cursor:default">${c.term}</span>`;
    // Repère lisible de la relation (pour le « + » de correction).
    const relRef=c.term+' '+relTypeLabel(r.type)+' '+(r.kind==='concept'?r.other.term:(r.term||r.desc||''));
    // Distinction pure (pas de cible) : juste le texte (ex. « A ≠ B »).
    if(r.kind==='free'&&!r.term){
      html+=`<div class="crel-card"><div class="crel-head"><span class="crel-dir crel-${r.type}">${relTypeLabel(r.type)}</span></div><div class="crel-desc">${linkTerms('<span>'+(r.desc||'')+'</span>')}</div>${pPlus('correction','concept-relation','',c.term+' — distinction : '+(r.desc||''))}</div>`;
      return;
    }
    let left,right;
    if(r.kind==='concept'){
      const safeOther=r.other.id.replace(/'/g,"\\'");
      const otherTerm=`<span class="cc-term" onclick="openConcept('${safeOther}')">${r.other.term}</span>`;
      left=r.dir==='out'?selfTerm:otherTerm;
      right=r.dir==='out'?otherTerm:selfTerm;
    }else{
      // terme libre : rendu via linkTerms (se liera si une fiche existe un jour)
      left=selfTerm;
      right=linkTerms('<span>'+r.term+'</span>');
    }
    html+=`<div class="crel-card"><div class="crel-head">${left}<span class="crel-dir crel-${r.type}">${relTypeLabel(r.type)}</span>${right}</div>${r.desc?`<div class="crel-desc">${linkTerms('<span>'+r.desc+'</span>')}</div>`:''}${pPlus('correction','concept-relation','',relRef)}</div>`;
  });
  // Bouton « + Proposer un lien » : pré-remplit le concept source (c.term).
  html+=pPlusCat('concept-relation','','Proposer un lien','',c.term);
  html+=`</div>`;

  if(c.notions.length) html+=`<div class="concept-section"><div class="concept-section-title">Notions concernées</div><div style="display:flex;flex-wrap:wrap;gap:6px">${notionPills}</div></div>`;

  mc.innerHTML=html;
}

/* ── G bis. ONGLET MÉTHODO (guide) ───────────────────────────────────
   Guide de méthode (sbMode='methodo'), DISTINCT de l'onglet « Repères ».
   Deux parcours (METHODO_TOPICS) : la dissertation et l'explication de
   texte. Chaque parcours = un SQUELETTE visuel de la copie (vue d'ensemble)
   + des ÉTAPES dépliables (le détail pas à pas, avec des phrases toutes
   prêtes et une astuce). Le contenu passe par linkTerms() pour rendre
   cliquables les concepts/notions/auteurs cités (ex. « problématique »,
   « thèse »…). Aucune donnée de data.js n'est dupliquée ici : c'est de la
   méthodologie pure. */
const METHODO_TOPICS=[
  {id:'dissertation', label:'Dissertation'},
  {id:'explication',  label:'Explication de texte'}
];

const METHODO_GUIDE={
  dissertation:{
    titre:'La dissertation',
    intro:"Disserter, ce n'est pas donner son avis : c'est <b>répondre à un problème par un raisonnement organisé et progressif</b>. "
        +"On part d'une question, on montre qu'elle oppose plusieurs réponses possibles, puis on construit pas à pas une réponse "
        +"argumentée en s'appuyant sur des <b>auteurs</b>, des <b>concepts</b> et des <b>exemples</b>.",
    squelette:[
      {bloc:'Introduction', detail:"Accroche → analyse des termes du sujet → <b>problématique</b> (la question qui oppose deux réponses) → annonce du plan."},
      {bloc:'I. Thèse', detail:"La réponse la plus spontanée au sujet : on la défend solidement… puis on en montre la limite."},
      {bloc:'II. Antithèse', detail:"Une objection qui corrige la première réponse et <b>déplace</b> le problème."},
      {bloc:'III. Dépassement', detail:"Une position plus fine qui lève la tension — souvent grâce à une <b>distinction</b> décisive."},
      {bloc:'Conclusion', detail:"Bilan des étapes → réponse claire à la problématique → ouverture."}
    ],
    etapes:[
      {t:"Analyser le sujet",
       body:"<p>Avant tout : <b>définir chaque mot</b> du sujet et repérer ses <b>présupposés</b>. Un même terme a souvent plusieurs sens — c'est là que naît le problème. Demande-toi ce que le sujet tient déjà pour acquis.</p>",
       phrases:["« Le terme … peut s'entendre en deux sens : … et … »","« Le sujet suppose que … : est-ce si évident ? »"],
       tip:"Souligne chaque mot du sujet : <b>chaque mot compte</b>, surtout les petits (« peut-on », « faut-il », « toujours »)."},
      {t:"Problématiser",
       body:"<p>Transforme le sujet en <b>problème</b> : montre que deux réponses opposées sont également défendables. La problématique, c'est cette <b>tension</b> à résoudre, formulée en une question précise — pas une simple reformulation du sujet.</p>",
       phrases:["« On pourrait répondre que … ; pourtant, … »","« Le problème est donc de savoir si … ou si, au contraire, … »"],
       tip:"Une bonne problématique se reconnaît à ce qu'on <b>ne peut pas y répondre par oui ou non immédiatement</b>."},
      {t:"Construire le plan",
       body:"<p>Trois parties (les correcteurs y tiennent) qui <b>progressent</b> — chacune corrige ou approfondit la précédente. Deux formes admises : le plan <b>dialectique</b> (thèse → objection → dépassement) et le plan <b>progressif</b> (on creuse la même question par paliers de plus en plus fins). Jamais un « pour / contre / synthèse » plaqué : chaque partie répond à la problématique d'une manière <b>nouvelle</b>.</p>",
       phrases:["I. réponse spontanée — II. objection qui la limite — III. distinction qui dépasse","« Ce qui était vrai en … ne l'est plus dès lors que … »"],
       tip:"Teste ton plan : si on peut <b>inverser deux parties sans rien changer</b>, c'est qu'il ne progresse pas."},
      {t:"Rédiger l'introduction",
       body:"<p>Quatre temps enchaînés : une <b>accroche</b> (exemple, paradoxe — voir le sous-onglet « Accroche » des Exemples), l'<b>analyse des termes</b>, la <b>problématique</b>, et l'<b>annonce du plan</b>. Elle se rédige souvent <i>après</i> avoir trouvé le plan.</p>",
       phrases:["« … . Cet exemple invite à se demander si … »","« Nous verrons d'abord que … , avant de montrer que … , pour enfin … »"],
       tip:"Pas de réponse dès l'introduction : on <b>pose</b> le problème, on ne le tranche pas encore."},
      {t:"Construire une sous-partie",
       body:"<p>Une sous-partie = <b>une seule idée</b>, développée en trois temps :</p>"
          +"<p><b>1. Affirmer</b> la thèse (la phrase-idée). <b>2. Expliquer</b> : le raisonnement qui la justifie (le <i>pourquoi</i>). <b>3. Illustrer</b> : un exemple précis ou un <b>auteur</b> qui l'incarne. On termine par une <b>transition</b> vers la suite.</p>",
       phrases:["« En effet, … » (l'explication) puis « Par exemple, … » / « Comme le montre … »","« Mais cette thèse se heurte à … , ce qui nous conduit à … » (transition)"],
       tip:"Un exemple n'est jamais là pour décorer : il doit <b>prouver</b> l'idée — explique toujours <b>en quoi</b>. Une référence par sous-partie suffit (≈ <b>5 auteurs au maximum</b> sur la copie) : on <b>mobilise</b> un auteur, on ne récite pas le cours."},
      {t:"Rédiger la conclusion",
       body:"<p>Trois temps : <b>bilan</b> du chemin parcouru (sans tout répéter), <b>réponse</b> nette à la problématique, et une <b>ouverture</b> (nouvelle question, prolongement) — jamais une question vague.</p>",
       phrases:["« Au terme de ce parcours, il apparaît que … »","« Reste alors à se demander si … »"],
       tip:"La conclusion <b>répond</b> vraiment à la question posée : relis ton introduction avant de la rédiger."}
    ]
  },
  explication:{
    titre:"L'explication de texte",
    intro:"Expliquer un texte, c'est en restituer la <b>thèse</b> et en suivre l'<b>argumentation</b> pas à pas pour la rendre claire — "
        +"sans paraphraser (redire en moins bien) ni plaquer un cours. On montre <b>pourquoi</b> l'auteur dit ce qu'il dit, "
        +"et en quoi sa réponse est forte.",
    squelette:[
      {bloc:'Introduction', detail:"Thème → <b>problème</b> auquel le texte répond → <b>thèse</b> de l'auteur → annonce des mouvements."},
      {bloc:'Développement', detail:"On suit l'<b>ordre du texte</b> : pour chaque mouvement, on cite, on explique les termes, on reformule l'argument."},
      {bloc:'Discussion', detail:"(Selon la consigne) intérêt et portée de la thèse, puis une <b>limite</b> éventuelle, discutée avec rigueur."},
      {bloc:'Conclusion', detail:"Ce que le texte établit → réponse au problème → ouverture."}
    ],
    etapes:[
      {t:"Lire et situer le texte",
       body:"<p>Lis deux fois. Repère le <b>thème</b> (de quoi ça parle), la <b>question</b> à laquelle le texte répond, et le <b>type</b> de texte (démonstration, réfutation, analyse d'un exemple…). Situe-le dans une notion du programme.</p>",
       phrases:["« Ce texte porte sur … et répond à la question : … »","« L'auteur cherche ici à établir que … »"],
       tip:"Ne jamais expliquer un texte qu'on n'a pas relu : la <b>thèse</b> apparaît souvent à la deuxième lecture."},
      {t:"Dégager la thèse",
       body:"<p>La <b>thèse</b>, c'est la position défendue par l'auteur, résumable en <b>une phrase</b>. Distingue-la des <b>arguments</b> (ce qui la justifie) et des <b>exemples</b> (ce qui l'illustre). Tout le texte est au service de cette thèse.</p>",
       phrases:["« La thèse de l'auteur est que … »","« Cette idée s'oppose à l'opinion commune selon laquelle … »"],
       tip:"Si tu ne peux pas écrire la thèse en une phrase, c'est qu'elle n'est <b>pas encore claire</b> pour toi."},
      {t:"Repérer la structure (les mouvements)",
       body:"<p>Découpe le texte en <b>moments argumentatifs</b> (les « mouvements ») et nomme la <b>fonction</b> de chacun : pose-t-il la thèse ? l'illustre-t-il ? répond-il à une objection ? Les connecteurs (« or », « mais », « donc ») sont tes repères.</p>",
       phrases:["« Dans un premier mouvement (l. … à …), l'auteur … »","« Il anticipe alors une objection : … »"],
       tip:"Indique les <b>lignes</b> de chaque mouvement : ça structure ta copie et prouve que tu suis le texte."},
      {t:"Expliquer pas à pas",
       body:"<p>Pour chaque mouvement : <b>cite</b> brièvement, <b>élucide les termes</b> techniques, <b>reformule</b> l'argument avec tes mots et explicite la <b>logique</b> (pourquoi telle idée entraîne telle autre). <b>Ne paraphrase pas</b> : ajoute toujours du sens.</p>",
       phrases:["« Par … , l'auteur entend … »","« Autrement dit, … . Ce qui revient à dire que … »"],
       tip:"Test anti-paraphrase : si ta phrase pourrait être <b>supprimée sans rien perdre</b>, c'est de la paraphrase."},
      {t:"Dégager les enjeux / discuter",
       body:"<p>Montre l'<b>intérêt philosophique</b> de la thèse : à quel problème répond-elle, qu'apporte-t-elle ? Si la consigne le demande, propose une <b>discussion</b> mesurée : une objection sérieuse, un cas qui résiste — sans démolir gratuitement l'auteur.</p>",
       phrases:["« L'intérêt de cette thèse est de … »","« On peut toutefois objecter que … »"],
       tip:"Discuter ≠ donner son avis : toute objection doit être <b>argumentée</b>, comme une mini-dissertation."},
      {t:"Rédiger intro et conclusion",
       body:"<p>L'<b>introduction</b> annonce thème, problème, thèse et mouvements (sans expliquer encore). La <b>conclusion</b> récapitule ce que le texte a établi, répond au problème et ouvre. Rédige-les une fois l'explication faite.</p>",
       phrases:["« Nous suivrons les trois moments de l'argumentation : … »","« Ainsi, le texte montre que … »"],
       tip:"L'introduction d'explication <b>n'annonce pas un plan en parties</b> : elle annonce les <b>mouvements du texte</b>."}
    ]
  }
};

/* renderMethodoContent() — affiche le guide du parcours courant (methodoTopic)
   dans la zone principale : bascule de parcours, squelette visuel, puis étapes
   dépliables. Mirroir de renderConceptContent pour la structure du #main. */
function renderMethodoContent(){
  renderCrumbs();
  const mainEl=document.getElementById('main');
  if(!mainEl.querySelector('.tabs')||!mainEl.querySelector('.main-content')){
    mainEl.innerHTML='<div class="tabs"></div><div class="main-content"></div>';
  }
  const tabsEl=mainEl.querySelector('.tabs');
  const mc=mainEl.querySelector('.main-content');
  tabsEl.innerHTML=backBtnHTML();   // bouton retour seul dans la barre

  const g=METHODO_GUIDE[methodoTopic]||METHODO_GUIDE.dissertation;
  // Bascule entre les deux parcours (boutons en tête de zone principale).
  const switchHTML=METHODO_TOPICS.map(t=>
    `<button class="${t.id===methodoTopic?'active':''}" role="tab" aria-selected="${t.id===methodoTopic}" onclick="methodoTopic='${t.id}';renderSB();renderMethodoContent();">${t.label}</button>`
  ).join('');
  // Squelette : une ligne par bloc de copie (vue d'ensemble de la structure).
  const skelHTML=g.squelette.map(s=>
    `<div class="methodo-skel-row"><div class="methodo-skel-bloc">${s.bloc}</div><div class="methodo-skel-detail">${linkTerms('<span>'+s.detail+'</span>')}</div></div>`
  ).join('');
  // Étapes dépliables : numéro + titre, corps, phrases toutes prêtes, astuce.
  const stepsHTML=g.etapes.map((e,i)=>{
    const phrases=(e.phrases||[]).length
      ? `<div class="methodo-block-title">Phrases toutes prêtes</div><ul class="methodo-phrases">${e.phrases.map(p=>`<li>${linkTerms('<span>'+p+'</span>')}</li>`).join('')}</ul>`
      : '';
    const tip=e.tip?`<div class="methodo-tip">💡 ${linkTerms('<span>'+e.tip+'</span>')}</div>`:'';
    return `<details class="methodo-step"${i===0?' open':''}>
      <summary><span class="methodo-step-num">${i+1}</span>${e.t}</summary>
      <div class="methodo-step-body">${linkTerms('<span>'+e.body+'</span>')}${phrases}${tip}</div>
    </details>`;
  }).join('');

  mc.innerHTML=`<div class="methodo-wrap">
    <div class="methodo-eyebrow">Je révise la méthode de…</div>
    <div class="methodo-switch" role="tablist" aria-label="Choisir la méthode">${switchHTML}</div>
    <p class="methodo-intro">${linkTerms('<span>'+g.intro+'</span>')}</p>
    <div class="methodo-sectitle">La copie en un coup d'œil</div>
    <div class="methodo-skel">${skelHTML}</div>
    <div class="methodo-sectitle">Étape par étape</div>
    <div class="methodo-steps">${stepsHTML}</div>
  </div>`;
}


/* tab(id)        — change l'onglet actif dans la vue notion (curTab).
   openAuthor(name) — ouvre la fiche d'un auteur depuis n'importe où
                      (liens .an-link dans les cartes auteur, pills dans
                      la fiche concept, noms dans l'onglet Dialogues…).  */
function tab(id){pushHistory();curTab=id;renderContent()}

/* ── Facette « courant » / « catégorie » (regrouper par étiquette) ──────────
   Cliquer le COURANT d'un auteur (sous son nom) ou la CATÉGORIE d'un concept
   (badge/tag) ouvre une petite liste de tous ceux qui PARTAGENT cette
   étiquette — chacun cliquable vers sa fiche. Pratique en révision : « montre-
   moi tous les stoïciens », « tous les concepts de métaphysique »…
     kind = 'courant' → on liste les AUTEURS dont AM[nom].courant === value
     kind = 'cat'     → on liste les CONCEPTS dont c.cat === value
   L'overlay réutilise le style .modal-overlay ; openAuthor/openConcept ferment
   d'abord la facette puis ouvrent la fiche. */
function openFacet(kind,value){
  const ov=document.getElementById('facet-overlay');
  const body=document.getElementById('facet-body');
  const titleEl=document.getElementById('facet-title');
  if(!ov||!body||!titleEl) return;
  value=String(value||'');
  let items='', label='', n=0;
  if(kind==='courant'){
    label='Courant';
    const col=CC[value]||'#888';
    // Les courants sont souvent COMPOSÉS (« Théorie critique / Sociologie ») et
    // quasi uniques. Pour que le clic regroupe vraiment, on rapproche les
    // auteurs qui partagent un MOT SIGNIFICATIF du courant (≥ 5 lettres, hors
    // « philosophie » trop générique) : tous les « rationalismes », les
    // « idéalismes », les « phénoménologies »… se retrouvent ainsi ensemble.
    // L'auteur au courant EXACTEMENT identique passe en tête ; le courant
    // propre de chacun est affiché en sous-ligne (pour la transparence).
    const toks=s=>s.toLowerCase().split(/[^a-zà-ÿ]+/).filter(w=>w.length>=5&&w!=='philosophie');
    const wanted=new Set(toks(value));
    const names=Object.keys(AI).filter(nm=>{
      const c=(AM[nm]||{}).courant||'';
      if(!c) return false;
      if(c===value) return true;
      return toks(c).some(w=>wanted.has(w));
    }).sort((a,b)=>{
      const ea=((AM[a]||{}).courant||'')===value?0:1, eb=((AM[b]||{}).courant||'')===value?0:1;
      return ea!==eb?ea-eb:a.localeCompare(b,'fr');
    });
    n=names.length;
    items=names.map(nm=>{
      const c=(AM[nm]||{}).courant||'';
      const ccol=CC[c]||col;
      return `<button class="facet-item" onclick="closeFacet();openAuthor('${nm.replace(/'/g,"\\'")}')">`
        +`<span class="facet-dot" style="background:${ccol}"></span>`
        +`<span class="facet-name">${nm}<span class="facet-sub">${c}</span></span></button>`;
    }).join('');
  } else { // 'cat' : concepts d'une même catégorie (repères inclus si cat='Repère')
    label='Catégorie';
    const cs=CONCEPTS.filter(c=>(c.cat||'')===value).sort((a,b)=>a.term.localeCompare(b.term,'fr'));
    n=cs.length;
    items=cs.map(c=>{
      const col=(c.notions&&c.notions[0]&&D[c.notions[0]])?D[c.notions[0]].c:'#888';
      const sub=(c.notions||[]).map(k=>D[k]?D[k].l:'').filter(Boolean).join(' · ');
      return `<button class="facet-item" onclick="closeFacet();openConcept('${c.id.replace(/'/g,"\\'")}')">`
        +`<span class="facet-dot" style="background:${col}"></span>`
        +`<span class="facet-name">${c.term}${sub?`<span class="facet-sub">${sub}</span>`:''}</span></button>`;
    }).join('');
  }
  titleEl.innerHTML=`${label} : <strong>${value}</strong> <span class="facet-count">${n}</span>`;
  body.innerHTML=items||'<div class="facet-empty">Aucun élément.</div>';
  ov.classList.add('open');
}
/* closeFacet() — referme l'overlay de facette. */
function closeFacet(){ const ov=document.getElementById('facet-overlay'); if(ov) ov.classList.remove('open'); }
// Échap referme la facette (comme les autres overlays ; no-op si déjà fermée).
document.addEventListener('keydown',e=>{ if(e.key==='Escape') closeFacet(); });

/* ── Fil d'Ariane — navigation hiérarchique cliquable ─────────────────
   renderCrumbs() peuple #crumbs selon l'état (sbMode, cur, curTab,
   curAuthor, curAuthorTab, curConcept, curConceptSubTab). Chaque segment
   porte data-act / data-arg ; un écouteur unique délègue les clics.
   Style « explorateur Windows » : on clique sur n'importe quel niveau
   pour y revenir directement. Le dernier segment (en cours) est inerte. */
function renderCrumbs(){
  persistNav();   // mémorise la position courante (résiste à l'actualisation + cloud)
  const el=document.getElementById('crumbs'); if(!el) return;
  // Helper : un segment. cur=true → segment « courant » (non cliquable).
  const seg=(label,act,arg,cur)=>cur
    ? `<span class="crumb current">${label}</span>`
    : `<span class="crumb" data-act="${act}" data-arg="${pEsc(arg||'')}">${label}</span>`;
  const sep=`<span class="crumb-sep">›</span>`;
  const segs=[];
  if(sbMode==='notions'){
    segs.push(seg('Notions','mode','notions',false));
    const n=D[cur];
    if(n){
      // Clic sur la notion → onglet par défaut 'auteurs'.
      const notionIsCurrent=(curTab==='auteurs');
      segs.push(seg(n.l,'tab','auteurs',notionIsCurrent));
      if(!notionIsCurrent){
        const lbl={textes:'Textes',concepts:'Concepts',diss:'Dissertations',exemples:'Exemples'}[curTab]||curTab;
        // Pour l'onglet concepts, un dernier niveau pour le sous-onglet.
        if(curTab==='concepts'){
          const subIsLiens=(curConceptSubTab==='liens');
          segs.push(seg(lbl,'subtab','concepts',!subIsLiens));   // « Concepts » courant si sous-onglet 'concepts'
          if(subIsLiens) segs.push(seg('Liens entre concepts','',null,true));
        }else{
          segs.push(seg(lbl,'',null,true));
        }
      }
    }
  }else if(sbMode==='auteurs'){
    segs.push(seg('Auteurs','mode','auteurs',false));
    if(curAuthor){
      const isIdees=(curAuthorTab==='idees');
      segs.push(seg(curAuthor,'authortab','idees',isIdees));
      if(!isIdees){
        const lbl={citations:'Citations',oeuvres:'Œuvres',dialogues:'Dialogues'}[curAuthorTab]||curAuthorTab;
        segs.push(seg(lbl,'',null,true));
      }
    }
  }else if(sbMode==='concepts'){
    segs.push(seg('Concepts','mode','concepts',false));
    if(curConcept){
      // garde x&& : Array.find visite les trous de tableau comme undefined
      // (contrairement à map/forEach), donc une virgule en trop dans CONCEPTS
      // ferait planter sur x.id sans cette protection.
      const c=CONCEPTS.find(x=>x&&x.id===curConcept);
      if(c) segs.push(seg(c.term,'',null,true));
    }
  }else if(sbMode==='reperes'){
    // Repères : même fiche que les concepts, mais segment racine distinct.
    segs.push(seg('Repères','mode','reperes',false));
    if(curConcept){
      const c=CONCEPTS.find(x=>x&&x.id===curConcept);
      if(c) segs.push(seg(c.term,'',null,true));
    }
  }else if(sbMode==='methodo'){
    // Méthodo (guide) : racine « Méthodo » + parcours courant (Dissertation /
    // Explication de texte). Le parcours est l'élément courant (non cliquable).
    segs.push(seg('Méthodo','mode','methodo',false));
    const t=METHODO_TOPICS.find(t=>t.id===methodoTopic);
    if(t) segs.push(seg(t.label,'',null,true));
  }
  el.innerHTML=segs.join(sep);
}
/* goMode(mode) — bascule la sidebar vers un mode (notions/auteurs/concepts)
   et re-rend la zone principale. Utilisé par les crumbs et la sb-tab. */
function goMode(mode){
  if(sbMode===mode){ renderSB(); return; }
  sbMode=mode;
  if(mode==='notions'){ renderSB(); renderContent(); }
  else if(mode==='auteurs'){ if(!curAuthor) curAuthor=authorsSorted()[0]; curAuthorTab='idees'; renderSB(); renderAuthorContent(); }
  else if(mode==='concepts'){ const c0=realConcepts().find(c=>c.id===curConcept)||realConcepts()[0]; if(c0) curConcept=c0.id; renderSB(); renderConceptContent(); }
  else if(mode==='reperes'){ const r0=REPERES().find(c=>c.id===curConcept)||REPERES()[0]; if(r0) curConcept=r0.id; renderSB(); renderConceptContent(); }
  else if(mode==='methodo'){ renderSB(); renderMethodoContent(); }   // guide de méthodologie
}

/* openAuthor(name) — ouvre la fiche d'un auteur depuis n'importe où :
   bascule la sidebar en mode 'auteurs' et rend la fiche. Ignore un nom
   absent de l'index AI. */
function openAuthor(name){
  // Résout une variante de nom (alias) vers le nom canonique, par sécurité —
  // les liens passent déjà le canonique, ceci ne couvre qu'un appel résiduel.
  if(!AI[name] && typeof AUTHOR_ALIASES!=='undefined' && AUTHOR_ALIASES[name]) name=AUTHOR_ALIASES[name];
  if(!AI[name]) return;
  pushHistory();
  sbMode='auteurs'; curAuthor=name; curAuthorTab='idees';
  renderSB(); renderAuthorContent();
  focusAfterRender();   // surbrillance d'arrivée (retour contributeur)
}

/* renderAuthorContent() — affiche la fiche d'un auteur (curAuthor).
   4 onglets (curAuthorTab) :
     · idées     → une carte par notion couverte (œuvre + idée + pill notion)
     · citations → citations de l'auteur, groupées par notion
     · œuvres    → œuvres mentionnées avec les notions associées
     · dialogues → relations avec d'autres auteurs (oppose/prolonge/répond)
   Tous les textes passent par linkTerms() pour rendre les concepts cliquables. */

/* ideaCitationsHTML(cites) — rend les citations d'une idée : la première
   est toujours visible ; s'il y en a plusieurs, les suivantes sont dans
   un déroulant. Renvoie '' si aucune citation. */
function ideaCitationsHTML(cites){
  if(!cites||!cites.length) return '';
  const first=`<div class="aq">${linkTerms('<span>'+cites[0]+'</span>')}</div>`;
  if(cites.length===1) return first;
  const n=cites.length-1;
  const rest=cites.slice(1).map(c=>`<div class="aq aq-more">${linkTerms('<span>'+c+'</span>')}</div>`).join('');
  return first+`<details class="aq-details"><summary>+ ${n} autre${n>1?'s':''} citation${n>1?'s':''}</summary>${rest}</details>`;
}
/* ideaSynthese(it) — version CONDENSÉE d'une idée pour le « mode fiche »
   (lecture rapide façon fiche de révision). Priorité à une synthèse rédigée
   à la main (champ it.fiche) ; à défaut, on extrait la THÈSE = la 1re phrase
   de l'idée (elles sont écrites thèse-d'abord, souvent avec un lead en gras).
   On coupe au 1er point/!/? HORS balise, en évitant les abréviations proches
   du début, puis on rééquilibre les balises ouvertes. Renvoie du HLML lié
   (linkTerms) ou '' si pas d'idée. */
function ideaSynthese(it){
  if(it&&it.fiche) return linkTerms('<span>'+it.fiche+'</span>');
  const html=(it&&it.i)||''; if(!html) return '';
  let depth=0, cut=-1;
  for(let i=0;i<html.length;i++){
    const ch=html[i];
    if(ch==='<') depth++;
    else if(ch==='>'){ if(depth>0) depth--; }
    else if(depth===0 && (ch==='.'||ch==='!'||ch==='?')){
      const nxt=html[i+1];
      // fin de phrase = ponctuation suivie d'espace/balise/fin ; on ignore les
      // coupures trop précoces (abréviations type « av. », « p. ex. »).
      if((nxt===undefined||nxt===' '||nxt==='<') && i>=45){ cut=i+1; break; }
    }
  }
  let s=(cut>0?html.slice(0,cut):html).trim();
  // Rééquilibrer les balises de mise en forme éventuellement laissées ouvertes.
  ['strong','em','span'].forEach(tag=>{
    const o=(s.match(new RegExp('<'+tag+'(?:\\s|>)','g'))||[]).length;
    const c=(s.match(new RegExp('</'+tag+'>','g'))||[]).length;
    for(let k=c;k<o;k++) s+='</'+tag+'>';
  });
  return linkTerms('<span>'+s+'</span>');
}

function renderAuthorContent(){
  renderCrumbs();
  const mainEl=document.getElementById('main');
  if(!mainEl.querySelector('.tabs')||!mainEl.querySelector('.main-content')){
    mainEl.innerHTML='<div class="tabs"></div><div class="main-content"></div>';
  }
  const tabsEl=mainEl.querySelector('.tabs');
  const mc=mainEl.querySelector('.main-content');

  if(!curAuthor||!AI[curAuthor]){mc.innerHTML='';tabsEl.innerHTML='';return;}
  const entry=AI[curAuthor];
  const meta=AM[curAuthor]||{bio:'',courant:'',periode:'',themes:[],dialogues:[]};
  const cc=CC[meta.courant]||'#888';
  // Nom de l'auteur échappé pour les attributs onclick (pastilles de notion
  // des onglets Idées / Citations / Œuvres → openNotionFromAuthor).
  const safeAuthor=curAuthor.replace(/'/g,"\\'");

  // notion badges row
  const notionBdgs=entry.notions.map(k=>`<span class="ab-bdg" style="background:${D[k].c};width:8px;height:8px" title="${D[k].l}"></span>`).join('');

  const tabs2=[{id:'idees',l:'Idées'},{id:'citations',l:'Citations'},{id:'oeuvres',l:'Œuvres'},{id:'dialogues',l:'Dialogues'}];

  // Barre d'onglets fixe
  tabsEl.innerHTML=backBtnHTML()+tabs2.map(t=>`<div class="tab${curAuthorTab===t.id?' active':''}" onclick="curAuthorTab='${t.id}';renderAuthorContent()">${t.l}</div>`).join('');

  let html=`
<div class="notion-head">
  <div>
    <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
      <div class="author-title">${curAuthor}</div>
      ${progBadgeHTML(curAuthor)}
      ${meta.courant?`<span class="author-courant facet-clickable" style="background:${cc}18;color:${cc};border:0.5px solid ${cc}40" title="Voir les auteurs de ce courant" onclick="openFacet('courant','${String(meta.courant).replace(/'/g,"\\'")}')">${meta.courant}</span>`:''}
    </div>
    <div style="display:flex;gap:3px;align-items:center;margin-top:5px">${notionBdgs}<span style="font-size:10px;color:var(--color-text-tertiary);margin-left:4px">${entry.notions.length} notion${entry.notions.length>1?'s':''}</span></div>
  </div>
</div>`;

  if(meta.bio){
    html+=`<div class="author-def-box">${linkTerms('<span>'+meta.bio+'</span>')}`;
    if(meta.periode||meta.themes.length){
      html+=`<details><summary>Période &amp; thèmes majeurs</summary>`;
      if(meta.periode) html+=`<div style="margin-top:8px;font-size:12px"><span style="font-weight:500;color:var(--color-text-primary)">Période :</span> ${meta.periode}</div>`;
      if(meta.themes.length) html+=`<div style="margin-top:4px;font-size:12px"><span style="font-weight:500;color:var(--color-text-primary)">Thèmes :</span> ${linkTerms('<span>'+meta.themes.join(' · ')+'</span>')}</div>`;
      html+=`</details>`;
    }
    html+=`</div>`;
  }

  // (les onglets sont désormais dans tabsEl — pas dans html)

  if(curAuthorTab==='idees'){
    html+=`<div class="slabel">Idées de ${curAuthor} par notion</div>`;
    // Une notion peut contenir plusieurs idées de l'auteur (a.ideas[]) :
    // on rend une carte par idée, en répétant la pill de la notion pour
    // que chaque idée soit clairement rattachée.
    entry.notions.forEach(k=>{
      const a=entry.entries[k]; const nc=D[k].c;
      a.ideas.forEach(it=>{
        const nb=it.new?`<span class="new-badge">✦ Nouveau</span>`:'';
        const mb=it.modified?`<span class="modified-badge">✎ Modifié</span>`:'';
        const statusCls=it.new?' is-new':it.modified?' is-modified':'';
        html+=`<div class="idea-card${statusCls}">
          <div class="idea-card-head">
            <div class="idea-card-work">${it.w||''} ${nb}${mb}</div>
            <span class="notion-pill" style="color:${nc};border-color:${nc}40;background:${nc}12"
              onclick="openNotionFromAuthor('${k}','${safeAuthor}')">${D[k].l} →</span>
          </div>
          ${it.i?`<div class="idea-card-body">${linkTerms('<span>'+it.i+'</span>')}</div>`:''}
          ${ideaCitationsHTML(it.citations)}
          ${pPlus('correction','auteur',k,curAuthor+' — '+(it.w||'idée')+' · '+D[k].l,curAuthor)}
        </div>`;
      });
    });
    html+=pPlusCat('auteur','','Proposer une idée',curAuthor);
  }
  else if(curAuthorTab==='citations'){
    // Collecte plate : chaque citation de chaque idée devient une carte.
    // Une idée peut porter plusieurs citations (it.citations[]).
    const qs=[];
    entry.notions.forEach(k=>{
      entry.entries[k].ideas.forEach(it=>{ (it.citations||[]).forEach(cite=>qs.push({k,it,cite})); });
    });
    if(!qs.length){html+=`<div style="color:var(--color-text-tertiary);font-size:12px;padding:10px 0">Aucune citation référencée.</div>`;}
    else{
      html+=`<div class="slabel">Citations de ${curAuthor}</div>`;
      qs.forEach(({k,it,cite})=>{
        const nc=D[k].c;
        html+=`<div class="cit-card" style="border-left-color:${nc}">
          <div class="cit-card-text">${linkTerms('<span>'+cite+'</span>')}</div>
          <div class="cit-card-footer">
            <span class="cit-card-src">${it.w||''}</span>
            <span class="notion-pill" style="color:${nc};border-color:${nc}40;background:${nc}12"
              onclick="openNotionFromAuthor('${k}','${safeAuthor}')">${D[k].l} →</span>
          </div>
          ${pPlus('correction','auteur',k,curAuthor+' — citation · '+D[k].l,curAuthor)}
        </div>`;
      });
    }
    html+=pPlusCat('auteur','','Proposer une citation',curAuthor);
  }
  else if(curAuthorTab==='oeuvres'){
    // Une œuvre peut être référencée par plusieurs idées et plusieurs
    // notions. On agrège : works[w] = Set de notions où l'œuvre apparaît.
    const works={};
    entry.notions.forEach(k=>{
      entry.entries[k].ideas.forEach(it=>{
        if(it.w){ if(!works[it.w]) works[it.w]=new Set(); works[it.w].add(k); }
      });
    });
    const wks=Object.keys(works);
    if(!wks.length){html+=`<div style="color:var(--color-text-tertiary);font-size:12px;padding:10px 0">Aucune œuvre référencée.</div>`;}
    else{
      html+=`<div class="slabel">Œuvres de ${curAuthor} à connaître</div>`;
      wks.forEach(w=>{
        const ks=Array.from(works[w]);
        const bdgs=ks.map(k=>`<span class="notion-pill" style="color:${D[k].c};border-color:${D[k].c}40;background:${D[k].c}12;font-size:10px;padding:2px 7px"
          onclick="openNotionFromAuthor('${k}','${safeAuthor}')">${D[k].l}</span>`).join('');
        html+=`<div class="oeuvre-card"><div class="oeuvre-title">${w}</div><div class="oeuvre-badges">${bdgs}</div>${pPlus('correction','auteur',ks[0]||'',curAuthor+' — œuvre : '+w,curAuthor)}</div>`;
      });
    }
    html+=pPlusCat('auteur','','Proposer une œuvre',curAuthor);
  }
  else if(curAuthorTab==='dialogues'){
    const dials=meta.dialogues||[];
    if(!dials.length){html+=`<div style="color:var(--color-text-tertiary);font-size:12px;padding:10px 0">Aucun dialogue référencé.</div>`;}
    else{
      html+=`<div class="slabel">Relations philosophiques de ${curAuthor}</div>`;
      const DL={'oppose':'S\'oppose à','prolonge':'Prolonge','repond':'Répond à'};
      dials.forEach(d=>{
        const can=!!AI[d.auteur];
        const safeN=d.auteur.replace(/'/g,"\\'");
        html+=`<div class="dial-card">
          <span class="dial-dir dial-${d.dir}">${DL[d.dir]||d.dir}</span>
          <div class="dial-body">
            <span class="dial-auteur" ${can?`onclick="openAuthor('${safeN}')"`:''}>${d.auteur}</span>
            <div class="dial-sujet">${d.sujet}</div>
            <div class="dial-desc">${linkTerms('<span>'+d.desc+'</span>')}</div>
          </div>
          ${pPlus('correction','auteur','',curAuthor+' — dialogue avec '+d.auteur,curAuthor)}
        </div>`;
      });
    }
    html+=pPlusCat('auteur','','Proposer un dialogue',curAuthor);
  }

  mc.innerHTML=html;
}

/* renderContent() — vue principale d'une notion (cur).
   C'est la fonction de rendu la plus volumineuse : elle gère les 5 onglets
   de la barre (curTab) :
     · auteurs   → grille de cartes auteur (.ag/.ac), linkTerms sur .ai
     · textes    → liste des textes du cours (.tbox), linkTerms sur .titxt
     · axes      → 3 axes de dissertation avec sous-parties (.axe-card/.sp)
     · exemples  → cartes d'exemples (.ex-card), filtrage par tag
     · diss      → questions de dissertation (.dq) + liens vers notions liées
   La définition (.def-box) est toujours affichée en haut, quelle que soit
   l'onglet actif.                                                         */
function renderContent(){
  renderCrumbs();
  const mainEl=document.getElementById('main');
  // Garantir la structure .tabs + .main-content
  if(!mainEl.querySelector('.tabs')||!mainEl.querySelector('.main-content')){
    mainEl.innerHTML='<div class="tabs"></div><div class="main-content"></div>';
  }
  const tabsEl=mainEl.querySelector('.tabs');
  const mc=mainEl.querySelector('.main-content');

  const n=D[cur];
  const c=n.c;
  const tabs2=['auteurs','textes','concepts','diss','exemples'];
  const tabLabels={'auteurs':'Auteurs','textes':'Textes','concepts':'Concepts','diss':'Dissertations','exemples':'Exemples'};

  // Remplir la barre d'onglets (toujours fixe)
  tabsEl.innerHTML=backBtnHTML()+tabs2.map(t=>`<div class="tab${curTab===t?' active':''}" onclick="tab('${t}')">${tabLabels[t]}</div>`).join('');

  // Contenu scrollable
  let html=`
<div class="notion-head">
  <div class="nbadge" style="background:${c}"></div>
  <div><div class="ntitle">${n.l}</div><div class="nsub">${n.s}</div></div>
</div>
<div class="def-box">${linkTerms(n.def)}${pPlus('ajout','notion',cur,'Définition / approfondissement de '+n.l)}</div>`;

  if(curTab==='auteurs'){
    // Fusion VOULUE : toutes les idées d'un même auteur pour cette notion
    // tiennent dans UNE seule carte (clarté). Un auteur peut être saisi soit
    // en une entrée multi-idées (a.ideas[]), soit en plusieurs entrées du
    // même nom : on regroupe ici par nom, en conservant l'ordre de 1re
    // apparition. (La fusion ne touche pas D : on copie les idées.)
    const byAuthor=[]; const authorPos={};
    n.auteurs.forEach(a=>{
      if(authorPos[a.n]===undefined){ authorPos[a.n]=byAuthor.length; byAuthor.push({n:a.n, ideas:a.ideas.slice()}); }
      else byAuthor[authorPos[a.n]].ideas.push(...a.ideas);
    });
    // Tri par « popularité » : nb de notions couvertes, puis score importance
    // bac (auto-corpus + coup de pouce), puis alphabétique (cf. compareAuthors).
    byAuthor.sort((a,b)=>compareAuthors(a.n,b.n));
    html+=`<div class="slabel">Auteurs et idées clés (${byAuthor.length} auteurs)</div><div class="ag">`;
    byAuthor.forEach(a=>{
      const safeN=a.n.replace(/'/g,"\\'");
      // CHAQUE idée = sa propre zone (.a-idea) avec SA couleur (is-new /
      // is-modified) et SES badges — les états sont par idée, plus au niveau
      // de la carte. Les zones se disposent horizontalement (cf. .a-ideas).
      let ideasHTML='';
      a.ideas.forEach(it=>{
        const nb=it.new?`<span class="new-badge">✦ Nouveau</span>`:'';
        const mb=it.modified?`<span class="modified-badge">✎ Modifié</span>`:'';
        const ic=it.new?' is-new':it.modified?' is-modified':'';   // teinte propre à l'idée
        ideasHTML+=`<div class="a-idea${ic}">
          <div class="aw">${it.w||''} ${nb}${mb}</div>
          ${it.i?`<div class="ai">${linkTerms('<span>'+it.i+'</span>')}</div>`:''}
          ${ideaSynthese(it)?`<div class="ai-fiche">${ideaSynthese(it)}</div>`:''}
          ${ideaCitationsHTML(it.citations)}
          ${pPlus('correction','auteur',cur,a.n+' — '+(it.w||'idée'))}
        </div>`;
      });
      // Carte élargie à toute la rangée si l'auteur a plusieurs idées, pour
      // que les zones tiennent réellement CÔTE À CÔTE (sinon elles
      // s'empileraient faute de largeur dans la grille étroite).
      const multi=a.ideas.length>1?' ac-multi':'';
      const nameColor=inkOnDark(c);   // nom = couleur de la notion (neutre)
      html+=`<div class="ac${multi}">
        <div class="an" style="color:${nameColor}">
          <span class="an-link" style="color:${nameColor}" onclick="openAuthor('${safeN}')">${a.n}</span>${progBadgeHTML(a.n,true)}
        </div>
        <div class="a-ideas">${ideasHTML}</div>
      </div>`;
    });
    html+=`</div>`;
    html+=pPlusCat('auteur',cur,'Proposer un auteur');
  }
  else if(curTab==='textes'){
    html+=`<div class="slabel">Textes &amp; extraits à connaître</div><div class="tbox">`;
    n.textes.forEach(t=>{
      const newBadge=t.new?`<span class="new-badge">✦ Nouveau</span>`:'';
      const modBadge=t.modified?`<span class="modified-badge">✎ Modifié</span>`:'';
      const statusClass=t.new?' is-new':t.modified?' is-modified':'';
      html+=`<div class="ti2${statusClass}"><span class="tinum">${t.n} ${newBadge}${modBadge}</span><span class="titxt">${linkTerms('<span>'+t.t+'</span>')}</span>${pPlus('correction','texte',cur,t.n)}</div>`;
    });
    html+=`</div>`;
    html+=pPlusCat('texte',cur,'Proposer un texte');
  }
  else if(curTab==='concepts'){
    // Concepts rattachés à la notion courante (c.notions.includes(cur)).
    // Les repères (cat:'Repère') sont exclus : ils vivent dans l'onglet
    // « Méthodo » de la sidebar, pas dans le glossaire de la notion.
    const cs=CONCEPTS.filter(c=>(c.notions||[]).includes(cur)&&!isRepere(c));
    // Liens entre concepts : relations dont les DEUX extrémités sont dans
    // la notion (mini-graphe local). Calculé d'abord pour afficher le compte
    // dans le sous-onglet.
    const idsInNotion=new Set(cs.map(c=>c.id));
    const relPairs=[];
    cs.forEach(c=>{
      (c.relations||[]).forEach(r=>{
        if(idsInNotion.has(r.to)){
          const target=CONCEPTS.find(x=>x.id===r.to);
          if(target) relPairs.push({from:c,to:target,type:r.type,desc:r.desc});
        }
      });
    });
    // Deux sous-onglets : « Concepts liés » / « Liens entre concepts » —
    // évite de scroller jusqu'en bas pour voir les liens.
    html+=`<div class="subtabs">
      <button class="subtab${curConceptSubTab==='concepts'?' active':''}" onclick="curConceptSubTab='concepts';renderContent()">Concepts liés (${cs.length})</button>
      <button class="subtab${curConceptSubTab==='liens'?' active':''}" onclick="curConceptSubTab='liens';renderContent()">Liens entre concepts (${relPairs.length})</button>
    </div>`;
    if(curConceptSubTab==='liens'){
      // ── Sous-onglet « Liens entre concepts » ──
      if(!relPairs.length){
        html+=`<div style="color:var(--color-text-tertiary);font-size:12px;padding:6px 0 10px">Aucun lien entre les concepts de cette notion pour l'instant.</div>`;
      }
      relPairs.forEach(p=>{
        const safeFrom=p.from.id.replace(/'/g,"\\'");
        const safeTo=p.to.id.replace(/'/g,"\\'");
        html+=`<div class="crel-card">
          <div class="crel-head">
            <span class="cc-term" onclick="openConcept('${safeFrom}')">${p.from.term}</span>
            <span class="crel-dir crel-${p.type}">${relTypeLabel(p.type)}</span>
            <span class="cc-term" onclick="openConcept('${safeTo}')">${p.to.term}</span>
          </div>
          ${p.desc?`<div class="crel-desc">${linkTerms('<span>'+p.desc+'</span>')}</div>`:''}
          ${pPlus('correction','concept-relation',cur,p.from.term+' '+relTypeLabel(p.type)+' '+p.to.term)}
        </div>`;
      });
    }else{
      // ── Sous-onglet « Concepts liés » ──
      if(!cs.length){
        html+=`<div style="color:var(--color-text-tertiary);font-size:12px;padding:6px 0 10px">Aucun concept rattaché à cette notion pour l'instant.</div>`;
      }
      cs.forEach(c=>{
        const isNew=c.new, isMod=c.modified;
        const statusCls=isNew?' is-new':isMod?' is-modified':'';
        const nb=isNew?`<span class="new-badge">✦ Nouveau</span>`:'';
        const mb=isMod?`<span class="modified-badge">✎ Modifié</span>`:'';
        const safeId=c.id.replace(/'/g,"\\'");
        // Définition COMPLÈTE + explication du lien concept ↔ notion (c.liens[cur]).
        const lien=c.liens&&c.liens[cur];
        html+=`<div class="concept-card${statusCls}">
          <div class="cc-head">
            <span class="cc-term" onclick="openConcept('${safeId}')">${c.term} →</span>
            ${c.cat?`<span class="cc-cat facet-clickable" title="Voir les concepts de cette catégorie" onclick="event.stopPropagation();openFacet('cat','${String(c.cat).replace(/'/g,"\\'")}')">${c.cat}</span>`:''}${nb}${mb}
          </div>
          <div class="cc-def">${linkTerms(c.def||'')}</div>
          ${lien?`<div class="cc-lien"><span class="cc-lien-label">Lien avec ${n.l} :</span> ${linkTerms('<span>'+lien+'</span>')}</div>`:''}
          ${pPlus('correction','concept',cur,c.term)}
        </div>`;
      });
    }
    // Bouton « + » de bas de section, adapté au sous-onglet courant.
    if(curConceptSubTab==='liens')
      html+=pPlusCat('concept-relation',cur,'Proposer un lien entre concepts');
    else
      html+=pPlusCat('concept',cur,'Proposer un concept');
  }
  else if(curTab==='exemples'){
    // Onglet « Exemples » = DEUX sous-onglets (curExempleSubTab) :
    //   • 'exemples'  → exemples concrets mobilisables (n.exemples) ;
    //   • 'accroches' → phrases d'accroche prêtes à l'emploi pour OUVRIR une
    //     dissertation (n.accroches). Les accroches sont aussi indexées dans
    //     la recherche globale (Ctrl+K, type 'accroche') ; activer un résultat
    //     ouvre la notion sur ce sous-onglet et fait briller la bonne carte.
    const exs=n.exemples||[];
    const accs=n.accroches||[];
    html+=`<div class="subtabs">
      <button class="subtab${curExempleSubTab==='exemples'?' active':''}" onclick="curExempleSubTab='exemples';renderContent()">Exemples (${exs.length})</button>
      <button class="subtab${curExempleSubTab==='accroches'?' active':''}" onclick="curExempleSubTab='accroches';renderContent()">Accroches (${accs.length})</button>
    </div>`;
    if(curExempleSubTab==='accroches'){
      // ── Sous-onglet « Accroches » ──
      // Cartes plus explicites (façon fiche concept) : un type (Citation,
      // Paradoxe, Mythe…), l'amorce rédigée (a.t), une source facultative
      // (a.src). data-acc=index → cible du scroll/flash venant de la recherche.
      html+=`<div class="slabel">Phrases d'accroche prêtes pour ouvrir une dissertation</div>`;
      if(!accs.length) html+=`<div style="color:var(--color-text-tertiary);font-size:12px;padding:6px 0 10px">Aucune accroche pour l'instant.</div>`;
      accs.forEach((a,ai)=>{
        const nb=a.new?`<span class="new-badge">✦ Nouveau</span>`:'';
        const mb=a.modified?`<span class="modified-badge">✎ Modifié</span>`:'';
        const sc=a.new?' is-new':a.modified?' is-modified':'';
        html+=`<div class="accroche-card${sc}" data-acc="${ai}">
          <div class="accroche-head">
            <span class="accroche-type">${a.type||'Accroche'}</span>${nb}${mb}
          </div>
          <div class="accroche-body">${linkTerms('<span>'+a.t+'</span>')}</div>
          ${a.src?`<div class="accroche-src">— ${linkTerms('<span>'+a.src+'</span>')}</div>`:''}
          ${pPlus('correction','accroche',cur,a.type||'Accroche')}
        </div>`;
      });
      html+=pPlusCat('accroche',cur,'Proposer une accroche');
    } else {
      // ── Sous-onglet « Exemples » (vue historique inchangée) ──
      html+=`<div class="slabel">Exemples concrets mobilisables en dissertation</div>`;
      exs.forEach(e=>{
        const tagColors={
          'Littérature':'#534AB7','Cas clinique':'#D85A30','Science':'#1D9E75','Sciences':'#1D9E75',
          'Société':'#5F5E5A','Écologie':'#1D9E75','Anthropologie':'#3B6D11','Mythe':'#EF9F27',
          'Psychologie':'#534AB7','Psychanalyse':'#993556','Philosophie':'#185FA5','Cinéma':'#D4537E',
          'Histoire':'#993556','Contemporain':'#185FA5','Actualité':'#D85A30','Droit':'#5F5E5A',
          'Texte':'#EF9F27','Art contemporain':'#8B5E3C','Musique':'#8B5E3C','Sociologie':'#5F5E5A',
          'Épistémologie':'#185FA5','Éthique':'#993556','Morale':'#993556','Logique':'#185FA5',
          'Politique':'#5F5E5A','Numérique':'#185FA5','Clinique':'#D85A30'
        };
        const tc=tagColors[e.tag]||c;
        const newBadgeEx=e.new?`<span class="new-badge">✦ Nouveau</span>`:'';
        const modBadgeEx=e.modified?`<span class="modified-badge">✎ Modifié</span>`:'';
        const statusClassEx=e.new?' is-new':e.modified?' is-modified':'';
        html+=`<div class="ex-card${statusClassEx}">
          <div class="ex-head">
            <span class="ex-tag" style="background:${(e.new||e.modified)?((e.new?'var(--color-new-bg)':'var(--color-mod-bg)')):tc+'18'};color:${(e.new||e.modified)?((e.new?'var(--color-new)':'var(--color-mod)')):tc};border:0.5px solid ${(e.new||e.modified)?((e.new?'var(--color-new-border)':'var(--color-mod-border)')):tc+'40'}">${e.tag}</span>
            <span class="ex-title">${e.tit}</span>${newBadgeEx}${modBadgeEx}
          </div>
          <div class="ex-body">${linkTerms('<span>'+e.body+'</span>')}</div>
          <div class="ex-lien">${e.lien}</div>
          ${pPlus('correction','exemple',cur,e.tit)}
        </div>`;
      });
      html+=pPlusCat('exemple',cur,'Proposer un exemple');
    }
  }
  else if(curTab==='diss'){
    // Onglet « Dissertations » : remplace l'ancien onglet Axes et absorbe
    // l'ancien onglet Dissertations. Trois sections :
    //   1. liens avec d'autres notions (navigation) ;
    //   2. plans de dissertation détaillés et déroulables (n.plans) ;
    //   3. autres sujets de dissertation (n.diss, questions simples).
    // 1) Liens avec d'autres notions
    const liens=n.liens||[];
    if(liens.length){
      html+=`<div class="slabel">Liens avec d'autres notions</div>
      <div class="liens-row">
        ${liens.map(l=>{const k=KEYS.find(k=>D[k].l===l);return k?`<div class="lpill" style="border-color:${D[k].c};color:${D[k].c}" onclick="pushHistory();cur='${k}';curTab='auteurs';sbMode='notions';renderSB();renderContent()">${l}</div>`:''}).join('')}
      </div>`;
    }
    // 2) Plans de dissertation détaillés (cartes déroulables)
    const plans=n.plans||[];
    html+=`<div class="slabel">Plans de dissertation détaillés (${plans.length})</div>`;
    if(!plans.length) html+=`<div style="color:var(--color-text-tertiary);font-size:12px;padding:6px 0 10px">Aucun plan détaillé pour l'instant.</div>`;
    plans.forEach(p=>{ html+=planCardHTML(p); });
    html+=pPlusCat('plan',cur,'Proposer un plan');
    // 3) Autres sujets de dissertation (questions simples)
    html+=`<div class="slabel">Autres sujets de dissertation</div>
    <div class="diss-list">`;
    n.diss.forEach(d=>{
      const isNew=typeof d==='object'&&d.new;
      const isMod=typeof d==='object'&&d.modified;
      const txt=typeof d==='object'?d.q:d;
      const modBadgeDq=isMod?`<span class="modified-badge" style="margin-left:6px;vertical-align:middle">✎ Modifié</span>`:'';
      html+=`<div class="dq${isNew?' is-new':isMod?' is-modified':''}">${linkTerms('<span>'+txt+'</span>')}${modBadgeDq}${pPlus('correction','dissertation',cur,txt)}</div>`;
    });
    html+=`</div>`;
    html+=pPlusCat('dissertation',cur,'Proposer un sujet');
  }

  mc.innerHTML=html;
}

/* renderSBList() — affiche la liste des items dans la sidebar scrollable.
   En mode 'notions' : une entrée .nb par notion (avec point coloré).
   En mode 'auteurs' : une entrée .ab par auteur filtré/recherché,
   avec les badges colorés des notions couvertes.                      */
function renderSBList(){
  const wrap=document.getElementById('sb-author-list');
  if(!wrap) return;
  const list=authorsFiltered();
  const inp=document.querySelector('.sb-search');
  if(inp&&document.activeElement!==inp) inp.value=authorSearch;
  let html='';
  if(!list.length){html=`<div style="padding:10px 4px;font-size:11px;color:var(--color-text-tertiary);text-align:center">Aucun résultat</div>`;}
  else{
    const fa=authorFilter.size>0;
    // Compteur TOUJOURS affiché : total d'auteurs, ou « filtrés / total »
    // quand une recherche/un filtre est actif.
    const total=Object.keys(AI).length;
    const hasFilter=authorSearch||fa;
    const countTxt=hasFilter
      ?`${list.length} / ${total} auteurs`
      :`${total} auteur${total>1?'s':''}`;
    html+=`<div class="sb-results-count">${countTxt}</div>`;
    list.forEach(name=>{
      const entry=AI[name];
      const bdgs=entry.notions.map(k=>`<span class="ab-bdg" style="background:${D[k].c}" title="${D[k].l}"></span>`).join('');
      const safeN=name.replace(/'/g,"\\'");
      html+=`<div class="ab${name===curAuthor?' active':''}" onclick="pushHistory();curAuthor='${safeN}';curAuthorTab='idees';renderSBList();renderAuthorContent()">
        <div class="ab-name">${name}</div><div class="ab-badges">${bdgs}</div>
      </div>`;
    });
  }
  wrap.innerHTML=html;
}
