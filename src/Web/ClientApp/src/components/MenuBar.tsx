import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'
import { Home } from 'lucide-react'

const MenuBar = ({ className }: { className?:string }) => {
  return (
    <div className={className}>
      <Button
        variant='ghost'
        className='flex items-center justify-start gap-3'
      >
        <Link href='/'>
          <Home/>
          <span>Trang chủ</span>
        </Link>
      </Button>
    </div>
  )
}

export default MenuBar