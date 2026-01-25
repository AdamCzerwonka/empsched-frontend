import type { ShiftRequirement } from "..";

export interface ShiftDefinition {
  startTime: string;
  endTime: string;
  shiftRequirements: ShiftRequirement[];
}
