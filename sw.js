// Service worker — outil de révision philo.
// Stratégie : « cache d'abord, réseau en repli ». Au premier chargement,
// on précache l'index, le manifeste et l'icône ; ensuite chaque requête
// est servie depuis le cache si disponible, sinon récupérée sur le réseau
// et stockée pour la prochaine fois. Permet l'usage 100 % hors-ligne.
// Pour invalider le cache après une mise à jour, incrémenter la version.

const CACHE = 'philo-v10';
const PRECACHE = ['./', './index.html', './data.js', './manifest.json', './icon.svg'];

// Installation : on précache les ressources critiques.
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(PRECACHE))
      .then(() => self.skipWaiting())   // active la nouvelle version sans attendre
  );
});

// Activation : suppression des anciens caches (autres versions).
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())  // contrôle immédiat des pages ouvertes
  );
});

// Fetch : on intercepte les GET de même origine (et Google Fonts).
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  const sameOrigin = url.origin === location.origin;
  const isFonts = url.hostname.includes('fonts.g');     // fonts.googleapis / gstatic
  if (!sameOrigin && !isFonts) return;                  // les autres : laissés au navigateur

  e.respondWith(
    caches.match(e.request).then(hit => {
      if (hit) return hit;
      return fetch(e.request).then(resp => {
        // Met en cache les réponses OK pour la prochaine fois.
        if (resp && resp.status === 200) {
          const copy = resp.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return resp;
      }).catch(() => {
        // Réseau coupé : pour une navigation, on retombe sur l'index en cache.
        if (e.request.mode === 'navigate') return caches.match('./index.html');
      });
    })
  );
});
