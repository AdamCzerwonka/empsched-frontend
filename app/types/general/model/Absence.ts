import type { AbsenceReasonEnum } from "../enums/AbsenceReasonEnum";

export interface Absence {
  id: string;
  description: string;
  reason: AbsenceReasonEnum;
  employeeId: string;
  approved: boolean;
  startDate: string;
  endDate: string;
}
