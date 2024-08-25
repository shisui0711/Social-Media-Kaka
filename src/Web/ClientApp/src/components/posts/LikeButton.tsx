
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
import { LikeInfo, PostDto } from "@/app/web-api-client";

interface LikeButtonProps {
  post: PostDto;
  initialState: LikeInfo;
}

export default function LikeButton({ post, initialState }: LikeButtonProps) {
  const { user } = useAuthorization()
  const client = useApiClient()
  const { toast } = useToast();

  const { sendNotification } = useSignalR();

  const queryClient = useQueryClient();

  const queryKey: QueryKey = ["like-info", post.id];

  const { data } = useQuery({
    queryKey,
    queryFn: () => client.getLikeInfo(post.id),
    initialData: initialState,
    staleTime: Infinity,
  });

  const { mutate } = useMutation({
    mutationFn: () =>
      data.isLikedByUser
        ? client.unlikePost(post.id)
        : client.likePost(post.id),
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
      if(data.isLikedByUser && post.userId !== user.id){
        sendNotification(post.userId, `${user.displayName} đã thích bài viết của bạn`)
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