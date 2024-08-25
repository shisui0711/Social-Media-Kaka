'use client'

import useFollowerInfo from '@/app/hooks/useFollowerInfo'
import { FollowInfo } from '@/app/web-api-client'
import { formatNumber } from '@/lib/utils'
import React from 'react'

interface FollowerCountProps {
  userId: string,
  initialState: FollowInfo
}

const FollowerCount = ({userId,initialState }:FollowerCountProps) => {
  const { data } = useFollowerInfo(userId,initialState)

  return (
    <span>
      Người theo dõi:{" "}
      <span className='font-semibold'>{formatNumber(data.followers)}</span>
    </span>
  )
}

export default FollowerCount