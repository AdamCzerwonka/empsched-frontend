import { useMutation } from "@tanstack/react-query";
import { api } from "~/api";
import { employeeEndpoints } from "~/constants";
import type { EmployeeCreateRequest } from "~/types/api";
import type { Employee } from "~/types/general";

export const useCreateEmployee = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: EmployeeCreateRequest) => {
      const response = await api.post<Employee>(
        employeeEndpoints.createEmployee,
        data
      );
      return response.data;
    },
  });
  return { createEmployeeAsync: mutateAsync, isPending };
};
