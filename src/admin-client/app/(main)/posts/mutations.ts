import { PaginatedListOfPostDto } from "@/app/web-api-client"
import { useToast } from "@/hooks/use-toast"
import { InfiniteData, QueryFilters, useMutation, useQueryClient } from "@tanstack/react-query"
import { removePost } from "./actions"

export function useDeletePostMutation(){
  const { toast } = useToast()

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: removePost,
    onSuccess: async (deletedPost) => {
      const queryFilter: QueryFilters = {
        queryKey: ["posts-admin"],
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