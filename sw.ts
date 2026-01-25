import { defaultCache } from "@serwist/vite/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { CacheFirst, NetworkFirst, Serwist } from "serwist";

// This declares the value of `injectionPoint` to TypeScript.
// `injectionPoint` is the string that will be replaced by the
// actual precache manifest. By default, this string is set to
// `"self.__SW_MANIFEST"`.
declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;
const cacheFirst = new CacheFirst();
const networkFirst = new NetworkFirst();

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: false,
  clientsClaim: true,
  navigationPreload: true,
  precacheOptions: {
    cleanupOutdatedCaches: true,
  },
  runtimeCaching: [
    {
      matcher: ({ url }) => url.pathname.includes("picture"),
      handler: cacheFirst,
    },
    {
      matcher: ({ url }) =>
        url.pathname.startsWith(import.meta.env.VITE_API_URL),
      handler: networkFirst,
    },

    ...defaultCache,
  ],
});

serwist.registerCapture(({ request, sameOrigin }) => {
  return sameOrigin && request.destination === "image";
}, new CacheFirst());

// add fallbacks
serwist.setCatchHandler(async ({ request }) => {
  const dest = request.destination;

  if (dest === "document") {
    const match = await serwist.matchPrecache("/offline.html");
    return match || Response.error();
  }

  if (dest === "image") {
    const match = await serwist.matchPrecache("/fallback.png");
    return match || Response.error();
  }

  if (dest === "font") {
    const match = await serwist.matchPrecache("/fonts/fallback.woff2");
    return match || Response.error();
  }

  return Response.error();
});
serwist.addEventListeners();
