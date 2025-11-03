import { useQuery } from "@tanstack/react-query";
import { api } from "~/api";
import { organisationEndpoints, queryKeys } from "~/constants";
import { sanitizeParams } from "~/lib";
import type { PaginationParams, PagedData } from "~/types/api";
import type { Position } from "~/types/general";

export const usePositions = (params?: PaginationParams) => {
  const { data, isPending } = useQuery({
    queryKey: [queryKeys.getPositions, params],
    queryFn: async () => {
      const cleanParams = sanitizeParams(params);
      const response = await api.get<PagedData<Position>>(
        organisationEndpoints.getPositions,
        { params: cleanParams }
      );
      return response.data;
    },
  });

  return { positions: data, isPending };
};
