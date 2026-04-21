// FitAI Custom Service Worker
// Caches app shell, last meal plan, and last workout for offline use
// next-pwa injects its own sw.js at /sw.js — this file is the custom worker
// referenced via next-pwa's `swSrc` option if needed. For now it's kept for
// reference; next-pwa generates the actual /sw.js at build time.

const CACHE_NAME = 'fitai-v1';
const APP_SHELL = [
  '/',
  '/dashboard/nutrition',
  '/dashboard/workout',
  '/dashboard/progress',
  '/dashboard/chat',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

// Keys for dynamic content cache
const MEAL_PLAN_CACHE_KEY = 'fitai-last-meal-plan';
const WORKOUT_CACHE_KEY = 'fitai-last-workout';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Cache API responses for meal-plan and workout so they're available offline
  if (url.pathname.startsWith('/api/meal-plan') || url.pathname.startsWith('/api/workout')) {
    event.respondWith(networkFirstWithCache(request));
    return;
  }

  // App shell: stale-while-revalidate
  event.respondWith(
    caches.match(request).then((cached) => {
      const networkFetch = fetch(request).then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      });
      return cached || networkFetch;
    })
  );
});

async function networkFirstWithCache(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const clone = response.clone();
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, clone);
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    // Return an offline JSON response so the app can show the banner
    return new Response(
      JSON.stringify({ offline: true, message: "You're offline — showing last saved data" }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// Listen for messages from the app (e.g. to update caches manually)
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});
