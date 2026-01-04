import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { api } from "~/api/api";
import { employeeEndpoints, queryKeys } from "~/constants";

export const useProfilePicture = () => {
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

  const { data, isLoading } = useQuery({
    queryKey: [queryKeys.getProfilePicture],
    queryFn: async () => {
      const response = await api.get(employeeEndpoints.getProfilePicture, {
        responseType: "blob",
      });

      return response.data;
    },
    retry: false,
  });

  useEffect(() => {
    if (data && data instanceof Blob) {
      const url = URL.createObjectURL(data);
      setImageUrl(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [data]);

  return { imageUrl, isLoading };
};
