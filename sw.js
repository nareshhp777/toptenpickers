/**
 * Service Worker — Top 10 Picker (toptenpicker.com)
 * Enables offline viewing, instant image switching, and stale-while-revalidate caching.
 */

const SHELL_CACHE = 'top10-shell-v1';
const MEDIA_CACHE = 'top10-media-v1';
const MAX_MEDIA_ENTRIES = 80;

const SHELL_ASSETS = [
  '/',
  '/style.css',
  '/app.js',
  '/favicon.svg',
  '/logo.png'
];

// Helper: Trim cache to max size (LRU)
async function trimCache(cacheName, maxItems) {
  try {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    if (keys.length > maxItems) {
      await cache.delete(keys[0]);
      trimCache(cacheName, maxItems);
    }
  } catch (e) {}
}

// 1. Install Event: Pre-cache critical app shell
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(SHELL_CACHE).then(cache => {
      return cache.addAll(SHELL_ASSETS).catch(err => {
        console.warn('[SW] Shell cache pre-fetch warning:', err);
      });
    })
  );
});

// 2. Activate Event: Clean up outdated cache versions
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== SHELL_CACHE && key !== MEDIA_CACHE) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch Event: Intelligent routing
self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  // Only handle GET requests
  if (req.method !== 'GET') return;

  // Bypass dynamic Cloudflare Worker API & Google Analytics
  if (url.hostname.includes('workers.dev') ||
      url.hostname.includes('googletagmanager.com') ||
      url.hostname.includes('google-analytics.com')) {
    return;
  }

  // Strategy A: ImageKit Media (Cache-First with LRU)
  if (url.hostname.includes('ik.imagekit.io')) {
    event.respondWith(
      caches.open(MEDIA_CACHE).then(async cache => {
        const cached = await cache.match(req);
        if (cached) return cached;

        try {
          const fresh = await fetch(req);
          if (fresh && fresh.status === 200) {
            cache.put(req, fresh.clone());
            trimCache(MEDIA_CACHE, MAX_MEDIA_ENTRIES);
          }
          return fresh;
        } catch (err) {
          return cached || Response.error();
        }
      })
    );
    return;
  }

  // Strategy B: HTML Page Navigations (Network-First with Cache Fallback)
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then(res => {
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(SHELL_CACHE).then(cache => cache.put(req, clone));
          }
          return res;
        })
        .catch(async () => {
          const cached = await caches.match(req);
          if (cached) return cached;
          const fallback = await caches.match('/');
          return fallback || Response.error();
        })
    );
    return;
  }

  // Strategy C: Static Assets (CSS, JS, Fonts, Covers — Stale-While-Revalidate)
  if (url.origin === self.location.origin || url.hostname.includes('cdnjs.cloudflare.com')) {
    event.respondWith(
      caches.match(req).then(cached => {
        const fetchPromise = fetch(req).then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(SHELL_CACHE).then(cache => cache.put(req, clone));
          }
          return networkResponse;
        }).catch(() => cached);

        return cached || fetchPromise;
      })
    );
    return;
  }
});
