import { calculateTimeDifference } from "@/lib/utils";
import Link from "next/link";
import UserAvatar from "../UserAvatar";
import UserTooltip from "../UserTooltip";
import CommentMoreButton from "./CommentMoreButton";
import { useAuthorization } from "@/providers/AuthorizationProvider";
import { CommentDto } from "@/app/web-api-client";
import { Separator } from "../ui/separator";
import LikeCommentButton from "./LikeCommentButton";

interface CommentProps {
  comment: CommentDto;
}

export default function Comment({ comment }: CommentProps) {
  const { user } = useAuthorization();

  return (
    <div className="group/comment bg-background flex gap-3 py-3 rounded-2xl p-3">
      <div className="flex flex-col gap-2 w-full">
        <div className="flex items-center gap-2 text-sm">
          <span className="hidden sm:inline">
            <UserTooltip user={comment.user}>
              <Link href={`/users/${comment.user?.userName}`}>
                <UserAvatar avatarUrl={comment.user?.avatarUrl} size={40} />
              </Link>
            </UserTooltip>
          </span>
          <div className="flex flex-row md:flex-col gap-2 md:gap-0">
            <UserTooltip user={comment.user}>
              <Link
                href={`/users/${comment.user?.userName}`}
                className="font-medium hover:underline"
              >
                {comment.user?.displayName}
              </Link>
            </UserTooltip>
            <span className="text-muted-foreground">
              {calculateTimeDifference(comment.created)}
            </span>
          </div>
          {comment.user.id === user.id && (
            <CommentMoreButton
              comment={comment}
              className="ms-auto opacity-0 transition-opacity group-hover/comment:opacity-100"
            />
          )}
        </div>
        <Separator />
        <div>{comment.content}</div>
        <Separator />
        <div className="flex justify-between items-center gap-5">
          <LikeCommentButton
            comment={comment}
            initialState={{
              likes: comment.commentLikes.length,
              isLikedByUser: comment.commentLikes.some(
                (like) => like.userId === user.id
              ),
            }}
          />
          {/* <CommentButton
          post={post}
          onClick={() => setShowComments(!showComments)}
        /> */}
        </div>
      </div>
    </div>
  );
}
