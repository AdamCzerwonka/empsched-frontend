import { useMutation } from "@tanstack/react-query";
import { api } from "~/api";
import { organisationEndpoints } from "~/constants";
import type { OrganisationCreateRequest } from "~/types/api";
import type { Organisation } from "~/types/general";

export const useCreateOrganisation = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: OrganisationCreateRequest) => {
      const response = await api.post<Organisation>(
        organisationEndpoints.createOrganisation,
        data
      );
      return response.data;
    },
  });

  return { createOrganisationAsync: mutateAsync, isPending };
};
