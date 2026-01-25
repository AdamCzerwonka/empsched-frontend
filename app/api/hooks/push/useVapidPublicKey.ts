import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useVapidPublicKey = () => {
  return useQuery({
    queryKey: ["vapid-public-key"],
    queryFn: async () => {
      // Use plain axios without Authorization header - this is a public endpoint
      const response = await axios.get<{ publicKey: string }>(
        `${import.meta.env.VITE_API_URL}/push-subscriptions/vapid-public-key`
      );
      return response.data.publicKey;
    },
    staleTime: Infinity,
  });
};
