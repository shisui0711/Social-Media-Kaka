import React from 'react'
import { Skeleton } from './ui/skeleton'

const FriendSuggestionSkeleton = () => {
  return (
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
  )
}

export default FriendSuggestionSkeleton