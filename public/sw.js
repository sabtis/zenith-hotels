// ZENITH OS - Service Worker v11.0.0-NUCLEUS
// Protocolo de Sincronização Simplificado

const CACHE_NAME = 'luxvago-zenith-v11.0.0';

const ASSETS = ['/', '/index.html', '/manifest.json'];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => 
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // Ignora chamadas de API
  if (e.request.url.includes('/api/')) return;
  
  e.respondWith(
    fetch(e.request)
      .then(r => {
        if (!r || r.status !== 200) return r;
        const rc = r.clone();
        caches.open(CACHE_NAME).then(c => c.put(e.request, rc));
        return r;
      })
      .catch(() => caches.match(e.request))
  );
});

console.log('[Zenith SW] v11.0.0-NUCLEUS loaded');
