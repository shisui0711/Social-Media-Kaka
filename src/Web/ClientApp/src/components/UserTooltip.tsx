"use client";

import Link from "next/link";
import { PropsWithChildren } from "react";
import FollowerCount from "./FollowerCount";
import Linkify from "./Linkify";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import UserAvatar from "./UserAvatar";
import { useAuthorization } from "@/providers/AuthorizationProvider";
import { FollowInfo, FriendInfo, UserDto } from "@/app/web-api-client";
import FriendCount from "./FriendCount";
import FriendButton from "./FriendButton";

interface UserTooltipProps extends PropsWithChildren {
  user: UserDto;
  className?: string;
}

export default function UserTooltip({ children, user, className }: UserTooltipProps) {
  const { user: signInUser } = useAuthorization();

  const followerState: FollowInfo = {
    followers: user?.followers?.length || 0,
    isFollowedByUser: !!user?.followers?.some(
      ({ followerId }) => followerId === signInUser.id,
    ),
  };

  const friendInfo: FriendInfo = {
    friends: user.friendRelationReceivers.filter(x=>x.accepted).length
    + user.friendRelationSenders.filter(x=>x.accepted).length,
    isSended: user.friendRelationReceivers.some(x=>x.senderId === signInUser.id),
    isFriend: user.friendRelationReceivers.some(x=>x.senderId === signInUser.id && x.accepted) ||
              user.friendRelationSenders.some(x=>x.receiverId === signInUser.id && x.accepted),
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent className={className}>
          <div className="flex max-w-80 flex-col gap-3 break-words px-1 py-2.5 md:min-w-52">
            <div className="flex items-center justify-between gap-2">
              <Link href={`/profile/${user.userName}`}>
                <UserAvatar size={70} avatarUrl={user.avatarUrl} />
              </Link>
              {signInUser.id !== user.id && (
                <FriendButton userId={user.id} initialState={friendInfo} />
              )}
            </div>
            <div>
              <Link href={`/profile/${user.userName}`}>
                <div className="text-lg font-semibold hover:underline">
                  {user.displayName}
                </div>
                <div className="text-muted-foreground">@{user.userName}</div>
              </Link>
            </div>
            {user.bio && (
              <Linkify>
                <div className="line-clamp-4 whitespace-pre-line">
                  {user.bio}
                </div>
              </Linkify>
            )}
            <FollowerCount userId={user.id} initialState={followerState} />
            <FriendCount userId={user.id} initialState={friendInfo}/>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}