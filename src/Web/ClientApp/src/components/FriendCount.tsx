'use client'

import useFriendInfo from '@/app/hooks/useFriendInfo'
import { FriendInfo } from '@/app/web-api-client'
import { formatNumber } from '@/lib/utils'
import React from 'react'

interface Props {
  userId: string,
  initialState: FriendInfo
}

const FriendCount = ({userId,initialState }:Props) => {
  const { data } = useFriendInfo(userId,initialState)

  return (
    <span>
      Bạn bè:{" "}
      <span className='font-semibold'>{formatNumber(data.friends)}</span>
    </span>
  )
}

export default FriendCount