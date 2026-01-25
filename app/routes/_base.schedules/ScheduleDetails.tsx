import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  useSchedule,
  usePositions,
  useSolveSchedule,
  useAddShift,
  useUpdateShift,
  useDeleteShift,
  useUnassignShift,
  useEmployees,
} from "~/api/hooks";
import { DisplayData } from "~/components/system";
import {
  Badge,
  BaseEmpty,
  BasePagination,
  Button,
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  Input,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
  Label,
  LoadingButton,
  Separator,
} from "~/components/ui";
import {
  extractDateFromLocalDateTime,
  extractIsoDateFromLocalDateTime,
  extractTimeFromLocalDateTime,
  formatTimeToLocalDateTime,
  parseFromIsoToDisplayDate,
} from "~/lib";
import {
  CalendarDays,
  Clock,
  Pencil,
  Play,
  Plus,
  Trash2,
  User,
  UserMinus,
  X,
} from "lucide-react";
import type { Schedule, Shift } from "~/types/general";
import { ScheduleStatusEnum } from "~/types/general";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "~/constants";
import { toast } from "sonner";
import type { ShiftUpdateRequest } from "~/types/api";

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

interface ShiftFormData {
  date: string;
  startTime: string;
  endTime: string;
  requiredPositionId: string;
  assignedEmployeeId: string;
}

const defaultShiftFormData: ShiftFormData = {
  date: new Date().toISOString().split("T")[0],
  startTime: "08:00",
  endTime: "16:00",
  requiredPositionId: "",
  assignedEmployeeId: "",
};

interface ScheduleDetailsDrawerProps {
  schedule: Schedule;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSolve: (scheduleId: string) => void;
  isSolving: boolean;
  onShiftAdd: (scheduleId: string, data: ShiftUpdateRequest) => Promise<void>;
  onShiftUpdate: (shiftId: string, data: ShiftUpdateRequest) => Promise<void>;
  onShiftDelete: (shiftId: string) => Promise<void>;
  onShiftUnassign: (shiftId: string) => Promise<void>;
  isShiftLoading: boolean;
}

const ScheduleDetailsDrawer = ({
  schedule,
  open,
  onOpenChange,
  onSolve,
  isSolving,
  onShiftAdd,
  onShiftUpdate,
  onShiftDelete,
  onShiftUnassign,
  isShiftLoading,
}: ScheduleDetailsDrawerProps) => {
  const { t } = useTranslation("routes/schedules");
  const { positions } = usePositions({ pageNumber: 0, pageSize: 100 });
  const { employees } = useEmployees({ pageNumber: 0, pageSize: 100 });

  const [isAddingShift, setIsAddingShift] = useState(false);
  const [editingShiftId, setEditingShiftId] = useState<string | null>(null);
  const [shiftFormData, setShiftFormData] =
    useState<ShiftFormData>(defaultShiftFormData);

  const getPositionName = (positionId: string) => {
    const position = positions?.content?.find((p) => p.id === positionId);
    return position?.name || positionId;
  };

  const getEmployeeName = (employeeId: string) => {
    const employee = employees?.content?.find((e) => e.id === employeeId);
    return employee ? `${employee.firstName} ${employee.lastName}` : employeeId;
  };

  const canSolve = schedule.status === ScheduleStatusEnum.DRAFT;
  const canEditShifts =
    schedule.status === ScheduleStatusEnum.DRAFT ||
    schedule.status === ScheduleStatusEnum.SOLVED;

  const handleStartAddShift = () => {
    setShiftFormData(defaultShiftFormData);
    setEditingShiftId(null);
    setIsAddingShift(true);
  };

  const handleStartEditShift = (shift: Shift) => {
    setShiftFormData({
      date: extractIsoDateFromLocalDateTime(shift.startTime),
      startTime: extractTimeFromLocalDateTime(shift.startTime),
      endTime: extractTimeFromLocalDateTime(shift.endTime),
      requiredPositionId: shift.requiredPositionId,
      assignedEmployeeId: shift.assignedEmployee || "",
    });
    setEditingShiftId(shift.id);
    setIsAddingShift(false);
  };

  const handleCancelForm = () => {
    setIsAddingShift(false);
    setEditingShiftId(null);
    setShiftFormData(defaultShiftFormData);
  };

  const handleSaveShift = async () => {
    if (!shiftFormData.requiredPositionId || !shiftFormData.date) return;

    const formattedData = {
      startTime: formatTimeToLocalDateTime(
        shiftFormData.startTime,
        shiftFormData.date
      ),
      endTime: formatTimeToLocalDateTime(
        shiftFormData.endTime,
        shiftFormData.date
      ),
      requiredPositionId: shiftFormData.requiredPositionId,
      assignedEmployeeId: shiftFormData.assignedEmployeeId || undefined,
    };

    if (isAddingShift) {
      await onShiftAdd(schedule.id, formattedData);
    } else if (editingShiftId) {
      await onShiftUpdate(editingShiftId, formattedData);
    }
    handleCancelForm();
  };

  const shiftForm = (
    <div className="bg-muted/50 flex flex-col gap-3 rounded-md border p-3">
      <div className="flex items-center justify-between">
        <Label className="font-medium">
          {isAddingShift
            ? t("details.drawer.shiftForm.title")
            : t("details.drawer.shiftForm.editTitle")}
        </Label>
        <Button variant="ghost" size="icon" onClick={handleCancelForm}>
          <X className="size-4" />
        </Button>
      </div>
      <div className="flex flex-col gap-1">
        <Label className="text-xs">{t("details.drawer.shiftForm.date")}</Label>
        <Input
          type="date"
          value={shiftFormData.date}
          onChange={(e) =>
            setShiftFormData((prev) => ({
              ...prev,
              date: e.target.value,
            }))
          }
        />
      </div>
      <div className="flex flex-wrap gap-3">
        <div className="flex min-w-[120px] flex-1 flex-col gap-1">
          <Label className="text-xs">
            {t("details.drawer.shiftForm.startTime")}
          </Label>
          <Input
            type="time"
            value={shiftFormData.startTime}
            onChange={(e) =>
              setShiftFormData((prev) => ({
                ...prev,
                startTime: e.target.value,
              }))
            }
          />
        </div>
        <div className="flex min-w-[120px] flex-1 flex-col gap-1">
          <Label className="text-xs">
            {t("details.drawer.shiftForm.endTime")}
          </Label>
          <Input
            type="time"
            value={shiftFormData.endTime}
            onChange={(e) =>
              setShiftFormData((prev) => ({ ...prev, endTime: e.target.value }))
            }
          />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <Label className="text-xs">
          {t("details.drawer.shiftForm.position")}
        </Label>
        <select
          className="border-input bg-background h-9 rounded-md border px-3 text-sm"
          value={shiftFormData.requiredPositionId}
          onChange={(e) =>
            setShiftFormData((prev) => ({
              ...prev,
              requiredPositionId: e.target.value,
            }))
          }
        >
          <option value="">
            {t("details.drawer.shiftForm.selectPosition")}
          </option>
          {positions?.content?.map((pos) => (
            <option key={pos.id} value={pos.id}>
              {pos.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <Label className="text-xs">
          {t("details.drawer.shiftForm.employee")}
        </Label>
        <select
          className="border-input bg-background h-9 rounded-md border px-3 text-sm"
          value={shiftFormData.assignedEmployeeId}
          onChange={(e) =>
            setShiftFormData((prev) => ({
              ...prev,
              assignedEmployeeId: e.target.value,
            }))
          }
        >
          <option value="">
            {t("details.drawer.shiftForm.selectEmployee")}
          </option>
          {employees?.content?.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.firstName} {emp.lastName}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={handleCancelForm}
        >
          {t("details.drawer.actions.cancel")}
        </Button>
        <LoadingButton
          size="sm"
          className="flex-1"
          onClick={handleSaveShift}
          isLoading={isShiftLoading}
          disabled={!shiftFormData.requiredPositionId || !shiftFormData.date}
        >
          {t("details.drawer.actions.save")}
        </LoadingButton>
      </div>
    </div>
  );

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
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
          </div>

          {/* Solve Button */}
          {canSolve && (
            <LoadingButton
              onClick={() => onSolve(schedule.id)}
              isLoading={isSolving}
              className="w-full"
            >
              <Play className="size-4" />
              {t("details.drawer.actions.solve")}
            </LoadingButton>
          )}

          <Separator />

          {/* Shifts Section */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
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
              {!isAddingShift && !editingShiftId && (
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={() => setIsAddingShift(true)}
                >
                  <Plus className="size-4" />
                  {t("details.drawer.actions.addShift")}
                </Button>
              )}
            </div>

            {/* Shift Form (for adding new or editing existing) */}
            {(isAddingShift || editingShiftId) && shiftForm}

            {!schedule.shiftList || schedule.shiftList.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                {t("details.drawer.noShifts")}
              </p>
            ) : (
              <ItemGroup className="rounded-md border">
                {schedule.shiftList.map((shift: Shift, index: number) => (
                  <div key={shift.id}>
                    <Item variant="muted" size="sm">
                      <ItemContent>
                        <ItemTitle className="flex items-center gap-2">
                          <CalendarDays className="text-muted-foreground size-3" />
                          {extractDateFromLocalDateTime(shift.startTime)}
                        </ItemTitle>
                        <ItemDescription className="flex flex-col gap-1">
                          <span className="flex items-center gap-1">
                            <Clock className="size-3" />
                            {extractTimeFromLocalDateTime(
                              shift.startTime
                            )} - {extractTimeFromLocalDateTime(shift.endTime)}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="size-3" />
                            {t("details.drawer.shiftDetails.position")}:{" "}
                            {getPositionName(shift.requiredPositionId)}
                          </span>
                          {shift.assignedEmployee && (
                            <span className="flex items-center gap-1">
                              <User className="size-3" />
                              {t("details.drawer.shiftDetails.employee")}:{" "}
                              {getEmployeeName(shift.assignedEmployee)}
                            </span>
                          )}
                        </ItemDescription>
                      </ItemContent>
                      {/* Shift Actions */}
                      <div className="flex w-full items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          onClick={() => handleStartEditShift(shift)}
                          disabled={isAddingShift || !!editingShiftId}
                        >
                          <Pencil />
                        </Button>
                        {shift.assignedEmployee && (
                          <Button
                            variant="ghost"
                            onClick={() => onShiftUnassign(shift.id)}
                            disabled={isAddingShift || !!editingShiftId}
                          >
                            <UserMinus />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                          onClick={() => onShiftDelete(shift.id)}
                          disabled={isAddingShift || !!editingShiftId}
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </Item>
                    {index < schedule.shiftList.length - 1 && <ItemSeparator />}
                  </div>
                ))}
              </ItemGroup>
            )}
          </div>
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
  const { addShiftAsync, isPending: isAddingShift } = useAddShift();
  const { updateShiftAsync, isPending: isUpdatingShift } = useUpdateShift();
  const { deleteShiftAsync, isPending: isDeletingShift } = useDeleteShift();
  const { unassignShiftAsync, isPending: isUnassigningShift } =
    useUnassignShift();

  const isShiftLoading =
    isAddingShift || isUpdatingShift || isDeletingShift || isUnassigningShift;

  const refreshSelectedSchedule = async () => {
    await queryClient.invalidateQueries({
      queryKey: [queryKeys.getSchedules],
    });

    // Get updated data from cache after invalidation
    const updatedData = queryClient.getQueryData<typeof schedules>([
      queryKeys.getSchedules,
      { pageNumber: page, pageSize: 10 },
    ]);

    if (selectedSchedule && updatedData?.content) {
      const updatedSchedule = updatedData.content.find(
        (s) => s.id === selectedSchedule.id
      );
      if (updatedSchedule) {
        setSelectedSchedule(updatedSchedule);
      }
    }
  };

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

  const handleAddShift = async (
    scheduleId: string,
    shiftData: ShiftUpdateRequest
  ) => {
    await addShiftAsync(
      {
        scheduleId,
        data: shiftData,
      },
      {
        onSuccess: async () => {
          toast.success(tInfo("shifts.added"));
          await refreshSelectedSchedule();
        },
      }
    );
  };

  const handleUpdateShift = async (
    shiftId: string,
    shiftData: ShiftUpdateRequest
  ) => {
    await updateShiftAsync(
      {
        shiftId,
        data: shiftData,
      },
      {
        onSuccess: async () => {
          toast.success(tInfo("shifts.updated"));
          await refreshSelectedSchedule();
        },
      }
    );
  };

  const handleDeleteShift = async (shiftId: string) => {
    await deleteShiftAsync(shiftId, {
      onSuccess: async () => {
        toast.success(tInfo("shifts.deleted"));
        await refreshSelectedSchedule();
      },
    });
  };

  const handleUnassignShift = async (shiftId: string) => {
    await unassignShiftAsync(shiftId, {
      onSuccess: async () => {
        toast.success(tInfo("shifts.unassigned"));
        await refreshSelectedSchedule();
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
          onShiftAdd={handleAddShift}
          onShiftUpdate={handleUpdateShift}
          onShiftDelete={handleDeleteShift}
          onShiftUnassign={handleUnassignShift}
          isShiftLoading={isShiftLoading}
        />
      )}
    </div>
  );
};
