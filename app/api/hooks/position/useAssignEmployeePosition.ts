import { api } from "~/api";
import { employeeEndpoints } from "~/constants";
import type { Position } from "~/types/general";
import { compile } from "path-to-regexp";
import { useMutation } from "@tanstack/react-query";

export const useAssignEmployeePosition = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async ({
      positionId,
      employeeId,
    }: {
      positionId: string;
      employeeId: string;
    }) => {
      const path = compile(employeeEndpoints.assignPositionToEmployee);
      const response = await api.post<Position[]>(
        path({ positionId, employeeId })
      );
      return response.data;
    },
  });
  return { assignEmployeePositionAsync: mutateAsync, isPending };
};
