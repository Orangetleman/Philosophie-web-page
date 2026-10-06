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

/* ── Menu « ⚙ Réglages » ─────────────────────────────────────────────────
   Regroupe les fonctions NON nécessaires à la révision. Le toggle de mode y
   est rendu EXPLICITE : le bouton nomme le mode-CIBLE (l'action), avec le mode
   ACTUEL rappelé en petit au-dessus (avant, le bouton affichait le mode courant
   et l'on ne savait pas si c'était un bouton ou un état). */
function renderSettingsBody(){
  const body=document.getElementById('settings-body'); if(!body) return;
  const isEd=(localStorage.getItem('philo-mode')||'revision')==='edition';
  const isFiche=localStorage.getItem('philo-fiche')==='1';
  // Étape 6 : thème et taille du texte, en boutons à choix unique.
  const choix=(titre, desc, options, actuel, fn)=>'<div class="set-row">'
    +'<div class="set-row-cur">'+titre+' : <strong>'+options[actuel]+'</strong></div>'
    +'<div class="set-row-desc">'+desc+'</div>'
    +'<div class="set-choix" role="group" aria-label="'+titre+'">'
    +Object.keys(options).map(k=>'<button class="pbtn '+(k===actuel?'pbtn-primary':'pbtn-ghost')+'" aria-pressed="'+(k===actuel)+'" onclick="'+fn+'(\''+k+'\')">'+options[k]+'</button>').join('')
    +'</div></div>';
  body.innerHTML=
    choix('Thème', 'Le thème clair, sur fond papier, repose les yeux pour lire longtemps ; « Automatique » suit le réglage de ton appareil.', THEMES, lireReglage('philo-theme','sombre'), 'setTheme')
    +choix('Taille du texte', 'Agrandit la zone de lecture (notions, fiches), pas la barre latérale.', TAILLES, lireReglage('philo-texte','normal'), 'setTailleTexte')
    +'<div class="set-row">'
    +'<div class="set-row-cur">Mode d\'affichage actuel : <strong>'+(isEd?'Édition':'Révision')+'</strong></div>'
    +'<div class="set-row-desc">Le mode <em>édition</em> révèle les badges « ✦ nouveau / ✎ modifié » et les boutons « + » pour proposer du contenu. Le mode <em>révision</em> épure l\'affichage pour se concentrer sur l\'apprentissage.</div>'
    +'<button class="pbtn pbtn-primary set-mode-btn" onclick="togglePhiloMode()">'
      +(isEd?'👁 Revenir au mode révision':'✎ Passer en mode édition')+'</button>'
    +'</div>'
    // Mode fiche : compresse les cartes d'auteur des notions pour une lecture rapide.
    +'<div class="set-row">'
    +'<div class="set-row-cur">Mode fiche : <strong>'+(isFiche?'activé':'désactivé')+'</strong></div>'
    +'<div class="set-row-desc">Compresse chaque boîte d\'auteur dans les notions (idée bornée à 2 lignes, citations masquées) pour une <em>lecture rapide</em>, façon fiche de révision. Le contenu complet reste sur la fiche de l\'auteur.</div>'
    +'<button class="pbtn pbtn-primary set-mode-btn" onclick="toggleFicheMode()">'
      +(isFiche?'📖 Affichage complet':'🗂 Activer le mode fiche')+'</button>'
    +'</div>'
    // Étape 5 : afficher ou masquer le hors programme (visible par défaut).
    +(KEYS_HP.length?'<div class="set-row">'
    +'<div class="set-row-cur">Hors programme : <strong>'+(voirHP()?'affiché':'masqué')+'</strong></div>'
    +'<div class="set-row-desc">Les notions qui ne sont pas au programme de terminale ('+KEYS_HP.length+' pour l\'instant), et ce qui n\'apparaît que sous elles : auteurs, concepts, cartes du quiz. Masqué, le site s\'en tient au programme du bac.</div>'
    +'<button class="pbtn pbtn-primary set-mode-btn" onclick="setVoirHP('+(voirHP()?'false':'true')+')">'
      +(voirHP()?'🎯 M\'en tenir au programme':'🧭 Afficher le hors programme')+'</button>'
    +'</div>':'')
    // Carte technique du projet (doc) — discret, pour les curieux de l'envers du décor.
    +'<div class="set-row">'
    +'<div class="set-row-cur">🔎 Découvrir l\'envers du projet</div>'
    +'<div class="set-row-desc">Pour les curieux de la technique : une <strong>carte interactive</strong> de l\'architecture (du parcours élève jusqu\'au nom des fonctions) et une <strong>frise</strong> de l\'évolution du projet commit par commit.</div>'
    +'<a class="pbtn pbtn-ghost set-mode-btn" href="docs/carte/carte.html" target="_blank" rel="noopener" style="display:inline-block;text-decoration:none;margin-right:6px">🗺 Carte du projet ↗</a>'
    +'<a class="pbtn pbtn-ghost set-mode-btn" href="docs/carte/frise.html" target="_blank" rel="noopener" style="display:inline-block;text-decoration:none">🕓 Frise des commits ↗</a>'
    +'</div>';
}
/* openSettings / closeSettings — ouvre/ferme l'overlay de réglages. */
function openSettings(){ const ov=document.getElementById('settings-overlay'); if(!ov) return; renderSettingsBody(); ov.classList.add('open'); }
function closeSettings(){ const ov=document.getElementById('settings-overlay'); if(ov) ov.classList.remove('open'); }
document.addEventListener('keydown',e=>{ if(e.key==='Escape') closeSettings(); });
