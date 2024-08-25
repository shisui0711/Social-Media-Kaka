import { useToast } from "@/components/ui/use-toast";
import { InfiniteData, QueryFilters, useMutation, useQueryClient } from "@tanstack/react-query";
import { submitPost } from "./actions";
import { useAuthorization } from "@/providers/AuthorizationProvider";
import { PaginatedListOfPostDto } from "@/app/web-api-client";

export function useSubmitPostMutation() {
  const { toast } = useToast();

  const queryClient = useQueryClient()

  const { user } = useAuthorization()

  const mutation = useMutation({
  mutationFn: submitPost,
    onSuccess: async (newPost) => {
      const queryFilter = {
        queryKey: ["post-feed"],
        predicate(query){
          return query.queryKey.includes("for-you") ||
                (query.queryKey.includes("user-posts") && query.queryKey.includes(user.id))
        }
      } satisfies QueryFilters
      await queryClient.cancelQueries(queryFilter)

      queryClient.setQueriesData<InfiniteData<PaginatedListOfPostDto,string |null>>(
        queryFilter,
        (oldData) => {
          const firstPage = oldData?.pages[0]
          if (firstPage && firstPage.items) {
            return {
              pageParams: oldData.pageParams,
              pages: [
                {
                  items: [newPost, ...firstPage.items],
                  pageNumber: firstPage.pageNumber + 1,
                  totalPages: firstPage.totalPages,
                  totalCount: firstPage.totalCount + 1,
                  hasNextPage: firstPage.pageNumber < firstPage.totalPages,
                  hasPreviousPage: firstPage.pageNumber > 1,
                },
                ...oldData.pages.slice(1)
              ]
            }
          }
        }
      )

      queryClient.invalidateQueries({
        queryKey: queryFilter.queryKey,
        predicate(query){
          return queryFilter.predicate(query) && !query.state.data
        }
      })

      toast({
        title: "Đăng bài thành công",
        className: "bg-primary text-white"
      })
    },
    onError: (error) => {
      toast({
        title: JSON.stringify(error.message),
        variant: "destructive",
      });
    },
  });

  return mutation
}
