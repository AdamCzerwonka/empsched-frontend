import { useState } from "react";
import { useTranslation } from "react-i18next";
import { navigation, OrganisationPlans } from "~/constants";
import { PlanCard } from "./PlanCard";
import type { UseFormReturn } from "react-hook-form";
import type { organisationCreateSchemaType } from "~/types/schemas";
import type { OrganisationPlanEnum } from "~/types/general";
import type { CarouselApi } from "~/components/ui/carousel";
import { Button } from "~/components/ui";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";

interface Props {
  form: UseFormReturn<organisationCreateSchemaType>;
  carouselApi: CarouselApi;
}

export const PlanStep = ({ form, carouselApi }: Props) => {
  const { t: tCommon } = useTranslation("common");
  const { t } = useTranslation("routes/auth/signUpPage");

  return (
    <div className="flex h-full flex-col items-center">
      <h1 className="text-muted-foreground mb-4 text-2xl font-medium">
        {t("chooseYourPlan")}
      </h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {OrganisationPlans.map((planData) => (
          <PlanCard
            key={planData.type}
            plan={planData}
            onSelect={(value: OrganisationPlanEnum) => {
              form.setValue("plan", value);
            }}
            isSelected={form.watch("plan") === planData.type}
          />
        ))}
      </div>
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
