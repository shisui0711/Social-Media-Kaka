"use client"

import { useApiClient } from '@/app/hooks/useApiClient'
import { useInfiniteQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react'
import { PaginatedListOfUserDto, UserDto } from '../../web-api-client';
import InfiniteScrollContainer from '@/components/InfiniteScrollContainer';
import FriendComponent from './FriendComponent';
import { Loader } from 'lucide-react';
import FriendComponentSkeleton from './FriendComponentSkeleton';

const ListAllFriend = () => {
  const client = useApiClient();
  const [friends, setFriends] = useState<UserDto[]>([]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery({
    queryKey: ["friends-all"],
    queryFn: async ({pageParam}): Promise<PaginatedListOfUserDto> => client.getMyFriendsWithPagination(pageParam,20),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage
        ? lastPage.pageNumber + 1
        : undefined;
    },
    refetchOnWindowFocus: false,
  })

  useEffect(()=>{
    if(data){
      const newFriends = data.pages.flatMap((page) => page.items);
      setFriends(newFriends)
    }
  },[data])

  if (status === "success" && !friends.length && !hasNextPage) {
    return (
      <div className="flex-center h-[60vh]">
        <p className="text-center text-muted-foreground">
          Bạn chưa có bạn bè nào. Tìm kiếm bạn bè để tương tác với họ ngay nào!
        </p>
      </div>
    );
  }

  if (status === "pending") {
    return <FriendComponentSkeleton/>
  }

  return (
    <InfiniteScrollContainer
    className="grid grid-cols-2 gap-3 lg:grid-cols-4 xl:grid-cols-5"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      {friends.length > 0 && friends.map((friend) => (
        <FriendComponent key={friend.id} user={friend}/>
      ))}
      {isFetchingNextPage && <Loader className="animate-spin mx-auto my-3" />}
    </InfiniteScrollContainer>
  )
}

export default ListAllFriend