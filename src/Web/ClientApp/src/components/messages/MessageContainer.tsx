"use client";

import UserAvatar from "@/components/UserAvatar";
import React, { useEffect, useState } from "react";
import MessageInput from "./MessageInput";
import { useAuthorization } from "@/providers/AuthorizationProvider";
import { BASE_API_URL } from "../../app/app.config";
import { Skeleton } from "../ui/skeleton";
import { useSignalR } from "@/providers/SignalRProvider";
import { Circle } from "lucide-react";
import ListMessage from "./ListMessage";
import { ConversationDto, UserDto } from "@/app/web-api-client";
import { useApiClient } from "@/app/hooks/useApiClient";

interface Props {
  conversation: ConversationDto;
}

const MessageContainer = ({ conversation }: Props) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [collaborator, setCollaborator] = useState<UserDto>()
  const { user } = useAuthorization()
  const client = useApiClient();
  const { connection, checkStatus } = useSignalR()
  const [status, setStatus] = useState(false)
  const collaboratorId = conversation.conversationMembers.find((x) => x.userId !== user.id)!.userId

  useEffect(()=>{
    checkStatus(collaboratorId).then((isOnline)=>{
      setStatus(isOnline)
    })
  },[collaboratorId,checkStatus])

  useEffect(()=>{
    if(connection){
      connection?.on("UserStatusChanged",(userId: string, isOnline: boolean)=>{
        if(userId === collaboratorId){
          setStatus(isOnline)
        }
      })
    }
  },[collaboratorId, connection])

  useEffect(()=>{
    client.getUserInfoById(collaboratorId)
    .then(data=>setCollaborator(data))
    .catch(err=>console.log(err))
    .finally(()=>setIsLoading(false))
  },[collaboratorId, client])
  return (
    <section className="relative h-full overflow-y-auto flex flex-col justify-between">
      <div className="sticky rounded-t-2xl top-0 w-full h-16 bg-card shadow-md flex items-center justify-between px-4">
        {isLoading ? (
          <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
        ):(
          <div className="flex gap-2 items-center">
          <UserAvatar />
          <div className="flex flex-col">
            <p className="font-semibold text-sm">{collaborator?.displayName}</p>
            {
              status ? (
                <div className="flex items-center gap-1"><Circle size={10} className="text-green-500 fill-green-500" /><p className="text-xs font-medium">Trực tuyến</p></div>
              ) : (
                <div className="flex items-center gap-1"><Circle size={10} className="text-gray-500 fill-gray-500" /><p className="text-xs text-gray-500">Ngoại tuyến</p></div>
              )
            }
          </div>
        </div>
        )
        }
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
