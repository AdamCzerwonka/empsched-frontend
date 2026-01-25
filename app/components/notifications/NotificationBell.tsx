import { useState } from "react";
import { Bell } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui";
import { useNotificationStore } from "~/store/notificationStore";
import { NotificationCenter } from "./NotificationCenter";

export const NotificationBell = () => {
  const { t } = useTranslation("components/notifications");
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={t("bell.title")}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <NotificationCenter onClose={() => setOpen(false)} />
      </PopoverContent>
    </Popover>
  );
};
