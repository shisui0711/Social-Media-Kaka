import { MessageDto } from '@/app/web-api-client'
import { cn } from '@/lib/utils'
import { useAuthorization } from '@/providers/AuthorizationProvider'
import React from 'react'

interface Props {
  message : MessageDto
}

const MessageComponent = ({message}:Props) => {
  const { user } = useAuthorization()
  return (
    <div className={cn('h-12 w-fit max-w-[150px] md:max-w-[220px] lg:max-w-[300px] rounded-2xl p-3',
      user.id === message.senderId ? 'self-end bg-primary text-white' : 'self-start bg-background text-foreground'
    )}>
      {message.content}
    </div>
  )
}

export default MessageComponent