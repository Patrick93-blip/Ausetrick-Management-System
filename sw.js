// ATC Income Management System - Service Worker
// Version 1.0.0

const CACHE_NAME = 'atc-income-v1.0.0';
const urlsToCache = [
    './',
    './index.html',
    './styles.css',
    './script.js',
    './README.md',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
    'https://cdn.jsdelivr.net/npm/chart.js'
];

// Install event - cache resources
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('ATC: Service Worker - Caching files');
                return cache.addAll(urlsToCache);
            })
            .catch(function(error) {
                console.error('ATC: Service Worker - Cache failed:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== CACHE_NAME) {
                        console.log('ATC: Service Worker - Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                // Return cached version or fetch from network
                if (response) {
                    console.log('ATC: Service Worker - Serving from cache:', event.request.url);
                    return response;
                }
                
                console.log('ATC: Service Worker - Fetching from network:', event.request.url);
                return fetch(event.request).then(
                    function(response) {
                        // Check if we received a valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        // Clone the response
                        var responseToCache = response.clone();
                        
                        caches.open(CACHE_NAME)
                            .then(function(cache) {
                                cache.put(event.request, responseToCache);
                            });
                        
                        return response;
                    }
                ).catch(function(error) {
                    console.error('ATC: Service Worker - Fetch failed:', error);
                    
                    // Return offline page or cached fallback
                    if (event.request.destination === 'document') {
                        return caches.match('./index.html');
                    }
                });
            })
    );
});

// Background sync for data backup
self.addEventListener('sync', function(event) {
    if (event.tag === 'atc-backup') {
        console.log('ATC: Service Worker - Background sync triggered');
        event.waitUntil(performBackgroundBackup());
    }
});

// Push notification support
self.addEventListener('push', function(event) {
    console.log('ATC: Service Worker - Push received');
    
    const options = {
        body: 'ATC Income Management System notification',
        icon: './icon-192x192.png',
        badge: './badge-72x72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: '1'
        }
    };
    
    event.waitUntil(
        self.registration.showNotification('ATC System', options)
    );
});

// Helper function for background backup
async function performBackgroundBackup() {
    try {
        // This would typically sync with a server
        console.log('ATC: Service Worker - Performing background backup');
        return Promise.resolve();
    } catch (error) {
        console.error('ATC: Service Worker - Background backup failed:', error);
        return Promise.reject(error);
    }
}

// Message handling from main thread
self.addEventListener('message', function(event) {
    console.log('ATC: Service Worker - Message received:', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({ version: CACHE_NAME });
    }
});

console.log('ATC: Service Worker - Loaded successfully');
