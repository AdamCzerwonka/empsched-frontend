import { api } from "~/api";
import { employeeEndpoints } from "~/constants";
import type { Position } from "~/types/general";
import { useMutation } from "@tanstack/react-query";
import { compile } from "path-to-regexp";

export const useRemoveEmployeePosition = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async ({
      positionId,
      employeeId,
    }: {
      positionId: string;
      employeeId: string;
    }) => {
      const path = compile(employeeEndpoints.assignPositionToEmployee);
      const response = await api.delete<Position[]>(
        path({ positionId, employeeId })
      );
      return response.data;
    },
  });
  return { removeEmployeePositionAsync: mutateAsync, isPending };
};
