import ListConversation from '@/components/messages/ListConversation'
import MessageContainer from '@/components/messages/MessageContainer'
import React from 'react'

const EmptyMessagePage = () => {
  return (
    <div className="flex-center w-full min-w-0 space-y-5 bg-card rounded-2xl h-[87vh]">
        <h1 className='text-2xl font-bold text-muted-foreground'>Chưa có tin nhắn nào</h1>
    </div>
  )
}

export default EmptyMessagePage