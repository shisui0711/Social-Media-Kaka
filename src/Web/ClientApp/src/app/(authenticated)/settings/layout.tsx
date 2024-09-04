"use server";

import Navbar from "@/components/Navbar";
import React from "react";
import AuthorizationProvider from "@/providers/AuthorizationProvider";
import { redirect } from "next/navigation";
import { validateRequest } from "@/auth";
import SettingBar from "./SettingBar";

export default async function SettingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, token } = await validateRequest();
  if (!token || !user) {
    redirect("/sign-in");
  }
  return (
    <AuthorizationProvider value={{ user: user, token: token }}>
      <div className="flex min-h-screen flex-col ">
        <Navbar />
        <div className="py-3 flex w-full grow gap-5 relative md:container">
          <div className="px-3 w-full overflow-y-auto">
            <div className="relative flex flex-col md:flex-row w-full min-w-0 gap-5">
              <SettingBar/>
              <div className="md:ml-5 w-full min-w-0 bg-card rounded-2xl p-5">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthorizationProvider>
  );
}
