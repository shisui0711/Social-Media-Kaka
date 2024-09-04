
import {
  InfiniteData,
  QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useToast } from "../ui/use-toast";
import { deleteComment, submitComment, submitNestedComment } from "./action"
import { useSignalR } from "@/providers/SignalRProvider";
import { CommentDto, PaginatedListOfCommentDto } from "@/app/web-api-client";

export function useSubmitCommentMutation(postId: string) {
  const { toast } = useToast();

  const queryClient = useQueryClient();
  const { sendComment } = useSignalR()

  const mutation = useMutation({
    mutationFn: submitComment,
    onSuccess: async (newComment) => {
      sendComment(newComment,postId)
      const queryKey: QueryKey = ["comments", postId];

      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<InfiniteData<PaginatedListOfCommentDto, string | null>>(
        queryKey,
        (oldData) => {
          const firstPage = oldData?.pages[0];
          if (firstPage) {
            return {
              pageParams: oldData.pageParams,
              pages: [
                {
                  pageNumber: firstPage.pageNumber,
                  items: [...firstPage.items, newComment],
                  totalPages: firstPage.totalPages,
                  totalCount: firstPage.totalCount + 1,
                  hasPreviousPage: firstPage.hasPreviousPage,
                  hasNextPage: firstPage.hasNextPage
                },
                ...oldData.pages.slice(1),
              ],
            };
          }
        },
      );

      queryClient.invalidateQueries({
        queryKey,
        predicate(query) {
          return !query.state.data;
        },
      });

      toast({
        description: "Đã bình luận",
        className: "bg-primary text-white"
      });
    },
    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Có lỗi xảy ra. Vui lòng thử lại",
      });
    },
  });

  return mutation;
}

export function useSubmitNestedCommentMutation(comment: CommentDto) {
  const { toast } = useToast();

  const queryClient = useQueryClient();
  // const { sendComment } = useSignalR()

  const mutation = useMutation({
    mutationFn: submitNestedComment,
    onSuccess: async (newComment) => {
      // sendComment(newComment,postId)
      const queryKey: QueryKey = ["comments", comment.parentId ?? comment.id];

      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<InfiniteData<PaginatedListOfCommentDto, string | null>>(
        queryKey,
        (oldData) => {
          const firstPage = oldData?.pages[0];
          if (firstPage) {
            return {
              pageParams: oldData.pageParams,
              pages: [
                {
                  pageNumber: firstPage.pageNumber,
                  items: [...firstPage.items, newComment],
                  totalPages: firstPage.totalPages,
                  totalCount: firstPage.totalCount + 1,
                  hasPreviousPage: firstPage.hasPreviousPage,
                  hasNextPage: firstPage.hasNextPage
                },
                ...oldData.pages.slice(1),
              ],
            };
          }
        },
      );

      queryClient.invalidateQueries({
        queryKey,
        predicate(query) {
          return !query.state.data;
        },
      });

      toast({
        description: "Đã bình luận",
        className: "bg-primary text-white"
      });
    },
    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Có lỗi xảy ra. Vui lòng thử lại",
      });
    },
  });

  return mutation;
}

export function useDeleteCommentMutation() {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: async (deletedComment) => {
      let queryKey: QueryKey;
      if(deletedComment.parentId){
        queryKey = ["comments", deletedComment.parentId]
      }else{
        queryKey = ["comments", deletedComment.postId];
      }

      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<InfiniteData<PaginatedListOfCommentDto, string | null>>(
        queryKey,
        (oldData) => {
          if (!oldData) return;

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              pageNumber: page.pageNumber,
              items: page.items.filter((c) => c.id !== deletedComment.id),
              totalPages: page.totalPages,
              totalCount: page.totalCount - 1,
              hasPreviousPage: page.hasPreviousPage,
              hasNextPage: page.hasNextPage,
            })),
          };
        },
      );

      toast({
        description: "Đã xóa bình luận",
        className: 'bg-primary text-white'
      });
    },
    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Đã xảy ra lỗi. Vui lòng thử lại",
      });
    },
  });

  return mutation;
}