import { useTranslation } from "react-i18next";
import { Card, CardContent } from "../ui/card";

export const Footer = () => {
  const { t } = useTranslation("layout/footer");

  return (
    <Card className="min-h-16 w-full">
      <CardContent className="flex flex-row flex-wrap items-center justify-center gap-2 md:gap-6">
        <h3>{t("aboutUs")}</h3>
        <h3>{t("contactUs")}</h3>
        <h3>{t("faqs")}</h3>
      </CardContent>
    </Card>
  );
};
