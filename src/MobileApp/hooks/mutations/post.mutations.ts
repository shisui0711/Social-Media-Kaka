import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner-native";
import { deletePost } from "@/actions/post.actions";
import { usePathname, useRouter } from "expo-router";
import { PaginatedListOfPostDto, PostDto } from "@/lib/api-client";

export function useDeletePostMutation(post: PostDto) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();

  const mutation = useMutation({
    mutationFn: deletePost,
    onSuccess: async (deletedPost) => {
      if (!deletedPost) return router.dismissAll();
      const queryFilter: QueryFilters = {
        queryKey: ["post-feed"],
      };
      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData<
        InfiniteData<PaginatedListOfPostDto, string | null>
      >(queryFilter, (oldData) => {
        if (!oldData) return;
        return {
          pageParams: oldData.pageParams,
          pages: oldData.pages.map((page) => ({
            pageNumber: page.pageNumber,
            items: page.items.filter((post) => post.id !== deletedPost.id),
            hasNextPage: page.hasNextPage,
            hasPreviousPage: page.hasPreviousPage,
            totalCount: page.totalCount - 1,
            totalPages: page.totalPages,
          })),
        };
      });

      toast.success("Xóa bài viết thành công");
      if (pathname === `/posts/${deletedPost.id}`) {
        router.push("/");
      }
    },
    onError: (error) => {
      console.log(error);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại");
    },
  });
  return mutation;
}
