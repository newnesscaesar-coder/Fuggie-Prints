const cacheName = 'fuggie-prints-app-v1';
const appShell = ['./', './index.html', './app.css', './app.js', './manifest.webmanifest', '../images/fuggie-prints-logo.png'];
self.addEventListener('install', (event) => event.waitUntil(caches.open(cacheName).then((cache) => cache.addAll(appShell))));
self.addEventListener('fetch', (event) => event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request))));
