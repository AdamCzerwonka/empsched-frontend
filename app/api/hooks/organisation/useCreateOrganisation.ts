import { useMutation } from "@tanstack/react-query";
import { api } from "~/api";
import { workflowEndpoints } from "~/constants";
import type { OrganisationCreateRequest } from "~/types/api";
import type { Organisation } from "~/types/general";

export const useCreateOrganisation = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: OrganisationCreateRequest) => {
      const response = await api.post<Organisation>(
        workflowEndpoints.createOrganisation,
        data
      );
      return response.data;
    },
  });

  return { createOrganisationAsync: mutateAsync, isPending };
};
