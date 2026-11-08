/* Korálové sny – service worker: hra funguje i offline.
   Strategie "nejdřív síť": online se vždy načte nejnovější verze, offline se použije uložená kopie. */
const CACHE = 'koralove-sny-v5';
const FILES = ['./', './index.html', './css/style.css', './manifest.webmanifest', './icons/icon.svg', './icons/icon-180.png',
  './js/storage.js', './js/levels.js', './js/engine.js', './js/sound.js', './js/music.js', './js/art.js', './js/art2.js', './js/art3.js', './js/meta.js', './js/pay.js', './js/shop.js', './js/scenes.js',
  './js/ui.js', './js/home.js', './js/map.js', './js/game.js', './js/main.js'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(res => {
      if (res.ok && new URL(e.request.url).origin === location.origin) {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
      }
      return res;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
