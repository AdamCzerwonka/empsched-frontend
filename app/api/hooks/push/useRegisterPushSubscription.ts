import { useMutation } from "@tanstack/react-query";
import { api } from "~/api/api";
import type { PushSubscriptionRequest } from "~/types/api/push/PushSubscriptionRequest";

export const useRegisterPushSubscription = () => {
  return useMutation({
    mutationFn: async (data: PushSubscriptionRequest) => {
      await api.post("/push-subscriptions", data);
    },
  });
};
