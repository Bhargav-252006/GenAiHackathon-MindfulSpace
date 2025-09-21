// Simple service worker to handle the 404 error
// This is a minimal service worker that does nothing but prevents the 404 error

self.addEventListener('install', function (event) {
    console.log('Service Worker installing.');
    // Skip waiting to activate immediately
    self.skipWaiting();
});

self.addEventListener('activate', function (event) {
    console.log('Service Worker activating.');
    // Take control of all clients immediately
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function (event) {
    // Just let the browser handle all fetch requests normally
    // We're not doing any caching or offline functionality
    return;
});