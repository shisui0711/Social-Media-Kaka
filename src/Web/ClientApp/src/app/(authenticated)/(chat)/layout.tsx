"use server";

import Navbar from "@/components/Navbar";
import React from "react";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { validateRequest } from "@/auth";
import ListConversation from "@/components/messages/ListConversation";
import SearchMesssageButton from "@/components/messages/SearchMesssageButton";

export default async function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="py-3 flex w-full grow gap-5 fixed top-[5rem]">
        <div className="px-3 w-full">
          <div className="flex w-full min-w-0 gap-5">
            <section className="flex flex-col gap-3 w-[100px] sm:w-[400px] bg-card rounded-2xl p-4">
              <h1 className="sm:text-lg md:text-2xl font-bold hidden sm:block">
                Đoạn chat
              </h1>
              <SearchMesssageButton />
              <ListConversation />
            </section>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
