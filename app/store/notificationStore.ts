import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AppNotification } from "~/types/general/model/AppNotification";
import { badgeApi } from "~/lib/badgeApi";

interface NotificationState {
  notifications: AppNotification[];
  unreadCount: number;
  permissionDismissedAt: number | null;

  addNotification: (notification: AppNotification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  dismissPermissionBanner: () => void;
  shouldShowPermissionBanner: () => boolean;
}

const PERMISSION_DISMISS_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,
      permissionDismissedAt: null,

      addNotification: (notification) => {
        set((state) => {
          const newCount = state.unreadCount + 1;
          badgeApi.setBadge(newCount);
          return {
            notifications: [notification, ...state.notifications].slice(0, 50),
            unreadCount: newCount,
          };
        });
      },

      markAsRead: (id) => {
        set((state) => {
          const notification = state.notifications.find((n) => n.id === id);
          if (!notification || notification.read) return state;

          const newCount = Math.max(0, state.unreadCount - 1);
          badgeApi.setBadge(newCount);
          return {
            notifications: state.notifications.map((n) =>
              n.id === id ? { ...n, read: true } : n
            ),
            unreadCount: newCount,
          };
        });
      },

      markAllAsRead: () => {
        set((state) => {
          badgeApi.clearBadge();
          return {
            notifications: state.notifications.map((n) => ({
              ...n,
              read: true,
            })),
            unreadCount: 0,
          };
        });
      },

      clearAll: () => {
        badgeApi.clearBadge();
        set({ notifications: [], unreadCount: 0 });
      },

      dismissPermissionBanner: () => {
        set({ permissionDismissedAt: Date.now() });
      },

      shouldShowPermissionBanner: () => {
        if (typeof window === "undefined") return false;
        if (!("Notification" in window)) return false;

        const { permissionDismissedAt } = get();
        if (Notification.permission !== "default") return false;
        if (!permissionDismissedAt) return true;
        return Date.now() - permissionDismissedAt > PERMISSION_DISMISS_DURATION;
      },
    }),
    {
      name: "notifications-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
