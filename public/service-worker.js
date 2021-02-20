const STATIC_BUDGET = "static-budget-v1";
const BUDGET_DATA = "data-budget-v1";

const FILES_TO_CACHE = [
	"/",
	"/index.html",
	"/manifest.webmanifest",
	"/styles.css",
    "/index.js",
    "/indexDB.js",
	"/icons/icon-192x192.png",
    "/icons/icon-512x512.png"
];

// Adds data to cache using an async function
self.addEventListener("install", async (e) => {
    const budgetData = await caches.open(BUDGET_DATA);
    await budgetData.add("/api/transaction");
  
    const staticBudget = await caches.open(STATIC_BUDGET);
    await staticBudget.addAll(FILES_TO_CACHE);
  
    self.skipWaiting();
  });
  
// Sets-up service worker and turns it "on"
self.addEventListener("activate", (e) => {
	e.waitUntil(
		caches.keys().then((keyList) => {
			return Promise.all(
				keyList.map((key) => {
					if (key !== STATIC_BUDGET && key !== BUDGET_DATA) {
						console.log("Removing old cache data", key);
						return caches.delete(key);
					}
				})
			);
		})
	);

	self.clients.claim();
});

// Asking access to data by fetching
self.addEventListener("fetch", (e) => {
	if (e.request.url.includes("/api/")) {
		e.respondWith(
			caches
				.open(BUDGET_DATA)
				.then((cache) => {
					return (
						fetch(e.request)
							.then((response) => {
								// If the response was good, clone it and store it in the cache.
								if (response.status === 200) {
									cache.put(e.request.url, response.clone());
								}

								return response;
							})
							// if  request fails, try to get data from the cache.
							.catch((err) => {
								return cache.match(e.request);
							})
					);
				})
				.catch((err) => console.log(err))
		);

		return;
	}
	// Fetch data response
	e.respondWith(
		caches.open(STATIC_BUDGET).then((cache) => {
			return cache.match(e.request).then((response) => {
				return response || fetch(e.request);
			});
		})
	);
});
