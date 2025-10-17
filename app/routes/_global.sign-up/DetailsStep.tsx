import { Button } from "~/components/ui";
import { useTranslation } from "react-i18next";
import { SignUpFormDataStep } from "~/components/form";
import type { CarouselApi } from "~/components/ui/carousel";
import { ArrowLeft } from "lucide-react";

interface Props {
  carouselApi?: CarouselApi;
}

export const DetailsStep = ({ carouselApi }: Props) => {
  const { t: tCommon } = useTranslation("common");
  const { t } = useTranslation("routes/auth/signUpPage");

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <h1 className="text-muted-foreground mb-4 text-2xl font-medium">
        {t("fillDetails")}
      </h1>
      <SignUpFormDataStep />
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
