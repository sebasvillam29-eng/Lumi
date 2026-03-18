/* Lumi Service Worker — v5 */
const CACHE = 'lumi-v5';

const PRECACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg',
  './icon-192.png',
  './icon-512.png'
];

// ── Install: pre-cache shell ────────────────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache =>
        Promise.allSettled(
          PRECACHE.map(url =>
            fetch(url + '?v=5').then(res => {
              if (res.ok) cache.put(url, res);
            }).catch(() => {})
          )
        )
      )
      .then(() => self.skipWaiting())
  );
});

// ── Activate: prune old caches, then force-reload all open tabs ─────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
      .then(() => self.clients.matchAll({ type: 'window' }))
      .then(clients => clients.forEach(client => client.navigate(client.url)))
  );
});

// ── Fetch: network-first for everything ─────────────────────────────────────
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') return;

  // Google Fonts — cache-first (immutable CDN assets)
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;
        return fetch(request).then(res => {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(request, clone));
          return res;
        }).catch(() => new Response('', { status: 408 }));
      })
    );
    return;
  }

  // Everything else — network-first, cache fallback
  if (url.origin === self.location.origin) {
    event.respondWith(
      fetch(request)
        .then(res => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE).then(c => c.put(request, clone));
          }
          return res;
        })
        .catch(() =>
          caches.match(request)
            .then(r => r || caches.match('./index.html'))
        )
    );
  }
});
