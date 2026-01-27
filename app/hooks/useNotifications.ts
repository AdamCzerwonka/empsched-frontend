import { useEffect } from "react";
import { useNotificationStore } from "~/store/notificationStore";
import { badgeApi } from "~/lib/badgeApi";
import type { AppNotification } from "~/types/general/model/AppNotification";

interface PushPayload {
  type: string;
  title: string;
  body: string;
  url?: string;
  data?: Record<string, string>;
}

export const useNotifications = () => {
  const { unreadCount, addNotification } = useNotificationStore();

  useEffect(() => {
    badgeApi.setBadge(unreadCount);
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "PUSH_RECEIVED") {
        const payload: PushPayload = event.data.payload;
        const notification: AppNotification = {
          id: crypto.randomUUID(),
          type: payload.type as AppNotification["type"],
          title: payload.title,
          body: payload.body,
          timestamp: new Date(),
          read: false,
          url: payload.url,
          data: payload.data,
        };
        addNotification(notification);
      }
    };

    navigator.serviceWorker?.addEventListener("message", handleMessage);
    return () => {
      navigator.serviceWorker?.removeEventListener("message", handleMessage);
    };
  }, [addNotification]);
};
