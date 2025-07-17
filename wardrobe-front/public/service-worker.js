// service-worker.js
self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open('static-assets').then((cache) => {
        return cache.addAll([
          '/',  // Добавляем главный HTML файл
          '/index.html',
          '/style.css',
          '/app.js',
          // Добавьте сюда другие файлы, которые хотите кэшировать
        ]);
      })
    );
  });
  
  self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then((networkResponse) => {
          return caches.open('dynamic-assets').then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
    );
  });
  
  self.addEventListener('activate', (event) => {
    const cacheWhitelist = ['static-assets', 'dynamic-assets'];
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!cacheWhitelist.includes(cacheName)) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
  });
  