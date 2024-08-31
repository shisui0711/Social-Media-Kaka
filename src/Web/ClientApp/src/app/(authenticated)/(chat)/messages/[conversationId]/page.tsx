"use client"

import React, { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useSignalR } from "@/providers/SignalRProvider";
import { useApiClient } from "@/app/hooks/useApiClient";
import { useQuery } from "@tanstack/react-query";
import MessageContainer from "@/components/messages/MessageContainer";

type Props = {
  params: {
    conversationId: string;
  };
};

const MessagePage = ({ params: { conversationId } }: Props) => {
  const client = useApiClient();
  const { joinGroup, leaveGroup } = useSignalR()

  useEffect(()=>{
    joinGroup(conversationId)
    return ()=>{
      leaveGroup(conversationId)
    }
  },[conversationId, joinGroup, leaveGroup])

  const {
    data,
    isError,
    isPending
  } = useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: ()=>client.getMyConversationInfo(conversationId),
    refetchOnWindowFocus: false,
  })

  if(isError) return <div className="flex-center text-red-500">Có lỗi xảy ra. Vui lòng tải lại trang.</div>;
  if(isPending) return <main className="w-full min-w-0 space-y-5 bg-card rounded-2xl h-[80vh] lg:h-[87vh]">
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
    <main className="w-full min-w-0 space-y-5 bg-card rounded-2xl h-[80vh] lg:h-[87vh]">
      <MessageContainer conversation={data} />
    </main>
  );
};

export default MessagePage;
