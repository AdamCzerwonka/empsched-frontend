import { useMutation } from "@tanstack/react-query";
import { api } from "~/api/api";
import { organisationEndpoints } from "~/constants";
import type { PositionCreateRequest } from "~/types/api";
import type { Position } from "~/types/general";

export const useCreatePosition = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: PositionCreateRequest) => {
      const response = await api.post<Position>(
        organisationEndpoints.createPosition,
        data
      );
      return response.data;
    },
  });

  return { createPositionAsync: mutateAsync, isPending };
};
