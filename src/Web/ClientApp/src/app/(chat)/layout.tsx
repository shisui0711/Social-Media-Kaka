"use server";

import Navbar from "@/components/Navbar";
import React from "react";
import AuthorizationProvider from "@/providers/AuthorizationProvider";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { validateRequest } from "@/auth";
import ListConversation from "@/components/messages/ListConversation";
import { SignalRProvider } from "@/providers/SignalRProvider";
import SearchMesssageButton from "@/components/messages/SearchMesssageButton";

export default async function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const token = cookies().get("token")?.value;
  const { user } = await validateRequest();
  if (!token || !user) {
    redirect("/sign-in");
  }
  return (
    <AuthorizationProvider value={{ user: user, token: token }}>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="py-3 flex w-full grow gap-5 relative">
          <div className="px-3 w-full overflow-y-auto">
            <div className="flex w-full min-w-0 gap-5">
              <SignalRProvider>
                <section className="flex flex-col gap-3 w-[100px] sm:w-[400px] bg-card rounded-2xl p-4">
                  <h1 className="sm:text-lg md:text-2xl font-bold hidden sm:block">
                    Đoạn chat
                  </h1>
                  <SearchMesssageButton />
                  <ListConversation />
                </section>
                {children}
              </SignalRProvider>
            </div>
          </div>
        </div>
      </div>
    </AuthorizationProvider>
  );
}
