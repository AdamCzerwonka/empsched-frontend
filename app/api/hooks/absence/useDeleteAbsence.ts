import { useMutation } from "@tanstack/react-query";
import { compile } from "path-to-regexp";
import { api } from "~/api/api";
import { employeeEndpoints } from "~/constants";

export const useDeleteAbsence = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (absenceId: string) => {
      const path = compile(employeeEndpoints.deleteAbsence);
      const response = await api.delete<void>(path({ absenceId }));
      return response.data;
    },
  });
  return { deleteAbsenceAsync: mutateAsync, isPending };
};
