"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { BASE_API_URL } from "../../app/app.config";
import MessagesSkeleton from "./MessagesSkeleton";
import InfiniteScrollContainer from "../InfiniteScrollContainer";
import MessageComponent from "./MessageComponent";
import { Loader } from "lucide-react";
import { useSignalR } from "@/providers/SignalRProvider";
import { useApiClient } from "@/app/hooks/useApiClient";
import { MessageDto } from "@/app/web-api-client";
import { PaginatedListOfMessageDto } from '../../app/web-api-client';

const ListMessage = ({ conversationId }: { conversationId: string }) => {
  const client = useApiClient();
  const { connection } = useSignalR();
  const [messages, setMessages] = useState<MessageDto[]>([]);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery({
    queryKey: ["messages", conversationId],
    queryFn: async ({ pageParam }): Promise<PaginatedListOfMessageDto> =>
      client.getMyMessageWithPagination(conversationId, pageParam,10),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.hasNextPage) {
        return lastPage.pageNumber + 1;
      }
      return undefined;
    },
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
  useEffect(() => {
    if (data) {
      const newMessages = data.pages.flatMap((page) => page.items);
      setMessages(newMessages);
    }
  }, [data]);

  useEffect(() => {
    if (connection) {
      const handleReceiveMessage = (message: MessageDto) => {
        if (message.conversationId === conversationId) {
          setMessages(prevMessages => [...prevMessages, message]);
        }
      };
      connection.on("ReceiveMessage", handleReceiveMessage);
      return () => {
        connection.off("ReceiveMessage",handleReceiveMessage);
      }
    }
  }, [connection, conversationId]);

  if (status === "pending") {
    return <MessagesSkeleton />;
  }

  if (status === "success" && !messages.length && !hasNextPage) {
    return (
      <div className="flex-center h-[60vh]">
        <p className="text-center text-muted-foreground">
          Chưa có tin nhắn nào ! Hãy nhắn tin ngay nào.
        </p>
      </div>
    );
  }

  if (status === "error") {
    console.log(error);
    return (
      <div className="flex-center h-[60vh]">
        <p className="text-center text-destructive w-full">
          Có lỗi xảy ra. Hãy tải lại trang.
        </p>
      </div>
    );
  }

  return (
    <InfiniteScrollContainer
      className="space-y-2 flex flex-col"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      {messages.length > 0 &&
        messages.map((message) => (
          <MessageComponent key={message.id} message={message} />
        ))}
      {isFetchingNextPage && <Loader className="animate-spin mx-auto my-3" />}
    </InfiniteScrollContainer>
  );
};

export default ListMessage;
