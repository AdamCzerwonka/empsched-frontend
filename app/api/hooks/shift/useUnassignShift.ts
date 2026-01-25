import { useMutation } from "@tanstack/react-query";
import { compile } from "path-to-regexp";
import { api } from "~/api/api";
import { scheduleEndpoints } from "~/constants";
import type { Shift } from "~/types/general";

export const useUnassignShift = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (shiftId: string) => {
      const path = compile(scheduleEndpoints.unassignShift);
      const response = await api.patch<Shift>(path({ shiftId }));
      return response.data;
    },
  });

  return { unassignShiftAsync: mutateAsync, isPending };
};
