import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router";
import { Card, CardContent } from "~/components/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { ClipboardPlus, FolderOpen } from "lucide-react";
import { ScheduleCreateDetails } from "./ScheduleCreateDetails";
import { ScheduleDetails } from "./ScheduleDetails";
import { useAuthStore } from "~/store";
import { RoleEnum } from "~/types/general";
// import { ScheduleDetails } from "./ScheduleDetails";

export const SchedulePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation("routes/schedules");
   const { roles } = useAuthStore();

  const isAdmin = roles?.includes(RoleEnum.ADMIN) || roles?.includes(RoleEnum.ORGANISATION_ADMIN);

  return (
    <Tabs
      value={searchParams.get("tab") || "create"}
      onValueChange={(value) => {
        setSearchParams({ tab: value });
      }}
      className="lg:grid-rows h-full lg:grid lg:grid-cols-[auto_1fr]"
    >
      <Card variant={"soft"} className="p-0 lg:h-full">
        <CardContent className="p-2">
          <TabsList className="flex h-auto w-full flex-wrap justify-start gap-2 bg-transparent lg:grid lg:h-full">
            <TabsTrigger
              variant={"primary"}
              value="details"
              className="justify-start p-2"
            >
              <FolderOpen />
              {t("tabs.details.trigger")}
            </TabsTrigger>
            { isAdmin && (
            <TabsTrigger
              variant={"primary"}
              value="create"
              className="justify-start p-2"
            >
              <ClipboardPlus />
              {t("tabs.create.trigger")}
            </TabsTrigger>
            )}
          </TabsList>
        </CardContent>
      </Card>
      <Card variant={"soft"} className="h-full">
        <CardContent className="h-full w-full">
          <TabsContent className="h-full w-full" value="details">
            <ScheduleDetails />
          </TabsContent>
          { isAdmin && (
          <TabsContent className="h-full w-full" value="create">
            <ScheduleCreateDetails />
          </TabsContent>
          )}
        </CardContent>
      </Card>
    </Tabs>
  );
};

export default SchedulePage;
