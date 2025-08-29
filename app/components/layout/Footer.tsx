import { useTranslation } from "react-i18next";
import { Button, Card, CardContent } from "../ui";
import { Link } from "react-router";
import { navigation } from "~/constants";

export const Footer = () => {
  const { t } = useTranslation("layout/footer");

  return (
    <Card className="min-h-16 w-full">
      <CardContent className="flex flex-row flex-wrap items-center justify-center gap-2 md:gap-6">
        <h3>
          <Button
            variant={"link"}
            className="text-foreground font-normal"
            size="sm"
            asChild
          >
            <Link to={navigation.home}>{t("aboutUs")}</Link>
          </Button>
        </h3>
        <h3>
          <Button
            variant={"link"}
            className="text-foreground font-normal"
            size="sm"
            asChild
          >
            <Link to={navigation.home}>{t("contactUs")}</Link>
          </Button>
        </h3>
        <h3>
          <Button
            variant={"link"}
            className="text-foreground font-normal"
            size="sm"
            asChild
          >
            <Link to={navigation.home}>{t("faqs")}</Link>
          </Button>
        </h3>
      </CardContent>
    </Card>
  );
};
