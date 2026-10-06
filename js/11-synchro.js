/* js/11-synchro.js — morceau du script du site. Le build (outils/construire.mjs)
   recolle js/*.js dans l'ORDRE des noms en UN SEUL script, app.js : les
   fonctions restent visibles d'un morceau à l'autre comme avant, et le code
   « de premier niveau » s'exécute dans cet ordre. */
/* ══════════════════════════════════════════════════════════════════
   L. SYNCHRONISATION DU COMPTE (Phase 2)
   ──────────────────────────────────────────────────────────────────
   Quand l'utilisateur est connecté, sa progression au quiz et ses
   préférences (mode révision/édition, visite guidée déjà vue) sont
   sauvegardées dans Supabase (deux tables : quiz_progress, preferences),
   sous forme d'un « blob » JSON par utilisateur. Il retrouve ainsi sa
   progression sur n'importe quel appareil.

   Principes :
   • À la PREMIÈRE connexion, on FUSIONNE le travail déjà fait hors-compte
     (le localStorage anonyme) avec ce qui est éventuellement déjà en ligne,
     pour ne RIEN perdre. Pour le quiz : fusion carte par carte (on garde la
     révision la plus récente) ; pour l'XP et la série : on garde le meilleur.
   • Ensuite, chaque changement local est repoussé en ligne (avec un petit
     délai « anti-rafale » pour grouper les clics rapprochés). Ce qui n'a pas
     pu partir (délai en cours, réseau coupé) est envoyé dès que la page se
     cache, et au retour du réseau (syncDirty / syncFlush, v4).
   • Au retour sur l'onglet, on relit l'en-ligne : si un AUTRE appareil a
     progressé entre-temps, on FUSIONNE le quiz carte par carte (mergeQuiz),
     puis on renvoie la fusion si elle apporte quelque chose (v4 ; avant, le
     distant remplaçait le local).
   • Les remises à zéro sont DATÉES (epoch pour tout, resetAt par rythme) :
     la fusion oublie les révisions plus anciennes, sans quoi une carte
     effacée sur un appareil reviendrait depuis l'autre.
   • Préférences : « dernière écriture gagne » via la colonne updated_at.
   • Non connecté / hors-ligne : tout continue de marcher en localStorage ;
     la synchro est un PLUS, jamais un prérequis. La moindre erreur réseau
     est avalée (console.warn) sans gêner l'usage.

   Sécurité : les tables sont protégées par RLS côté Supabase (chaque
   utilisateur ne lit et n'écrit que SA ligne, via auth.uid() = user_id).
   La clé publique du site ne donne accès à rien d'autre.

   [Notion hors-programme NSI] RLS (« Row Level Security ») = filtre de
   sécurité au niveau de CHAQUE ligne d'une table : la base elle-même
   refuse de renvoyer/modifier les lignes qui ne t'appartiennent pas, même
   si quelqu'un trafiquait la requête. C'est la barrière côté serveur. */

let syncReady=false;        // true une fois la fusion de 1re connexion faite
let syncInFlight=false;     // évite deux fusions simultanées
let syncSuspend=false;      // true pendant qu'on APPLIQUE le distant (ne pas re-pousser)
const syncMeta={quiz:null,prefs:null};   // dernier updated_at serveur connu (anti-réapplication)
let syncQuizTimer=null, syncPrefsTimer=null;
const SYNC_DEBOUNCE=1500;   // ms : regroupe les écritures rapprochées avant l'envoi

function syncUid(){ return authUser?authUser.id:null; }

/* new (Phase 2 — correctif « dernière version gagne ») :
   ── Le « marqueur de synchro » (persisté en localStorage) ───────────────
   On retient, POUR CET APPAREIL, le dernier updated_at serveur qu'on a vu
   pour chaque table, ET le compte (uid) auquel il appartient. Ce marqueur
   permet de distinguer deux situations au chargement :
     • le distant a un updated_at DIFFÉRENT du marqueur → un AUTRE appareil a
       écrit depuis → on adopte le distant (plus récent) ;
     • le distant a le MÊME updated_at que le marqueur → rien n'a bougé en
       ligne depuis notre dernière synchro → c'est le LOCAL qui fait foi, y
       compris une remise à zéro (sinon une suppression « reviendrait »).
   Sans ce marqueur, l'ancienne version fusionnait à chaque chargement, ce
   qui ressuscitait les cartes qu'on venait d'effacer. */
function loadSyncMarker(){
  try{ return JSON.parse(localStorage.getItem('philo-sync')||'null'); }catch(e){ return null; }
}
function saveSyncMarker(){
  try{ localStorage.setItem('philo-sync',JSON.stringify({uid:syncUid(),quiz:syncMeta.quiz,prefs:syncMeta.prefs})); }catch(e){}
}

/* quizBlobForSync() — l'objet quiz à envoyer en ligne. On synchronise TOUT,
   y compris la session en cours (« active »), pour pouvoir la reprendre sur
   un autre appareil (téléphone → PC, etc.). */
function quizBlobForSync(){
  return Object.assign({},loadQuizState());
}

/* prefsBlobForSync() — préférences synchronisées (petites) + le brouillon de
   proposition en cours (philo-drafts), qui voyage ici faute de table dédiée. */
function prefsBlobForSync(){
  let drafts=null,nav=null;
  try{ drafts=JSON.parse(localStorage.getItem('philo-drafts')||'null'); }catch(e){}
  try{ nav=JSON.parse(localStorage.getItem('philo-nav')||'null'); }catch(e){}
  return {
    mode: localStorage.getItem('philo-mode')||'revision',
    tour: localStorage.getItem('philo-tour-v1')||'',
    hp: localStorage.getItem('philo-hp')||'',            // étape 5 : hors programme affiché ('1') ou masqué ('0')
    hpChoix: localStorage.getItem('philo-hp-choix')||'', // la proposition d'arrivée a reçu une réponse
    theme: localStorage.getItem('philo-theme')||'',      // étape 6 : sombre, clair ou auto
    texte: localStorage.getItem('philo-texte')||'',      // étape 6 : taille du texte
    drafts: drafts,
    nav: nav     // position courante (cross-plateforme : reprendre où l'on en était)
  };
}

/* applyPrefsBlob() — applique mode + tour reçus du serveur. Le brouillon est
   traité à part (adoptRemoteDrafts), pour pouvoir le CONSERVER à la 1re
   connexion si l'utilisateur en avait déjà un en cours. */
function applyPrefsBlob(p){
  if(!p) return;
  if(p.mode) localStorage.setItem('philo-mode',p.mode);
  if(p.tour) localStorage.setItem('philo-tour-v1',p.tour);
  // Étape 5 : le choix hors programme suit le compte ; la proposition
  // d'arrivée se ferme si l'autre appareil y a déjà répondu.
  if(p.hp){ const avant=voirHP(); localStorage.setItem('philo-hp',p.hp); if(voirHP()!==avant){ renderSB(); renderCurrentView(); } }
  if(p.hpChoix){ localStorage.setItem('philo-hp-choix',p.hpChoix); fermerHpInvite(); }
  // Étape 6 : thème et taille du texte suivent aussi le compte.
  if(p.theme||p.texte){
    const avant=themeEffectif();
    if(p.theme) localStorage.setItem('philo-theme',p.theme);
    if(p.texte) localStorage.setItem('philo-texte',p.texte);
    appliquerAffichage();
    if(themeEffectif()!==avant){ renderSB(); renderCurrentView(); }
  }
  applyPhiloMode();
  // Position distante (cross-plateforme) : on ne l'adopte QUE si l'utilisateur
  // n'a pas encore navigué sur cet appareil (navTouched). Sinon sa position
  // locale fait foi — on ne le « téléporte » jamais en pleine lecture, et on
  // n'écrase pas non plus son philo-nav local.
  if(p.nav && !navTouched && !sameNav(p.nav, navStateNow())){
    // Avant de basculer sur la page d'un AUTRE appareil, on empile la page
    // LOCALE courante dans l'historique : ainsi « ← Retour » ramène à là où CET
    // appareil en était (la page distante ne fait pas disparaître la locale).
    // On n'effleure PAS navTouched : l'appareil reste un spectateur passif et
    // continue d'adopter les mises à jour distantes suivantes.
    const localBefore=navStateNow();
    if(applyNavState(p.nav)){
      try{ localStorage.setItem('philo-nav', JSON.stringify(p.nav)); }catch(e){}
      const top=navHistory[navHistory.length-1];
      if(navEntryValid(localBefore) && !sameNav(top,localBefore)){
        navHistory.push(localBefore);
        if(navHistory.length>50) navHistory.shift();
      }
      renderSB(); renderCurrentView(); updateBackBtn();
    }
  }
}

/* adoptRemoteDrafts() — recopie le brouillon du compte dans le stockage local
   ET dans l'état d'exécution.
   Cas délicat : la modale de proposition est OUVERTE sur cet appareil.
     • si rien n'est saisi localement (draftIsEmpty) → on adopte quand même et on
       RE-REND la modale, sinon le brouillon venu d'un autre appareil resterait
       invisible (on ne voit le brouillon qu'en ouvrant la modale… qui bloquait
       justement la mise à jour) ;
     • si une saisie est en cours → on garde la saisie locale (on n'écrase pas
       ce que le contributeur est en train d'écrire), le stockage local ayant
       déjà reçu la copie distante pour un prochain chargement.
   (Appelé sous syncSuspend : le draftChanged de renderProposal ne re-pousse pas.) */
function adoptRemoteDrafts(p){
  const d=p && p.drafts;
  if(!d) return;
  try{ localStorage.setItem('philo-drafts', JSON.stringify(d)); }catch(e){}
  const modalOpen=proposalOpen();
  if(modalOpen && !draftIsEmpty()) return;     // saisie en cours : on ne touche pas au runtime
  applyDraftsBlob(d, modalOpen);               // force=true si modale ouverte mais vide
  if(modalOpen && typeof renderProposal==='function') renderProposal();   // refléter à l'écran
}

/* mergeQuiz(a,b) — fusionne deux états de quiz sans rien perdre (a = local).
   v4 : c'est désormais LA règle de synchro du quiz, à chaque retour sur
   l'onglet et pas seulement à la 1re connexion (avant, le bloc distant
   remplaçait le local : des réponses faites hors ligne sur un appareil
   pouvaient disparaître). Les dates de remise à zéro empêchent la fusion de
   ressusciter une progression effacée.
   - les deux côtés passent d'abord par migrateQuizState (anciens ids) ;
   - epoch (remise à zéro totale) : on garde la plus récente ; resetAt[h]
     (remise à zéro d'un rythme) aussi. Une révision antérieure à l'une ou
     l'autre est oubliée ;
   - byHorizon : union carte par carte, on garde la révision la plus récente
     (lastSeen le plus grand) ;
   - gamif.xp : maximum des côtés qui datent de la DERNIÈRE remise à zéro
     (l'XP d'avant une remise à zéro ne revient pas) ;
   - daily : meilleure série conservée ; le reste suit la date la plus récente ;
   - active : la session écrite en dernier (activeAt), y compris « aucune » ;
   - prefs.dontWarnNewSession : vrai si vrai d'au moins un côté. */
function mergeQuiz(a,b){
  a=migrateQuizState(JSON.parse(JSON.stringify(a||{})));
  b=migrateQuizState(JSON.parse(JSON.stringify(b||{})));
  const out=JSON.parse(JSON.stringify(a));     // base = état local
  const epoch=Math.max(a.epoch||0,b.epoch||0);
  const ra=a.resetAt||{}, rb=b.resetAt||{};
  out.epoch=epoch;
  out.resetAt={};
  out.byHorizon={};
  ['sprint','long'].forEach(h=>{
    out.resetAt[h]=Math.max(ra[h]||0,rb[h]||0);
    const cutoff=Math.max(epoch,out.resetAt[h]);   // tout ce qui précède est oublié
    const merged={};
    [a,b].forEach(side=>{
      const src=(side.byHorizon&&side.byHorizon[h])||{};
      for(const id in src){
        const cand=src[id], seen=(cand&&cand.lastSeen)||0;
        if(seen<=cutoff) continue;
        if(!merged[id] || seen>(merged[id].lastSeen||0)) merged[id]=cand;
      }
    });
    out.byHorizon[h]=merged;
  });
  const xpOf=s=>((s.epoch||0)===epoch && s.gamif && s.gamif.xp)||0;
  const mx=Math.max(xpOf(a),xpOf(b));
  out.gamif={xp:mx, level:quizLevel(mx)};
  // Un côté antérieur à la dernière remise à zéro totale ne compte pas pour le jour/la série.
  const ad=(a.epoch||0)===epoch?(a.daily||{}):{}, bd=(b.epoch||0)===epoch?(b.daily||{}):{};
  // On garde le « daily » du jour le plus récent. ATTENTION : le quiz
  // renseigne .date (le dernier jour actif), pas .lastDate (champ historique
  // resté vide) — c'est donc bien .date qui sert d'arbitre. Puis on conserve
  // la meilleure série (streak), pour ne jamais la faire reculer à la fusion.
  out.daily=((bd.date||'')>(ad.date||'')) ? Object.assign({},ad,bd) : Object.assign({},bd,ad);
  out.daily.streak=Math.max(ad.streak||0, bd.streak||0);
  if(!out.daily.goal) out.daily.goal=(a.daily&&a.daily.goal)||(b.daily&&b.daily.goal)||QUIZ_DEFAULT_GOAL;
  // Session en cours : celle qui a été écrite en dernier ; à égalité (états
  // d'avant v4, sans date), celle de cet appareil, sinon la distante.
  const aAt=a.activeAt||0, bAt=b.activeAt||0;
  out.active=bAt>aAt?(b.active||null):aAt>bAt?(a.active||null):(a.active||b.active||null);
  out.activeAt=Math.max(aAt,bAt);
  out.prefs=out.prefs||{};
  out.prefs.dontWarnNewSession=!!(((a.prefs||{}).dontWarnNewSession)||((b.prefs||{}).dontWarnNewSession));
  if(!out.horizon) out.horizon=b.horizon||'sprint';
  return out;
}

function quizOverlayOpen(){
  const o=document.getElementById('quiz-overlay');
  return !!(o && o.classList.contains('open'));
}

/* syncOnLogin() — au moment où l'on devient connecté : lit le distant, puis
   décide quoi faire selon le « marqueur de synchro » de cet appareil :

     • AUCUN marqueur (vraie 1re connexion / appareil tout neuf) → on FUSIONNE
       une fois les données anonymes locales avec le compte (rien n'est perdu).
     • marqueur présent ET distant inchangé depuis (même updated_at) → le LOCAL
       fait foi (y compris une remise à zéro) → on POUSSE le local.
     • marqueur présent MAIS distant différent (autre appareil) OU compte
       différent (changement de session) → on ADOPTE le distant tel quel.

   C'est ce qui fait que « la version la plus récente gagne » : on ne fusionne
   plus à chaque chargement (ce qui ressuscitait les cartes effacées). */
async function syncOnLogin(){
  if(!SB||!authUser) return;
  const uid=syncUid();
  const marker=loadSyncMarker();
  const firstEver = !marker;                          // jamais synchronisé sur cet appareil
  const sameAccount = !!marker && marker.uid===uid;   // même compte qu'au dernier passage
  try{
    const [q,p]=await Promise.all([
      SB.from('quiz_progress').select('data,updated_at').eq('user_id',uid).maybeSingle(),
      SB.from('preferences').select('data,updated_at').eq('user_id',uid).maybeSingle()
    ]);
    if(q.error) throw q.error;
    if(p.error) throw p.error;

    syncSuspend=true;   // on écrit en localStorage sans déclencher de push en retour

    // ── QUIZ ──
    const remoteQ=q.data&&q.data.data;
    const remoteQAt=(q.data&&q.data.updated_at)||null;
    if(firstEver || (sameAccount && remoteQAt!==marker.quiz)){
      // 1re synchro sur cet appareil (on combine l'anonyme local et le compte),
      // OU un autre appareil du même compte a écrit depuis notre dernier
      // passage : on FUSIONNE carte par carte (mergeQuiz). Rien n'est perdu,
      // et une remise à zéro faite ailleurs est respectée grâce à ses dates.
      // (Avant v4, le second cas ADOPTAIT le distant tel quel : les réponses
      // faites ici sans réseau disparaissaient.)
      if(remoteQ && remoteQ.byHorizon) saveQuizState(mergeQuiz(loadQuizState(), remoteQ));
      // (si le distant est vide : on garde le local, il sera poussé ci-dessous)
    } else if(sameAccount){
      // Rien n'a changé en ligne depuis notre dernier passage → le local fait
      // foi (on ne touche à rien ; on poussera l'état local plus bas).
    } else {
      // Changement de COMPTE sur cet appareil → on adopte le distant TEL QUEL :
      // on ne mélange pas la progression de deux personnes.
      if(remoteQ){ saveQuizState(remoteQ); }
      else { localStorage.removeItem('philo-quiz'); }
    }
    syncMeta.quiz=remoteQAt;

    // ── PRÉFÉRENCES ── (même logique, en plus simple : pas de fusion fine)
    const remoteP=p.data&&p.data.data;
    const remotePAt=(p.data&&p.data.updated_at)||null;
    if(firstEver){
      if(remoteP){
        applyPrefsBlob(remoteP);
        // Brouillon : on n'adopte celui du compte que si le local est vide
        // (sinon on garderait ce que l'utilisateur était en train d'écrire).
        if(draftIsEmpty()) adoptRemoteDrafts(remoteP);
      }
    } else if(sameAccount && remotePAt===marker.prefs){
      // local fait foi (mode, tour ET brouillon local conservés)
    } else if(remoteP){
      applyPrefsBlob(remoteP);
      adoptRemoteDrafts(remoteP);
    }
    syncMeta.prefs=remotePAt;

    syncSuspend=false;

    // On pousse l'état local courant : il devient la référence partagée. Le push
    // met à jour syncMeta puis persiste le marqueur (cf. syncPushQuiz/Prefs).
    await syncPushQuiz(true);
    await syncPushPrefs(true);

    syncReady=true;
    applyPhiloMode();
    // Aligner le runtime du quiz sur l'état (fusionné/adopté) : horizon + session
    // reprenable, pour que « Reprendre » apparaisse sans rouvrir l'overlay.
    syncRuntimeQuizFromStorage({keepLive:true});
    if(quizOverlayOpen()){ try{ renderQuiz(); }catch(e){} }
  }catch(e){
    syncSuspend=false;
    console.warn("[sync] synchro initiale impossible :", (e&&e.message)||e);
    // syncReady reste false : on réessaiera à la prochaine connexion ; entre-temps
    // tout fonctionne en local (la synchro n'est jamais un prérequis).
  }
}

/* syncPushQuiz(immediate) — envoie le quiz en ligne (upsert sur user_id). En
   mode différé, regroupe les appels rapprochés (anti-rafale).
   [Notion hors-programme NSI] « upsert » = UPDATE-or-INSERT : si la ligne de
   cet utilisateur existe déjà on la met à jour, sinon on la crée — en une
   seule requête, sans avoir à tester l'existence au préalable. */
/* syncDirty — v4 : « il reste quelque chose à envoyer ». Un compteur par
   table, augmenté à chaque changement local, remis à 0 seulement quand un
   envoi a RÉUSSI sans qu'un nouveau changement soit arrivé entre-temps. Tant
   qu'il n'est pas nul, l'envoi est retenté : quand la page se cache (on
   ferme l'onglet ou on change d'appli pendant le délai anti-rafale) et au
   retour du réseau (cf. initAuth). Avant v4, un envoi raté n'était jamais
   refait. */
const syncDirty={quiz:0,prefs:0};

async function syncPushQuiz(immediate){
  if(!SB||!authUser) return;
  if(!immediate) syncDirty.quiz++;
  const doPush=async()=>{
    const uid=syncUid(); if(!uid) return;
    const now=new Date().toISOString(), v=syncDirty.quiz;
    try{
      const {error}=await SB.from('quiz_progress')
        .upsert({user_id:uid,data:quizBlobForSync(),updated_at:now},{onConflict:'user_id'});
      if(error){ console.warn("[sync] envoi du quiz :", error.message); syncDirty.quiz=Math.max(syncDirty.quiz,1); return; }
      syncMeta.quiz=now; saveSyncMarker();   // notre local devient la dernière version connue
      if(syncDirty.quiz===v) syncDirty.quiz=0;
    }catch(e){ console.warn("[sync] envoi du quiz :", (e&&e.message)||e); syncDirty.quiz=Math.max(syncDirty.quiz,1); }
  };
  clearTimeout(syncQuizTimer);
  if(immediate){ await doPush(); }
  else { syncQuizTimer=setTimeout(doPush, SYNC_DEBOUNCE); }
}

async function syncPushPrefs(immediate){
  if(!SB||!authUser) return;
  if(!immediate) syncDirty.prefs++;
  const doPush=async()=>{
    const uid=syncUid(); if(!uid) return;
    const now=new Date().toISOString(), v=syncDirty.prefs;
    try{
      const {error}=await SB.from('preferences')
        .upsert({user_id:uid,data:prefsBlobForSync(),updated_at:now},{onConflict:'user_id'});
      if(error){ console.warn("[sync] envoi des préférences :", error.message); syncDirty.prefs=Math.max(syncDirty.prefs,1); return; }
      syncMeta.prefs=now; saveSyncMarker();   // notre local devient la dernière version connue
      if(syncDirty.prefs===v) syncDirty.prefs=0;
    }catch(e){ console.warn("[sync] envoi des préférences :", (e&&e.message)||e); syncDirty.prefs=Math.max(syncDirty.prefs,1); }
  };
  clearTimeout(syncPrefsTimer);
  if(immediate){ await doPush(); }
  else { syncPrefsTimer=setTimeout(doPush, SYNC_DEBOUNCE); }
}

/* syncFlush() — v4 : envoie tout de suite ce qui attendait (délai anti-rafale
   en cours, ou envoi raté). Appelé quand la page se cache ou va être fermée,
   pour qu'une réponse donnée juste avant de quitter ne reste pas en local. */
function syncFlush(){
  if(!syncReady || syncSuspend) return;
  if(syncDirty.quiz) syncPushQuiz(true);
  if(syncDirty.prefs) syncPushPrefs(true);
}

/* quizDiffers(x, y) — v4 : vrai si l'état fusionné x apporte quelque chose
   que l'état distant y n'a pas (une carte, une révision plus récente, de
   l'XP, une autre session, une remise à zéro). Sert à ne renvoyer la fusion
   en ligne que si elle change quelque chose : sinon deux appareils se
   renverraient le même état à chaque retour sur l'onglet. */
function quizDiffers(x,y){
  y=migrateQuizState(JSON.parse(JSON.stringify(y||{})));
  if((x.epoch||0)!==(y.epoch||0)) return true;
  for(const h of ['sprint','long']){
    if(((x.resetAt||{})[h]||0)!==((y.resetAt||{})[h]||0)) return true;
    const xs=(x.byHorizon&&x.byHorizon[h])||{}, ys=(y.byHorizon&&y.byHorizon[h])||{};
    if(Object.keys(xs).length!==Object.keys(ys).length) return true;
    for(const id in xs){ const p=ys[id]; if(!p || (p.lastSeen||0)!==(xs[id].lastSeen||0)) return true; }
  }
  if(((x.gamif||{}).xp||0)!==((y.gamif||{}).xp||0)) return true;
  if((x.activeAt||0)!==(y.activeAt||0)) return true;
  return false;
}

/* Hooks appelés depuis le code existant après une écriture locale. Ils ne
   font rien tant que la fusion de 1re connexion n'est pas finie (syncReady),
   ni pendant qu'on applique le distant (syncSuspend). */
function syncOnQuizChange(){ if(syncReady && !syncSuspend) syncPushQuiz(false); }
function syncOnPrefsChange(){ if(syncReady && !syncSuspend) syncPushPrefs(false); }

/* syncOnFocus() — au retour sur l'onglet (et au retour du réseau) : si un
   autre appareil a écrit depuis (updated_at différent du dernier connu), on
   FUSIONNE son quiz avec le nôtre carte par carte (v4 ; avant, on adoptait le
   distant tel quel et ce qui avait été fait ici entre-temps était perdu). Les
   remises à zéro datées (epoch, resetAt) empêchent de ressusciter des cartes
   effacées ailleurs. Si la fusion apporte quelque chose au distant, on la
   renvoie aussitôt, pour que les appareils convergent. Les préférences, elles,
   suivent toujours la dernière écriture. Enfin, ce qui attendait d'être
   envoyé (syncDirty) part. */
async function syncOnFocus(){
  if(!SB||!authUser||!syncReady) return;
  const uid=syncUid();
  try{
    const [q,p]=await Promise.all([
      SB.from('quiz_progress').select('data,updated_at').eq('user_id',uid).maybeSingle(),
      SB.from('preferences').select('data,updated_at').eq('user_id',uid).maybeSingle()
    ]);
    syncSuspend=true;
    let pushQuiz=false;
    if(q.data && q.data.updated_at && q.data.updated_at!==syncMeta.quiz){
      if(q.data.data){
        const merged=mergeQuiz(loadQuizState(), q.data.data);
        saveQuizState(merged);
        pushQuiz=quizDiffers(merged, q.data.data);
      } else pushQuiz=true;                   // ligne vide en ligne : le local fait foi
      syncMeta.quiz=q.data.updated_at; saveSyncMarker();
      // Aligner le runtime sur l'état fusionné (horizon + session reprenable) afin
      // que « Reprendre » et le bon rythme apparaissent même overlay déjà ouvert.
      syncRuntimeQuizFromStorage({keepLive:true});
      if(quizOverlayOpen()){ try{ renderQuiz(); }catch(e){} }
    }
    if(p.data && p.data.updated_at && p.data.updated_at!==syncMeta.prefs){
      applyPrefsBlob(p.data.data||{});
      adoptRemoteDrafts(p.data.data||{});   // brouillon écrit depuis un autre appareil
      syncMeta.prefs=p.data.updated_at; saveSyncMarker();
    }
    syncSuspend=false;
    if(pushQuiz || syncDirty.quiz) await syncPushQuiz(true);
    if(syncDirty.prefs) await syncPushPrefs(true);
  }catch(e){ syncSuspend=false; }
}

/* maybeStartSync() — lance la fusion initiale une seule fois, dès qu'on est
   connecté. Appelé après getSession et à chaque événement « connecté ». */
function maybeStartSync(){
  if(!SB||!authUser||syncReady||syncInFlight) return;
  syncInFlight=true;
  syncOnLogin().finally(()=>{ syncInFlight=false; });
}

/* syncResetState() — à la déconnexion : on coupe la synchro. Le localStorage
   reste intact (l'utilisateur peut continuer en mode anonyme). */
function syncResetState(){
  syncReady=false;
  syncMeta.quiz=null; syncMeta.prefs=null;
  syncDirty.quiz=0; syncDirty.prefs=0;
  clearTimeout(syncQuizTimer); clearTimeout(syncPrefsTimer);
}
