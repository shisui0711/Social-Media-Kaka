import { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'
import SignInForm from './SignInForm'
import GoogleSignInButton from './GoogleSignInButton'

export const metadata: Metadata = { title: "Đăng nhập" }

const Page = () => {
  return (
    <main className="h-screen flex-center p-5">
      <div className='flex h-full max-h-[40rem] w-full max-w-[32rem] rounded-2xl overflow-hidden bg-card shadow-2xl'>
        <div className='w-full space-y-10 overflow-y-auto p-10'>
          <div className='space-y-1 text-center'>
            <h1 className='text-3xl font-bold'>
              Đăng nhập vào Kaka
            </h1>
            <p className='text-muted-foreground'>
              Nơi giao lưu với mọi người
            </p>
          </div>
          <div className='space-y-5'>
            <SignInForm/>
            <div className='flex items-center gap-3'>
              <div className='h-px flex-1 bg-muted'/>
              <span>hoặc</span>
              <div className='h-px flex-1 bg-muted'/>
            </div>
            <GoogleSignInButton/>
            <Link href='/sign-up' className='block text-center hover:underline hover:text-blue-500'>
              Chưa có tài khoản? Đăng ký
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Page