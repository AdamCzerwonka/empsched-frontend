import { useQuery } from "@tanstack/react-query";
import { api } from "~/api";
import { queryKeys, scheduleEndpoints } from "~/constants";
import { sanitizeParams } from "~/lib";
import type { PagedData, PaginationParams } from "~/types/api";
import type { Schedule } from "~/types/general";

export const useSchedule = (params?: PaginationParams) => {
  const { data, isPending } = useQuery({
    queryKey: [queryKeys.getSchedules, params],
    queryFn: async () => {
      const cleanParams = sanitizeParams(params);
      const response = await api.get<PagedData<Schedule>>(
        scheduleEndpoints.getSchedules,
        {
          params: cleanParams,
        }
      );
      return response.data;
    },
  });

  return { schedules: data, isPending };
};
