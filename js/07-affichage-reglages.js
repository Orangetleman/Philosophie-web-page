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

/* ── Menu « ⚙ Réglages » ─────────────────────────────────────────────────
   Regroupe les fonctions NON nécessaires à la révision. Le toggle de mode y
   est rendu EXPLICITE : le bouton nomme le mode-CIBLE (l'action), avec le mode
   ACTUEL rappelé en petit au-dessus (avant, le bouton affichait le mode courant
   et l'on ne savait pas si c'était un bouton ou un état). */
function renderSettingsBody(){
  const body=document.getElementById('settings-body'); if(!body) return;
  const isEd=(localStorage.getItem('philo-mode')||'revision')==='edition';
  const isFiche=localStorage.getItem('philo-fiche')==='1';
  body.innerHTML=
    '<div class="set-row">'
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
