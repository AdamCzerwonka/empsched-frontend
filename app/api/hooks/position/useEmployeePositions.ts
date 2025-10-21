import { useQuery } from "@tanstack/react-query";
import { api } from "~/api";
import { employeeEndpoints, queryKeys } from "~/constants";
import type { Position } from "~/types/general";
import { compile } from "path-to-regexp";

export const useEmployeePositions = (employeeId: string) => {
  const { data, isPending } = useQuery({
    queryKey: [queryKeys.getEmployeePositions, employeeId],
    queryFn: async () => {
      const path = compile(employeeEndpoints.getEmployeePositions);
      const response = await api.get<Position[]>(path({ employeeId }));
      return response.data;
    },
  });
  return { employeePositions: data, isPending };
};
