import type { AbsenceReasonEnum } from "../enums/AbsenceReasonEnum";
import type { Employee } from "./Employee";

export interface Absence {
  id: string;
  description: string;
  reason: AbsenceReasonEnum;
  employee: Employee;
  approved: boolean;
  startDate: string;
  endDate: string;
}
