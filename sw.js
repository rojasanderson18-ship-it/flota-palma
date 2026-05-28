const CACHE = 'flotaPG-v9';
const CORE_ASSETS = ['./', './index.html', './control.js', './logo.svg', './logo-mark.svg'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.url.includes('script.google.com')) {
    e.respondWith(fetch(e.request).catch(() => new Response('offline')));
    return;
  }
  const url = new URL(e.request.url);
  const isAppShell = e.request.mode === 'navigate' || url.pathname.endsWith('/') || url.pathname.endsWith('/index.html');
  if (isAppShell) {
    e.respondWith(
      fetch(e.request).then(async response => {
        const text = await response.clone().text();
        const body = text.includes('control.js') ? text : text.replace('</body>', '<script src="./control.js"></script></body>');
        const injected = new Response(body, { headers: { 'Content-Type': 'text/html; charset=UTF-8' } });
        caches.open(CACHE).then(cache => cache.put(e.request, injected.clone()));
        return injected;
      }).catch(() => caches.match(e.request))
    );
    return;
  }
  e.respondWith(
    fetch(e.request).then(response => {
      const clone = response.clone();
      caches.open(CACHE).then(cache => cache.put(e.request, clone));
      return response;
    }).catch(() => caches.match(e.request))
  );
});
