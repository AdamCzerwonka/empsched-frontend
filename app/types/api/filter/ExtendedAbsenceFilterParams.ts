import {
  defaultPaginationParams,
  type PaginationParams,
} from "./PaginationParams";
import {
  defaultStartDateFilterParams,
  type StartDateFilterParams,
} from "./StartDateFilterParams";

export interface ExtendedAbsenceFilterParams
  extends StartDateFilterParams,
    PaginationParams {
  approved: boolean;
}

export const defaultExtendedAbsenceFilterParams: ExtendedAbsenceFilterParams = {
  approved: false,
  ...defaultStartDateFilterParams,
  ...defaultPaginationParams,
};
