import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { cn } from "~/lib/utils";
import { useNotificationStore } from "~/store/notificationStore";
import type { AppNotification } from "~/types/general/model/AppNotification";

interface NotificationItemProps {
  notification: AppNotification;
  onClose: () => void;
}

export const NotificationItem = ({
  notification,
  onClose,
}: NotificationItemProps) => {
  const { t } = useTranslation("components/notifications");
  const navigate = useNavigate();
  const markAsRead = useNotificationStore((s) => s.markAsRead);

  const handleClick = () => {
    markAsRead(notification.id);
    if (notification.url) {
      navigate(notification.url);
    }
    onClose();
  };

  const timeAgo = getTimeAgo(notification.timestamp, t);

  return (
    <button
      onClick={handleClick}
      className={cn(
        "flex w-full flex-col gap-1 border-b p-4 text-left transition-colors hover:bg-muted/50",
        !notification.read && "bg-muted/30"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="font-medium">{notification.title}</span>
        {!notification.read && (
          <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
        )}
      </div>
      <p className="text-sm text-muted-foreground">{notification.body}</p>
      <span className="text-xs text-muted-foreground">{timeAgo}</span>
    </button>
  );
};

function getTimeAgo(
  date: Date,
  t: (key: string, options?: Record<string, unknown>) => string
): string {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return t("time.justNow");
  if (minutes < 60) return t("time.minutesAgo", { count: minutes });
  if (hours < 24) return t("time.hoursAgo", { count: hours });
  return t("time.daysAgo", { count: days });
}
