import React, { useEffect, useState } from "react";
import UserAvatar from "../UserAvatar";
import { calculateTimeDifference } from "@/lib/utils";
import LikeButton from "./LikeButton";
import BookmarkButton from "./BookmarkButton";
import { MessageSquare, View } from "lucide-react-native";
import ListComment from "../comments/ListComment";
import { Link, usePathname } from "expo-router";
import { useSignalR } from "../providers/SignalrProvider";
import { PostDto, PostMediaDto } from "@/lib/api-client";
import { Image, Text } from "react-native";
import ShareButton from "./ShareButton";
import { useUser } from "../providers/AuthorizationProvider";
import Separator from "../Separator";
import PostMoreButton from "./PostMoreButton";

const PostComponent = ({ post }: { post: PostDto }) => {
  const user = useUser();
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
    <View className="space-y-3 rounded-2xl bg-card p-5 shadow-sm">
      <View className="flex justify-between gap-3">
        <View className="flex flex-wrap gap-3">
          <Link href={`/profile/${post.user?.userName}`}>
            <UserAvatar avatarUrl={post.user?.avatarUrl} />
          </Link>
          <View className="flex flex-col">
            <Link
              href={`/profile/${post.user?.userName}`}
              className="block font-medium hover:underline"
            >
              {post.user.displayName}
            </Link>
            <Link
              href={`/posts/${post.id}`}
              className="block text-sm text-muted-foreground hover:underline"
              suppressHydrationWarning
            >
              {calculateTimeDifference(post.created)}
            </Link>
          </View>
        </View>
        {post.user.id === user?.id && <PostMoreButton post={post} />}
      </View>
      <Text className="whitespace-pre-line break-words">{post.content}</Text>
      {!!post.attachments.length && (
        <ListMediaPreview attachments={post.attachments} />
      )}
      <Separator />
      <View className="flex justify-between items-center gap-5">
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
      </View>
      {showComments && <ListComment post={post} />}
    </View>
  );
};

export default PostComponent;

interface ListMediaPreviewProps {
  attachments: PostMediaDto[];
}

const ListMediaPreview = ({ attachments }: ListMediaPreviewProps) => {
  return (
    <View
      className={`
        "flex flex-col gap-3",
        ${attachments.length > 1 && "grid grid-cols-2"}
      `}
    >
      {attachments.map((media) => (
        <MediaPreview key={media.id} media={media} />
      ))}
    </View>
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
          source={{
            uri: media.url,
          }}
          alt={media.id}
          className="mx-auto w-[500px] h-[500px] max-h-[30rem] rounded-2xl"
        />
      ) : (
        <View>
          <video
            src={media.url}
            controls
            className="mx-auto rounded-2xl w-full max-h-[30rem]"
          />
        </View>
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
