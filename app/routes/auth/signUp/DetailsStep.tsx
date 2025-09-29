import { Button, LoadingButton } from "~/components/ui";
import { useTranslation } from "react-i18next";
import { organisationValidation } from "~/constants";
import { CustomFormField } from "~/components/form";
import type { CarouselApi } from "~/components/ui/carousel";
import { ArrowLeft } from "lucide-react";

interface Props {
  isPending: boolean;
  carouselApi: CarouselApi;
}

export const DetailsStep = ({ isPending, carouselApi }: Props) => {
  const { t: tCommon } = useTranslation("common");
  const { t } = useTranslation("routes/auth/signUpPage");

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <h1 className="text-muted-foreground mb-4 text-2xl font-medium">
        {t("fillDetails")}
      </h1>
      <div className="flex w-full flex-col gap-2">
        <CustomFormField
          name="email"
          label={t("form.email.label")}
          placeholder={t("form.email.placeholder")}
          type="email"
        />
        <CustomFormField
          name="password"
          label={t("form.password.label")}
          placeholder={t("form.password.placeholder")}
          type="password"
        />
        <CustomFormField
          name="confirmPassword"
          label={t("form.confirmPassword.label")}
          placeholder={t("form.confirmPassword.placeholder")}
          type="password"
        />
        <CustomFormField
          name="name"
          label={t("form.name.label")}
          placeholder={t("form.name.placeholder")}
          type="text"
        />
      </div>
      <LoadingButton
        className="mt-4 min-w-1/2 cursor-pointer"
        type="submit"
        isLoading={isPending}
      >
        {t("form.submit")}
      </LoadingButton>
      <Button
        type="button"
        variant={"link"}
        className="min-w-1/2 cursor-pointer"
        onClick={() => carouselApi?.scrollPrev()}
      >
        <ArrowLeft />
        {tCommon("previous")}
      </Button>
    </div>
  );
};
