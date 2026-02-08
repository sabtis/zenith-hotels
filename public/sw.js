// ZENITH OS - Service Worker v11.0.0-NUCLEUS
// Protocolo de Sincronização Absoluta com Cache-First + Network Update

const CACHE_VERSION = 'zenith-v11.0.0';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;

// Assets estáticos essenciais
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico'
];

// Padrões a NUNCA cachear (APIs, realtime, etc.)
const BYPASS_PATTERNS = [
  'supabase',
  'google',
  '/functions/',
  'ai.gateway.lovable',
  'localhost',
  'lovableproject.com',
  'chrome-extension',
  'hot-update',
  '__vite',
  'ws://',
  'wss://'
];

// Instalação: Cache estático + Skip Waiting imediato
self.addEventListener('install', (event) => {
  console.log('[Zenith SW] Installing v11.0.0-NUCLEUS');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => {
        console.log('[Zenith SW] Static assets cached');
        return self.skipWaiting(); // Ativa IMEDIATAMENTE
      })
  );
});

// Ativação: Limpa TODOS os caches antigos + Claim clients
self.addEventListener('activate', (event) => {
  console.log('[Zenith SW] Activating v11.0.0-NUCLEUS');
  
  event.waitUntil(
    caches.keys()
      .then(keys => {
        return Promise.all(
          keys
            .filter(key => !key.startsWith(CACHE_VERSION))
            .map(key => {
              console.log('[Zenith SW] Purging cache:', key);
              return caches.delete(key);
            })
        );
      })
      .then(() => {
        console.log('[Zenith SW] All old caches purged, claiming clients');
        return self.clients.claim(); // Assume controle IMEDIATO
      })
  );
});

// Estratégia: Network-First com Fallback para Cache
self.addEventListener('fetch', (event) => {
  const requestUrl = event.request.url;
  
  // BYPASS: Ignora completamente requests que não devem ser cacheados
  if (BYPASS_PATTERNS.some(pattern => requestUrl.includes(pattern))) {
    return;
  }
  
  // Ignora requests não-GET
  if (event.request.method !== 'GET') {
    return;
  }
  
  // ESTRATÉGIA NETWORK-FIRST: Sempre tenta buscar da rede primeiro
  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        // Se a rede retornou sucesso, atualiza o cache e retorna
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(DYNAMIC_CACHE).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Offline: Fallback para cache
        return caches.match(event.request).then(cachedResponse => {
          if (cachedResponse) {
            console.log('[Zenith SW] Serving from cache:', requestUrl);
            return cachedResponse;
          }
          // Fallback final para HTML
          if (event.request.headers.get('accept')?.includes('text/html')) {
            return caches.match('/index.html');
          }
        });
      })
  );
});

// Listener para mensagens do cliente (force update)
self.addEventListener('message', (event) => {
  if (event.data === 'FORCE_UPDATE') {
    console.log('[Zenith SW] Force update requested');
    
    caches.keys().then(keys => {
      Promise.all(keys.map(key => caches.delete(key)))
        .then(() => {
          self.skipWaiting();
          event.ports[0]?.postMessage('UPDATE_COMPLETE');
        });
    });
  }
  
  if (event.data === 'GET_VERSION') {
    event.ports[0]?.postMessage({ version: CACHE_VERSION });
  }
});

// Listener para push notifications (futuro)
self.addEventListener('push', (event) => {
  console.log('[Zenith SW] Push received');
});

console.log('[Zenith SW] Script loaded - v11.0.0-NUCLEUS');
