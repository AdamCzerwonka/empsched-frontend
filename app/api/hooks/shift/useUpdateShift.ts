import { useMutation } from "@tanstack/react-query";
import { compile } from "path-to-regexp";
import { api } from "~/api/api";
import { scheduleEndpoints } from "~/constants";
import type { ShiftUpdateRequest } from "~/types/api";
import type { Shift } from "~/types/general";

interface UpdateShiftParams {
  shiftId: string;
  data: ShiftUpdateRequest;
}

export const useUpdateShift = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async ({ shiftId, data }: UpdateShiftParams) => {
      const path = compile(scheduleEndpoints.updateShift);
      const response = await api.put<Shift>(path({ shiftId }), data);
      return response.data;
    },
  });

  return { updateShiftAsync: mutateAsync, isPending };
};
