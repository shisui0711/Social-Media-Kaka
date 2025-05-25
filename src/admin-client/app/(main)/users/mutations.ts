import { PaginatedListOfUserDto } from "@/app/web-api-client"
import { useToast } from "@/hooks/use-toast"
import { InfiniteData, QueryFilters, useMutation, useQueryClient } from "@tanstack/react-query"
import { removeUser } from "./actions"

export function useDeleteUserMutation(){
  const { toast } = useToast()

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: removeUser,
    onSuccess: async (deletedUser) => {
      const queryFilter: QueryFilters = {
        queryKey: ["users-admin"],
      }
      await queryClient.cancelQueries(queryFilter)

      queryClient.setQueriesData<InfiniteData<PaginatedListOfUserDto,string|null>>(
        queryFilter,
        (oldData) => {
          if (!oldData) return;
          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              pageNumber: page.pageNumber,
              items: page.items.filter((user) => user.id !== deletedUser.id),
              hasNextPage: page.hasNextPage,
              hasPreviousPage: page.hasPreviousPage,
              totalCount: page.totalCount - 1,
              totalPages: page.totalPages
            }))
          }
        }
      )

      toast({
        title: "Xóa người dùng thành công",
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