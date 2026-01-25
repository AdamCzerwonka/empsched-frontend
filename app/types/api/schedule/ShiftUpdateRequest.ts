export interface ShiftUpdateRequest {
  startTime: string;
  endTime: string;
  requiredPositionId: string;
  assignedEmployeeId?: string;
}
