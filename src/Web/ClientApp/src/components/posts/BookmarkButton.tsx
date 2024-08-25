
import { cn } from "@/lib/utils";
import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Bookmark } from "lucide-react";
import { useToast } from "../ui/use-toast";
import { BookmarkInfo } from "@/app/web-api-client";
import { useApiClient } from "@/app/hooks/useApiClient";

interface BookmarkButtonProps {
  postId: string;
  initialState: BookmarkInfo;
}

export default function BookmarkButton({ postId, initialState }: BookmarkButtonProps) {
  const { toast } = useToast();

  const queryClient = useQueryClient();
  const client = useApiClient();

  const queryKey: QueryKey = ["bookmark-info", postId];

  const { data,status } = useQuery({
    queryKey,
    queryFn: () =>  client.getBookmarkInfo(postId),
    initialData: initialState,
    staleTime: Infinity
  });

  const { mutate } = useMutation({
    mutationFn: () =>
      data.isBookmarkedByUser
        ? client.unBookmarkPost(postId)
        : client.bookmarkPost(postId),
    onMutate: async () => {
      toast({
        title: `Đã${!data.isBookmarkedByUser ? "": " hủy"} đánh dấu bài viết `,
        className: 'bg-primary text-white',
      })
      await queryClient.cancelQueries({ queryKey });

      const previousState = queryClient.getQueryData<BookmarkInfo>(queryKey);

      queryClient.setQueryData<BookmarkInfo>(queryKey, () => ({
          isBookmarkedByUser: !previousState?.isBookmarkedByUser,
      }));

      return { previousState };
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
      <Bookmark
        className={cn(
          "size-6 hover:text-blue-500",
          data.isBookmarkedByUser && "fill-blue-500 text-blue-500",
        )}
      />
      </div>
    </button>
  );
}