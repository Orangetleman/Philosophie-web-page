// Service worker de l'ancienne page de TRIAGE (scope /triage/), retirée au
// lot A6 (nov. 2026) au profit de /admin/. Ceux qui avaient installé la
// page gardent ce worker : sa nouvelle version efface les caches « triage-… »,
// se désinscrit, puis recharge les onglets ouverts, qui tombent alors sur la
// redirection de triage/index.html vers /admin/.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const cles = await caches.keys();
    await Promise.all(cles.filter(k => k.startsWith('triage-')).map(k => caches.delete(k)));
    await self.registration.unregister();
    const onglets = await self.clients.matchAll({ type: 'window' });
    onglets.forEach(c => c.navigate(c.url));
  })());
});
