import { useQuery } from "@tanstack/react-query";
import { api } from "~/api/api";
import { employeeEndpoints, queryKeys } from "~/constants";
import type { PaginationParams, PagedData } from "~/types/api";
import type { Employee } from "~/types/general";

export const useEmployees = (params?: PaginationParams) => {
  const { data, isPending } = useQuery({
    queryKey: [queryKeys.getEmployees, params],
    queryFn: async () => {
      const response = await api.get<PagedData<Employee>>(
        employeeEndpoints.getEmployees,
        { params }
      );
      return response.data;
    },
  });

  return { employees: data, isPending };
};
