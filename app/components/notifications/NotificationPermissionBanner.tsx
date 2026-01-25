import { useState } from "react";
import { Bell, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button, Card, CardContent } from "~/components/ui";
import { useNotificationStore } from "~/store/notificationStore";
import { usePushSubscription } from "~/hooks/usePushSubscription";

export const NotificationPermissionBanner = () => {
  const { t } = useTranslation("components/notifications");
  const { shouldShowPermissionBanner, dismissPermissionBanner } =
    useNotificationStore();
  const { subscribe, isLoading } = usePushSubscription();
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible || !shouldShowPermissionBanner()) return null;

  const handleEnable = async () => {
    const success = await subscribe();
    if (success) {
      setIsVisible(false);
    }
  };

  const handleDismiss = () => {
    dismissPermissionBanner();
    setIsVisible(false);
  };

  return (
    <Card className="mb-4 border-primary/20 bg-primary/5">
      <CardContent className="flex flex-wrap items-center gap-4 p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
          <Bell className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-[200px]">
          <h4 className="font-medium">{t("permission.title")}</h4>
          <p className="text-sm text-muted-foreground">
            {t("permission.description")}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleDismiss}>
            {t("permission.later")}
          </Button>
          <Button size="sm" onClick={handleEnable} disabled={isLoading}>
            {t("permission.enable")}
          </Button>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0"
          onClick={handleDismiss}
        >
          <X className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};
