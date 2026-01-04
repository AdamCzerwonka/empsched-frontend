import { useTranslation } from "react-i18next";
import { ProfilePictureSection } from "./ProfilePictureSection";
import { Separator } from "~/components/ui";

export const MyAccountSettingsPage = () => {
  const { t } = useTranslation("routes/my-account-settings");
  return (
    <div className="grid gap-4">
      <h1 className="mb-4 text-2xl font-bold">{t("title")}</h1>
      <Separator />
      <ProfilePictureSection />
    </div>
  );
};

export default MyAccountSettingsPage;
