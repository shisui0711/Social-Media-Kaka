"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import UserAvatar from "../UserAvatar";
import { cn, calculateTimeDifference } from "@/lib/utils";
import { useAuthorization } from "@/providers/AuthorizationProvider";
import PostMoreButton from "./PostMoreButton";
import Linkify from "../Linkify";
import UserTooltip from "../UserTooltip";
import Image from "next/image";
import { Separator } from "../ui/separator";
import LikeButton from "./LikeButton";
import BookmarkButton from "./BookmarkButton";
import { MessageSquare } from "lucide-react";
import ListComment from "../comments/ListComment";
import ShareButton from "./ShareButton";
import { useSignalR } from "@/providers/SignalRProvider";
import { usePathname } from "next/navigation";
import { PostDto, PostMediaDto } from "@/app/web-api-client";

const PostComponent = ({ post }: { post: PostDto }) => {
  const { user } = useAuthorization();
  const { joinGroup, leaveGroup } = useSignalR();
  const [showComments, setShowComments] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/posts/")) {
      joinGroup(post.id);
      return () => {
        leaveGroup(post.id);
      };
    }
  }, [joinGroup, leaveGroup, pathname, post.id]);

  return (
    <article className="group/post space-y-3 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          <UserTooltip user={post.user}>
            <Link href={`/profile/${post.user?.userName}`}>
              <UserAvatar avatarUrl={post.user?.avatarUrl ?? undefined} />
            </Link>
          </UserTooltip>
          <div className="flex flex-col">
            <UserTooltip user={post.user}>
              <Link
                href={`/profile/${post.user?.userName}`}
                className="block font-medium hover:underline"
              >
                {post.user.displayName}
              </Link>
            </UserTooltip>
            <Link
              href={`/posts/${post.id}`}
              className="block text-sm text-muted-foreground hover:underline"
              suppressHydrationWarning
            >
              {calculateTimeDifference(post.created)}
            </Link>
          </div>
        </div>
        {post.user.id === user?.id && (
          <PostMoreButton
            post={post}
            className="opacity-0 transition-opacity group-hover/post:opacity-100"
          />
        )}
      </div>
      <Linkify>
        <div className="whitespace-pre-line break-words">{post.content}</div>
      </Linkify>
      {!!post.attachments.length && (
        <ListMediaPreview attachments={post.attachments} />
      )}
      <Separator />
      <div className="flex justify-between items-center gap-5">
        <LikeButton
          post={post}
          initialState={{
            likes: post.likes.length,
            isLikedByUser: post.likes.some((like) => like.userId === user.id),
          }}
        />
        <CommentButton
          post={post}
          onClick={() => setShowComments(!showComments)}
        />
        <ShareButton post={post} />
        <BookmarkButton
          postId={post.id}
          initialState={{
            isBookmarkedByUser: post.bookmarks.some(
              (bookmark) => bookmark.userId === user.id
            ),
          }}
        />
      </div>
      {showComments && <ListComment post={post} />}
    </article>
  );
};

export default PostComponent;

interface ListMediaPreviewProps {
  attachments: PostMediaDto[];
}

const ListMediaPreview = ({ attachments }: ListMediaPreviewProps) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        attachments.length > 1 && "sm:grid sm:grid-cols-2"
      )}
    >
      {attachments.map((media) => (
        <MediaPreview key={media.id} media={media} />
      ))}
    </div>
  );
};

interface MediaPreviewProps {
  media: PostMediaDto;
}

const MediaPreview = ({ media }: MediaPreviewProps) => {
  return (
    <>
      {media.type === "IMAGE" ? (
        <Image
          src={media.url}
          alt={media.id}
          width={500}
          height={500}
          className="mx-auto w-full max-h-[30rem] rounded-2xl"
        />
      ) : (
        <div>
          <video
            src={media.url}
            controls
            className="mx-auto rounded-2xl w-full max-h-[30rem]"
          />
        </div>
      )}
    </>
  );
};

interface CommentButtonProps {
  post: PostDto;
  onClick?: () => void;
}

function CommentButton({ post, onClick }: CommentButtonProps) {
  return (
    <button onClick={onClick} className="flex items-center gap-2">
      <MessageSquare className="size-5" />
      <span className="text-sm font-medium tabular-nums">
        {post.comments.length}{" "}
      </span>
    </button>
  );
}
