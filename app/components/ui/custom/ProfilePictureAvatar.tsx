import { UserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "..";
import { useProfilePicture } from "~/api/hooks";

interface Props {
  size?: "miniature" | "large";
}

export const ProfilePictureAvatar = ({ size = "miniature" }: Props) => {
  const { imageUrl } = useProfilePicture();

  const sizeClass = size === "miniature" ? "size-6" : "size-32";

  return (
    <Avatar className={sizeClass}>
      <AvatarImage src={imageUrl} />
      <AvatarFallback>
        <UserRound className="text-primary size-full" />
      </AvatarFallback>
    </Avatar>
  );
};
