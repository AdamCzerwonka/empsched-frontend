import { useCallback } from "react";
import { useRegisterPushSubscription } from "~/api/hooks/push";
import i18n from "~/i18n/i18n";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export const usePushSubscription = () => {
  const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
  const registerMutation = useRegisterPushSubscription();

  const subscribe = useCallback(async (): Promise<boolean> => {
    if (!vapidPublicKey) {
      console.error(
        "VAPID public key not found in .env file (VITE_VAPID_PUBLIC_KEY)"
      );
      return false;
    }
    if (!("serviceWorker" in navigator)) {
      console.error("Service worker not found");
      return false;
    }

    if (!("PushManager" in window)) {
      console.error("Push manager not found");
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") return false;

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        // @ts-ignore
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });

      const json = subscription.toJSON();
      if (!json.endpoint || !json.keys?.p256dh || !json.keys?.auth)
        return false;

      await registerMutation.mutateAsync({
        endpoint: json.endpoint,
        p256dh: json.keys.p256dh,
        auth: json.keys.auth,
        locale: i18n.language,
      });

      return true;
    } catch (error) {
      console.error("Push subscription failed:", error);
      return false;
    }
  }, [vapidPublicKey, registerMutation]);

  return {
    subscribe,
    isLoading: registerMutation.isPending,
  };
};
