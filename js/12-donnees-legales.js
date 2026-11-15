/* js/12-donnees-legales.js — morceau du script du site. Le build (outils/construire.mjs)
   recolle js/*.js dans l'ORDRE des noms en UN SEUL script, app.js : les
   fonctions restent visibles d'un morceau à l'autre comme avant, et le code
   « de premier niveau » s'exécute dans cet ordre. */
/* ══════════════════════════════════════════════════════════════════
   DONNÉES PERSONNELLES ET NOTICE LÉGALE (chantier RGPD, 15 nov. 2026)
   ──────────────────────────────────────────────────────────────────
   docs/protocole-donnees.md, actions A7 et A8. La notice vient de LEGAL
   (data.js, depuis contenu/legal.js) : une seule source pour la page
   /informations-legales/, les Réglages et l'export.
   • L'accord : case NON cochée à la création d'un compte (et à l'envoi
     d'une proposition). La version acceptée est gardée dans le compte
     (user_metadata.cgu_version, cgu_date) et sur l'appareil
     (« philo-legal »). Quand la notice change, verifierAccordLegal() la
     redemande au compte, et la signale au visiteur qui l'avait acceptée.
   • Les droits : exporterMesDonnees() (accès, portabilité),
     effacerDonneesAppareil(), supprimerMonCompte() (effacement).
   ══════════════════════════════════════════════════════════════════ */

// La version en vigueur : la date de la dernière entrée de l'historique.
const LEGAL_VERSION=(LEGAL.historique[LEGAL.historique.length-1]||{}).version||'';
const LEGAL_URL='informations-legales/';

/* legalDateFr(v) — « 2026-11-15 » → « 15 novembre 2026 » (même règle que
   outils/lib/legal.mjs, pour la page légale). */
function legalDateFr(v){
  const M=['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
  const p=String(v||'').split('-').map(Number); if(p.length!==3) return v||'';
  return (p[2]===1?'1er':p[2])+' '+M[p[1]-1]+' '+p[0];
}
/* legalLocal() / legalRetenir() — la version acceptée sur CET appareil. */
function legalLocal(){ try{ return localStorage.getItem('philo-legal')||''; }catch(e){ return ''; } }
function legalRetenir(){ try{ localStorage.setItem('philo-legal', LEGAL_VERSION); }catch(e){} }

/* cguCaseHTML(id, quoi) — la case d'accord, jamais pré-cochée. `quoi` dit ce
   qu'on fait en cochant (« créer un compte », « envoyer »). Le lien ouvre la
   notice dans un autre onglet, pour ne pas perdre le formulaire. */
function cguCaseHTML(id, quoi){
  return '<label class="cgu-case"><input type="checkbox" id="'+id+'"> '
    +'<span>J\'ai lu et j\'accepte les <a href="'+LEGAL_URL+'#cgu" target="_blank" rel="noopener">conditions d\'utilisation</a> '
    +'et la <a href="'+LEGAL_URL+'#donnees" target="_blank" rel="noopener">notice des données</a> pour '+quoi+'.</span></label>';
}
/* cguCoche(id) — vrai si la case existe et est cochée. */
function cguCoche(id){ const c=document.getElementById(id); return !!(c&&c.checked); }

/* legalChangementsDepuis(v) — les entrées de l'historique postérieures à la
   version `v` (toutes si v est vide), de la plus récente à la plus ancienne. */
function legalChangementsDepuis(v){
  return LEGAL.historique.filter(h=>!v||h.version>v).slice().reverse();
}

/* verifierAccordLegal() — appelée au démarrage et à chaque changement de
   connexion (initAuth). Avec un compte : si la version acceptée n'est pas
   celle du site, une fenêtre la redemande (accepter, ou se déconnecter :
   on ne garde pas un compte sous des conditions qu'il n'a pas vues).
   L'appareil retient la version acceptée, le jeton pouvant retarder.
   Sans compte : si le visiteur avait accepté une version plus ancienne (en
   proposant du contenu), un bandeau discret lui signale le changement. */
function verifierAccordLegal(){
  const ancien=document.getElementById('legal-accord'); if(ancien) ancien.remove();
  const loc=legalLocal();
  if(typeof authUser!=='undefined' && authUser){
    const v=(authUser.user_metadata||{}).cgu_version||'';
    if(v===LEGAL_VERSION || loc===LEGAL_VERSION) return;
    afficherAccordLegal(true, v);
    return;
  }
  if(loc && loc<LEGAL_VERSION) afficherAccordLegal(false, loc);
}

/* afficherAccordLegal(compte, depuis) — la fenêtre (compte) ou le bandeau
   (visiteur) qui annonce la nouvelle version et résume ce qui a changé. */
function afficherAccordLegal(compte, depuis){
  const ch=legalChangementsDepuis(depuis);
  const box=document.createElement('div');
  box.id='legal-accord'; box.className='legal-accord'+(compte?' legal-accord-compte':'');
  box.setAttribute('role', compte?'dialog':'status');
  if(compte) box.setAttribute('aria-modal','true');
  box.setAttribute('aria-labelledby','legal-accord-titre');
  box.innerHTML='<div class="legal-accord-panneau">'
    +'<div class="legal-accord-titre" id="legal-accord-titre">'+(depuis?'Les conditions ont changé':'Les conditions d\'utilisation')+'</div>'
    +'<ul class="legal-accord-liste">'+ch.map(h=>'<li><strong>'+pEsc(legalDateFr(h.version))+'</strong> : '+pEsc(h.resume)+'</li>').join('')+'</ul>'
    +(compte?'<p>Pour continuer à utiliser ton compte, accepte la version du '+pEsc(legalDateFr(LEGAL_VERSION))+'. Tu peux aussi te déconnecter : le site marche sans compte.</p>':'')
    +'<div class="legal-accord-btns">'
    +'<a class="pbtn pbtn-ghost" href="'+LEGAL_URL+'" target="_blank" rel="noopener">Lire le texte</a>'
    +(compte
      ?'<button class="pbtn pbtn-ghost" onclick="refuserAccordLegal()">Me déconnecter</button><button class="pbtn pbtn-primary" onclick="accepterAccordLegal()">J\'accepte</button>'
      :'<button class="pbtn pbtn-primary" onclick="legalRetenir();fermerAccordLegal()">Compris</button>')
    +'</div><div class="legal-accord-statut" id="legal-accord-statut"></div></div>';
  document.body.appendChild(box);
}
function fermerAccordLegal(){ const b=document.getElementById('legal-accord'); if(b) b.remove(); }

/* accepterAccordLegal() — écrit la version et la date dans le compte
   (preuve de l'accord : savoir quand, et à quelle version), puis sur
   l'appareil. En cas d'échec réseau, la fenêtre reste et le dit. */
async function accepterAccordLegal(){
  const st=document.getElementById('legal-accord-statut');
  if(!SB||!authUser){ legalRetenir(); fermerAccordLegal(); return; }
  if(st) st.textContent='Enregistrement…';
  try{
    const meta={cgu_version:LEGAL_VERSION, cgu_date:new Date().toISOString()};
    const {error}=await SB.auth.updateUser({data:meta});
    if(error) throw error;
    authUser.user_metadata=Object.assign({},authUser.user_metadata,meta);
    legalRetenir(); fermerAccordLegal();
  }catch(e){ if(st) st.textContent='Impossible d\'enregistrer ton accord pour l\'instant (hors-ligne ?). Réessaie.'; }
}
/* refuserAccordLegal() — déconnecte, sans rien effacer : le compte reste,
   et la question reviendra à la prochaine connexion. */
async function refuserAccordLegal(){
  fermerAccordLegal();
  if(typeof authSignOut==='function') await authSignOut();
}

/* ── Les droits ─────────────────────────────────────────────────────── */

/* donneesAppareil() — tout ce que le site garde dans CE navigateur, clé par
   clé (« philo-… »). La session de connexion (sb-…) n'est PAS exportée :
   c'est un secret, pas une donnée sur la personne. */
function donneesAppareil(){
  const out={};
  try{
    for(let i=0;i<localStorage.length;i++){
      const k=localStorage.key(i);
      if(!k||k.indexOf('philo-')!==0) continue;
      const v=localStorage.getItem(k);
      try{ out[k]=JSON.parse(v); }catch(e){ out[k]=v; }
    }
  }catch(e){}
  return out;
}

/* exporterMesDonnees() — droit d'accès et de portabilité (RGPD, art. 15 et
   20) : un fichier JSON avec ce que le site garde sur la personne. Sur
   l'appareil toujours ; avec un compte, aussi ce qui est en ligne (le compte
   lui-même, réglages, progression, propositions), lu avec SON jeton : les
   règles d'accès ne lui rendent que ses lignes. */
async function exporterMesDonnees(btn){
  const st=document.getElementById('rg-donnees-statut');
  const dire=m=>{ if(st) st.textContent=m; };
  if(btn) btn.disabled=true;
  dire('Préparation du fichier…');
  const dossier={
    genere_le:new Date().toISOString(),
    site:LEGAL.site,
    notice:{version:LEGAL_VERSION, adresse:LEGAL.site+'/'+LEGAL_URL},
    sur_cet_appareil:donneesAppareil(),
    compte:null
  };
  try{
    if(SB&&authUser){
      const uid=authUser.id;
      const [pref,quiz,props]=await Promise.all([
        SB.from('preferences').select('data,updated_at').eq('user_id',uid),
        SB.from('quiz_progress').select('data,updated_at').eq('user_id',uid),
        SB.from('contributions').select('id,payload,statut,explication,avis_ia,created_at,updated_at').eq('user_id',uid).order('created_at')
      ]);
      dossier.compte={
        identifiant:uid,
        email:authUser.email||null,
        connexion:(authUser.app_metadata&&authUser.app_metadata.provider)||'email',
        cree_le:authUser.created_at||null,
        derniere_connexion:authUser.last_sign_in_at||null,
        profil:authUser.user_metadata||{},
        reglages_en_ligne:(pref.data&&pref.data[0])||null,
        progression_quiz_en_ligne:(quiz.data&&quiz.data[0])||null,
        propositions:props.data||[],
        erreurs:[pref.error,quiz.error,props.error].filter(Boolean).map(e=>e.message)
      };
    }
    const blob=new Blob([JSON.stringify(dossier,null,2)],{type:'application/json'});
    const a=document.createElement('a');
    a.href=URL.createObjectURL(blob);
    a.download='mes-donnees-philo-'+new Date().toISOString().slice(0,10)+'.json';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(()=>URL.revokeObjectURL(a.href),4000);
    dire(dossier.compte&&dossier.compte.erreurs.length
      ?'Fichier téléchargé, mais une partie de tes données en ligne n\'a pas pu être lue (hors-ligne ?).'
      :'Fichier téléchargé.');
  }catch(e){ dire('Le fichier n\'a pas pu être préparé : '+((e&&e.message)||'erreur inconnue')+'.'); }
  if(btn) btn.disabled=false;
}

/* effacerDonneesAppareil() — efface tout ce que le site garde dans CE
   navigateur (« philo-… »). Avec un compte, on se déconnecte d'abord : sinon
   la synchronisation renverrait aussitôt un état vide vers le compte et
   écraserait la progression en ligne. Le compte, lui, n'est pas touché. */
async function effacerDonneesAppareil(){
  const connecte=typeof authUser!=='undefined'&&!!authUser;
  const msg=connecte
    ?'Effacer les données de cet appareil ?\n\nTu seras déconnecté. Tes réglages et ta progression restent sur ton compte : tu les retrouveras en te reconnectant.'
    :'Effacer les données de cet appareil ?\n\nTes réglages, ta progression du quiz et ton brouillon de proposition seront effacés de ce navigateur. C\'est définitif.';
  if(!confirm(msg)) return;
  if(connecte && SB){ try{ await SB.auth.signOut(); }catch(e){} }
  try{
    const cles=[];
    for(let i=0;i<localStorage.length;i++){ const k=localStorage.key(i); if(k&&(k.indexOf('philo-')===0||/^sb-.*-auth-token$/.test(k))) cles.push(k); }
    cles.forEach(k=>localStorage.removeItem(k));
  }catch(e){}
  location.reload();
}

/* supprimerMonCompte() — depuis les Réglages : ouvre la fenêtre du compte
   (qui affiche le déroulement) et lance la suppression (authDeleteAccount,
   js/09-compte.js, qui demande confirmation). */
function supprimerMonCompte(){
  closeSettings();
  openAuth();
  authDeleteAccount();
}
