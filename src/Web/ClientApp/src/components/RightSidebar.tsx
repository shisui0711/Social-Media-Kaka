"use server";
import { Loader } from "lucide-react";
import Link from "next/link";
import React, { Suspense } from "react";
import UserAvatar from "./UserAvatar";
import { cn, parseStringify } from "@/lib/utils";
import FollowButton from "./FollowButton";
import UserTooltip from "./UserTooltip";
import { TrendingTags } from "./TrendingTags";
import { cookies } from "next/headers";
import { validateRequest } from "@/auth";
import { Skeleton } from "./ui/skeleton";
import {  UserDto } from "@/app/web-api-client";
import { getApiClient } from "@/lib/apiClient";

const RightSidebar = () => {
  return (
    <div
      className={cn(
        "sticky self-start top-0 hidden h-fit w-72 flex-none space-y-5 lg:block lg:w-80"
      )}
    >
      <Suspense
        fallback={
          <>
            <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
              <div className="text-xl font-bold">Bạn có thể biết</div>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-[120px]" />
                    <Skeleton className="h-4 w-[60px]" />
                  </div>
                </div>
                <Skeleton className="h-10 w-[85px] rounded-2xl" />
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-[120px]" />
                    <Skeleton className="h-4 w-[60px]" />
                  </div>
                </div>
                <Skeleton className="h-10 w-[85px] rounded-2xl" />
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-[120px]" />
                    <Skeleton className="h-4 w-[60px]" />
                  </div>
                </div>
                <Skeleton className="h-10 w-[85px] rounded-2xl" />
              </div>
            </div>
            <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
              <div className="text-xl font-bold">Xu hướng</div>
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-4 w-[100px]" />
              </div>
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-4 w-[100px]" />
              </div>
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-4 w-[100px]" />
              </div>
            </div>
          </>
        }
      >
        <WhoToFollow />
        <TrendingTags />
      </Suspense>
    </div>
  );
};

export default RightSidebar;

async function WhoToFollow() {
  const { user: signedInUser } = await validateRequest();
  const token = cookies().get("token")?.value;
  if (!token || !signedInUser) return <Loader className="animate-spin mx-auto" />;
  const client = getApiClient(token);
  try {
    const usersToFollow: UserDto[] = parseStringify(await client.getSuggestionFollow());
    if (!usersToFollow) return <Loader className="animate-spin mx-auto" />;
    return (
      <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
        <div className="text-xl font-bold">Bạn có thể biết</div>
        {usersToFollow.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between gap-3"
          >
            <UserTooltip user={user}>
              <Link
                href={`/profile/${user.userName}`}
                className="flex gap-2 items-center"
              >
                <UserAvatar avatarUrl={user.avatarUrl} />
                <div className="flex flex-col">
                  <p className="line-clamp-1 break-all font-semibold hover:underline">
                    {user.displayName}
                  </p>
                  <p className="line-clamp-1 text-sm break-all text-muted-foreground">
                    @{user.userName}
                  </p>
                </div>
              </Link>
            </UserTooltip>
            <FollowButton
              userId={user.id}
              initialState={{
                followers: user.followers.length,
                isFollowedByUser: user.followers.some(
                  (x) => x.followerId === signedInUser.id
                ),
              }}
            />
          </div>
        ))}
      </div>
    );
  } catch (error) {
    return <Loader className="animate-spin mx-auto" />;
  }
}
