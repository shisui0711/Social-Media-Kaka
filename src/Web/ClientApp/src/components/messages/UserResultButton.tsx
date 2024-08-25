
import React from "react";
import UserAvatar from "../UserAvatar";
import { useEnsureCreatedMutation } from "./mutations";
import { UserDto } from "@/app/web-api-client";

const UserResultButton = ({ receiver }: { receiver: UserDto }) => {
  const mutation = useEnsureCreatedMutation()

  return (
    <button
      onClick={()=>{mutation.mutate(receiver.id)}}
      className="flex flex-col items-center gap-2 max-w-28"
    >
      <UserAvatar avatarUrl={receiver.avatarUrl} />
      <p className="text-sm text-center line-clamp-1 break-all">
        {receiver.displayName}
      </p>
    </button>
  );
};

export default UserResultButton;
