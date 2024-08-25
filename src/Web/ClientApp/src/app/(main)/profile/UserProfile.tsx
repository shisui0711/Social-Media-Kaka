"use server"

import FollowButton from "@/components/FollowButton";
import FollowerCount from "@/components/FollowerCount";
import { Separator } from "@/components/ui/separator";
import UserAvatar from "@/components/UserAvatar";
import { formatNumber } from "@/lib/utils";
import React from "react";
import EditProfileButton from "./[username]/EditProfileButton";
import Linkify from "@/components/Linkify";
import { FollowInfo, UserDto } from "@/app/web-api-client";

interface UserProfileProps {
  user: UserDto;
  signedInUserId: string;
}

const UserProfile = async ({ user, signedInUserId }: UserProfileProps) => {
  const followerInfo: FollowInfo = {
    followers: user.followers.length,
    isFollowedByUser: user.followers.some(
      (follower) => follower.followerId === signedInUserId
    ),
  };
  return (
    <div className="h-fit w-full space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <UserAvatar
        size={250}
        avatarUrl={user.avatarUrl}
        className="mx-auto size-full max-h-60 max-w-60 rounded-full"
      />
      <div className="flex flex-wrap gap-3 md:flex-nowrap">
        <div className="me-auto space-y-3">
          <div>
            <h1 className="text-3xl font-bold">{user.displayName}</h1>
            <p className="text-muted-foreground">@{user.userName}</p>
          </div>
          <div className="flex items-center gap-3">
            <span>
              Bài viết:{" "}
              <span className="font-semibold">
                {formatNumber(user.posts.length)}
              </span>
            </span>
            <FollowerCount userId={user.id} initialState={followerInfo} />
          </div>
        </div>
        {user.id === signedInUserId ? (
          <EditProfileButton user={user} />
        ) : (
          <FollowButton userId={user.id} initialState={followerInfo} />
        )}
      </div>
      {user.bio && (
        <Linkify>
          <Separator />
          <div className="whitespace-pre-line break-words overflow-hidden">
            {user.bio}
          </div>
        </Linkify>
      )}
    </div>
  );
};

export default UserProfile;
