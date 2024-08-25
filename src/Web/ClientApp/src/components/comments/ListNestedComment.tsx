
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { useSignalR } from "@/providers/SignalRProvider";
import { usePathname } from "next/navigation";
import { CommentDto } from "@/app/web-api-client";
import { useApiClient } from "@/app/hooks/useApiClient";
import CommentComponent from "./CommentComponent";
import CommentNestedInput from "./CommentNestedInput";

interface CommentsProps {
  comment: CommentDto;
}

export default function ListNestedComment({ comment }: CommentsProps) {
  const client = useApiClient();
  const [comments, setComments] = useState<CommentDto[]>([]);
  const { connection } = useSignalR()
  const pathname = usePathname()
  const { data, fetchNextPage, hasNextPage, isFetching, status } =
    useInfiniteQuery({
      queryKey: ["comments", comment.id],
      queryFn: ({ pageParam }) =>
        client.getCommentNestedWithPagination(comment.id, pageParam,5),
      initialPageParam: 1,
      getNextPageParam: (firstPage) => {
        return firstPage.hasNextPage
          ? firstPage.pageNumber + 1
          : undefined;
      },
      select: (data) => ({
        pages: [...data.pages].reverse(),
        pageParams: [...data.pageParams].reverse(),
      }),
      refetchOnWindowFocus: false,
      staleTime: Infinity
    });

  useEffect(() => {
    if (data) {
      const newComments = data.pages.flatMap((page) => page.items);
      setComments(newComments);
    }
  }, [data]);

  useEffect(() => {
    if (connection && pathname === `/post/${comment.postId}`) {
      const handleReceiveComment = (comment: CommentDto,) => {
        console.log("ReceiveComment")
        setComments(prevComments => [...prevComments, comment]);
      };
      connection.on("ReceiveComment", handleReceiveComment);
      return () => {
        connection.off("ReceiveComment",handleReceiveComment);
      }
    }
  }, [comment.postId, connection, pathname]);

  return (
    <div className="space-y-3">
      <CommentNestedInput comment={comment} />
      {hasNextPage && (
        <Button
          variant="link"
          className="mx-auto block"
          disabled={isFetching}
          hidden={!hasNextPage}
          onClick={() => fetchNextPage()}
        >
          Xem bình luận trước
        </Button>
      )}
      {status === "pending" && <Loader2 className="mx-auto animate-spin" />}
      {/* {status === "success" && !comments.length && (
        <p className="text-center text-muted-foreground">
          Chưa có bình luận nào. Hãy là người đầu tiên bình luận
        </p>
      )} */}
      {status === "error" && (
        <p className="text-center text-destructive">
          Đã xảy ra lỗi khi tải bình luận.
        </p>
      )}
      <div className="divide-y">
        {comments.map((comment) => (
          <CommentComponent key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
}
