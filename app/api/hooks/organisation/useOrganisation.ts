import { useQuery } from "@tanstack/react-query";
import { api } from "~/api/api";
import { organisationEndpoints, queryKeys } from "~/constants";
import type { Organisation } from "~/types/general";

export const useOrganisation = (id?: string) => {
  const { data } = useQuery({
    queryKey: [queryKeys.getOrganisationDetails, id],
    queryFn: async () => {
      const endpoint = id
        ? `${organisationEndpoints.getOrganisation}/${id}`
        : `${organisationEndpoints.getOrganisation}`;
      const response = await api.get<Organisation>(endpoint);
      return response.data;
    },
  });

  return { organisation: data };
};
