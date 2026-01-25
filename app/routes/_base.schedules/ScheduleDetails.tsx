import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSchedule, usePositions, useSolveSchedule } from "~/api/hooks";
import { DisplayData } from "~/components/system";
import {
  Badge,
  BaseEmpty,
  BasePagination,
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
  Label,
  LoadingButton,
  Separator,
} from "~/components/ui";
import { parseFromIsoToDisplayDate } from "~/lib";
import { CalendarDays, Clock, Play, User } from "lucide-react";
import type { Schedule, Shift } from "~/types/general";
import { ScheduleStatusEnum } from "~/types/general";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "~/constants";
import { toast } from "sonner";

const getStatusBadgeStyles = (status: ScheduleStatusEnum) => {
  switch (status) {
    case ScheduleStatusEnum.DRAFT:
      return {
        variant: "outline" as const,
        className: "border-slate-400 text-slate-600 dark:text-slate-400",
      };
    case ScheduleStatusEnum.SOLVING:
      return {
        variant: "outline" as const,
        className:
          "border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
      };
    case ScheduleStatusEnum.SOLVED:
      return {
        variant: "outline" as const,
        className:
          "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
      };
    case ScheduleStatusEnum.PUBLISHED:
      return {
        variant: "default" as const,
        className: "bg-blue-600 text-white hover:bg-blue-700",
      };
    case ScheduleStatusEnum.ERROR:
      return {
        variant: "destructive" as const,
        className: "",
      };
    default:
      return {
        variant: "outline" as const,
        className: "",
      };
  }
};

interface ScheduleDetailsDrawerProps {
  schedule: Schedule;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSolve: (scheduleId: string) => void;
  isSolving: boolean;
}

const ScheduleDetailsDrawer = ({
  schedule,
  open,
  onOpenChange,
  onSolve,
  isSolving,
}: ScheduleDetailsDrawerProps) => {
  const { t } = useTranslation("routes/schedules");
  const { positions } = usePositions({ pageNumber: 0, pageSize: 100 });

  const getPositionName = (positionId: string) => {
    const position = positions?.content?.find((p) => p.id === positionId);
    return position?.name || positionId;
  };

  const canSolve = schedule.status === ScheduleStatusEnum.DRAFT;

  return (
    <Drawer direction="right" open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="sm:max-w-md">
        <DrawerHeader>
          <DrawerTitle>{t("details.drawer.title")}</DrawerTitle>
          <DrawerDescription>
            {t("details.drawer.description")}
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex flex-col gap-6 p-4">
          {/* Basic Info */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <Label className="text-muted-foreground text-xs">
                {t("details.drawer.id")}
              </Label>
              <span className="font-mono text-sm">{schedule.id}</span>
            </div>

            <div className="flex flex-col gap-1">
              <Label className="text-muted-foreground text-xs">
                {t("details.drawer.period")}
              </Label>
              <span className="text-sm">
                {parseFromIsoToDisplayDate(schedule.startDate)}{" "}
                {t("details.list.to")}{" "}
                {parseFromIsoToDisplayDate(schedule.endDate)}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <Label className="text-muted-foreground text-xs">
                {t("details.drawer.status")}
              </Label>
              <Badge
                variant={getStatusBadgeStyles(schedule.status).variant}
                className={`w-fit ${getStatusBadgeStyles(schedule.status).className}`}
              >
                {t(`details.status.${schedule.status}`)}
              </Badge>
            </div>

            <div className="flex flex-col gap-1">
              <Label className="text-muted-foreground text-xs">
                {t("details.drawer.score")}
              </Label>
              <span className="text-sm">{schedule.score || "-"}</span>
            </div>
          </div>

          <Separator />

          {/* Shifts Section */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Clock className="size-4" />
                {t("details.drawer.shifts")}
              </Label>
              <span className="text-muted-foreground text-sm">
                {t("details.drawer.shiftsCount", {
                  count: schedule.shiftList?.length || 0,
                })}
              </span>
            </div>

            {!schedule.shiftList || schedule.shiftList.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                {t("details.drawer.noShifts")}
              </p>
            ) : (
              <ItemGroup className="max-h-[300px] overflow-y-auto rounded-md border">
                {schedule.shiftList.map((shift: Shift, index: number) => (
                  <div key={shift.id}>
                    <Item variant="muted" size="sm">
                      <ItemContent>
                        <ItemTitle className="flex items-center gap-2">
                          <Clock className="text-muted-foreground size-3" />
                          {shift.startTime} - {shift.endTime}
                        </ItemTitle>
                        <ItemDescription className="flex flex-col gap-1">
                          <span className="flex items-center gap-1">
                            <CalendarDays className="size-3" />
                            {t("details.drawer.shiftDetails.position")}:{" "}
                            {getPositionName(shift.requiredPositionId)}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="size-3" />
                            {t("details.drawer.shiftDetails.employee")}:{" "}
                            {shift.assignedEmployee ||
                              t("details.drawer.shiftDetails.unassigned")}
                          </span>
                        </ItemDescription>
                      </ItemContent>
                    </Item>
                    {index < schedule.shiftList.length - 1 && <ItemSeparator />}
                  </div>
                ))}
              </ItemGroup>
            )}
          </div>

          {/* Actions Section */}
          {canSolve && (
            <>
              <Separator />
              <div className="flex flex-col gap-2">
                <LoadingButton
                  onClick={() => onSolve(schedule.id)}
                  isLoading={isSolving}
                  className="w-full"
                >
                  <Play className="size-4" />
                  {t("details.drawer.actions.solve")}
                </LoadingButton>
              </div>
            </>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

interface ScheduleListItemProps {
  schedule: Schedule;
  onClick: () => void;
}

const ScheduleListItem = ({ schedule, onClick }: ScheduleListItemProps) => {
  const { t } = useTranslation("routes/schedules");

  return (
    <Item
      variant="outline"
      className="hover:bg-accent/50 cursor-pointer"
      onClick={onClick}
    >
      <ItemContent>
        <ItemTitle>
          {parseFromIsoToDisplayDate(schedule.startDate)} {t("details.list.to")}{" "}
          {parseFromIsoToDisplayDate(schedule.endDate)}
        </ItemTitle>
        <ItemDescription>
          {t("details.drawer.shiftsCount", {
            count: schedule.shiftList?.length || 0,
          })}
        </ItemDescription>
      </ItemContent>
      <Badge
        variant={getStatusBadgeStyles(schedule.status).variant}
        className={getStatusBadgeStyles(schedule.status).className}
      >
        {t(`details.status.${schedule.status}`)}
      </Badge>
    </Item>
  );
};

export const ScheduleDetails = () => {
  const { t } = useTranslation("routes/schedules");
  const { t: tInfo } = useTranslation("information");
  const queryClient = useQueryClient();
  const [page, setPage] = useState<number>(0);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  );
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { schedules, isPending } = useSchedule({
    pageNumber: page,
    pageSize: 10,
  });

  const { solveScheduleAsync, isPending: isSolving } = useSolveSchedule();

  const handleScheduleClick = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setDrawerOpen(true);
  };

  const handleSolveSchedule = async (scheduleId: string) => {
    await solveScheduleAsync(scheduleId, {
      onSuccess: () => {
        toast.success(tInfo("schedules.solveStarted"));
        setDrawerOpen(false);
        queryClient.invalidateQueries({
          queryKey: [queryKeys.getSchedules],
        });
      },
    });
  };

  const emptyContent = (
    <BaseEmpty
      icon={<CalendarDays />}
      title={t("details.empty.title")}
      description={t("details.empty.description")}
    />
  );

  const dataContent = (data: typeof schedules) => (
    <>
      <span className="text-muted-foreground mb-2 w-full text-start text-sm">
        {t("details.totalSchedules")}: {data?.totalElements}
      </span>
      <ItemGroup className="w-full flex-grow gap-2">
        {data?.content.map((schedule) => (
          <ScheduleListItem
            key={schedule.id}
            schedule={schedule}
            onClick={() => handleScheduleClick(schedule)}
          />
        ))}
      </ItemGroup>
      <BasePagination
        page={page}
        setPage={setPage}
        totalPages={data?.totalPages || 0}
      />
    </>
  );

  return (
    <div className="flex h-full flex-col">
      <section className="mb-4 flex flex-wrap items-center justify-between gap-2 align-middle">
        <h1 className="text-2xl font-bold">{t("details.title")}</h1>
      </section>
      <section className="flex h-full w-full flex-col items-center justify-center">
        <DisplayData
          isLoading={isPending}
          data={schedules}
          emptyContent={emptyContent}
          dataContent={dataContent}
        />
      </section>

      {selectedSchedule && (
        <ScheduleDetailsDrawer
          schedule={selectedSchedule}
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          onSolve={handleSolveSchedule}
          isSolving={isSolving}
        />
      )}
    </div>
  );
};
