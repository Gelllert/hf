const cacheName = "v2";
/**
 * Kezeli a fetch eseményeket, hogy a kért erőforrás benne van-e a gyorsítótárban, ha igen, vissza adja.
 * Ha nincs, lekéri a hálózatról, eltárolja a cache-ben, majd visszaadja.
 * @param e - A fetch esemény objektum.
 */
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