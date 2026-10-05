/* js/10-partage.js — morceau du script du site. Le build (outils/construire.mjs)
   recolle js/*.js dans l'ORDRE des noms en UN SEUL script, app.js : les
   fonctions restent visibles d'un morceau à l'autre comme avant, et le code
   « de premier niveau » s'exécute dans cet ordre. */
/* ══════════════════════════════════════════════════════════════════
   PARTAGE DU SITE (bouton .topbar-share → modale #share-overlay)
   ──────────────────────────────────────────────────────────────────
   Le site est un simple lien : on le rend facile à diffuser. Approche
   adaptative à l'appareil :
   • Mobile / appareils compatibles → bouton « Partager… » qui ouvre la
     feuille de partage native du système (navigator.share : SMS, mail,
     messageries, AirDrop…). Affiché en tête seulement si supporté.
   • Partout → un QR code (à scanner en personne) + le lien copiable en
     un clic. Ces deux moyens marchent même hors-ligne (aucun compte
     requis), le QR étant la seule ressource réseau (avec repli si KO).
   ══════════════════════════════════════════════════════════════════ */

// URL canonique à partager : origine + chemin, sans le hash de navigation
// interne (#notion…) ni les paramètres, pour un lien propre et stable.
function shareUrl(){ return location.origin + location.pathname; }

// Ouverture / fermeture de la modale (même mécanique que les autres modales).
function openShare(){ renderShare(); document.getElementById('share-overlay').classList.add('open'); }
function closeShare(){ document.getElementById('share-overlay').classList.remove('open'); }

/* renderShare() — construit le corps de la modale (#share-body).
   Compose, dans l'ordre : intro, bouton de partage natif (si supporté),
   QR code, lien copiable, ligne de statut. Tout est (re)généré à chaque
   ouverture pour refléter l'URL courante. */
function renderShare(){
  const body=document.getElementById('share-body');
  if(!body) return;
  const url=shareUrl();
  const urlAttr=url.replace(/"/g,'&quot;');                 // sûr en attribut HTML
  // Le QR est rendu par un service externe (API publique) : pas de
  // bibliothèque embarquée. onerror → on masque proprement le bloc.
  const qr='https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=0&data='+encodeURIComponent(url);
  // Bouton de partage natif : seulement si l'appareil le propose (mobiles
  // surtout). Sinon on s'appuie sur le QR + la copie, toujours présents.
  const nativeBtn = (typeof navigator!=='undefined' && navigator.share)
    ? `<button class="share-btn share-btn-primary share-native" onclick="shareNative()">📲 Partager…</button>`
    : '';
  body.innerHTML=`
    <div class="share-intro">Partage l'outil de révision à tes camarades : scanne le QR code, copie le lien, ou utilise le partage de ton appareil.</div>
    ${nativeBtn}
    <div class="share-qr-wrap">
      <img class="share-qr" src="${qr}" alt="QR code vers le site" loading="lazy"
        onerror="this.parentNode.style.display='none'">
      <div class="share-qr-cap">Scanne pour ouvrir le site</div>
    </div>
    <div class="share-linkrow">
      <input class="share-link" id="share-link" type="text" readonly value="${urlAttr}"
        onclick="this.select()" aria-label="Lien du site">
      <button class="share-btn share-btn-copy" id="share-copy" onclick="copyShareLink(this)">Copier</button>
    </div>
    <div class="share-status" id="share-status"></div>`;
}

/* shareNative() — ouvre la feuille de partage native du système.
   Le rejet par annulation de l'utilisateur (AbortError) est silencieux ;
   toute autre erreur retombe sur la copie du lien. */
async function shareNative(){
  const url=shareUrl();
  try{
    await navigator.share({ title:'Révision Philo — Terminale', text:'Outil de révision de philosophie (Terminale) : fiches, citations, dissertations et quiz.', url });
  }catch(e){
    if(e && e.name==='AbortError') return;   // l'utilisateur a simplement fermé la feuille
    copyShareLink(document.getElementById('share-copy'));
  }
}

/* copyShareLink(btn) — copie le lien dans le presse-papiers et confirme
   visuellement (bouton « Copié ! » vert, 1,8 s). Repli execCommand pour les
   navigateurs anciens ou les contextes non sécurisés (où clipboard est absent). */
async function copyShareLink(btn){
  const url=shareUrl();
  let ok=false;
  try{
    if(navigator.clipboard && navigator.clipboard.writeText){
      await navigator.clipboard.writeText(url); ok=true;
    } else throw new Error('no-clipboard-api');
  }catch(e){
    // Repli : sélection du champ + execCommand('copy').
    const inp=document.getElementById('share-link');
    if(inp){ inp.focus(); inp.select(); try{ ok=document.execCommand('copy'); }catch(_){ ok=false; } }
  }
  if(btn){
    const old=btn.textContent;
    btn.textContent = ok ? 'Copié !' : 'Échec';
    btn.classList.toggle('ok', ok);
    setTimeout(()=>{ btn.textContent=old; btn.classList.remove('ok'); }, 1800);
  }
}

/* Câblage des fermetures de la modale de partage (croix, voile, Échap),
   même garde anti-fermeture-accidentelle que les autres modales. */
(function initShareUI(){
  const closeBtn=document.getElementById('share-close');
  if(!closeBtn) return;                  // sécurité si le HTML est absent
  closeBtn.addEventListener('click',closeShare);
  const _ov=document.getElementById('share-overlay');
  let _down=false;
  _ov.addEventListener('mousedown',e=>{ _down=(e.target===_ov); });
  _ov.addEventListener('click',e=>{ if(e.target===_ov&&_down) closeShare(); });
  document.addEventListener('keydown',e=>{ if(e.key==='Escape') closeShare(); });
})();
