import type { OrganisationPlan, OrganisationPlanEnum } from "~/types/general";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui";
import { useTranslation } from "react-i18next";
import { cn } from "~/lib/utils";

interface Props {
  plan: OrganisationPlan;
  isSelected?: boolean;
  onSelect: (type: OrganisationPlanEnum) => void;
}

export const PlanCard = ({ plan, isSelected, onSelect }: Props) => {
  const { t: tCommon } = useTranslation();
  const { t } = useTranslation("routes/auth/signUpPage");

  return (
    <Card
      className={cn(
        "w-full gap-0 rounded-sm border p-4 duration-100 ease-in-out hover:shadow-xl",
        isSelected && "border-primary shadow-xl"
      )}
    >
      <CardHeader>
        <CardTitle>
          <h1 className="text-lg font-semibold">{tCommon(plan.name)}</h1>
        </CardTitle>
        <CardDescription>
          {t("employeesLimit", { val: plan.maxEmployees })}
        </CardDescription>
        <CardTitle className="text-end text-2xl font-bold"></CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {tCommon(plan.description)}
      </CardContent>
      <CardFooter className="mt-auto flex flex-col gap-2">
        <p className="mt-2">
          <span className="font-mono text-2xl font-bold">${plan.price}</span>
          <span className="text-sm">{t("pricePerMonth")}</span>
        </p>
        <Button
          type="button"
          variant={isSelected ? "default" : "outline"}
          disabled={isSelected}
          className="w-full cursor-pointer"
          onClick={() => onSelect(plan.type)}
        >
          {t(isSelected ? "selectedPlan" : "selectPlan")}
        </Button>
      </CardFooter>
    </Card>
  );
};
