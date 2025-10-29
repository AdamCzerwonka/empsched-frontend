import type { AbsenceReasonEnum } from "~/types/general/enums/AbsenceReasonEnum";

export interface AbsenceCreateRequest {
  description: string;
  reason: AbsenceReasonEnum;
  startDate: string;
  endDate: string;
}
