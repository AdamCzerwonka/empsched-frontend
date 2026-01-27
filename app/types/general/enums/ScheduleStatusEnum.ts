export enum ScheduleStatusEnum {
  DRAFT = "DRAFT",
  SOLVING = "SOLVING",
  SOLVED = "SOLVED",
  PUBLISHED = "PUBLISHED",
  ERROR = "ERROR",
}

export type ScheduleStatusType = keyof typeof ScheduleStatusEnum;
