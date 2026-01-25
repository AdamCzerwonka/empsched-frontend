import { useMutation } from "@tanstack/react-query";
import { compile } from "path-to-regexp";
import { api } from "~/api/api";
import { scheduleEndpoints } from "~/constants";

export const useDeleteShift = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (shiftId: string) => {
      const path = compile(scheduleEndpoints.removeShift);
      const response = await api.delete<void>(path({ shiftId }));
      return response.data;
    },
  });

  return { deleteShiftAsync: mutateAsync, isPending };
};
