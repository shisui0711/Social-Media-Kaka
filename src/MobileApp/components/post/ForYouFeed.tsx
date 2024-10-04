
import PostsLoadingSkeleton from "@/components/posts/PostsLoadingSkeleton";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react-native";
import PostComponent from "@/components/posts/Post";
import { useAuthorizeApiClient } from "@/store";
import { PaginatedListOfPostDto } from "@/lib/api-client";

export default function ForYouFeed() {
  const { client } = useAuthorizeApiClient();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery({
    queryKey: ["post-feed", "for-you"],
    queryFn: async ({ pageParam }): Promise<PaginatedListOfPostDto> =>
      client.getPostFeedWithPagination(pageParam, 10),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage ? lastPage.pageNumber + 1 : undefined;
    },
    refetchOnWindowFocus: false,
  });
  const posts = data?.pages.flatMap((page) => page.items) || [];
  if (status === "pending") {
    return <PostsLoadingSkeleton />;
  }

  if (status === "success" && !posts.length && !hasNextPage) {
    return (
      <div className="flex-center h-[60vh]">
        <p className="text-center text-muted-foreground">
          Chưa có bài viết nào phù hợp. Tạo một bài viết và chia sẻ với bạn bè!
        </p>
      </div>
    );
  }

  if (status === "error") {
    console.log(error);
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
      {posts.length > 0 &&
        posts.map((post) => <PostComponent key={post.id} post={post} />)}
      {isFetchingNextPage && <Loader className="animate-spin mx-auto my-3" />}
    </InfiniteScrollContainer>
  );
}
