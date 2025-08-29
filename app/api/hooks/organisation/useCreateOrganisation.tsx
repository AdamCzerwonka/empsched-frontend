import { useMutation } from "@tanstack/react-query";
import { api } from "~/api";
import { organisationEndpoints } from "~/constants";
import type { OrganisationCreateRequest } from "~/types/api";

export const useCreateOrganisation = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: OrganisationCreateRequest) => {
      const reponse = await api.post(organisationEndpoints.create, data);
      return reponse.data;
    },
  });

  return { createOrganisationAsync: mutateAsync, isPending };
};
