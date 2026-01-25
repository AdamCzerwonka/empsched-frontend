import { useTranslation } from "react-i18next";
import { Button, ScrollArea } from "~/components/ui";
import { useNotificationStore } from "~/store/notificationStore";
import { NotificationItem } from "./NotificationItem";

interface NotificationCenterProps {
  onClose: () => void;
}

export const NotificationCenter = ({ onClose }: NotificationCenterProps) => {
  const { t } = useTranslation("components/notifications");
  const { notifications, markAllAsRead, clearAll } = useNotificationStore();

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between border-b p-4">
        <h4 className="font-semibold">{t("center.title")}</h4>
        {notifications.length > 0 && (
          <Button variant="ghost" size="sm" onClick={markAllAsRead}>
            {t("center.markAllAsRead")}
          </Button>
        )}
      </div>

      <ScrollArea className="h-[300px]">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            {t("center.empty")}
          </div>
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onClose={onClose}
            />
          ))
        )}
      </ScrollArea>

      {notifications.length > 0 && (
        <div className="border-t p-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full"
            onClick={clearAll}
          >
            {t("center.clearAll")}
          </Button>
        </div>
      )}
    </div>
  );
};
