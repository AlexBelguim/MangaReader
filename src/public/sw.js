/**
 * Service Worker for Manga Reader PWA
 * Handles: app shell caching, offline chapter images from IndexedDB, push notifications
 */

const CACHE_NAME = 'manga-reader-v1';
const APP_SHELL_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// ==================== INSTALL ====================

self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_SHELL_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// ==================== ACTIVATE ====================

self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// ==================== FETCH ====================

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip socket.io and API mutation requests
  if (url.pathname.startsWith('/socket.io')) return;

  // Chapter images: check IndexedDB first (offline chapters)
  if (url.pathname.includes('/chapter-images/') || url.pathname.includes('/reader-images')) {
    event.respondWith(
      handleChapterImage(event.request)
    );
    return;
  }

  // API requests: network-first with cache fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      networkFirstWithCache(event.request)
    );
    return;
  }

  // App shell & static assets: cache-first
  event.respondWith(
    cacheFirstWithNetwork(event.request)
  );
});

// ==================== CACHING STRATEGIES ====================

/**
 * Cache-first: try cache, fallback to network (for app shell)
 */
async function cacheFirstWithNetwork(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (e) {
    // If offline and no cache, return a basic offline page
    if (request.destination === 'document') {
      const cached = await caches.match('/index.html');
      if (cached) return cached;
    }
    throw e;
  }
}

/**
 * Network-first with cache fallback (for API calls)
 */
async function networkFirstWithCache(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (e) {
    const cached = await caches.match(request);
    if (cached) return cached;
    return new Response(JSON.stringify({ error: 'Offline' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * Handle chapter image requests — check IndexedDB cache first
 */
async function handleChapterImage(request) {
  // Try to get from IndexedDB offline cache
  try {
    const blob = await getImageFromIndexedDB(request.url);
    if (blob) {
      return new Response(blob, {
        headers: { 'Content-Type': blob.type || 'image/jpeg' }
      });
    }
  } catch (e) {
    // IndexedDB not available or no match, continue to network
  }

  // Fallback to network, then cache in regular cache
  try {
    const response = await fetch(request);
    return response;
  } catch (e) {
    return new Response('', { status: 503, statusText: 'Offline' });
  }
}

// ==================== IndexedDB Helpers (SW-side) ====================

const DB_NAME = 'manga-offline';
const DB_VERSION = 1;
const IMAGE_STORE = 'images';

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(IMAGE_STORE)) {
        db.createObjectStore(IMAGE_STORE);
      }
      if (!db.objectStoreNames.contains('chapters')) {
        db.createObjectStore('chapters');
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function getImageFromIndexedDB(url) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IMAGE_STORE, 'readonly');
    const store = tx.objectStore(IMAGE_STORE);
    const req = store.get(url);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

// ==================== PUSH NOTIFICATIONS ====================

self.addEventListener('push', (event) => {
  console.log('[SW] Push received');
  let data = { title: 'Manga Reader', body: 'New chapter available!' };

  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [100, 50, 100],
    data: {
      mangaId: data.mangaId,
      url: data.url || '/'
    },
    actions: [
      { action: 'open', title: 'Open' },
      { action: 'dismiss', title: 'Dismiss' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );

  // If auto-offline is enabled for this manga, trigger sync
  if (data.mangaId && data.autoOffline) {
    event.waitUntil(
      self.registration.sync.register(`auto-offline-${data.mangaId}`)
        .catch(() => { /* sync not supported */ })
    );
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') return;

  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clients) => {
        // Focus existing window if available
        for (const client of clients) {
          if (client.url.includes(self.location.origin)) {
            client.navigate(urlToOpen);
            return client.focus();
          }
        }
        // Open new window
        return self.clients.openWindow(urlToOpen);
      })
  );
});

// ==================== BACKGROUND SYNC ====================

self.addEventListener('sync', (event) => {
  if (event.tag.startsWith('auto-offline-')) {
    const mangaId = event.tag.replace('auto-offline-', '');
    event.waitUntil(syncOfflineChapters(mangaId));
  }
});

async function syncOfflineChapters(mangaId) {
  try {
    // Get auth token from IndexedDB (stored by the app)
    const db = await openDB();
    const tx = db.transaction('chapters', 'readonly');
    const store = tx.objectStore('chapters');
    const autoOfflineReq = store.get(`auto-offline-${mangaId}`);

    await new Promise((resolve, reject) => {
      autoOfflineReq.onsuccess = resolve;
      autoOfflineReq.onerror = reject;
    });

    if (!autoOfflineReq.result) return;

    // Notify any open client to handle the sync
    const clients = await self.clients.matchAll({ type: 'window' });
    for (const client of clients) {
      client.postMessage({
        type: 'sync-offline',
        mangaId
      });
    }
  } catch (e) {
    console.error('[SW] Sync failed:', e);
  }
}
