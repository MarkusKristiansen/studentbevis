const CACHE = 'studentbevis-v2';
const FILES = [
  './',
  './index.html',
  './qr.png',
  './icon.png',
  './sikt_logo.png'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return cache.addAll(FILES);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(names) {
      return Promise.all(names.map(function(name) {
        if (name !== CACHE) return caches.delete(name);
      }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request)
        .then(function(response) {
          var copy = response.clone();
          caches.open(CACHE).then(function(cache) {
            cache.put('./index.html', copy);
          });
          return response;
        })
        .catch(function() {
          return caches.match('./index.html');
        })
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});
