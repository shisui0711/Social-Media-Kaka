"use client"

import React, { useEffect, useState } from 'react'
import { useAuthorization } from '@/providers/AuthorizationProvider'
import { useInfiniteQuery } from '@tanstack/react-query'
import kyInstance from '@/lib/ky'
import { BASE_API_URL } from '../../app/app.config'
import ConversationSkeleton from './ConversationSkeleton'
import InfiniteScrollContainer from '../InfiniteScrollContainer'
import ConversationComponent from './Conversation'
import { Loader } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { ConversationDto, PaginatedListOfConversationDto } from '@/app/web-api-client'
import { useApiClient } from '@/app/hooks/useApiClient'

const ListConversation = () => {
  const client = useApiClient();
  const pathname = usePathname()
  const router = useRouter()
  const [conversations, setConversations] = useState<ConversationDto[]>([]);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery({
    queryKey: ['conversations'],
    queryFn: async ({pageParam}): Promise<PaginatedListOfConversationDto> => client.getMyConversationWithPagination(pageParam,10),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage
        ? lastPage.pageNumber + 1
        : undefined;
    },
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    if (data) {
      const newConversations = data.pages.flatMap((page) => page.items);
      setConversations(newConversations);
    }
  }, [data]);

  if(conversations.length > 0 && pathname === "/messages") {
    router.push(`/messages/${conversations[0].id}`)
  }
  if (status === "pending") {
    return <ConversationSkeleton />;
  }

  if (status === "success" && !conversations.length && !hasNextPage) {
    return (
      <div className="flex-center h-[60vh]">
        <p className="text-center text-muted-foreground">
          Bạn chưa có đoạn chat nào. Tìm kiếm bạn bè để nhắn tin với họ ngay nào!
        </p>
      </div>
    );
  }

  if (status === "error") {
    console.log(error);
    return (
      <div className="flex-center h-[60vh]">
        <p className="text-center text-destructive">
          Có lỗi xảy ra. Hãy tải lại trang.
        </p>
      </div>
    );
  }

  return (
    <InfiniteScrollContainer
    className="flex flex-col gap-3"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      {conversations.length > 0 && conversations.map((conversation) => (
        <ConversationComponent key={conversation.id} conversation={conversation}/>
      ))}
      {isFetchingNextPage && <Loader className="animate-spin mx-auto my-3" />}
    </InfiniteScrollContainer>
  )
}

export default ListConversation