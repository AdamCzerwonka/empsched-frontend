import { useMutation } from "@tanstack/react-query";
import { compile } from "path-to-regexp";
import { api } from "~/api/api";
import { scheduleEndpoints } from "~/constants";

export const useSolveSchedule = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (scheduleId: string) => {
      const path = compile(scheduleEndpoints.solveSchedule);
      const response = await api.post<void>(path({ scheduleId }));
      return response.data;
    },
  });

  return { solveScheduleAsync: mutateAsync, isPending };
};
