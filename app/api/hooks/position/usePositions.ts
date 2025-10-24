import { useQuery } from "@tanstack/react-query";
import { api } from "~/api";
import { organisationEndpoints, queryKeys } from "~/constants";
import type { FilterParams, PagedData } from "~/types/api";
import type { Position } from "~/types/general";

export const usePositions = (params?: FilterParams) => {
  const { data, isPending } = useQuery({
    queryKey: [queryKeys.getPositions, params],
    queryFn: async () => {
      const response = await api.get<PagedData<Position>>(
        organisationEndpoints.getPositions,
        { params }
      );
      return response.data;
    },
  });

  return { positions: data, isPending };
};
