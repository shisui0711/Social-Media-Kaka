import { useFriendInfo } from '@/hooks/mutations/user.mutations'
import { FriendInfo } from '@/lib/api-client'
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