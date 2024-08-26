"use server";
import React, { Suspense } from "react";
import { cn } from "@/lib/utils";
import { TrendingTags } from "./TrendingTags";
import { Skeleton } from "./ui/skeleton";
import FriendSuggestion from "./FriendSuggesstion";

const RightSidebar = () => {
  return (
    <div
      className={cn(
        "fixed top-[5.8rem] right-5 h-fit hidden w-72 flex-none space-y-5 lg:block lg:w-80"
      )}
    >
      <FriendSuggestion />
      <Suspense
        fallback={
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
        }
      >
        <TrendingTags />
      </Suspense>
    </div>
  );
};

export default RightSidebar;

