"use client"

import React, { useEffect, useState } from "react";
import MessageContainer from "../../../../components/messages/MessageContainer";
import { Skeleton } from "@/components/ui/skeleton";
import { useSignalR } from "@/providers/SignalRProvider";
import { useRouter } from "next/navigation";
import { useApiClient } from "@/app/hooks/useApiClient";
import { ConversationDto } from "@/app/web-api-client";
import { AxiosError } from "axios";

type Props = {
  params: {
    conversationId: string;
  };
};

const MessagePage = ({ params: { conversationId } }: Props) => {
  const client = useApiClient();
  const [conversation, setConversation] = useState<ConversationDto>()
  const [error, setError] = useState('')
  const { joinGroup, leaveGroup } = useSignalR()
  const router = useRouter()

  useEffect(()=>{
    joinGroup(conversationId)
    return ()=>{
      leaveGroup(conversationId)
    }
  },[conversationId, joinGroup, leaveGroup])

  useEffect(()=>{
    client.getMyConversationInfo(conversationId)
    .then(data=>setConversation(data))
    .catch(error=>{
      if(error instanceof AxiosError && error.status === 404) router.push('/messages')
      setError(error)
    })
  },[client, conversationId, router])

  if(error) return <div className="flex-center text-red-500">Có lỗi xảy ra. Vui lòng tải lại trang.</div>
  if(!conversation) return <main className="w-full min-w-0 space-y-5 bg-card rounded-2xl h-[87vh]">
          <section className="relative h-full overflow-y-auto flex flex-col justify-between">
      <div className="sticky rounded-t-2xl top-0 w-full h-16 bg-card shadow-md flex items-center justify-between px-4">
      <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      </div>
      <div className="sticky rounded-b-2xl bottom-1 w-full h-16 bg-card shadow-md flex items-center justify-between px-4">
      <Skeleton className="h-12 w-full" />
      </div>
    </section>
</main>

  return (
    <main className="w-full min-w-0 space-y-5 bg-card rounded-2xl h-[87vh]">
      <MessageContainer conversation={conversation} />
    </main>
  );
};

export default MessagePage;
