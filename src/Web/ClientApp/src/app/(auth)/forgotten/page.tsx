import Image from "next/image";
import React from "react";
import ForgottenForm from "./ForgottenForm";
import Link from "next/link";

const ForgottenPage = () => {
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
            <h1 className="text-3xl font-bold">Quên mật khẩu</h1>
            <p className="text-muted-foreground">
              Hãy nhập email để khôi phục mật khẩu
            </p>
          </div>
          <ForgottenForm />
          <Link
            href="/sign-in"
            className="block text-center hover:underline hover:text-blue-500"
          >
            Quay lại đăng nhập
          </Link>
        </div>
      </div>
    </main>
  );
};

export default ForgottenPage;
