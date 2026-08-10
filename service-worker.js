// ========== Service worker: on-device cache for piano samples + app shell ==========
// Piano samples are the expensive part (~36MB, 452 files) and never change once fetched — cached
// cache-first so a returning visit costs zero network requests for them, on any device. The rest
// of the app shell is cached too so the whole thing works offline after the first successful
// visit, but with a network-first strategy (falling back to cache) so code/lesson changes show up
// on the next visit instead of being stuck behind a stale cache.
const CACHE_VERSION = "v1";
const SAMPLE_CACHE = `piano-samples-${CACHE_VERSION}`;
const SHELL_CACHE = `app-shell-${CACHE_VERSION}`;

self.addEventListener("install", event => {
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== SAMPLE_CACHE && key !== SHELL_CACHE)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);
  if (event.request.method !== "GET" || url.origin !== self.location.origin) return;

  if (url.pathname.includes("/assets/piano-samples/")) {
    event.respondWith(cacheFirst(event.request, SAMPLE_CACHE));
  } else {
    event.respondWith(networkFirst(event.request, SHELL_CACHE));
  }
});

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) cache.put(request, response.clone());
  return response;
}

async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch (err) {
    const cached = await cache.match(request);
    if (cached) return cached;
    throw err;
  }
}
