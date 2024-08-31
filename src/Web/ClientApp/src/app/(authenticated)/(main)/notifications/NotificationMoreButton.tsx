import { Check, Ellipsis } from 'lucide-react'
import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import useNotification from '@/app/hooks/useNotification'
import { NotificationMarkAsReadEvent } from '@/events/NotificationMarkAsReadEvent'

const NotificationMoreButton = () => {
  const { markAsReadNotifications } = useNotification()

  return (
    <DropdownMenu>
  <DropdownMenuTrigger className='hover:bg-blue-300 p-2 rounded-2xl'><Ellipsis/></DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem onClick={()=>{
      markAsReadNotifications()
      window.dispatchEvent(NotificationMarkAsReadEvent)
    }}>
      <Check />
      <p>Đánh dấu tất cả là đã đọc</p>
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>

  )
}

export default NotificationMoreButton