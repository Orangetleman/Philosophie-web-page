/* js/07-affichage-reglages.js — morceau du script du site. Le build (outils/construire.mjs)
   recolle js/*.js dans l'ORDRE des noms en UN SEUL script, app.js : les
   fonctions restent visibles d'un morceau à l'autre comme avant, et le code
   « de premier niveau » s'exécute dans cet ordre. */
/* ── Tiroir « burger » (mobile ≤700px) ─────────────────────────────
   La sidebar est masquée par défaut en mobile et révélée en ajoutant
   la classe `sb-open` sur <body>. Le voile (#sb-backdrop) la referme
   au clic, idem touche Échap. Sélectionner un item de la sidebar
   (.nb/.ab/.cb) referme aussi automatiquement le tiroir, pour que
   l'élève voie immédiatement le contenu choisi.                       */
function toggleSidebar(){document.body.classList.toggle('sb-open')}
function closeSidebar(){document.body.classList.remove('sb-open')}

/* ── Mode révision / édition (persisté en localStorage) ──────────────
   Par défaut « révision » (élève) : badges new/modified, boutons de
   contribution (+) et « 💡 Proposer du contenu » cachés via CSS pour
   un rendu épuré. « Édition » : tout est révélé pour le mainteneur.
   Bascule via le bouton .sb-mode en bas de la sidebar.                */
function applyPhiloMode(){
  const m=localStorage.getItem('philo-mode')||'revision';
  document.body.classList.toggle('mode-edition', m==='edition');
  // Le toggle vit désormais dans le menu « Réglages » : on le rafraîchit s'il
  // est ouvert (pour que le libellé suive l'état).
  const ov=document.getElementById('settings-overlay');
  if(ov && ov.classList.contains('open')) renderSettingsBody();
}
function togglePhiloMode(){
  const cur=localStorage.getItem('philo-mode')||'revision';
  localStorage.setItem('philo-mode', cur==='edition'?'revision':'edition');
  applyPhiloMode();
  syncOnPrefsChange();        // new (Phase 2) : reporte la préférence vers le compte si connecté
}

/* applyFicheMode() — applique le « mode fiche » (lecture compressée des cartes
   d'auteur dans les notions) via la classe body.mode-fiche, lue dans
   localStorage 'philo-fiche'. Rafraîchit le menu Réglages s'il est ouvert. */
function applyFicheMode(){
  document.body.classList.toggle('mode-fiche', localStorage.getItem('philo-fiche')==='1');
  const ov=document.getElementById('settings-overlay');
  if(ov && ov.classList.contains('open')) renderSettingsBody();
}
function toggleFicheMode(){
  localStorage.setItem('philo-fiche', localStorage.getItem('philo-fiche')==='1'?'0':'1');
  applyFicheMode();
}

/* ── Thème et taille du texte (étape 6, oct. 2026) ───────────────────────
   « philo-theme » : 'sombre' (défaut), 'clair' ou 'auto' (suit le système).
   Le script en tête d'index.html pose data-theme avant le premier affichage ;
   ici, on le change à chaud. « philo-texte » : 'normal', 'grand' ou
   'tres-grand' (classe sur <body>, zoom de la zone de lecture, css/01).  */
const THEMES={sombre:'Sombre', clair:'Clair', auto:'Automatique'};
const TAILLES={normal:'Normale', grand:'Grande', 'tres-grand':'Très grande'};
function lireReglage(cle, defaut){ try{ return localStorage.getItem(cle)||defaut; }catch(e){ return defaut; } }
/* themeEffectif() — 'clair' ou 'sombre', une fois « auto » résolu. */
function themeEffectif(){
  const t=document.documentElement.dataset.theme||'sombre';
  if(t!=='auto') return t;
  return (window.matchMedia&&matchMedia('(prefers-color-scheme: light)').matches)?'clair':'sombre';
}
/* appliquerAffichage() — pose thème et taille, met à jour la couleur de la
   barre du téléphone (theme-color). Ne redessine pas : setTheme s'en charge. */
function appliquerAffichage(){
  document.documentElement.dataset.theme=lireReglage('philo-theme','sombre');
  const taille=lireReglage('philo-texte','normal');
  document.body.classList.toggle('texte-grand', taille==='grand');
  document.body.classList.toggle('texte-tres-grand', taille==='tres-grand');
  const meta=document.querySelector('meta[name="theme-color"]');
  if(meta) meta.setAttribute('content', themeEffectif()==='clair'?'#e9e6df':'#121212');
}
/* setTheme(t) / setTailleTexte(t) — enregistrent, appliquent, redessinent
   (les couleurs de notion des liens dépendent du thème : inkOnDark) et
   reportent au compte. */
function setTheme(t){
  try{ localStorage.setItem('philo-theme', t); }catch(e){}
  appliquerAffichage(); renderSB(); renderCurrentView();
  const ov=document.getElementById('settings-overlay');
  if(ov && ov.classList.contains('open')) renderSettingsBody();
  syncOnPrefsChange();
}
function setTailleTexte(t){
  try{ localStorage.setItem('philo-texte', t); }catch(e){}
  appliquerAffichage();
  const ov=document.getElementById('settings-overlay');
  if(ov && ov.classList.contains('open')) renderSettingsBody();
  syncOnPrefsChange();
}
// En « auto », suivre le système quand il passe du clair au sombre.
if(window.matchMedia){
  const mq=matchMedia('(prefers-color-scheme: light)');
  const suivre=()=>{ if(lireReglage('philo-theme','sombre')==='auto'){ appliquerAffichage(); renderSB(); renderCurrentView(); } };
  if(mq.addEventListener) mq.addEventListener('change', suivre); else if(mq.addListener) mq.addListener(suivre);
}

/* ── Hors programme : afficher / masquer (étape 5, oct. 2026) ─────────────
   setVoirHP(v) — enregistre le réglage (« philo-hp » : '1' visible, '0'
   masqué), note que la personne a fait son choix (« philo-hp-choix », la
   proposition d'arrivée ne revient plus), redessine tout ce qui en dépend
   (barre latérale, page ouverte, Réglages, quiz) et le reporte au compte. */
function setVoirHP(v){
  try{ localStorage.setItem('philo-hp', v?'1':'0'); localStorage.setItem('philo-hp-choix','1'); }catch(e){}
  fermerHpInvite();
  renderSB(); renderCurrentView();
  const ov=document.getElementById('settings-overlay');
  if(ov && ov.classList.contains('open')) renderSettingsBody();
  const qo=document.getElementById('quiz-overlay');
  if(qo && qo.classList.contains('open') && quizState.view==='dashboard') renderQuiz();
  syncOnPrefsChange();
}

/* hpInviterSiBesoin() — la proposition de la première visite (décision du
   5 octobre 2026 : le hors programme est visible par défaut, mais le site
   propose de le masquer à l'arrivée). Ne s'affiche qu'une fois (« philo-hp-
   choix »), seulement s'il existe du hors programme, et jamais par-dessus la
   visite guidée : endTour() la rappelle à la fin de la visite. */
function hpInviterSiBesoin(){
  if(!KEYS_HP.length || document.getElementById('hp-invite')) return;
  let choix='1'; try{ choix=localStorage.getItem('philo-hp-choix'); }catch(e){}
  if(choix) return;
  if(typeof tourState!=='undefined' && tourState.i>=0) return;   // visite en cours
  const noms=KEYS_HP.slice(0,3).map(k=>D[k].l.toLowerCase()).join(', ');
  const box=document.createElement('div');
  box.id='hp-invite'; box.className='hp-invite'; box.setAttribute('role','dialog');
  box.setAttribute('aria-labelledby','hp-invite-titre');
  box.innerHTML=`<div class="hp-invite-titre" id="hp-invite-titre">Programme ou plus large ?</div>
    <p>En plus des 17 notions du bac, le site propose des notions <strong>hors programme</strong> (${noms}…), marquées comme telles. Tu prépares le bac et préfères t'en tenir au programme ?</p>
    <div class="hp-invite-btns">
      <button class="pbtn pbtn-primary" onclick="setVoirHP(false)">M'en tenir au programme</button>
      <button class="pbtn pbtn-ghost" onclick="setVoirHP(true)">Tout garder visible</button>
    </div>
    <p class="hp-invite-note">Modifiable à tout moment dans ⚙ Réglages.</p>`;
  document.body.appendChild(box);
}
function fermerHpInvite(){ const b=document.getElementById('hp-invite'); if(b) b.remove(); }

/* ── Menu « ⚙ Réglages » (refondu le 15 nov. 2026) ──────────────────────
   Avant : une liste continue de lignes, chacune avec un long paragraphe et un
   gros bouton. Refonte d'après les leçons de l'interface de Fiches BUT
   (docs/protocole-donnees.md § 1.4) :
   - le plus courant en haut : Affichage, Révision, puis Compte, Mes données
     (les droits RGPD), À propos ;
   - un sommaire de pastilles : chaque section est à un geste ;
   - des cartes, avec l'ÉTAT en première ligne (« Sombre · texte normal ») ;
   - une commande par réglage : choix segmenté, ou interrupteur (role=switch)
     qui dit l'état sans qu'on ait à lire un libellé de bouton ;
   - la prose RANGÉE dans un <details> « Ce que ça change », pas supprimée ;
   - l'action risquée (supprimer le compte) en dernier, à part, en rouge.
   La visite guidée cherche le bouton du mode édition par son action
   (tourSettingsRow('togglePhiloMode')) : l'interrupteur la garde. */

/* rgSegment(titre, options, actuel, fn) — un choix à options exclusives
   (thème, taille), en boutons accolés. */
function rgSegment(titre, options, actuel, fn){
  return '<div class="rg-ligne"><span class="rg-lib">'+titre+'</span>'
    +'<div class="rg-seg" role="group" aria-label="'+titre+'">'
    +Object.keys(options).map(k=>'<button class="'+(k===actuel?'on':'')+'" aria-pressed="'+(k===actuel)+'" onclick="'+fn+'(\''+k+'\')">'+options[k]+'</button>').join('')
    +'</div></div>';
}
/* rgInterrupteur(libelle, sous, actif, appel) — un réglage oui/non. */
function rgInterrupteur(libelle, sous, actif, appel){
  return '<div class="rg-ligne"><span class="rg-lib">'+libelle+(sous?'<span class="rg-sous">'+sous+'</span>':'')+'</span>'
    +'<button class="rg-switch" role="switch" aria-checked="'+actif+'" aria-label="'+libelle.replace(/<[^>]+>/g,'')+'" onclick="'+appel+'"><span></span></button></div>';
}
/* rgCarte(id, titre, etat, contenu) — une section du menu. */
function rgCarte(id, titre, etat, contenu, extra){
  return '<section class="rg-carte'+(extra?' '+extra:'')+'" id="'+id+'"><div class="rg-tete"><h3>'+titre+'</h3>'
    +(etat?'<span class="rg-etat">'+etat+'</span>':'')+'</div>'+contenu+'</section>';
}
/* rgAller(id) — le sommaire : fait défiler la fenêtre jusqu'à la carte. */
function rgAller(id){ const el=document.getElementById(id); if(el) el.scrollIntoView({behavior:'smooth',block:'start'}); }

function renderSettingsBody(){
  const body=document.getElementById('settings-body'); if(!body) return;
  const isEd=(localStorage.getItem('philo-mode')||'revision')==='edition';
  const isFiche=localStorage.getItem('philo-fiche')==='1';
  const theme=lireReglage('philo-theme','sombre'), taille=lireReglage('philo-texte','normal');
  const connecte=typeof authUser!=='undefined'&&!!authUser;
  const hp=KEYS_HP.length>0;

  // ── Sommaire ──
  const sommaire=[['rg-affichage','Affichage'],['rg-revision','Révision'],['rg-compte','Compte'],['rg-donnees','Mes données'],['rg-apropos','À propos']];
  let h='<nav class="rg-sommaire" aria-label="Sections des réglages">'
    +sommaire.map(([id,t])=>'<button onclick="rgAller(\''+id+'\')">'+t+'</button>').join('')+'</nav>';

  // ── Affichage : le réglage le plus courant, en premier ──
  h+=rgCarte('rg-affichage','Affichage', THEMES[theme]+' · texte '+({normal:'normal',grand:'grand','tres-grand':'très grand'}[taille]||'normal'),
    rgSegment('Thème', THEMES, theme, 'setTheme')
    +rgSegment('Taille du texte', TAILLES, taille, 'setTailleTexte')
    +'<details class="rg-plus"><summary>Ce que ça change</summary>'
    +'<p>Le thème clair, sur fond papier, repose les yeux pour lire longtemps ; « Automatique » suit le réglage de ton appareil.</p>'
    +'<p>La taille agrandit la zone de lecture (notions, fiches), pas la barre latérale.</p></details>');

  // ── Révision : trois interrupteurs ──
  const etatRev=[isEd?'Mode édition':'Mode révision'].concat(isFiche?['fiche']:[]).concat(hp?[voirHP()?'hors programme visible':'programme seul']:[]).join(' · ');
  h+=rgCarte('rg-revision','Révision', etatRev,
    rgInterrupteur('Mode fiche','idées en deux lignes, sans citations', isFiche, 'toggleFicheMode()')
    +(hp?rgInterrupteur('Hors programme','les '+KEYS_HP.length+' notions au-delà du bac', voirHP(), 'setVoirHP('+(voirHP()?'false':'true')+')'):'')
    +rgInterrupteur('Mode édition','pour proposer du contenu', isEd, 'togglePhiloMode()')
    +'<details class="rg-plus"><summary>Ce que ça change</summary>'
    +'<p><strong>Mode fiche</strong> : compresse chaque boîte d\'auteur dans les notions (idée bornée à 2 lignes, citations masquées) pour une <em>lecture rapide</em>, façon fiche de révision. Le contenu complet reste sur la fiche de l\'auteur.</p>'
    +(hp?'<p><strong>Hors programme</strong> : les notions qui ne sont pas au programme de terminale ('+KEYS_HP.length+' pour l\'instant), et ce qui n\'apparaît que sous elles : auteurs, concepts, cartes du quiz. Masqué, le site s\'en tient au programme du bac.</p>':'')
    +'<p><strong>Mode édition</strong> : révèle les badges « ✦ nouveau / ✎ modifié » et les boutons « + » pour proposer du contenu. Le mode <em>révision</em> épure l\'affichage pour se concentrer sur l\'apprentissage.</p></details>');

  // ── Compte ──
  h+=rgCarte('rg-compte','Compte', connecte?'Connecté':'Sans compte',
    connecte
      ?'<p class="rg-texte">Connecté en tant que <strong>'+pEsc(authLabel())+'</strong>'+(authUser.email?' ('+pEsc(authUser.email)+')':'')+'. Ta progression et tes réglages se synchronisent entre tes appareils.</p>'
        +'<div class="rg-actions"><button class="pbtn" onclick="closeSettings();openAuth()">Gérer mon compte</button>'
        +'<button class="pbtn" onclick="authSignOut().then(renderSettingsBody)">Se déconnecter</button></div>'
      :'<p class="rg-texte">Sans compte, tout reste sur cet appareil. Un compte (facultatif) retrouve ta progression sur tous tes appareils et permet de suivre tes propositions.</p>'
        +'<div class="rg-actions"><button class="pbtn pbtn-primary" onclick="closeSettings();openAuth(\'signup\')">Créer un compte</button>'
        +'<button class="pbtn" onclick="closeSettings();openAuth(\'signin\')">Se connecter</button></div>');

  // ── Mes données : les droits RGPD, en un clic ──
  const surAppareil=Object.keys(donneesAppareil()).length;
  h+=rgCarte('rg-donnees','Mes données', surAppareil+' élément'+(surAppareil>1?'s':'')+' sur cet appareil'+(connecte?' · compte':''),
    '<p class="rg-texte">Pas de publicité, pas de statistiques, pas de traceur. Le site garde seulement ce qui sert à ta révision'+(connecte?', sur cet appareil et sur ton compte':', sur cet appareil')+'.</p>'
    +'<div class="rg-actions"><button class="pbtn" onclick="exporterMesDonnees(this)">↓ Télécharger mes données</button>'
    +'<button class="pbtn" onclick="effacerDonneesAppareil()">Effacer les données de cet appareil</button></div>'
    +'<div class="rg-statut" id="rg-donnees-statut" role="status"></div>'
    +'<details class="rg-plus"><summary>Ce que le site garde sur toi</summary><ul>'
    +LEGAL.traitements.map(t=>'<li><strong>'+pEsc(t.titre)+'</strong> : '+pEsc(t.donnees.join(', '))+'. <span class="rg-sous">'+pEsc(t.duree)+'</span></li>').join('')
    +'</ul><p>Le détail, les services qui reçoivent ces données et tes droits : <a href="'+LEGAL_URL+'" target="_blank" rel="noopener">informations légales</a>.</p></details>'
    +(connecte?'<div class="rg-danger"><div><strong>Supprimer mon compte</strong><span class="rg-sous">Compte, réglages et progression effacés. Tes propositions restent sur le site, sans ton nom.</span></div>'
      +'<button class="pbtn rg-btn-danger" onclick="supprimerMonCompte()">Supprimer</button></div>':''));

  // ── À propos ──
  h+=rgCarte('rg-apropos','À propos', 'Version du '+legalDateFr(LEGAL_VERSION),
    '<div class="rg-liens">'
    +'<a href="'+LEGAL_URL+'" target="_blank" rel="noopener">Informations légales et conditions ↗</a>'
    +'<a href="mailto:'+pEsc(LEGAL.contact)+'">Écrire à l\'éditeur</a>'
    +'<a href="docs/carte/carte.html" target="_blank" rel="noopener">🗺 Carte du projet ↗</a>'
    +'<a href="docs/carte/frise.html" target="_blank" rel="noopener">🕓 Frise des commits ↗</a>'
    +'</div>'
    +'<details class="rg-plus"><summary>La carte et la frise, c\'est quoi ?</summary><p>Pour les curieux de la technique : une <strong>carte interactive</strong> de l\'architecture (du parcours élève jusqu\'au nom des fonctions) et une <strong>frise</strong> de l\'évolution du projet commit par commit.</p></details>');

  body.innerHTML=h;
}
/* openSettings / closeSettings — ouvre/ferme l'overlay de réglages. */
function openSettings(){ const ov=document.getElementById('settings-overlay'); if(!ov) return; renderSettingsBody(); ov.classList.add('open'); }
function closeSettings(){ const ov=document.getElementById('settings-overlay'); if(ov) ov.classList.remove('open'); }
document.addEventListener('keydown',e=>{ if(e.key==='Escape') closeSettings(); });
