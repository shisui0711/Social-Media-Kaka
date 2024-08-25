"use client"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import React, { useState } from 'react'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'


const ReactQueryProvider = ({ children }: { children: React.ReactNode }) => {
  const [client] = useState(new QueryClient())

  return <QueryClientProvider client={client} >
    {children}
    <ReactQueryDevtools initialIsOpen={false}/>
  </QueryClientProvider>
}
export default ReactQueryProvider