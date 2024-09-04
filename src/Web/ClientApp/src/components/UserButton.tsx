"use client"

import { useAuthorization } from '@/providers/AuthorizationProvider'
import React, { useState } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'
import UserAvatar from './UserAvatar'
import Link from 'next/link'
import { LogOut, Settings, User2 } from 'lucide-react'
import { SignOut } from '@/app/(auth)/actions'
import { useQueryClient } from '@tanstack/react-query'


const UserButton = ({ className }: { className?:string }) => {
  const { user } = useAuthorization()
  const [open,setOpen] = useState(false)

  const queryClient = useQueryClient()

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button className='outline-none'>
          <UserAvatar avatarUrl={user.avatarUrl}/>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Link href={`/profile/${user.userName}`} className='flex gap-2'
            onClick={()=>setOpen(false)}
          >
            <User2 className='size-4'/>
            Trang cá nhân
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href={`/settings/information`} className='flex gap-2'
            onClick={()=>setOpen(false)}
          >
            <Settings className='size-4'/>
            Cài đặt
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator/>
        <DropdownMenuItem className='flex gap-2' onClick={()=>{
          queryClient.clear();
          SignOut();
          }}>
          <LogOut />
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserButton