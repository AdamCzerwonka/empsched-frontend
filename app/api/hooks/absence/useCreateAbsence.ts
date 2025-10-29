import { useMutation } from "@tanstack/react-query";
import { compile } from "path-to-regexp";
import { api } from "~/api/api";
import { employeeEndpoints } from "~/constants";
import type { AbsenceCreateRequest } from "~/types/api";
import type { Absence } from "~/types/general";

export const useCreateAbsence = (employeeId?: string) => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: AbsenceCreateRequest) => {
      const employeePath = compile(employeeEndpoints.createEmployeeAbsence);
      const path = employeeId
        ? employeePath({ employeeId })
        : employeeEndpoints.createSelfAbsence;
      const response = await api.post<Absence>(path, data);
      return response.data;
    },
  });

  return { createAbsenceAsync: mutateAsync, isPending };
};
