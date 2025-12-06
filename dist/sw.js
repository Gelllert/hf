const cacheName = "final";
const expectedCaches = [cacheName];

async function impl(e) {
    let cache = await caches.open(cacheName);
    let cacheResponse = await cache.match(e.request);
    if (cacheResponse)
        return cacheResponse
    else {
        let networkResponse = await fetch(e.request);
        cache.put(e.request, networkResponse.clone())
        return networkResponse;
    }
}
self.addEventListener("fetch", e => e.respondWith(impl(e))); 
self.addEventListener("install", (e) => {
    self.skipWaiting();
});
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (!expectedCaches.includes(key)) {
                        console.log('bocs de új cache van:', key);
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.clients.claim(); 
});

