import { images } from "@/constants";
import React from "react";
import { Image } from "react-native";

interface UserAvatarProps {
  avatarUrl?: string | undefined | null;
  size?: number;
  className?: string;
}

const UserAvatar = ({ avatarUrl, size, className }: UserAvatarProps) => {
  if (avatarUrl)
    return (
      <Image
        source={{ uri: avatarUrl }}
        alt="User avatar"
        width={size ?? 48}
        height={size ?? 48}
        className={`aspect-square h-fit flex-none rounded-full bg-secondary object-cover,
        ${className} `}
      />
    );

  return (
    <Image
      source={images.userPlaceholder}
      alt="User avatar"
      width={size ?? 48}
      height={size ?? 48}
      className={`aspect-square h-fit flex-none rounded-full bg-secondary object-cover,
    ${className} `}
    />
  );
};

export default UserAvatar;
