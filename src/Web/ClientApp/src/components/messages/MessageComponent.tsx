import { MessageDto } from "@/app/web-api-client";
import { cn } from "@/lib/utils";
import { useAuthorization } from "@/providers/AuthorizationProvider";
import React from "react";
import UserAvatar from "../UserAvatar";
import { useApiClient } from "@/app/hooks/useApiClient";
import { useQuery } from "@tanstack/react-query";

interface Props {
  message: MessageDto;
}

const MessageComponent = ({ message }: Props) => {
  const { user } = useAuthorization();
  const client = useApiClient();
  const { data } = useQuery({
    queryKey: ["user-info", message.senderId],
    queryFn: () => client.getUserInfoById(message.senderId),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60, //1 hours
  });
  return (
    <div
      className={cn(
        "flex gap-3 items-center",
        user.id === message.senderId ? "self-end" : "self-start"
      )}
    >
      {user.id !== message.senderId && (
        <UserAvatar avatarUrl={data?.avatarUrl} />
      )}
      <div
        className={cn(
          "h-12 w-fit max-w-[150px] md:max-w-[220px] lg:max-w-[300px] rounded-2xl p-3",
          user.id === message.senderId
            ? " bg-primary text-white"
            : "bg-background text-foreground"
        )}
      >
        {message.content}
      </div>
    </div>
  );
};

export default MessageComponent;
