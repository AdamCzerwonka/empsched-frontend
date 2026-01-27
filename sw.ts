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

// ============================================
// PUSH NOTIFICATIONS - add BEFORE serwist.addEventListeners()
// ============================================
interface PushPayload {
  type: string;
  title: string;
  body: string;
  url?: string;
  data?: Record<string, string>;
}

self.addEventListener("push", (event: PushEvent) => {
  if (!event.data) return;

  const payload: PushPayload = event.data.json();

  const options: NotificationOptions = {
    body: payload.body,
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-192x192.png",
    data: { url: payload.url, ...payload.data, type: payload.type },
    tag: payload.type,
  };

  event.waitUntil(
    Promise.all([
      self.registration.showNotification(payload.title, options),
      self.clients
        .matchAll({ type: "window", includeUncontrolled: true })
        .then((clients) => {
          clients.forEach((client) => {
            client.postMessage({
              type: "PUSH_RECEIVED",
              payload,
            });
          });
        }),
    ])
  );
});

self.addEventListener("notificationclick", (event: NotificationEvent) => {
  event.notification.close();

  const url = event.notification.data?.url || "/";

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clients) => {
        for (const client of clients) {
          if (client.url.includes(self.location.origin) && "focus" in client) {
            client.focus();
            if ("navigate" in client) {
              (client as WindowClient).navigate(url);
            }
            return;
          }
        }
        return self.clients.openWindow(url);
      })
  );
});

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
      matcher: ({ url }) => url.href.startsWith(import.meta.env.VITE_API_URL),
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
