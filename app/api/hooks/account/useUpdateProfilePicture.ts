import { useMutation } from "@tanstack/react-query";
import { api } from "~/api";
import { employeeEndpoints } from "~/constants";

export const useUpdateProfilePicture = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post(
        employeeEndpoints.updateProfilePicture,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    },
  });

  return { updateProfilePictureAsync: mutateAsync, isPending };
};
