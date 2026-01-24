import { useQueryClient } from "@tanstack/react-query";
import { Trash2, UserRoundX } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDeleteAbsence, useSelfAbsences } from "~/api/hooks";
import { AddAbsenceDrawer } from "~/components/drawer";
import { AbsencesFilter } from "~/components/filter";
import { DisplayData } from "~/components/system";
import {
  AbsenceItem,
  BaseEmpty,
  BasePagination,
  ItemActions,
  LoadingButton,
  Separator,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui";
import { queryKeys } from "~/constants";
import { baseFormSuccessHandler } from "~/lib";
import {
  defaultStartDateFilterParams,
  type StartDateFilterParams,
} from "~/types/api";
import type { Absence } from "~/types/general";

export const AbsencesPage = () => {
  const { t } = useTranslation("routes/absences");
  const { t: tInfo } = useTranslation("information");
  const { deleteAbsenceAsync, isPending: isDeleting } = useDeleteAbsence();
  const [page, setPage] = useState<number>(0);
  const [absenceFilterParams, setAbsenceFilterParams] =
    useState<StartDateFilterParams>(defaultStartDateFilterParams);
  const { absences, isPending } = useSelfAbsences({
    ...absenceFilterParams,
    pageNumber: page,
    pageSize: 10,
  });
  const queryClient = useQueryClient();

  const handleDeleteAbsence = async (absenceId: string) => {
    await deleteAbsenceAsync(absenceId, {
      onSuccess: () => {
        baseFormSuccessHandler(
          null,
          false,
          true,
          tInfo("absences.absenceDeleted"),
          () =>
            queryClient.invalidateQueries({
              queryKey: [queryKeys.getSelfAbsences],
            })
        );
      },
    });
  };

  const absenceActions = (absence: Absence) => {
    return !absence.approved ? (
      <ItemActions>
        <Tooltip>
          <TooltipTrigger asChild>
            <LoadingButton
              variant={"outline"}
              isLoading={isDeleting}
              onClick={() => handleDeleteAbsence(absence.id)}
            >
              <Trash2 />
            </LoadingButton>
          </TooltipTrigger>
          <TooltipContent
            className="bg-destructive text-destructive-foreground"
            arrowClassName="bg-destructive fill-destructive"
          >
            {t("deleteAbsenceTooltip")}
          </TooltipContent>
        </Tooltip>
      </ItemActions>
    ) : null;
  };

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
              <AbsenceItem
                key={absence.id}
                absence={absence}
                actionSection={absenceActions(absence)}
              />
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
