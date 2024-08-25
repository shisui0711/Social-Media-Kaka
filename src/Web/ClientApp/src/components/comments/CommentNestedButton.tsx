import { CommentDto } from '@/app/web-api-client'
import { MessageSquare } from 'lucide-react';
import React from 'react'

interface Props {
  comment: CommentDto;
  onClick?: () => void;
}

const CommentNestedButton = ({comment, onClick}:Props) => {
  return (
    <button onClick={onClick} className="flex items-center gap-2">
      <MessageSquare className="size-5" />
      <span className="text-sm font-medium tabular-nums">
        {comment.childrenComment.length}{" "}
      </span>
    </button>
  )
}

export default CommentNestedButton