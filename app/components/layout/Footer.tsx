import { useTranslation } from "react-i18next";
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  LanguageSelector,
  ModeToggle,
  Separator,
} from "../ui";
import { Link } from "react-router";
import { navigation } from "~/constants";
import { useIsMobile } from "~/hooks";

export const Footer = () => {
  const { t } = useTranslation("layout/footer");
  const isMobile = useIsMobile();

  return (
    <Card variant={"soft"} className="min-h-16 w-full">
      <CardContent className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <span className="flex flex-wrap items-center justify-between gap-4">
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
        </span>
        <span className="flex flex-wrap items-center justify-between gap-4">
          <LanguageSelector />
          <ModeToggle />
        </span>
      </CardContent>
      <CardFooter className="flex flex-col gap-3">
        <Separator />
        <p className="text-muted-foreground text-sm">EmployeeScheduler</p>
      </CardFooter>
    </Card>
  );
};
