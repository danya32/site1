
  const CACHE_NAME = 'v1.0';
  const PRECACHE_URLS = [
    '/',
  '/index.html',
  '/login.html',
  '/register_teacher.html',
  '/register_student.html',
  '/reviews.html',
  '/teachers.html',
  '/styles.css',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
  ];

  self.addEventListener('install', event => {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then(cache => cache.addAll(PRECACHE_URLS))
        .then(() => self.skipWaiting())
    );
  });

  self.addEventListener('activate', event => {
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cache => {
            if (cache !== CACHE_NAME) return caches.delete(cache);
          })
        );
      }).then(() => self.clients.claim())
    );
  });

  self.addEventListener('fetch', event => {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => cache.put(event.request, responseClone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
  });

