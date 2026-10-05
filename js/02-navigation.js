/* js/02-navigation.js — morceau du script du site. Le build (outils/construire.mjs)
   recolle js/*.js dans l'ORDRE des noms en UN SEUL script, app.js : les
   fonctions restent visibles d'un morceau à l'autre comme avant, et le code
   « de premier niveau » s'exécute dans cet ordre. */
/* ── Historique de navigation ────────────────────────────────── */
/* ── Système de navigation historique ───────────────────────────────
   navHistory  : pile d'états (snapshots de cur, curTab, sbMode, etc.)
   pushHistory(): sauvegarde l'état courant avant chaque navigation.
   backBtnHTML(): génère le HTML du bouton Retour — désactivé si la
                  pile est vide, sinon affiche le nombre de pages.
   Le bouton Retour est placé dans la barre d'onglets (.tabs) de chaque
   vue (notion, auteur, concept) par les fonctions renderContent* .     */
let navHistory=[];
let _navigating=false; // évite les boucles lors du goBack
// navTouched : l'utilisateur a-t-il navigué depuis le chargement ? (mis à true
// dans pushHistory). Sert à la PERSISTANCE DE POSITION (philo-nav) : on ne
// pousse vers le cloud qu'après une vraie navigation, et on n'ADOPTE une
// position distante (autre appareil) que si l'utilisateur n'a pas encore bougé
// ici — pour ne jamais le « téléporter » en pleine lecture.
let navTouched=false;

/* pushHistory() — empile l'état d'affichage courant (mode, notion, onglets,
   auteur, concept) dans la pile de navigation, pour le bouton Retour. Ignore
   les doublons et les appels survenant pendant un goBack (drapeau _navigating). */
function pushHistory(){
  if(_navigating) return;
  navTouched=true;   // une navigation utilisateur a eu lieu (cf. persistNav / adoption distante)
  const last=navHistory[navHistory.length-1];
  // Ne pas pousser si on est déjà sur la même page
  if(last&&last.sbMode===sbMode&&last.cur===cur&&last.curTab===curTab
    &&last.curAuthor===curAuthor&&last.curAuthorTab===curAuthorTab
    &&last.curConcept===curConcept&&last.methodoTopic===methodoTopic) return;
  navHistory.push({sbMode,cur,curTab,curAuthor,curAuthorTab,curConcept,methodoTopic});
  if(navHistory.length>50) navHistory.shift();
  updateBackBtn();
}

/* goBack() — dépile le dernier état de navigation et le restaure (bouton
   Retour). _navigating empêche pushHistory de ré-empiler pendant l'opération. */
function goBack(){
  if(!navHistory.length) return;
  _navigating=true;
  const s=navHistory.pop();
  sbMode=s.sbMode; cur=s.cur; curTab=s.curTab;
  curAuthor=s.curAuthor; curAuthorTab=s.curAuthorTab; curConcept=s.curConcept;
  if(s.methodoTopic) methodoTopic=s.methodoTopic;
  renderSB();
  if(sbMode==='auteurs'&&curAuthor) renderAuthorContent();
  else if(sbMode==='concepts'||sbMode==='reperes') renderConceptContent();
  else if(sbMode==='methodo') renderMethodoContent();   // guide de méthodologie
  else renderContent();
  _navigating=false;
  updateBackBtn();
}

/* updateBackBtn() — synchronise l'état (activé/désactivé + infobulle) de
   tous les boutons Retour présents dans le DOM avec la pile de navigation. */
function updateBackBtn(){
  document.querySelectorAll('.back-btn').forEach(btn=>{
    btn.disabled=navHistory.length===0;
    btn.title=navHistory.length?`Retour (${navHistory.length} page${navHistory.length>1?'s':''} dans l'historique)`:'Aucune page précédente';
  });
  // Persiste la pile « Retour » (résiste à l'actualisation). updateBackBtn est
  // appelée à chaque changement de la pile (pushHistory / goBack).
  try{ localStorage.setItem('philo-navhist', JSON.stringify(navHistory)); }catch(e){}
}

/* ── Persistance de la POSITION (résiste à l'actualisation + cross-plateforme) ──
   On mémorise « où l'on est » (mode sidebar + fiche + onglet) dans localStorage
   (philo-nav) à chaque rendu, et — pour les comptes connectés — on l'inclut dans
   les préférences synchronisées (prefsBlobForSync.nav). Ainsi : un rafraîchissement
   rouvre la même page, et un autre appareil reprend là où on s'était arrêté.
   Liste des onglets de notion (validation à la restauration). */
const NOTION_TABS=['auteurs','textes','concepts','diss','exemples'];

/* renderCurrentView() — (re)rend la vue correspondant au sbMode courant.
   Même aiguillage que goBack ; factorisé pour la restauration et le démarrage. */
function renderCurrentView(){
  if(sbMode==='auteurs'&&curAuthor) renderAuthorContent();
  else if(sbMode==='concepts'||sbMode==='reperes') renderConceptContent();
  else if(sbMode==='methodo') renderMethodoContent();
  else renderContent();
}

/* navStateNow() — capture la position courante sous forme d'objet sérialisable. */
function navStateNow(){
  return {sbMode,cur,curTab,curConceptSubTab,curExempleSubTab,
          curAuthor,curAuthorTab,curConcept,methodoTopic};
}

/* sameNav(a,b) — deux états désignent-ils la même page ? (champs « cœur »,
   ceux que goBack restaure ; les sous-onglets sont ignorés). */
function sameNav(a,b){
  return !!a&&!!b&&a.sbMode===b.sbMode&&a.cur===b.cur&&a.curTab===b.curTab
    &&a.curAuthor===b.curAuthor&&a.curAuthorTab===b.curAuthorTab
    &&a.curConcept===b.curConcept&&a.methodoTopic===b.methodoTopic;
}

/* persistNav() — sauvegarde la position dans localStorage à chaque rendu (donc
   à chaque navigation). Si l'utilisateur a réellement navigué (navTouched) et
   qu'il est connecté, la synchro des préférences (debouncée) emportera aussi la
   position vers le cloud. Appelée depuis renderCrumbs (commun aux 4 vues). */
function persistNav(){
  try{ localStorage.setItem('philo-nav', JSON.stringify(navStateNow())); }catch(e){}
  if(navTouched && typeof syncOnPrefsChange==='function') syncOnPrefsChange();
}

/* applyNavState(s) — applique une position (locale ou distante) aux variables
   globales, APRÈS validation (la cible doit toujours exister — une notion/fiche
   a pu disparaître entre deux versions). Renvoie true si une position valide a
   été appliquée, false sinon (on garde alors les valeurs par défaut). */
function applyNavState(s){
  if(!s||typeof s!=='object') return false;
  const m=s.sbMode;
  if(m==='notions'){
    if(!s.cur||!D[s.cur]) return false;
    cur=s.cur; sbMode='notions';
    curTab=NOTION_TABS.includes(s.curTab)?s.curTab:'auteurs';
    if(s.curConceptSubTab) curConceptSubTab=s.curConceptSubTab;
    if(s.curExempleSubTab) curExempleSubTab=s.curExempleSubTab;
    return true;
  }
  if(m==='auteurs'){
    if(!s.curAuthor||!AI[s.curAuthor]) return false;
    curAuthor=s.curAuthor; curAuthorTab=s.curAuthorTab||'idees'; sbMode='auteurs';
    return true;
  }
  if(m==='concepts'||m==='reperes'){
    const c=CONCEPTS.find(x=>x&&x.id===s.curConcept);
    if(!c) return false;
    curConcept=s.curConcept; sbMode=m;
    return true;
  }
  if(m==='methodo'){
    methodoTopic=(METHODO_TOPICS.find(t=>t.id===s.methodoTopic))?s.methodoTopic:'dissertation';
    sbMode='methodo';
    return true;
  }
  return false;
}

/* restoreNavFromStorage() — au démarrage : recharge la position sauvegardée.
   Renvoie true si une position valide a été restaurée. */
function restoreNavFromStorage(){
  let s; try{ s=JSON.parse(localStorage.getItem('philo-nav')||'null'); }catch(e){ return false; }
  return applyNavState(s);
}

/* navEntryValid(s) — une entrée d'historique pointe-t-elle encore vers une
   cible existante ? (sans muter l'état). Sert à nettoyer l'historique restauré. */
function navEntryValid(s){
  if(!s) return false;
  if(s.sbMode==='notions') return !!D[s.cur];
  if(s.sbMode==='auteurs') return !!(s.curAuthor&&AI[s.curAuthor]);
  if(s.sbMode==='concepts'||s.sbMode==='reperes') return !!CONCEPTS.find(x=>x&&x.id===s.curConcept);
  if(s.sbMode==='methodo') return true;
  return false;
}

/* restoreNavHistory() — au démarrage : recharge la PILE « ← Retour »
   (philo-navhist) pour que le bouton Retour survive à l'actualisation. Local
   seulement (l'historique est propre à l'appareil ; la position, elle, se
   synchronise). Entrées invalides (cible disparue) filtrées. */
function restoreNavHistory(){
  let arr; try{ arr=JSON.parse(localStorage.getItem('philo-navhist')||'null'); }catch(e){ return; }
  if(Array.isArray(arr)) navHistory=arr.filter(navEntryValid).slice(-50);
}

/* backBtnHTML() — renvoie le HTML du bouton Retour (désactivé si la pile
   de navigation est vide). Inséré en tête des barres d'onglets. */
function backBtnHTML(){
  const disabled=navHistory.length===0;
  return `<button class="back-btn"${disabled?' disabled':''} onclick="goBack()" title="${disabled?'Aucune page précédente':`Retour (${navHistory.length} page${navHistory.length>1?'s':''})`}">← Retour</button>`;
}
