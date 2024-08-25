import { Metadata } from 'next'
import React from 'react'
import Bookmarks from './Bookmarks'
import RightSidebar from '@/components/RightSidebar'

const metadata: Metadata = {
  title: "Đã lưu"
}

const BookMarkPage = () => {
  return (
    <main className='flex w-full min-w-0 gap-5'>
      <div className='w-full min-w-0 space-y-5'>
        <div className='rounded-2xl bg-card p-5 shadow-sm'>
          <h1 className='text-center text-2xl font-bold'>Đã lưu</h1>
        </div>
        <Bookmarks/>
      </div>
      <RightSidebar/>
    </main>
  )
}

export default BookMarkPage