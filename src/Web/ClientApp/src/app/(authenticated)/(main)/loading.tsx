import PostsLoadingSkeleton from "@/components/posts/PostsLoadingSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const Loading = () => {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <div className="flex flex-col gap-5 rounded-2xl bg-card p-5 shadow-sm">
          <div className="flex gap-5 items-center">
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-10 w-[250px]" />
          </div>
        </div>
        <div className="w-full bg-card flex">
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
        </div>
        <PostsLoadingSkeleton/>
      </div>
    </main>
  );
};

export default Loading;
