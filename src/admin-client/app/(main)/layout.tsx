"use server";

import { validateRequest } from "@/auth";
import LeftSidebar from "@/components/LeftSideBar";
import Navbar from "@/components/Navbar";
import AuthorizationProvider from "@/providers/AuthorizationProvider";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
import { SignalRProvider } from "../../providers/SignalRProvider";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const token = cookies().get("admin_token")?.value;
  const { user } = await validateRequest();
  if (!token || !user) {
    redirect("/sign-in");
  }
  return (
    <AuthorizationProvider value={{ user: user, token: token }}>
      <SignalRProvider>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <div className="py-3 flex w-full grow gap-5 relative">
            <LeftSidebar />
            <div className="px-3 md:px-5 w-full overflow-y-auto">
              {children}
            </div>
          </div>
        </div>
      </SignalRProvider>
    </AuthorizationProvider>
  );
}
