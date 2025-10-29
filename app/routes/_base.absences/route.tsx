import { useTranslation } from "react-i18next";
import { AddAbsenceDrawer } from "~/components/drawer";

export const AbsencesPage = () => {
  const { t } = useTranslation("routes/absences");

  return (
    <div>
      <section className="flex flex-row flex-wrap items-center justify-between">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <AddAbsenceDrawer />
      </section>
      <section></section>
    </div>
  );
};

export default AbsencesPage;
