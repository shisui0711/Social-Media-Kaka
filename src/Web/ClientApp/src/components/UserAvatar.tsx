import React from 'react'
import { UserAvatarProps } from '@/types'
import Image from 'next/image'
import { cn } from '@/lib/utils'

const UserAvatar = ({ avatarUrl, size, className }:UserAvatarProps) => {
  return (
    <Image
      src={avatarUrl || '/images/user-placeholder.png'}
      alt="User avatar"
      width={size ?? 48}
      height={size ?? 48}
      className={cn(
        "aspect-square h-fit flex-none rounded-full bg-secondary object-cover",
        className,
      )}
    />
  )
}

export default UserAvatar