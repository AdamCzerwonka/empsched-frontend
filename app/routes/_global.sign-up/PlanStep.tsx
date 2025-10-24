import { useTranslation } from "react-i18next";
import { navigation } from "~/constants";
import type { CarouselApi } from "~/components/ui/carousel";
import { Button } from "~/components/ui";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { SignUpFormPlanStep } from "~/components/form";

interface Props {
  carouselApi?: CarouselApi;
}

export const PlanStep = ({ carouselApi }: Props) => {
  const { t: tCommon } = useTranslation("common");
  const { t } = useTranslation("routes/sign-up");

  return (
    <div className="flex h-full flex-col items-center">
      <h1 className="text-muted-foreground mb-4 text-2xl font-medium">
        {t("chooseYourPlan")}
      </h1>
      <SignUpFormPlanStep />
      <Button
        type="button"
        variant="link"
        className="mt-4 min-w-1/2 cursor-pointer"
        onClick={() => carouselApi?.scrollNext()}
      >
        {tCommon("next")}
        <ArrowRight />
      </Button>
      <div className="mt-4 flex flex-col items-center justify-center gap-4">
        <Button variant={"secondary"} className="min-w-1/2" asChild>
          <Link to={navigation.signIn}>{t("signInQuestion")}</Link>
        </Button>
        <Button variant={"link"} className="min-w-1/2" asChild>
          <Link to={navigation.home}>{t("navigateHomepage")}</Link>
        </Button>
      </div>
    </div>
  );
};
