"use client";

import UserAvatar from "@/components/UserAvatar";
import React, { useEffect, useState } from "react";
import MessageInput from "./MessageInput";
import { useAuthorization } from "@/providers/AuthorizationProvider";
import { Skeleton } from "../ui/skeleton";
import { useSignalR } from "@/providers/SignalRProvider";
import { Circle, CircleEllipsis, Phone, Video } from "lucide-react";
import ListMessage from "./ListMessage";
import { ConversationDto, UserDto } from "@/app/web-api-client";
import { useApiClient } from "@/app/hooks/useApiClient";
import { useQuery } from "@tanstack/react-query";
import ConversationMoreButton from "./ConversationMoreButton";

interface Props {
  conversation: ConversationDto;
}

const MessageContainer = ({ conversation }: Props) => {
  const { user } = useAuthorization();
  const client = useApiClient();
  const { connection, checkStatus } = useSignalR();
  const [status, setStatus] = useState(false);
  const collaboratorId = conversation.conversationMembers.find(
    (x) => x.userId !== user.id
  )!.userId;
  const { data, isPending, isError } = useQuery({
    queryKey: ["user-info", collaboratorId],
    queryFn: () => client.getUserInfoById(collaboratorId),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60, //1 hours
  });

  useEffect(() => {
    checkStatus(collaboratorId).then((isOnline:boolean) => {
      setStatus(isOnline);
    });
  }, [collaboratorId, checkStatus]);

  useEffect(() => {
    if (connection) {
      connection?.on(
        "UserStatusChanged",
        (userId: string, isOnline: boolean) => {
          if (userId === collaboratorId) {
            setStatus(isOnline);
          }
        }
      );
    }
  }, [collaboratorId, connection]);

  const handleOpenRegularCall = () => {
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    const left = screenWidth / 2 - 1200 / 2;
    const top = screenHeight / 2 - 600 / 2;
    window.open(
      `/groupcall/${collaboratorId}`,
      "_blank",
      `noopener,noreferrer,width=${1200},height=${600},left=${left},top=${top}`
    );
  };

  const handleOpenVideoCall = () => {
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    const left = screenWidth / 2 - 1200 / 2;
    const top = screenHeight / 2 - 600 / 2;
    window.open(
      `/groupcall/${collaboratorId}?hasVideo=true`,
      "_blank",
      `noopener,noreferrer,width=${1200},height=${600},left=${left},top=${top}`
    );
  }

  return (
    <section className="relative h-full overflow-y-auto flex flex-col justify-between">
      <div className="sticky w-full rounded-t-2xl top-0 h-16 bg-card shadow-md flex items-center justify-between px-4">
        {isPending ? (
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ) : (
          <section className="flex w-full items-center justify-between">
            <div className="flex gap-2 items-center">
              <UserAvatar />
              <div className="flex flex-col">
                <p className="font-semibold text-sm">{data?.displayName}</p>
                {status ? (
                  <div className="flex items-center gap-1">
                    <Circle
                      size={10}
                      className="text-green-500 fill-green-500"
                    />
                    <p className="text-xs font-medium">Trực tuyến</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <Circle size={10} className="text-gray-500 fill-gray-500" />
                    <p className="text-xs text-gray-500">Ngoại tuyến</p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <button className="hover:bg-background p-2 rounded-2xl" onClick={handleOpenRegularCall}>
                <Phone className="text-primary fill-primary" />
              </button>
              <button className="hover:bg-background p-2 rounded-2xl" onClick={handleOpenVideoCall}>
                <Video className="text-primary fill-primary" />
              </button>
              <ConversationMoreButton conversation={conversation} className="text-primary hover:bg-background rounded-2xl"/>
            </div>
          </section>
        )}
      </div>
      <section className="flex flex-col-reverse h-full overflow-y-auto p-5">
        <ListMessage conversationId={conversation.id} />
      </section>
      <div className="sticky rounded-b-2xl bottom-1 w-full h-16 bg-card shadow-md flex items-center justify-between px-4">
        <MessageInput
          receiverId={collaboratorId}
          senderId={user.id}
          conversation={conversation}
        />
      </div>
    </section>
  );
};

export default MessageContainer;
