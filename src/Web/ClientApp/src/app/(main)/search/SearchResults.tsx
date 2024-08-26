"use client";

import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import Post from "@/components/posts/Post";
import PostsLoadingSkeleton from "@/components/posts/PostsLoadingSkeleton";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { PaginatedListOfPostDto } from "@/app/web-api-client";
import { useApiClient } from "@/app/hooks/useApiClient";

export default function SearchResults({query}:{query:string}) {
  const client = useApiClient();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["post-feed","search", query],
    queryFn: async ({pageParam}):Promise<PaginatedListOfPostDto> => client.searchPostByQueryWithPagination(query, pageParam, 10),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage
        ? lastPage.pageNumber + 1
        : undefined;
    },
    gcTime: 0
  });

  const posts = data?.pages.flatMap((page) => page.items) || [];
  if (status === "pending") {
    return <PostsLoadingSkeleton />;
  }

  if (status === "success" && !posts.length && !hasNextPage) {
    return (
      <div className="flex-center h-[60vh]">
        <p className="text-center text-muted-foreground">
          Không tìm thấy kết quả nào. Hãy thử thay đổi từ khóa tìm kiếm
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex-center h-[60vh]">
        <p className="text-center text-destructive w-full">
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
