import { useMutation } from "@tanstack/react-query";
import { api } from "~/api/api";

export const useUnregisterPushSubscription = () => {
  return useMutation({
    mutationFn: async (endpoint: string) => {
      await api.delete("/push-subscriptions", { data: { endpoint } });
    },
  });
};
