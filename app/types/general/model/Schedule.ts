import type { ScheduleStatusEnum, Shift } from "..";

export interface Schedule {
  id: string;
  startDate: string;
  endDate: string;
  status: ScheduleStatusEnum;
  score: string;
  shiftList: Shift[];
}
