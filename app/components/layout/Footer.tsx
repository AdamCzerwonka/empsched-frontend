import { useTranslation } from "react-i18next";
import { Card } from "../ui/card";

export const Footer = () => {
  const { t } = useTranslation("layout/footer");

  return (
    <Card className="flex min-h-16 w-full flex-row items-center justify-center rounded-none">
      <h3>{t("aboutUs")}</h3>
      <h3>{t("contactUs")}</h3>
      <h3>{t("faqs")}</h3>
    </Card>
  );
};
