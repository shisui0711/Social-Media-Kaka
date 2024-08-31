import RightSidebar from '@/components/RightSidebar'
import { Metadata } from 'next'
import React from 'react'
import SearchResults from './SearchResults'

export function generateMetadata({searchParams:{q}}:{searchParams: {q: string}}):Metadata{
  return {
    title: `${q} - Kết quả tìm kiếm`
  }
}

const SearchPage = ({searchParams:{q}}:{searchParams: {q: string}}) => {
  return (
    <main className='flex w-full min-w-0 gap-5'>
      <div className='w-full min-w-0 space-y-5'>
        <div className='rounded-2xl bg-card p-5 shadow-sm'>
          <h1 className='text-center text-2xl font-bold line-clamp-2 break-all'>Kết quả tìm kiếm cho &quot;{q}&quot;</h1>
        </div>
        <SearchResults query={q} />
      </div>
      <RightSidebar/>
    </main>
  )
}

export default SearchPage
