import { useTranslation } from "react-i18next";
import { ProfilePictureSection } from "./ProfilePictureSection";
import { Separator, Skeleton } from "~/components/ui";
import { useMyEmployee } from "~/api/hooks";
import { useAuthStore } from "~/store";
import { RoleEnum } from "~/types/general";

export const MyAccountSettingsPage = () => {
  const { t } = useTranslation("routes/my-account-settings");
  const { t: tOrg } = useTranslation("routes/organisation");
  const { employee, isPending } = useMyEmployee();
  const { roles } = useAuthStore();

  const isOrganisationAdmin = roles?.includes(RoleEnum.ORGANISATION_ADMIN);

  const positionDisplay = () => {
    if (isPending) {
      return <Skeleton className="h-5 w-24" />;
    }
    if (isOrganisationAdmin) {
      return <span>{tOrg("tabs.details.fields.owner.value")}</span>;
    }
    if (employee?.positions && employee.positions.length > 0) {
      return (
        <ul>
          {employee.positions.map((p) => (
            <li key={p.id}>{p.name}</li>
          ))}
        </ul>
      );
    }
    return <span>{t("noPositionAssigned")}</span>;
  };

  return (
    <div className="grid gap-4">
      <h1 className="mb-4 text-2xl font-bold">{t("title")}</h1>
      <Separator />
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">{t("position")}</h2>
        {positionDisplay()}
      </div>
      <Separator />
      <ProfilePictureSection />
    </div>
  );
};

export default MyAccountSettingsPage;
