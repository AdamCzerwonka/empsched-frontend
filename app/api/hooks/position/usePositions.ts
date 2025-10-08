import { useQuery } from "@tanstack/react-query";
import { api } from "~/api";
import { organisationEndpoints } from "~/constants";
import type { Position } from "~/types/general";

export const usePositions = () => {
  const { data } = useQuery({
    queryKey: ["positions"],
    queryFn: async () => {
      const response = await api.get<Position[]>(
        organisationEndpoints.getPositions
      );
      return response.data;
    },
  });

  return { positions: data };
};
