import { CommentDto } from "@/app/web-api-client";
import React, { useState } from "react";
import UserTooltip from "../UserTooltip";
import Link from "next/link";
import UserAvatar from "../UserAvatar";
import LikeCommentButton from "./LikeCommentButton";
import { useAuthorization } from "@/providers/AuthorizationProvider";
import { calculateTimeDifference, cn } from "@/lib/utils";
import CommentNestedButton from "./CommentNestedButton";
import ListNestedComment from "./ListNestedComment";
import CommentMoreButton from "./CommentMoreButton";

const CommentComponent = ({ comment }: { comment: CommentDto }) => {
  const { user } = useAuthorization();
  const [showComments, setShowComments] = useState(false);

  return (
    <article className="flex flex-col rounded-xl p-7">
      <div className="flex gap-3">
          <div className="flex flex-col items-center relative">
            <UserTooltip user={comment.user}>
              <Link href={`/profile/${comment.user?.userName}`}>
                <UserAvatar avatarUrl={comment.user?.avatarUrl} size={40} />
              </Link>
            </UserTooltip>
              <div className={cn("hidden absolute -left-[60px] top-5 w-10 h-0.5 bg-neutral-800",
                comment.parentId && 'block'
              )}/>
            <div className={cn("hidden relative mt-2 w-0.5 mb-32 grow rounded-full bg-neutral-800",
              comment.childrenComment.length > 0 && showComments && 'block')} />
          </div>
          <div className="flex flex-col">
            <div className="bg-background p-3 rounded-2xl">
              <Link
                href={`profile/${comment.user.userName}`}
                className="w-fit flex gap-2 items-center"
              >
                <h4 className="cursor-pointer font-semibold hover:underline">
                  {comment.user.displayName}
                </h4>
                <p className="text-[12px] text-muted-foreground">
                  {calculateTimeDifference(comment.created)}
                </p>
              </Link>
              <p className="mt-2 text-sm">{comment.content}</p>
            </div>
            <div className="my-3 flex flex-col gap-3">
              <div className="flex gap-3.5">
                <LikeCommentButton
                  comment={comment}
                  initialState={{
                    likes: comment.commentLikes.length,
                    isLikedByUser: comment.commentLikes.some(
                      (like) => like.userId === user.id
                    ),
                  }}
                />
                <CommentNestedButton comment={comment} onClick={()=> setShowComments(!showComments)} />
              </div>
            </div>
            {showComments && <ListNestedComment comment={comment} />}
          </div>
          {comment.userId === user.id && <CommentMoreButton comment={comment} />}
        </div>
    </article>
  );
};

export default CommentComponent;
