// Service Worker for Manga Scraper PWA
const CACHE_NAME = 'manga-scraper-v4';
const STATIC_CACHE = 'manga-static-v4';
const IMAGE_CACHE = 'manga-images-v4';

// Static assets to cache immediately
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/js/app.js',
    '/js/api.js',
    '/js/components.js',
    '/js/router.js',
    '/manifest.json'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('[SW] Installing service worker...');
    event.waitUntil(
        caches.open(STATIC_CACHE).then((cache) => {
            console.log('[SW] Caching static assets');
            return cache.addAll(STATIC_ASSETS);
        })
    );
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating service worker...');
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys
                    .filter((key) => key !== STATIC_CACHE && key !== IMAGE_CACHE)
                    .map((key) => caches.delete(key))
            );
        })
    );
    self.clients.claim();
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Skip non-GET requests
    if (event.request.method !== 'GET') return;

    // Handle image requests (covers, chapter images)
    if (url.pathname.startsWith('/downloads/') ||
        url.pathname.startsWith('/covers/') ||
        url.pathname.includes('/covers/')) {
        event.respondWith(cacheFirst(event.request, IMAGE_CACHE));
        return;
    }

    // Handle API requests - network first with cache fallback
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(networkFirst(event.request));
        return;
    }

    // Handle static assets - cache first
    event.respondWith(cacheFirst(event.request, STATIC_CACHE));
});

// Cache-first strategy (for images and static assets)
async function cacheFirst(request, cacheName) {
    const cached = await caches.match(request);
    if (cached) {
        return cached;
    }

    try {
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, response.clone());
        }
        return response;
    } catch (error) {
        console.log('[SW] Network failed, no cache available');
        return new Response('Offline', { status: 503 });
    }
}

// Network-first strategy (for API calls)
async function networkFirst(request) {
    try {
        const response = await fetch(request);
        // Cache successful API responses
        if (response.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, response.clone());
        }
        return response;
    } catch (error) {
        // Fall back to cache if network fails
        const cached = await caches.match(request);
        if (cached) {
            console.log('[SW] Serving API from cache (offline)');
            return cached;
        }
        return new Response(JSON.stringify({ error: 'Offline' }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

// Push notification event
self.addEventListener('push', (event) => {
    if (!event.data) return;

    const data = event.data.json();
    const options = {
        body: data.body || 'New chapter available!',
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: data.tag || 'manga-update',
        data: data.url || '/'
    };

    event.waitUntil(
        self.registration.showNotification(data.title || 'Manga Update', options)
    );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    event.waitUntil(
        clients.matchAll({ type: 'window' }).then((clientList) => {
            // Focus existing window or open new one
            for (const client of clientList) {
                if (client.url === event.notification.data && 'focus' in client) {
                    return client.focus();
                }
            }
            return clients.openWindow(event.notification.data);
        })
    );
});

console.log('[SW] Service worker loaded');
