import { useMutation } from "@tanstack/react-query";
import { api } from "~/api";
import { authEndpoints } from "~/constants";
import type { signInRequest } from "~/types/api";
import { useAuthStore } from "~/store";

export interface SignInResponse {
  token: string;
}

export const useSignIn = () => {
  const { setToken } = useAuthStore();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: signInRequest) => {
      const response = await api.post<SignInResponse>(
        authEndpoints.signIn,
        data
      );

      if (response.data.token) {
        setToken(response.data.token);
      }

      return response.data;
    },
  });

  return { signInAsync: mutateAsync, isPending };
};
