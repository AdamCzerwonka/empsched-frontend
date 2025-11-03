import { useQuery } from "@tanstack/react-query";
import { api } from "~/api/api";
import { employeeEndpoints, queryKeys } from "~/constants";
import {
  type AbsenceFilterParams,
  type PagedData,
  type PaginationParams,
} from "~/types/api";
import type { Absence } from "~/types/general";
import { sanitizeParams } from "~/lib";

export const useSelfAbsences = (
  params?: PaginationParams & AbsenceFilterParams
) => {
  const { data, isPending } = useQuery({
    queryKey: [queryKeys.getSelfAbsences, params],
    queryFn: async () => {
      const cleanParams = sanitizeParams(params);
      const response = await api.get<PagedData<Absence>>(
        employeeEndpoints.getSelfAbsences,
        { params: cleanParams }
      );
      return response.data;
    },
  });

  return { absences: data, isPending };
};
