"use client";

import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import PostsLoadingSkeleton from "@/components/posts/PostsLoadingSkeleton";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import React, { Dispatch, SetStateAction } from "react";
import Notification from "./Notification";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useApiClient } from "@/app/hooks/useApiClient";

interface Props {
  setOpen: Dispatch<SetStateAction<boolean>> | undefined;
}

const ListNotification = ({setOpen}: Props) => {
  const client = useApiClient();
  const pathname = usePathname();
  const pageSize = pathname === '/notifications' ? 10 : 5;
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["notifications"],
    queryFn: ({ pageParam }) => client.getMyNotificationWithPagination(pageParam, pageSize),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage
        ? lastPage.pageNumber + 1
        : undefined;
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const notifications = data?.pages.flatMap((page) => page.items) || [];

  if (status === "pending") {
    return <PostsLoadingSkeleton />;
  }

  if (status === "success" && !notifications.length && !hasNextPage) {
    return (
      <p className="text-center text-muted-foreground">
        Bạn chưa có thông báo nào.
      </p>
    );
  }

  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        Đã xảy ra lỗi khi tải thông báo. Vui lòng tải lại trang.
      </p>
    );
  }

  if (pathname !== "/notifications") {
    return (
      <div className="max-h-[70vh] overflow-y-auto">
        <div className="space-y-3 px-2" onClick={()=>{
          if(setOpen) setOpen(false);
        }}>
          {notifications.map((notification) => (
            <Notification key={notification.id} notification={notification} />
          ))}
        </div>
        {hasNextPage && (
          <Button
            variant="link"
            className="mx-auto block"
            disabled={isFetching}
            hidden={!hasNextPage}
            onClick={() => fetchNextPage()}
          >
            Xem thông báo trước đó
          </Button>
        )}
      </div>
    );
  }

  return (
    <InfiniteScrollContainer
      className="space-y-5"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      {notifications.map((notification) => (
        <Notification key={notification.id} notification={notification} />
      ))}
      {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
    </InfiniteScrollContainer>
  );
};

export default ListNotification;
