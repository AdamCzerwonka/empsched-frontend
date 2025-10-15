import { useQuery } from "@tanstack/react-query";
import { api } from "~/api/api";
import { employeeEndpoints, queryKeys } from "~/constants";
import type { Employee } from "~/types/general";

export const useEmployees = () => {
  const { data, isPending } = useQuery({
    queryKey: [queryKeys.getEmployees],
    queryFn: async () => {
      const response = await api.get<Employee[]>(
        employeeEndpoints.getEmployees
      );
      return response.data;
    },
  });

  return { employees: data, isPending };
};
