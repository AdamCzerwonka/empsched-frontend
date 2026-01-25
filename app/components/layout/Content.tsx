import { Outlet } from "react-router";
import { Card, CardContent } from "../ui";
import { NotificationPermissionBanner } from "~/components/notifications";
import { useNotifications } from "~/hooks/useNotifications";
import { useAuthStore } from "~/store";

export const Content = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());

  useNotifications();

  return (
    <Card
      variant={"soft"}
      className="container flex h-full w-full flex-1 flex-col p-4"
    >
      <CardContent className="h-full p-0">
        {isAuthenticated && <NotificationPermissionBanner />}
        <Outlet />
      </CardContent>
    </Card>
  );
};
