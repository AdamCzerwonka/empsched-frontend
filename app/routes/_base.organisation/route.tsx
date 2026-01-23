import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router";
import { Card, CardContent } from "~/components/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { OrganisationDetails } from "./OrganisationDetails";
import { PositionsDetails } from "./PositionsDetails";
import { EmployeesDetails } from "./EmployeesDetails";
import {
  BetweenHorizontalStart,
  IdCardLanyard,
  NotebookText,
} from "lucide-react";
import { useAuthStore } from "~/store";

export const OrganisationPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation("routes/organisation");
  const roles = useAuthStore((state) => state.roles);

  const isAdmin = roles?.includes("ADMIN") || roles?.includes("ORGANISATION_ADMIN");

  return (
    <Tabs
      value={searchParams.get("tab") || "details"}
      onValueChange={(value) => {
        setSearchParams({ tab: value });
      }}
      className="lg:grid-rows h-full lg:grid lg:grid-cols-[auto_1fr]"
    >
      <Card variant={"soft"} className="p-0 lg:h-full">
        <CardContent className="p-2">
          <TabsList className="w-full gap-0.5 sm:gap-2 bg-transparent lg:grid lg:h-full">
            <TabsTrigger
              variant={"primary"}
              value="details"
              className="justify-start p-2"
            >
              <NotebookText />
              {t("tabs.details.trigger")}
            </TabsTrigger>
            {isAdmin && (
              <>
              <TabsTrigger
                variant={"primary"}
                value="employees"
                className="justify-start p-2"
              >
                <IdCardLanyard />
                {t("tabs.employees.trigger")}
              </TabsTrigger>
              <TabsTrigger
                variant={"primary"}
                value="positions"
                className="justify-start p-2"
              >
                <BetweenHorizontalStart />
                {t("tabs.positions.trigger")}
              </TabsTrigger>
              </>
            )}
          </TabsList>
        </CardContent>
      </Card>
      <Card variant={"soft"} className="h-full">
        <CardContent className="h-full w-full">
          <TabsContent className="h-full w-full" value="details">
            <OrganisationDetails />
          </TabsContent>
          {isAdmin && (
            <>
              <TabsContent className="h-full w-full" value="employees">
                <EmployeesDetails />
              </TabsContent>
              <TabsContent className="h-full w-full" value="positions">
                <PositionsDetails />
              </TabsContent>
            </>
          )}
        </CardContent>
      </Card>
    </Tabs>
  );
};

export default OrganisationPage;
