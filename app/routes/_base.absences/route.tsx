import { UserRoundX } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelfAbsences } from "~/api/hooks";
import { AddAbsenceDrawer } from "~/components/drawer";
import { AbsencesFilter } from "~/components/filter";
import { DisplayData } from "~/components/system";
import { BaseEmpty, BasePagination, Separator } from "~/components/ui";
import {
  defaultAbsenceFilterParams,
  type AbsenceFilterParams,
} from "~/types/api";
import { AbsenceItem } from "./AbsenceItem";

export const AbsencesPage = () => {
  const { t } = useTranslation("routes/absences");
  const [page, setPage] = useState<number>(0);
  const [absenceFilterParams, setAbsenceFilterParams] =
    useState<AbsenceFilterParams>(defaultAbsenceFilterParams);
  const { absences, isPending } = useSelfAbsences({
    pageNumber: page,
    pageSize: 10,
    ...absenceFilterParams,
  });

  const emptyContent = (
    <BaseEmpty
      icon={<UserRoundX />}
      title={t("emptyState.title")}
      description={t("emptyState.description")}
    />
  );

  const dataContent = (data: typeof absences) => (
    <>
      <span className="text-muted-foreground mb-2 w-full text-start text-sm">
        {t("totalAbsences")}: {data?.totalElements}
      </span>
      <div className="flex h-full w-full flex-col gap-3">
        {data?.content.map((absence, index) => {
          return (
            <>
              <AbsenceItem key={absence.id} absence={absence} />
              {index < data?.content.length - 1 && <Separator />}
            </>
          );
        })}
      </div>
      <BasePagination
        page={page}
        setPage={setPage}
        totalPages={data?.totalPages || 0}
      />
    </>
  );

  return (
    <div className="flex h-full flex-col">
      <section className="flex flex-row flex-wrap items-center justify-between">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <AddAbsenceDrawer />
      </section>
      <section className="flex h-full w-full flex-col items-center justify-center">
        <div className="w-full py-4">
          <AbsencesFilter
            params={absenceFilterParams}
            changeParams={setAbsenceFilterParams}
            disabled={absences?.content.length === 0}
          />
        </div>
        <DisplayData
          isLoading={isPending}
          data={absences}
          emptyContent={emptyContent}
          dataContent={dataContent}
        />
      </section>
    </div>
  );
};

export default AbsencesPage;
