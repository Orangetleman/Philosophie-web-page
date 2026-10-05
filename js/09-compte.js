/* js/09-compte.js — morceau du script du site. Le build (outils/construire.mjs)
   recolle js/*.js dans l'ORDRE des noms en UN SEUL script, app.js : les
   fonctions restent visibles d'un morceau à l'autre comme avant, et le code
   « de premier niveau » s'exécute dans cet ordre. */
/* ── K. COMPTES — authentification (Supabase) ───────────────────────
   Couche « compte » FACULTATIVE : se connecter (Google ou e-mail + mot de
   passe) pour, plus tard, synchroniser quiz/préférences et suivre ses
   propositions. Si SB est null (CDN non chargé, hors-ligne…), rien ne
   casse : le site reste pleinement utilisable en anonyme.

   Quelques termes :
     • OAuth   : « se connecter avec Google » sans confier son mot de passe
                 au site ; Google nous renvoie un jeton de session.
     • session : la preuve qu'on est connecté — un jeton que Supabase range
                 dans le navigateur et renouvelle tout seul.
   authUser : l'utilisateur courant (objet Supabase) ou null si déconnecté.
   authView : onglet affiché dans la modale, 'signin' ou 'signup'.        */
let authUser=null;
let authView='signin';

/* initAuth() — au démarrage : lit la session existante (si l'on était déjà
   connecté), puis s'abonne aux changements (connexion, retour d'un login
   Google, déconnexion, renouvellement de jeton). À chaque changement, on
   rafraîchit le bouton de la sidebar. */
async function initAuth(){
  if(!SB) return;                       // pas de client → couche compte inactive
  try{
    const {data}=await SB.auth.getSession();
    authUser=(data&&data.session)?data.session.user:null;
  }catch(e){ authUser=null; }
  renderAccountBtn();
  maybeStartSync();                     // new (Phase 2) : si déjà connecté au chargement, on synchronise
  SB.auth.onAuthStateChange((event,session)=>{
    authUser=session?session.user:null;
    renderAccountBtn();
    if(authUser) maybeStartSync(); else syncResetState();   // new (Phase 2) : (dé)clenche la synchro selon l'état
    const ov=document.getElementById('auth-overlay');
    // new : retour d'un lien « mot de passe oublié ». L'évènement arrive en
    // général alors que la modale est fermée (la page vient de s'ouvrir depuis
    // l'e-mail) → on l'ouvre nous-mêmes sur l'écran « nouveau mot de passe ».
    // À placer AVANT le test « modale fermée » ci-dessous.
    if(event==='PASSWORD_RECOVERY'){
      authView='newpw';
      if(ov) ov.classList.add('open');
      renderAuth();
      return;
    }
    if(!ov||!ov.classList.contains('open')) return;   // modale fermée : rien à faire
    // Modale ouverte : on ne ferme QUE sur une connexion réussie ; une
    // déconnexion ramène au formulaire. Les autres événements (mise à jour
    // du profil après un renommage, renouvellement de jeton…) laissent la
    // modale telle quelle — sinon renommer fermerait la fenêtre.
    if(event==='SIGNED_IN') closeAuth();
    else if(event==='SIGNED_OUT') renderAuth();
  });
  // new (mot de passe oublié) : repli ROBUSTE. Si l'URL au chargement portait
  // « type=recovery » mais que l'évènement PASSWORD_RECOVERY a pu passer AVANT
  // notre abonnement (course expliquée à la déclaration d'AUTH_RECOVERY_IN_URL),
  // on ouvre nous-mêmes l'écran « nouveau mot de passe ». À ce stade getSession
  // a fini de traiter l'URL : la session de récupération est prête, et
  // renderAuth() priorise l'écran 'newpw' sur le profil.
  if(AUTH_RECOVERY_IN_URL){
    authView='newpw';
    const ovr=document.getElementById('auth-overlay');
    if(ovr) ovr.classList.add('open');
    renderAuth();
  }
  // new (Phase 2) : au retour sur l'onglet, on récupère ce qu'un autre appareil
  // aurait pu écrire entre-temps (fusion non destructive).
  // v4 : quand la page se CACHE (onglet changé, appli quittée, fermeture), on
  // envoie aussitôt ce qui attendait (syncFlush) ; au retour du RÉSEAU, on
  // refait une synchro complète, qui renvoie aussi ce qui avait échoué.
  document.addEventListener('visibilitychange',()=>{
    if(document.visibilityState==='visible') syncOnFocus(); else syncFlush();
  });
  window.addEventListener('pagehide',syncFlush);
  window.addEventListener('online',()=>syncOnFocus());
}

/* authLabel() — nom lisible : prénom/nom Google si dispo, sinon la partie
   avant « @ » de l'e-mail, sinon « Mon compte ». */
function authLabel(){
  if(!authUser) return '';
  const m=authUser.user_metadata||{};
  if(m.full_name) return m.full_name;
  if(m.name) return m.name;
  if(authUser.email) return authUser.email.split('@')[0];
  return 'Mon compte';
}

/* renderAccountBtn() — remplit la zone .sb-account-wrap selon l'état :
   masquée si SB indisponible ; DEUX boutons (Se connecter / Créer un
   compte) si déconnecté ; un seul (nom → profil) si connecté. Pose aussi
   body.is-signed-in (repère pour le CSS et les modules de synchro à venir). */
function renderAccountBtn(){
  const wrap=document.querySelector('.sb-account-wrap');
  if(!wrap) return;
  if(!SB){ wrap.style.display='none'; return; }   // aucun compte possible
  wrap.style.display='';
  document.body.classList.toggle('is-signed-in',!!authUser);
  if(authUser){
    // Connecté : un seul bouton (nom → ouvre le profil / la déconnexion).
    wrap.innerHTML=`<button class="sb-account" title="Gérer le compte ou se déconnecter" onclick="openAuth()">👤 ${pEsc(authLabel())}</button>`;
  }else{
    // Déconnecté : deux boutons distincts (chacun ouvre le bon onglet).
    wrap.innerHTML=`<button class="sb-account" title="Déjà un compte ? Se connecter" onclick="openAuth('signin')">Se connecter</button>`+
      `<button class="sb-account" title="Pas encore de compte ? En créer un" onclick="openAuth('signup')">Créer un compte</button>`;
  }
}

/* openAuth(view) — affiche la modale de compte sur l'onglet « signin »
   (Se connecter, défaut) ou « signup » (Créer un compte). Les deux boutons
   de la sidebar appellent l'un ou l'autre ; une fois connecté, c'est l'écran
   profil qui s'affiche quel que soit `view`. */
function openAuth(view){
  authView=(view==='signup')?'signup':'signin';
  renderAuth();
  document.getElementById('auth-overlay').classList.add('open');
}
function closeAuth(){ document.getElementById('auth-overlay').classList.remove('open'); }

/* renderAuth() — construit le corps de la modale (#auth-body) : connecté →
   profil + « Se déconnecter » ; déconnecté → onglets Connexion/Création,
   bouton Google, formulaire e-mail + mot de passe, et ligne de statut. */
function renderAuth(){
  const body=document.getElementById('auth-body');
  const titleEl=document.getElementById('auth-title');
  if(!body) return;
  // ── Écran « définir un nouveau mot de passe » (retour d'un lien de
  //    récupération). PRIORITAIRE même si une session de récupération est
  //    déjà ouverte (sinon on afficherait le profil). ──
  if(authView==='newpw'){
    if(titleEl) titleEl.textContent='🔑 Nouveau mot de passe';
    body.innerHTML=`
      <div class="auth-intro">Choisis un nouveau mot de passe pour ton compte.</div>
      <form class="auth-form" onsubmit="authSetNewPassword(event)">
        <div class="auth-pw-wrap">
          <input class="auth-input" id="auth-newpw" type="password" placeholder="Nouveau mot de passe (6 caractères min.)" autocomplete="new-password" minlength="6" required>
          <button type="button" class="auth-pw-eye" title="Afficher / masquer le mot de passe" aria-label="Afficher le mot de passe" onclick="togglePwEye(this)">👁</button>
        </div>
        <button class="auth-btn auth-btn-primary" type="submit">Définir le mot de passe</button>
      </form>
      <div class="auth-status" id="auth-status"></div>`;
    return;
  }
  if(authUser){                                  // ── déjà connecté : profil ──
    if(titleEl) titleEl.textContent='👤 Mon compte';
    const rawProv=(authUser.app_metadata&&authUser.app_metadata.provider)||'email';
    // « google » s'affiche « Gmail » ; « email » → « e-mail / mot de passe ».
    const prov=rawProv==='google'?'Gmail':(rawProv==='email'?'e-mail / mot de passe':rawProv);
    const isEmailUser=rawProv==='email';         // seul un compte e-mail peut renommer
    body.innerHTML=`<div class="auth-meta">
        Connecté en tant que <b>${pEsc(authLabel())}</b>.<br>
        ${authUser.email?('E-mail : <b>'+pEsc(authUser.email)+'</b><br>'):''}
        Méthode de connexion : <b>${pEsc(prov)}</b>.
      </div>
      ${isEmailUser?`
      <div class="auth-form" style="margin-top:14px">
        <label class="auth-note" for="auth-rename" style="margin:0">Changer mon pseudo (nom affiché) :</label>
        <div style="display:flex;gap:6px">
          <input class="auth-input" id="auth-rename" type="text" maxlength="40" value="${pEsc(authLabel())}" style="flex:1">
          <button class="auth-btn auth-btn-primary" style="width:auto;padding:10px 14px" onclick="authUpdateName()">Enregistrer</button>
        </div>
      </div>`:''}
      <div class="auth-form" style="margin-top:14px">
        <button class="auth-btn auth-btn-primary" onclick="authSignOut()">Se déconnecter</button>
      </div>
      <button class="auth-link-btn auth-danger" onclick="authDeleteAccount()" title="Supprimer définitivement le compte et toutes ses données">Supprimer mon compte</button>
      <div class="auth-status" id="auth-status"></div>`;
    return;
  }
  // ── Écran « mot de passe oublié » : demande l'e-mail, envoie le lien. ──
  if(authView==='reset'){
    if(titleEl) titleEl.textContent='🔑 Mot de passe oublié';
    body.innerHTML=`
      <div class="auth-intro">Saisis ton adresse e-mail : on t’envoie un <b>lien</b> pour choisir un nouveau mot de passe.</div>
      <form class="auth-form" onsubmit="authResetSend(event)">
        <input class="auth-input" id="auth-email" type="email" placeholder="Adresse e-mail" autocomplete="email" required>
        <button class="auth-btn auth-btn-primary" type="submit">Envoyer le lien</button>
      </form>
      <button class="auth-link-btn" onclick="authSetView('signin')">← Retour à la connexion</button>
      <div class="auth-status" id="auth-status"></div>`;
    return;
  }
  if(titleEl) titleEl.textContent='👤 Créer un compte / se connecter';
  const isSignup=authView==='signup';            // ── déconnecté : connexion ──
  body.innerHTML=`
    <div class="auth-tabs">
      <div class="auth-tab${isSignup?'':' active'}" onclick="authSetView('signin')">Connexion</div>
      <div class="auth-tab${isSignup?' active':''}" onclick="authSetView('signup')">Créer un compte</div>
    </div>
    <div class="auth-intro">Deux façons de t’identifier, au choix : avec ton compte <b>Google</b>, ou avec une <b>adresse e-mail + mot de passe</b>.</div>
    <button class="auth-btn auth-btn-google" onclick="authSignInGoogle()"><span style="font-weight:700;color:#4285f4">G</span> Continuer avec Google</button>
    <div class="auth-sep">ou avec un e-mail</div>
    <form class="auth-form" onsubmit="authSubmit(event)">
      ${isSignup?'<input class="auth-input" id="auth-name" type="text" placeholder="Pseudo (nom affiché)" autocomplete="nickname" maxlength="40">':''}
      <input class="auth-input" id="auth-email" type="email" placeholder="Adresse e-mail" autocomplete="email" required>
      <div class="auth-pw-wrap">
        <input class="auth-input" id="auth-pw" type="password" placeholder="Mot de passe (6 caractères min.)" autocomplete="${isSignup?'new-password':'current-password'}" minlength="6" required>
        <button type="button" class="auth-pw-eye" title="Afficher / masquer le mot de passe" aria-label="Afficher le mot de passe" onclick="togglePwEye(this)">👁</button>
      </div>
      <button class="auth-btn auth-btn-primary" type="submit">${isSignup?'Créer mon compte':'Se connecter'}</button>
    </form>
    ${isSignup?'':'<button class="auth-link-btn" onclick="authSetView(\'reset\')">Mot de passe oublié ?</button>'}
    ${isSignup?'<div class="auth-note">En créant un compte, seuls ton <b>pseudo</b> et ton <b>adresse e-mail</b> sont enregistrés (chez Supabase, l’hébergeur), pour retrouver ta progression et tes propositions sur tous tes appareils. Rien d’autre n’est collecté.</div>':''}
    <div class="auth-status" id="auth-status"></div>`;
}

/* authSetView() — bascule Connexion / Création puis re-rend. */
function authSetView(v){ authView=v; renderAuth(); }

/* togglePwEye(btn) — affiche/masque le mot de passe du champ voisin (bouton œil
   dans .auth-pw-wrap) : bascule type password↔text, met à jour l'icône et le
   libellé, puis redonne le focus au champ. */
function togglePwEye(btn){
  const inp=btn.parentNode.querySelector('input');
  if(!inp) return;
  const show=inp.type==='password';
  inp.type=show?'text':'password';
  btn.textContent=show?'🙈':'👁';
  btn.setAttribute('aria-label', show?'Masquer le mot de passe':'Afficher le mot de passe');
  inp.focus();
}

/* authStatus() — message sous le formulaire (kind : 'err' | 'ok' | ''). */
function authStatus(msg,kind){
  const el=document.getElementById('auth-status');
  if(!el) return;
  el.className='auth-status'+(kind?(' '+kind):'');
  el.textContent=msg||'';
}

/* authSubmit() — soumission du formulaire e-mail : crée le compte (signUp)
   ou connecte (signInWithPassword) selon l'onglet actif. */
async function authSubmit(ev){
  ev.preventDefault();
  if(!SB){ authStatus('Service indisponible (hors-ligne ?).','err'); return; }
  const email=(document.getElementById('auth-email')||{}).value||'';
  const pw=(document.getElementById('auth-pw')||{}).value||'';
  authStatus('Un instant…','');
  try{
    if(authView==='signup'){
      // Pseudo facultatif → rangé dans user_metadata.full_name (le « nom
      // affiché »), lu en priorité par authLabel().
      const name=((document.getElementById('auth-name')||{}).value||'').trim();
      const opts=name?{data:{full_name:name}}:{};
      const {error}=await SB.auth.signUp({email,password:pw,options:opts});
      if(error) throw error;
      // Si la confirmation par e-mail est activée côté Supabase, pas encore
      // de session : on invite à confirmer (et à regarder les spams, l'e-mail
      // pouvant tarder ou y atterrir). Sinon, onAuthStateChange ferme.
      authStatus('Compte créé. Si une confirmation par e-mail est demandée, valide-la (pense à vérifier tes spams) puis reviens te connecter.','ok');
    }else{
      const {error}=await SB.auth.signInWithPassword({email,password:pw});
      if(error) throw error;             // succès → onAuthStateChange ferme la modale
    }
  }catch(e){ authStatus(authHumanError(e),'err'); }
}

/* authSignInGoogle() — connexion Google (OAuth) : le navigateur part sur
   Google puis revient sur la même page (redirectTo). Au retour, le client
   Supabase détecte la session dans l'URL et onAuthStateChange se déclenche. */
async function authSignInGoogle(){
  if(!SB){ authStatus('Service indisponible (hors-ligne ?).','err'); return; }
  authStatus('Redirection vers Google…','');
  try{
    const {error}=await SB.auth.signInWithOAuth({provider:'google',options:{redirectTo:location.origin+location.pathname}});
    if(error) throw error;
  }catch(e){ authStatus(authHumanError(e),'err'); }
}

/* authResetSend() — écran « mot de passe oublié » : envoie un e-mail
   contenant un lien de récupération. Le lien ramène sur la même page
   (redirectTo) ; au retour, le client Supabase détecte le jeton dans l'URL
   et déclenche l'évènement PASSWORD_RECOVERY (cf. onAuthStateChange), qui
   bascule la modale sur l'écran « nouveau mot de passe ». */
async function authResetSend(ev){
  ev.preventDefault();
  if(!SB){ authStatus('Service indisponible (hors-ligne ?).','err'); return; }
  const email=((document.getElementById('auth-email')||{}).value||'').trim();
  authStatus('Envoi du lien…','');
  try{
    const {error}=await SB.auth.resetPasswordForEmail(email,{redirectTo:location.origin+location.pathname});
    if(error) throw error;
    authStatus('Si un compte existe pour cette adresse, un e-mail vient d’être envoyé. Ouvre le lien qu’il contient pour choisir un nouveau mot de passe.','ok');
  }catch(e){ authStatus(authHumanError(e),'err'); }
}

/* authSetNewPassword() — écran « nouveau mot de passe » (atteint via le lien
   de récupération) : enregistre le nouveau mot de passe sur la session de
   récupération en cours, puis revient à l'écran de connexion. */
async function authSetNewPassword(ev){
  ev.preventDefault();
  if(!SB){ authStatus('Service indisponible (hors-ligne ?).','err'); return; }
  const pw=((document.getElementById('auth-newpw')||{}).value||'');
  authStatus('Enregistrement…','');
  try{
    const {error}=await SB.auth.updateUser({password:pw});
    if(error) throw error;
    authStatus('Mot de passe mis à jour. Tu es maintenant connecté.','ok');
    // La session de récupération vaut connexion : on quitte l'écran spécial
    // et on referme la modale au bout d'un instant (laisse lire le message).
    authView='signin';
    setTimeout(closeAuth,1400);
  }catch(e){ authStatus(authHumanError(e),'err'); }
}

/* authSignOut() — déconnexion ; onAuthStateChange remet l'UI à zéro. */
async function authSignOut(){
  if(!SB) return;
  try{ await SB.auth.signOut(); }catch(e){}
  authUser=null;                         // état déconnecté garanti même si l'event tarde
  renderAccountBtn();
  renderAuth();                          // retour à l'écran de connexion
}

/* authDeleteAccount() — suppression DÉFINITIVE du compte, à la demande de
   l'utilisateur. Le SDK client ne peut pas supprimer un compte (cela exige la
   clé secrète, qui ne doit jamais vivre dans le navigateur) : on appelle donc
   une fonction PostgreSQL « delete_own_account » (SECURITY DEFINER) qui efface
   les données de l'utilisateur (contributions, progression, préférences) puis
   sa ligne auth.users — toujours bornée à auth.uid(), donc à SON seul compte.
   Voir le SQL à exécuter une fois côté Supabase (communiqué séparément).
   Après suppression : on nettoie la session locale et on revient au formulaire. */
async function authDeleteAccount(){
  if(!SB||!authUser) return;
  // Confirmation explicite : action irréversible (double sécurité native).
  if(!confirm("Supprimer définitivement ton compte ?\n\nTa progression de révision, tes préférences et tes propositions seront effacées. Cette action est IRRÉVERSIBLE.")) return;
  authStatus('Suppression du compte…','');
  try{
    const {error}=await SB.rpc('delete_own_account');
    if(error) throw error;
    // Le compte n'existe plus côté serveur → on coupe la session locale (le
    // jeton est devenu caduc ; on avale une éventuelle erreur de signOut).
    try{ await SB.auth.signOut(); }catch(e){}
    authUser=null;
    syncResetState();                    // stoppe la synchro et oublie l'utilisateur
    renderAccountBtn();
    authView='signin';
    renderAuth();
    authStatus('Ton compte a été supprimé. À bientôt !','ok');
  }catch(e){
    // Cas le plus courant : la fonction SQL n'a pas (encore) été créée côté
    // Supabase → message clair plutôt que l'erreur brute.
    const msg=(e&&/function|not exist|delete_own_account|404/i.test(e.message||''))
      ? "La suppression n'est pas encore activée côté serveur. Réessaie plus tard."
      : authHumanError(e);
    authStatus(msg,'err');
  }
}

/* authUpdateName() — change le nom affiché (pseudo) d'un compte e-mail.
   Écrit user_metadata.full_name via updateUser ; authLabel() le relira.
   Réservé aux comptes e-mail : pour Google, le nom vient du fournisseur et
   serait réécrit à la prochaine connexion. */
async function authUpdateName(){
  if(!SB||!authUser) return;
  const inp=document.getElementById('auth-rename');
  const name=((inp&&inp.value)||'').trim();
  if(!name){ authStatus('Le pseudo ne peut pas être vide.','err'); return; }
  authStatus('Enregistrement…','');
  try{
    const {error}=await SB.auth.updateUser({data:{full_name:name}});
    if(error) throw error;
    // On met aussi à jour l'objet local pour rafraîchir le bouton tout de suite.
    authUser.user_metadata=Object.assign({},authUser.user_metadata,{full_name:name});
    renderAccountBtn();
    authStatus('Pseudo mis à jour.','ok');
  }catch(e){ authStatus(authHumanError(e),'err'); }
}

/* authHumanError() — traduit les messages Supabase (anglais) en phrases
   courtes ; repli sur le message brut si on ne reconnaît pas. */
function authHumanError(e){
  const m=((e&&e.message)||'').toLowerCase();
  if(m.includes('invalid login')) return 'E-mail ou mot de passe incorrect.';
  if(m.includes('already registered')||m.includes('already exists')) return 'Un compte existe déjà avec cet e-mail.';
  if(m.includes('password')&&m.includes('6')) return 'Le mot de passe doit faire au moins 6 caractères.';
  if(m.includes('confirm')) return 'E-mail non confirmé : vérifie ta boîte de réception.';
  if(m.includes('rate limit')||m.includes('too many')) return 'Trop de tentatives, réessaie dans un moment.';
  return (e&&e.message)?e.message:'Une erreur est survenue.';
}

/* Câblage des fermetures de la modale compte (une fois au chargement) —
   même garde anti-fermeture-accidentelle que la modale de contribution. */
(function initAuthUI(){
  const closeBtn=document.getElementById('auth-close');
  if(!closeBtn) return;                  // sécurité si le HTML est absent
  closeBtn.addEventListener('click',closeAuth);
  const _ov=document.getElementById('auth-overlay');
  let _down=false;
  _ov.addEventListener('mousedown',e=>{ _down=(e.target===_ov); });
  _ov.addEventListener('click',e=>{ if(e.target===_ov&&_down) closeAuth(); });
  document.addEventListener('keydown',e=>{ if(e.key==='Escape') closeAuth(); });
})();
