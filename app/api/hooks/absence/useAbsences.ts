import { useQuery } from "@tanstack/react-query";
import { api } from "~/api/api";
import { employeeEndpoints, queryKeys } from "~/constants";
import { sanitizeParams } from "~/lib";
import type { PagedData, ExtendedAbsenceFilterParams } from "~/types/api";
import { type Absence } from "~/types/general";

export const useAbsences = (params?: ExtendedAbsenceFilterParams) => {
  const { data, isPending } = useQuery({
    queryKey: [queryKeys.getAbsences, params],
    queryFn: async () => {
      const cleanParams = sanitizeParams(params);
      const response = await api.get<PagedData<Absence>>(
        employeeEndpoints.getAbsences,
        { params: cleanParams }
      );
      return response.data;
    },
  });

  return { absences: data, isPending };
};
