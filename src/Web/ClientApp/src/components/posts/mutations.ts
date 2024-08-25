
import { useToast } from "../ui/use-toast";
import { InfiniteData, QueryFilters, useMutation, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { deletePost } from "./actions";
import { PaginatedListOfPostDto, PostDto } from "@/app/web-api-client";

export function useDeletePostMutation(post: PostDto){
  const { toast } = useToast()

  const queryClient = useQueryClient()
  const router = useRouter()
  const pathname = usePathname()

  const mutation = useMutation({
    mutationFn: deletePost,
    onSuccess: async (deletedPost) => {
      const queryFilter: QueryFilters = {
        queryKey: ["post-feed"],
      }
      await queryClient.cancelQueries(queryFilter)

      queryClient.setQueriesData<InfiniteData<PaginatedListOfPostDto,string|null>>(
        queryFilter,
        (oldData) => {
          if (!oldData) return;
          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              pageNumber: page.pageNumber,
              items: page.items.filter((post) => post.id !== deletedPost.id),
              hasNextPage: page.hasNextPage,
              hasPreviousPage: page.hasPreviousPage,
              totalCount: page.totalCount - 1,
              totalPages: page.totalPages
            }))
          }
        }
      )

      toast({
        title: "Xóa bài viết thành công",
        className: "bg-primary text-white",
      })

      if(pathname === `/posts/${deletedPost.id}`){
        router.push('/')
      }
    },
    onError: (error) => {
      console.log(error)
      toast({
        title: "Có lỗi xảy ra. Vui lòng thử lại",
        variant: "destructive"
      })
    }
  })
  return mutation
}