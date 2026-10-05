/* js/12-demarrage.js — morceau du script du site. Le build (outils/construire.mjs)
   recolle js/*.js dans l'ORDRE des noms en UN SEUL script, app.js : les
   fonctions restent visibles d'un morceau à l'autre comme avant, et le code
   « de premier niveau » s'exécute dans cet ordre. */
/* ── I. INITIALISATION ───────────────────────────────────────────────
   Appel initial au chargement de la page :
   renderSB()      → construit la sidebar avec la première notion active
   renderContent() → affiche le contenu de cette première notion        */
restoreDraftsFromStorage();   // new (Phase 3) : recharge le brouillon de proposition local
restoreNavFromStorage();      // position survit à l'actualisation (philo-nav)
restoreNavHistory();          // pile « ← Retour » survit aussi (philo-navhist)
renderSB();renderCurrentView();
initAuth();           // new (comptes) : récupère la session + s'abonne aux changements d'état
tourStartIfFirst();   // visite guidée auto à la 1re venue (cf. module « Visite guidée »)
initNotice();         // bandeau « contenu en construction » (auto-fermeture à 1 min)

/* ── PWA — enregistrement du service worker + mise à jour automatique ──
   Le service worker rend le site installable et utilisable hors-ligne.
   Désormais il sert le HTML/JS en « réseau d'abord » (cf. sw.js) : une
   simple actualisation récupère la dernière version déployée, sans la
   manip manuelle de vidage de cache.

   Mise à jour transparente : quand un nouveau service worker prend le
   contrôle de la page (événement `controllerchange`), on recharge UNE
   seule fois pour basculer sur la nouvelle version. Le garde
   `navigator.serviceWorker.controller` évite de recharger à la toute
   première visite (aucun contrôleur encore actif = rien à remplacer).
   `reg.update()` force la vérification d'une nouvelle version à chaque
   chargement. Aucune erreur si le navigateur ne supporte pas. */
if('serviceWorker' in navigator){
  let swReloading=false;        // garde anti-boucle de rechargement
  // Un contrôleur déjà présent = on a une version installée susceptible
  // d'être remplacée → on s'autorise le rechargement auto à la bascule.
  if(navigator.serviceWorker.controller){
    navigator.serviceWorker.addEventListener('controllerchange',()=>{
      if(swReloading) return;
      swReloading=true;
      window.location.reload();
    });
  }
  window.addEventListener('load',()=>{
    navigator.serviceWorker.register('sw.js')
      .then(reg=>{ reg.update().catch(()=>{}); })   // cherche une MAJ dès le chargement
      .catch(()=>{});
  });
}
