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
  navAdresseEnAttente=true;   // la page qui va s'afficher aura sa propre entrée dans l'historique du navigateur
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
  majAdresse();   // l'adresse #/… et le titre de l'onglet suivent la page affichée
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

/* ── Adresses de page (#/…) — étape 3, octobre 2026 ──────────────────────
   Chaque vue a son adresse, dans le fragment de l'URL (après le #) :
     #/notion/<clé>[/<onglet>]      #/auteur/<nom>[/<onglet>]
     #/concept/<id>                 #/repere/<id>      #/methodo/<parcours>
   Le # plutôt qu'un vrai chemin : il marche partout, y compris index.html
   ouvert par double-clic, et Vercel n'a aucune réécriture à faire.
   Ce que ça apporte : un lien partagé ouvre la bonne page (« Partager »
   copie l'adresse de la page ouverte), le bouton « précédent » du
   navigateur revient à la page d'avant, et le titre de l'onglet nomme la
   page (favoris, historique du navigateur).
   Mécanique : majAdresse() est appelée à chaque rendu (par persistNav) ;
   après une vraie navigation (pushHistory pose navAdresseEnAttente) elle
   AJOUTE une entrée à l'historique du navigateur (pushState), sinon elle
   remplace l'adresse courante (replaceState). « popstate » (précédent /
   suivant du navigateur) rejoue l'adresse atteinte. */
const ONGLETS_AUTEUR=['idees','citations','oeuvres','dialogues'];
let navAdresseEnAttente=false;   // la prochaine majAdresse doit-elle créer une entrée ?

/* adresseDe(s) — l'adresse (#/…) d'un état de navigation. */
function adresseDe(s){
  const e=encodeURIComponent;
  if(s.sbMode==='auteurs'&&s.curAuthor) return '#/auteur/'+e(s.curAuthor)+(s.curAuthorTab&&s.curAuthorTab!=='idees'?'/'+e(s.curAuthorTab):'');
  if(s.sbMode==='concepts'&&s.curConcept) return '#/concept/'+e(s.curConcept);
  if(s.sbMode==='reperes'&&s.curConcept) return '#/repere/'+e(s.curConcept);
  if(s.sbMode==='methodo') return '#/methodo/'+e(s.methodoTopic||'dissertation');
  return '#/notion/'+e(s.cur)+(s.curTab&&s.curTab!=='auteurs'?'/'+e(s.curTab):'');
}

/* etatDe(h) — l'état de navigation d'une adresse #/…, ou null si l'adresse
   n'en est pas une. Un nom d'auteur sous une forme courte (« Arendt ») est
   ramené au nom canonique. La validité de la cible est vérifiée ensuite par
   applyNavState (une adresse vers une fiche disparue est ignorée). */
function etatDe(h){
  const m=/^#\/([a-z]+)\/([^/]+)(?:\/([^/]+))?$/.exec(h||'');
  if(!m) return null;
  let v, o;
  try{ v=decodeURIComponent(m[2]); o=m[3]?decodeURIComponent(m[3]):null; }catch(e){ return null; }
  switch(m[1]){
    case 'notion':  return {sbMode:'notions',cur:v,curTab:o||'auteurs'};
    case 'auteur':  return {sbMode:'auteurs',curAuthor:(AI[v]||!AUTHOR_ALIASES[v])?v:AUTHOR_ALIASES[v],curAuthorTab:ONGLETS_AUTEUR.includes(o)?o:'idees'};
    case 'concept': return {sbMode:'concepts',curConcept:v};
    case 'repere':  return {sbMode:'reperes',curConcept:v};
    case 'methodo': return {sbMode:'methodo',methodoTopic:v};
  }
  return null;
}

/* titrePage() — le titre de l'onglet : « Liberté · Graphe Philosophie ». */
function titrePage(){
  let t='';
  if(sbMode==='auteurs'&&curAuthor) t=curAuthor;
  else if((sbMode==='concepts'||sbMode==='reperes')&&curConcept){ const c=CONCEPTS.find(x=>x.id===curConcept); t=c?c.term:''; }
  else if(sbMode==='methodo') t='Méthodo';
  else if(D[cur]) t=D[cur].l;
  return (t?t+' · ':'')+'Graphe Philosophie';
}

/* adresseProtegee() — l'URL porte-t-elle un jeton de connexion (retour d'un
   lien « mot de passe oublié » ou de Google) ? supabase-js le lit dans le #
   puis nettoie l'URL lui-même : il ne faut surtout pas l'écraser avant. */
function adresseProtegee(){ return /access_token|refresh_token|type=recovery|error_description/.test(location.hash); }

/* majAdresse() — aligne l'adresse et le titre sur la page affichée. */
function majAdresse(){
  document.title=titrePage();
  if(adresseProtegee()) return;
  const h=adresseDe(navStateNow());
  if(location.hash!==h){
    try{ history[navAdresseEnAttente?'pushState':'replaceState'](null,'',h); }catch(e){}
  }
  navAdresseEnAttente=false;
}

/* Précédent / suivant du navigateur : on affiche la page de l'adresse
   atteinte, sans rien empiler. Si c'est aussi le sommet de la pile
   « ← Retour » du site, on l'en retire, pour que les deux restent d'accord. */
window.addEventListener('popstate',()=>{
  const s=etatDe(location.hash);
  if(!s||!applyNavState(s)) return;
  _navigating=true;
  renderSB(); renderCurrentView();
  _navigating=false;
  const top=navHistory[navHistory.length-1];
  if(top&&sameNav(top,navStateNow())){ navHistory.pop(); updateBackBtn(); }
});

/* restoreNavFromAddress() — au démarrage : une adresse #/… valide (lien
   partagé, favori) l'emporte sur la position mémorisée. Compte comme une
   navigation de l'utilisateur (navTouched) : la position d'un autre appareil
   ne viendra pas la remplacer. Renvoie true si elle a été appliquée. */
function restoreNavFromAddress(){
  const s=etatDe(location.hash);
  if(!s||!applyNavState(s)) return false;
  navTouched=true;
  return true;
}
