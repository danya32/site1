// Версия кэша - при обновлении кэш автоматически заменится
const CACHE_NAME = 'v1.0';
// Ресурсы для кэширования при установке
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
  '/icons/icon-512.png',
];

// Установка Service Worker и кэширование ресурсов
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(self.skipWaiting()) // Активирует SW без ожидания
  );
});

// Активация и очистка старых кэшей
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache); // Удаляем старые кэши
          }
        })
      );
    }).then(() => self.clients.claim()) // Контролирует страницы сразу
  );
});

// Стратегия: "Сначала сеть, потом кэш" (с fallback для оффлайн-режима)
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Клонируем ответ для кэширования
        const responseClone = response.clone();
        caches.open(CACHE_NAME)
          .then(cache => cache.put(event.request, responseClone));
        return response;
      })
      .catch(() => caches.match(event.request)) // Оффлайн-режим
  );
});
