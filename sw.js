// Service worker — outil de révision philo.
// Stratégie MIXTE selon le type de ressource :
//   • HTML / JS (le « code » du site, qui change à chaque déploiement) →
//     « réseau d'abord, cache en repli ». Ainsi une simple actualisation
//     récupère la dernière version en ligne ; le cache ne sert qu'en cas
//     de coupure réseau. Fini la manip manuelle de vidage de cache.
//   • Le reste (icône, manifeste, polices Google) → « cache d'abord »
//     (ces fichiers changent rarement → priorité à la vitesse/hors-ligne).
// Permet l'usage hors-ligne tout en restant à jour dès qu'on a du réseau.
// Pour invalider le cache après une mise à jour, incrémenter la version.

const CACHE = 'philo-v59';
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
  // L'appli de TRIAGE (/triage/) est une PWA SÉPARÉE, avec son propre service
  // worker (scope /triage/). Bien que le scope de CE SW soit « / » (donc couvre
  // /triage/), on s'en désintéresse explicitement : sinon on intercepterait son
  // manifeste/icône (cache-first) et on brouillerait son identité d'appli
  // (mauvaise icône, pas d'install séparée). On laisse le SW de triage / le
  // réseau gérer entièrement /triage/.
  if (sameOrigin && url.pathname.includes('/triage/')) return;

  // Le « code » du site = HTML et JS de même origine (et toute navigation).
  // C'est ce qui change à chaque déploiement → réseau d'abord.
  const isApp = sameOrigin && (
    e.request.mode === 'navigate' ||
    url.pathname.endsWith('/') ||
    /\.(html|js)$/.test(url.pathname)
  );

  if (isApp) {
    // RÉSEAU D'ABORD : on tente le réseau, on met à jour le cache, et on
    // ne retombe sur le cache (puis l'index) qu'en cas d'échec réseau.
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
    return;
  }

  // CACHE D'ABORD pour le reste (icône, manifeste, polices) : rapide et
  // stable hors-ligne ; on récupère sur le réseau au 1er accès seulement.
  e.respondWith(
    caches.match(e.request).then(hit => {
      if (hit) return hit;
      return fetch(e.request).then(resp => {
        if (resp && resp.status === 200) {
          const copy = resp.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return resp;
      });
    })
  );
});
