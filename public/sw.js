const CACHE_NAME = 'luxvago-v3.5.1-sovereign';

const ASSETS = ['/', '/index.html', '/manifest.json'];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(k => {
        if (k !== CACHE_NAME) {
          console.log('Zenith SW: Purging old cache', k);
          return caches.delete(k);
        }
      })
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  // Não cachear chamadas de API (Google, Supabase, Edge Functions)
  const url = e.request.url;
  if (
    url.includes('google') ||
    url.includes('supabase') ||
    url.includes('/functions/') ||
    url.includes('ai.gateway.lovable')
  ) {
    return;
  }

  e.respondWith(
    fetch(e.request).then(res => {
      if (!res || res.status !== 200 || res.type !== 'basic') return res;
      const clone = res.clone();
      caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
      return res;
    }).catch(() => caches.match(e.request))
  );
});
