"use client";

import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import Post from "@/components/posts/Post";
import PostsLoadingSkeleton from "@/components/posts/PostsLoadingSkeleton";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { BASE_API_URL } from "../../../app.config";
import { useApiClient } from "@/app/hooks/useApiClient";

interface UserPostsProps {
  userName: string,
}

export default function TaggedPosts({userName}: UserPostsProps) {
  const client = useApiClient();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["post-feed", "tagged-posts",userName],
    queryFn: ({ pageParam }) => client.getUserTaggedPostWithPagination(userName, pageParam,10),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage
        ? lastPage.pageNumber + 1
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
          Nguời này không được gắn thẻ ở bất kỳ bài viết nào.
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
