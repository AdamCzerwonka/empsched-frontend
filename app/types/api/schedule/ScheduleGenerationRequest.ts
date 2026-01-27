import type { ShiftDefinition } from "..";

export interface ScheduleGenerationRequest {
  startDate: string;
  endDate: string;
  weeklyPattern: Record<string, ShiftDefinition[]>; // e.g., DayOfWeek (Java) -> [shift1, shift2]
  dateOverrides?: Record<string, ShiftDefinition[]>; // e.g., LocalDate (Java) -> [shift1]
}
