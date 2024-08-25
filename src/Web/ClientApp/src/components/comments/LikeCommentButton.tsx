
import { cn } from "@/lib/utils";
import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { ArrowBigUp } from "lucide-react";
import { useToast } from "../ui/use-toast";
import { useAuthorization } from "@/providers/AuthorizationProvider";
import { useSignalR } from "@/providers/SignalRProvider";
import { useApiClient } from "@/app/hooks/useApiClient";
import { CommentDto, LikeInfo } from "@/app/web-api-client";

interface Props {
  comment: CommentDto;
  initialState: LikeInfo;
}

export default function LikeCommentButton({ comment, initialState }: Props) {
  const { user } = useAuthorization()
  const client = useApiClient()
  const { toast } = useToast();

  const { sendNotification } = useSignalR();

  const queryClient = useQueryClient();

  const queryKey: QueryKey = ["comment-like-info", comment.id];

  const { data } = useQuery({
    queryKey,
    queryFn: () => client.getCommentLikeInfo(comment.id),
    initialData: initialState,
    staleTime: Infinity,
  });

  const { mutate } = useMutation({
    mutationFn: () =>
      data.isLikedByUser
        ? client.unLikeComment(comment.id)
        : client.likeComment(comment.id),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });

      const previousState = queryClient.getQueryData<LikeInfo>(queryKey);

      queryClient.setQueryData<LikeInfo>(queryKey, () => ({
        likes:
          (previousState?.likes || 0) + (previousState?.isLikedByUser ? -1 : 1),
        isLikedByUser: !previousState?.isLikedByUser,
      }));

      return { previousState };
    },
    onSuccess(){
      if(data.isLikedByUser && comment.userId !== user.id){
        sendNotification(comment.userId, `${user.displayName} đã thích bình luận của bạn`)
      }
    },
    onError(error, variables, context) {
      queryClient.setQueryData(queryKey, context?.previousState);
      console.error(error);
      toast({
        variant: "destructive",
        description: "Có lỗi xảy ra. Vui lòng thử lại",
      });
    },
  });

  return (
    <button onClick={() => mutate()} className="flex items-center gap-2">
      <div className="rounded hover:bg-blue-300">
      <ArrowBigUp
        className={cn(
          "size-6 hover:text-blue-500",
          data.isLikedByUser && "fill-blue-500 text-blue-500",
        )}
      />
      </div>
      <span className="text-sm font-medium tabular-nums">
        {data.likes}
      </span>
    </button>
  );
}