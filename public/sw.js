const CACHE_NAME = 'luxvago-v3.5.1';

const ASSETS = ['/', '/index.html', '/manifest.json'];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => k !== CACHE_NAME && caches.delete(k))))
    .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  // Ignora requisições para APIs externas e edge functions
  if (e.request.url.includes('google') || 
      e.request.url.includes('/functions/') ||
      e.request.url.includes('supabase') ||
      e.request.url.includes('/api/')) return;
  
  e.respondWith(
    fetch(e.request).then(res => {
      const clone = res.clone();
      caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
      return res;
    }).catch(() => caches.match(e.request))
  );
});
