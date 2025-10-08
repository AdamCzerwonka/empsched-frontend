import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router";
import { Card, CardContent } from "~/components/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { OrganisationDetails } from "./OrganisationDetails";
import { PositionsDetails } from "./PositionsDetails";

export const OrganisationPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation("routes/organisation");

  return (
    <Tabs
      defaultValue={searchParams.get("tab") || "details"}
      onValueChange={(value) => {
        setSearchParams({ tab: value });
      }}
      className="lg:grid-rows h-full lg:grid lg:grid-cols-[auto_1fr]"
    >
      <Card variant={"soft"} className="p-0 shadow-none">
        <CardContent className="p-0">
          <TabsList className="h-full w-full gap-2 lg:grid">
            <TabsTrigger value="details">
              {t("tabs.details.trigger")}
            </TabsTrigger>
            <TabsTrigger value="employees">
              {t("tabs.employees.trigger")}
            </TabsTrigger>
            <TabsTrigger value="positions">
              {t("tabs.positions.trigger")}
            </TabsTrigger>
          </TabsList>
        </CardContent>
      </Card>
      <Card variant={"soft"}>
        <CardContent>
          <TabsContent value="details">
            <OrganisationDetails />
          </TabsContent>
          <TabsContent value="employees">
            <div>[placeholder for employees content]</div>
          </TabsContent>
          <TabsContent value="positions">
            <PositionsDetails />
          </TabsContent>
        </CardContent>
      </Card>
    </Tabs>
  );
};

export default OrganisationPage;
