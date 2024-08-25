import React from "react";
import { Skeleton } from "../ui/skeleton";

const ConversationSkeleton = () => {
  return (
    <div className="space-y-3">
      <div className="w-full animate-pulse space-y-3 rounded-2xl bg-card shadow-sm p-4">
        <div className="flex flex-wrap gap-3">
          <Skeleton className="size-8 md:size-12 rounded-full" />
          <div className="space-y-1.5 hidden md:block">
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-4 w-24 rounded" />
          </div>
        </div>
      </div>
      <div className="w-full animate-pulse space-y-3 rounded-2xl bg-card shadow-sm p-4">
        <div className="flex flex-wrap gap-3">
          <Skeleton className="size-8 md:size-12 rounded-full" />
          <div className="space-y-1.5 hidden md:block">
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-4 w-24 rounded" />
          </div>
        </div>
      </div>
      <div className="w-full animate-pulse space-y-3 rounded-2xl bg-card shadow-sm p-4">
        <div className="flex flex-wrap gap-3">
          <Skeleton className="size-8 md:size-12 rounded-full" />
          <div className="space-y-1.5 hidden md:block">
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-4 w-24 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationSkeleton;
