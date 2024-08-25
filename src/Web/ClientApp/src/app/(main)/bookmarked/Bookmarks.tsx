"use client";

import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import Post from "@/components/posts/Post";
import PostsLoadingSkeleton from "@/components/posts/PostsLoadingSkeleton";
import kyInstance from "@/lib/ky";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { BASE_API_URL } from "../../app.config";
import { useApiClient } from "@/app/hooks/useApiClient";

export default function Bookmarks() {
  const client = useApiClient()
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["post-feed", "bookmarks"],
    queryFn:  ({pageParam}) => client.getBookmarkPostWithPagination(pageParam,10),
    initialPageParam: 1,
    getNextPageParam: (firstPage) => {
      return firstPage.hasNextPage
      ? firstPage.pageNumber + 1
      : undefined;
    },
  });

  const posts = data?.pages.flatMap((page) => page.items) || [];
  if (status === "pending") {
    return <PostsLoadingSkeleton />;
  }

  if (status === "success" && !posts.length && !hasNextPage) {
    return (
      <div className="flex-center h-[60vh]">
        <p className="text-center text-muted-foreground">
          Chưa có bài viết nào được lưu. Hãy đánh dấu bài viết để lưu nó vào đây !
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex-center h-[60vh]">
        <p className="text-center text-destructive">
          Có lỗi xảy ra khi tải bài viết. Hãy tải lại trang.
        </p>
      </div>
    );
  }

  return (
    <InfiniteScrollContainer
      className="space-y-5"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
      {isFetchingNextPage && <Loader className="animate-spin mx-auto my-3" />}
    </InfiniteScrollContainer>
  );
}
