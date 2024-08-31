"use client";

import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import Post from "@/components/posts/Post";
import PostsLoadingSkeleton from "@/components/posts/PostsLoadingSkeleton";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useApiClient } from "../../hooks/useApiClient";
import { PaginatedListOfPostDto } from "../../web-api-client";

export default function FollowingFeed() {
  const client = useApiClient()
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["post-feed", "following"],
    queryFn: async ({pageParam}):Promise<PaginatedListOfPostDto> => client.getFollowingPostWithPagination(pageParam,10),
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
          Chưa có bài viết nào. Hãy follow ai đó để xem bài viết của họ !
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        An error occurred while loading posts.
      </p>
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
