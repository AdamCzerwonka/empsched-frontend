import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useCreateDraftSchedule, usePositions } from "~/api/hooks";
import { defaultPaginationParams } from "~/types/api";
import type { ShiftDefinition, ShiftRequirement } from "~/types/api";
import { ScheduleStatusEnum } from "~/types/general";
import type { Schedule } from "~/types/general";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  CalendarPopover,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  LoadingButton,
  Separator,
} from "~/components/ui";
import {
  formatTimeToLocalDateTime,
  parseFromIsoToDisplayDate,
  parseToIsoDate,
} from "~/lib";
import { CalendarIcon, Clock, Plus, Trash2, Users } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "~/constants";
import { toast } from "sonner";

type DayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

const DAYS_OF_WEEK: DayOfWeek[] = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

interface ShiftFormData {
  id: string;
  startTime: string;
  endTime: string;
  requirements: Array<{
    id: string;
    positionId: string;
    quantity: number;
  }>;
}

type WeeklyPatternState = Record<DayOfWeek, ShiftFormData[]>;

const createEmptyShift = (): ShiftFormData => ({
  id: crypto.randomUUID(),
  startTime: "08:00",
  endTime: "16:00",
  requirements: [],
});

const createEmptyRequirement = () => ({
  id: crypto.randomUUID(),
  positionId: "",
  quantity: 1,
});

export const ScheduleCreateDetails = () => {
  const { t } = useTranslation("routes/schedules");
  const { t: tInfo } = useTranslation("information");
  const queryClient = useQueryClient();

  const { positions, isPending: isPositionsLoading } = usePositions({
    ...defaultPaginationParams,
    pageSize: 100,
  });
  const { createDraftSchedule } = useCreateDraftSchedule({
    onMutate: async (newSchedule) => {
      await queryClient.cancelQueries({ queryKey: [queryKeys.getSchedules] });
      const previousSchedules = queryClient.getQueriesData({
        queryKey: [queryKeys.getSchedules],
      });

      queryClient.setQueriesData(
        { queryKey: [queryKeys.getSchedules] },
        (old: any) => {
          if (!old) return old;
          const optimisticSchedule: Schedule = {
            id: crypto.randomUUID(),
            startDate: newSchedule.startDate,
            endDate: newSchedule.endDate,
            status: ScheduleStatusEnum.DRAFT,
            shiftList: [],
            score: "",
          };
          return {
            ...old,
            content: [optimisticSchedule, ...old.content],
            totalElements: old.totalElements + 1,
          };
        }
      );
      toast.info(tInfo("schedules.draftCreatedOffline"));
      resetForm();
      return { previousSchedules };
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.getSchedules] });
    },
    onSuccess: () => {
      toast.success(tInfo("schedules.draftCreated"));
      resetForm();
    },
  });

  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [weeklyPattern, setWeeklyPattern] = useState<WeeklyPatternState>(() =>
    DAYS_OF_WEEK.reduce(
      (acc, day) => ({ ...acc, [day]: [] }),
      {} as WeeklyPatternState
    )
  );

  const addShift = useCallback((day: DayOfWeek) => {
    setWeeklyPattern((prev) => ({
      ...prev,
      [day]: [...prev[day], createEmptyShift()],
    }));
  }, []);

  const removeShift = useCallback((day: DayOfWeek, shiftId: string) => {
    setWeeklyPattern((prev) => ({
      ...prev,
      [day]: prev[day].filter((s) => s.id !== shiftId),
    }));
  }, []);

  const updateShift = useCallback(
    (
      day: DayOfWeek,
      shiftId: string,
      field: keyof ShiftFormData,
      value: string
    ) => {
      setWeeklyPattern((prev) => ({
        ...prev,
        [day]: prev[day].map((s) =>
          s.id === shiftId ? { ...s, [field]: value } : s
        ),
      }));
    },
    []
  );

  const addRequirement = useCallback((day: DayOfWeek, shiftId: string) => {
    setWeeklyPattern((prev) => ({
      ...prev,
      [day]: prev[day].map((s) =>
        s.id === shiftId
          ? {
              ...s,
              requirements: [...s.requirements, createEmptyRequirement()],
            }
          : s
      ),
    }));
  }, []);

  const removeRequirement = useCallback(
    (day: DayOfWeek, shiftId: string, requirementId: string) => {
      setWeeklyPattern((prev) => ({
        ...prev,
        [day]: prev[day].map((s) =>
          s.id === shiftId
            ? {
                ...s,
                requirements: s.requirements.filter(
                  (r) => r.id !== requirementId
                ),
              }
            : s
        ),
      }));
    },
    []
  );

  const updateRequirement = useCallback(
    (
      day: DayOfWeek,
      shiftId: string,
      requirementId: string,
      field: "positionId" | "quantity",
      value: string | number
    ) => {
      setWeeklyPattern((prev) => ({
        ...prev,
        [day]: prev[day].map((s) =>
          s.id === shiftId
            ? {
                ...s,
                requirements: s.requirements.map((r) =>
                  r.id === requirementId ? { ...r, [field]: value } : r
                ),
              }
            : s
        ),
      }));
    },
    []
  );

  const resetForm = useCallback(() => {
    setStartDate(undefined);
    setEndDate(undefined);
    setWeeklyPattern(
      DAYS_OF_WEEK.reduce(
        (acc, day) => ({ ...acc, [day]: [] }),
        {} as WeeklyPatternState
      )
    );
  }, []);

  const handleSubmit = async () => {
    if (!startDate || !endDate) return;

    const weeklyPatternObj: Record<string, ShiftDefinition[]> = {};

    for (const day of DAYS_OF_WEEK) {
      const shifts = weeklyPattern[day];
      if (shifts.length > 0) {
        const shiftDefinitions: ShiftDefinition[] = shifts.map((shift) => ({
          startTime: formatTimeToLocalDateTime(shift.startTime),
          endTime: formatTimeToLocalDateTime(shift.endTime),
          shiftRequirements: shift.requirements
            .filter((r) => r.positionId)
            .map(
              (r): ShiftRequirement => ({
                positionId: r.positionId,
                quantity: r.quantity,
              })
            ),
        }));
        weeklyPatternObj[day] = shiftDefinitions;
      }
    }

    await createDraftSchedule({
      startDate: parseToIsoDate(startDate),
      endDate: parseToIsoDate(endDate),
      weeklyPattern: weeklyPatternObj,
    });
  };

  const getTotalShiftsCount = () =>
    DAYS_OF_WEEK.reduce((sum, day) => sum + weeklyPattern[day].length, 0);

  return (
    <div className="flex h-full flex-col gap-6">
      {/* Header Section */}
      <div>
        <h2 className="text-2xl font-bold">{t("create.title")}</h2>
        <p className="text-muted-foreground">{t("create.description")}</p>
      </div>

      {/* Date Range Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="size-5" />
            {t("create.dateRange.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex min-w-[200px] flex-1 flex-col gap-2">
              <Label>{t("create.dateRange.startDate")}</Label>
              <CalendarPopover
                selected={startDate}
                onSelect={setStartDate}
                triggerContent={
                  startDate ? (
                    parseFromIsoToDisplayDate(parseToIsoDate(startDate))
                  ) : (
                    <span className="text-muted-foreground">
                      {t("create.dateRange.selectDate")}
                    </span>
                  )
                }
                triggerClassName="w-full"
              />
            </div>
            <div className="flex min-w-[200px] flex-1 flex-col gap-2">
              <Label>{t("create.dateRange.endDate")}</Label>
              <CalendarPopover
                selected={endDate}
                onSelect={setEndDate}
                triggerContent={
                  endDate ? (
                    parseFromIsoToDisplayDate(parseToIsoDate(endDate))
                  ) : (
                    <span className="text-muted-foreground">
                      {t("create.dateRange.selectDate")}
                    </span>
                  )
                }
                triggerClassName="w-full"
                disabledDates={(date) => (startDate ? date < startDate : false)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Pattern Section */}
      <Card className="flex-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="size-5" />
            {t("create.weeklyPattern.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full">
            {DAYS_OF_WEEK.map((day) => (
              <AccordionItem key={day} value={day}>
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <span>{t(`create.weeklyPattern.days.${day}`)}</span>
                    {weeklyPattern[day].length > 0 && (
                      <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                        {weeklyPattern[day].length}{" "}
                        {t("create.weeklyPattern.shiftsCount", {
                          count: weeklyPattern[day].length,
                        })}
                      </span>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-4 pl-2">
                    {weeklyPattern[day].length === 0 ? (
                      <p className="text-muted-foreground text-sm">
                        {t("create.weeklyPattern.noShifts")}
                      </p>
                    ) : (
                      weeklyPattern[day].map((shift, shiftIndex) => (
                        <Card key={shift.id} className="border-dashed">
                          <CardContent className="pt-4">
                            <div className="flex flex-col gap-4">
                              {/* Shift Header */}
                              <div className="flex items-center justify-between">
                                <span className="font-medium">
                                  {t("create.weeklyPattern.shift")} #
                                  {shiftIndex + 1}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeShift(day, shift.id)}
                                >
                                  <Trash2 className="text-destructive size-4" />
                                </Button>
                              </div>

                              {/* Time Inputs */}
                              <div className="flex flex-wrap gap-4">
                                <div className="flex min-w-[150px] flex-1 flex-col gap-2">
                                  <Label>
                                    {t("create.weeklyPattern.startTime")}
                                  </Label>
                                  <Input
                                    type="time"
                                    value={shift.startTime}
                                    onChange={(e) =>
                                      updateShift(
                                        day,
                                        shift.id,
                                        "startTime",
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>
                                <div className="flex min-w-[150px] flex-1 flex-col gap-2">
                                  <Label>
                                    {t("create.weeklyPattern.endTime")}
                                  </Label>
                                  <Input
                                    type="time"
                                    value={shift.endTime}
                                    onChange={(e) =>
                                      updateShift(
                                        day,
                                        shift.id,
                                        "endTime",
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>
                              </div>

                              <Separator />

                              {/* Requirements Section */}
                              <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                  <Label className="flex items-center gap-2">
                                    <Users className="size-4" />
                                    {t("create.weeklyPattern.requirements")}
                                  </Label>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      addRequirement(day, shift.id)
                                    }
                                    disabled={isPositionsLoading}
                                  >
                                    <Plus className="size-4" />
                                    {t("create.weeklyPattern.addRequirement")}
                                  </Button>
                                </div>

                                {shift.requirements.length === 0 ? (
                                  <p className="text-muted-foreground text-sm">
                                    {t("create.weeklyPattern.noRequirements")}
                                  </p>
                                ) : (
                                  <div className="flex flex-col gap-2">
                                    {shift.requirements.map((req) => (
                                      <div
                                        key={req.id}
                                        className="bg-muted/50 flex flex-wrap items-center gap-3 rounded-md p-3"
                                      >
                                        <div className="flex min-w-[180px] flex-1 flex-col gap-1">
                                          <Label className="text-xs">
                                            {t("create.weeklyPattern.position")}
                                          </Label>
                                          <select
                                            className="border-input bg-background h-9 rounded-md border px-3 text-sm"
                                            value={req.positionId}
                                            onChange={(e) =>
                                              updateRequirement(
                                                day,
                                                shift.id,
                                                req.id,
                                                "positionId",
                                                e.target.value
                                              )
                                            }
                                          >
                                            <option value="">
                                              {t(
                                                "create.weeklyPattern.selectPosition"
                                              )}
                                            </option>
                                            {positions?.content?.map((pos) => (
                                              <option
                                                key={pos.id}
                                                value={pos.id}
                                              >
                                                {pos.name}
                                              </option>
                                            ))}
                                          </select>
                                        </div>
                                        <div className="flex w-24 flex-col gap-1">
                                          <Label className="text-xs">
                                            {t("create.weeklyPattern.quantity")}
                                          </Label>
                                          <Input
                                            type="number"
                                            min={1}
                                            value={req.quantity}
                                            onChange={(e) =>
                                              updateRequirement(
                                                day,
                                                shift.id,
                                                req.id,
                                                "quantity",
                                                parseInt(e.target.value, 10) ||
                                                  1
                                              )
                                            }
                                          />
                                        </div>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="self-end"
                                          onClick={() =>
                                            removeRequirement(
                                              day,
                                              shift.id,
                                              req.id
                                            )
                                          }
                                        >
                                          <Trash2 className="text-destructive size-4" />
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => addShift(day)}
                    >
                      <Plus className="size-4" />
                      {t("create.weeklyPattern.addShift")}
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Submit Section */}
      <div className="flex items-center justify-between border-t pt-4">
        <p className="text-muted-foreground text-sm">
          {t("create.summary", { count: getTotalShiftsCount() })}
        </p>
        <LoadingButton
          onClick={handleSubmit}
          isLoading={false}
          disabled={!startDate || !endDate || getTotalShiftsCount() === 0}
        >
          {t("create.submit")}
        </LoadingButton>
      </div>
    </div>
  );
};
