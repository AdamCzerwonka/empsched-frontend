import { useMutation } from "@tanstack/react-query";
import { compile } from "path-to-regexp";
import { api } from "~/api/api";
import { employeeEndpoints } from "~/constants";

export const useApproveAbsence = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (absenceId: string) => {
      const path = compile(employeeEndpoints.approveAbsence);
      const response = await api.patch<void>(path({ absenceId }));
      return response.data;
    },
  });

  return { approveAbsenceAsync: mutateAsync, isPending };
};
