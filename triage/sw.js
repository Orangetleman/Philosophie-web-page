// Service worker de la page de TRIAGE (scope /triage/).
// Distinct du SW de l'appli principale (scope /) : il ne gère QUE cette page.
//
// Stratégie : « réseau d'abord » pour la coquille (HTML/JS/manifeste), avec le
// cache en repli hors-ligne — ainsi une simple actualisation récupère toujours
// la dernière version. Les appels à Supabase (données + auth) ne sont JAMAIS
// interceptés : le triage exige le réseau (rien à mettre en cache, et on ne
// veut pas servir des contributions périmées).
//
// À chaque modif de cette coquille, incrémenter la version.

const CACHE = 'triage-v1';
const SHELL = ['./', './index.html', './manifest.webmanifest', '../icon.svg'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE && k.startsWith('triage-')).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  // On ne s'occupe QUE des ressources de même origine sous /triage/.
  // Tout le reste (Supabase, CDN supabase-js) part directement au réseau.
  if (url.origin !== location.origin) return;
  if (!url.pathname.includes('/triage/') && !url.pathname.endsWith('/icon.svg')) return;

  e.respondWith(
    fetch(e.request).then(resp => {
      if (resp && resp.status === 200) {
        const copy = resp.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
      }
      return resp;
    }).catch(() =>
      caches.match(e.request).then(hit =>
        hit || (e.request.mode === 'navigate' ? caches.match('./index.html') : undefined)
      )
    )
  );
});
