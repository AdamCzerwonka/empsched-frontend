import { ProfilePictureAvatar } from "~/components/ui";
import { UpdateProfilePictureForm } from "~/components/form/UpdateProfilePictureForm";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "~/constants";

export const ProfilePictureSection = () => {
  const queryClient = useQueryClient();

  return (
    <section className="my-4 flex w-full flex-col items-center justify-center gap-4">
      <ProfilePictureAvatar size="large" />
      <UpdateProfilePictureForm
        onSuccess={() =>
          queryClient.invalidateQueries({
            queryKey: [queryKeys.getProfilePicture],
          })
        }
      />
    </section>
  );
};
