import { useMutation } from "@tanstack/react-query";
import { api } from "~/api";
import { authEndpoints } from "~/constants";
import type { signInRequest } from "~/types/api";

export const useSignIn = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: signInRequest) => {
      const reponse = await api.post(authEndpoints.signIn, data);
      return reponse.data;
    },
  });

  return { signInAsync: mutateAsync, isPending };
};
