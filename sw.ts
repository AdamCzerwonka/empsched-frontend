import { defaultCache } from "@serwist/vite/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

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

// Handle push notification received
self.addEventListener("push", (event: PushEvent) => {
  if (!event.data) return;

  const payload: PushPayload = event.data.json();

  const options: NotificationOptions = {
    body: payload.body,
    icon: "/icons/android-chrome-192x192.png",
    badge: "/icons/android-chrome-192x192.png",
    data: { url: payload.url, ...payload.data, type: payload.type },
    tag: payload.type,
  };

  event.waitUntil(
    Promise.all([
      // Show native notification
      self.registration.showNotification(payload.title, options),
      // Notify open app tabs
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

// Handle notification click
self.addEventListener("notificationclick", (event: NotificationEvent) => {
  event.notification.close();

  const url = event.notification.data?.url || "/";

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clients) => {
        // Check if app window is already open
        for (const client of clients) {
          if (client.url.includes(self.location.origin) && "focus" in client) {
            client.focus();
            if ("navigate" in client) {
              (client as WindowClient).navigate(url);
            }
            return;
          }
        }
        // Open new window
        return self.clients.openWindow(url);
      })
  );
});

// ============================================
// SERWIST CONFIGURATION
// ============================================

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
});

serwist.addEventListeners();
