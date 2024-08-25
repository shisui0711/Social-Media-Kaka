import React from "react";
import { Skeleton } from "../ui/skeleton";

const PostsLoadingSkeleton = () => {
  return (
    <div className="space-y-5">
      <PostSkeleton />
      <PostSkeleton />
      <PostSkeleton />
    </div>
  );
};

export default PostsLoadingSkeleton;

export const PostSkeleton = () => {
  return (
    <div className="w-full animate-pulse space-y-3 rounded-2xl bg-card shadow-sm p-4">
      <div className="flex flex-wrap gap-3">
        <Skeleton className="size-12 rounded-full" />
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-4 w-24 rounded" />
        </div>
      </div>
      <Skeleton className="h-16 rounded-2xl" />
    </div>
  );
};
