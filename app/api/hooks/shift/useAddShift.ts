import { useMutation } from "@tanstack/react-query";
import { compile } from "path-to-regexp";
import { api } from "~/api/api";
import { scheduleEndpoints } from "~/constants";
import type { ShiftUpdateRequest } from "~/types/api";
import type { Shift } from "~/types/general";

interface AddShiftParams {
  scheduleId: string;
  data: ShiftUpdateRequest;
}

export const useAddShift = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async ({ scheduleId, data }: AddShiftParams) => {
      const path = compile(scheduleEndpoints.addShift);
      const response = await api.post<Shift>(path({ scheduleId }), data);
      return response.data;
    },
  });

  return { addShiftAsync: mutateAsync, isPending };
};
