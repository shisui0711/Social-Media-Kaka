import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation'
import React from 'react'
import RecoveryForm from './RecoveryForm';

const RecoveryPage = ({searchParams:{token,email}}:{searchParams:{token:string,email:string}}) => {
  if(!token || !email) redirect("/sign-in");
  return (
    <main className="h-screen flex-center p-5">
      <div className="flex h-full max-h-[40rem] w-full max-w-[32rem] rounded-2xl overflow-hidden bg-card shadow-2xl">
        <div className="w-full space-y-10 overflow-y-auto p-10">
          <div className="space-y-1 text-center">
            <Image
              src="/icons/logo.png"
              alt="Logo"
              width={50}
              height={50}
              className="mx-auto"
            />
            <h1 className="text-3xl font-bold">Đặt lại mật khẩu</h1>
            <p className="text-muted-foreground">
              Thiết lập lại mật khẩu của bạn
            </p>
          </div>
          <RecoveryForm/>
          <Link
            href="/sign-in"
            className="block text-center hover:underline hover:text-blue-500"
          >
            Quay lại đăng nhập
          </Link>
        </div>
      </div>
    </main>
  )
}

export default RecoveryPage