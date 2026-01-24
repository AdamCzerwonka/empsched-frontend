import { useQueryClient } from "@tanstack/react-query";
import { BadgeCheck, CalendarX } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAbsences, useApproveAbsence } from "~/api/hooks";
import { ExtendedAbsencesFilter } from "~/components/filter/ExtendedAbsencesFilter";
import { DisplayData } from "~/components/system";
import {
  AbsenceItem,
  BaseEmpty,
  BasePagination,
  ItemActions,
  LoadingButton,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui";
import { queryKeys } from "~/constants";
import {
  defaultExtendedAbsenceFilterParams,
  type ExtendedAbsenceFilterParams,
} from "~/types/api";
import type { Absence } from "~/types/general";

export const EmployeesAbsencesDetails = () => {
  const [page, setPage] = useState<number>(0);
  const { t } = useTranslation("routes/organisation");
  const queryClient = useQueryClient();
  const [extendedAbsenceFilterParams, setExtendedAbsenceFilterParams] =
    useState<ExtendedAbsenceFilterParams>(defaultExtendedAbsenceFilterParams);
  const { approveAbsenceAsync, isPending: isApproving } = useApproveAbsence();
  const { absences, isPending } = useAbsences({
    ...extendedAbsenceFilterParams,
    pageNumber: page,
  });

  const handleApproveAbsence = async (absenceId: string) => {
    await approveAbsenceAsync(absenceId, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [queryKeys.getAbsences],
        });
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
              isLoading={isApproving}
              onClick={() => handleApproveAbsence(absence.id)}
            >
              <BadgeCheck />
            </LoadingButton>
          </TooltipTrigger>
          <TooltipContent>
            {t("tabs.employeesAbsences.approveTooltip")}
          </TooltipContent>
        </Tooltip>
      </ItemActions>
    ) : null;
  };

  const emptyContent = (
    <BaseEmpty
      icon={<CalendarX />}
      title={t("tabs.employeesAbsences.empty.title")}
      description={t("tabs.employeesAbsences.empty.description")}
    />
  );

  const dataContent = (data: typeof absences) => (
    <>
      <span className="text-muted-foreground mb-2 w-full text-start text-sm">
        {t("tabs.employeesAbsences.totalAbsences")}: {data?.totalElements}
      </span>

      <div className="flex h-full w-full flex-col gap-3">
        {data?.content.map((absence) => (
          <AbsenceItem
            key={absence.id}
            absence={absence}
            actionSection={absenceActions(absence)}
            showEmployeeData={true}
          />
        ))}
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
      <section className="flex h-full w-full flex-col items-center justify-center">
        <div className="w-full py-4">
          <ExtendedAbsencesFilter
            params={extendedAbsenceFilterParams}
            changeParams={setExtendedAbsenceFilterParams}
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
