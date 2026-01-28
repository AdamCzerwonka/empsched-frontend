import { useQuery } from "@tanstack/react-query";
import { api } from "~/api/api";
import { employeeEndpoints, queryKeys } from "~/constants";
import type { Employee } from "~/types/general";

export const useMyEmployee = () => {
  const { data, isPending } = useQuery({
    queryKey: [queryKeys.getMe],
    queryFn: async () => {
      const response = await api.get<Employee>(
        employeeEndpoints.getMe
      );
      return response.data;
    },
  });

  return { employee: data, isPending };
};
