import React from 'react'
import { Skeleton } from '../ui/skeleton'

const MessagesSkeleton = () => {
  return (
    <div className='size-full flex flex-col space-y-3'>
      <Skeleton className="h-12 w-[150px] md:w-[220px] lg:w-[300px]" />
      <Skeleton className="h-12 w-[150px] md:w-[220px] lg:w-[300px] self-end" />
      <Skeleton className="h-12 w-[150px] md:w-[220px] lg:w-[300px]" />
      <Skeleton className="h-12 w-[150px] md:w-[220px] lg:w-[300px] self-end" />
      <Skeleton className="h-12 w-[150px] md:w-[220px] lg:w-[300px]" />
      <Skeleton className="h-12 w-[150px] md:w-[220px] lg:w-[300px] self-end" />
      <Skeleton className="h-12 w-[150px] md:w-[220px] lg:w-[300px]" />
      <Skeleton className="h-12 w-[150px] md:w-[220px] lg:w-[300px] self-end" />
      <Skeleton className="h-12 w-[150px] md:w-[220px] lg:w-[300px]" />
      <Skeleton className="h-12 w-[150px] md:w-[220px] lg:w-[300px] self-end" />
    </div>
  )
}

export default MessagesSkeleton