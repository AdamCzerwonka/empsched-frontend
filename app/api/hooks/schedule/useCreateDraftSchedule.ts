import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { api } from "~/api/api";
import { scheduleEndpoints } from "~/constants";
import type { ScheduleGenerationRequest } from "~/types/api";
import type { Schedule } from "~/types/general";

export const useCreateDraftSchedule = (
  options?: UseMutationOptions<
    Schedule,
    Error,
    ScheduleGenerationRequest,
    unknown
  >
) => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: ScheduleGenerationRequest) => {
      const response = await api.post<Schedule>(
        scheduleEndpoints.createDraftSchedule,
        data
      );
      return response.data;
    },
    ...options,
  });

  return { createDraftSchedule: mutateAsync, isPending };
};
