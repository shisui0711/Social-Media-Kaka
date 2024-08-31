"use server";

import Navbar from "@/components/Navbar";
import React from "react";
import LeftSidebar from "@/components/LeftSidebar";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="py-3 flex w-full grow gap-5 relative">
        <LeftSidebar />
        <div className="px-3 md:px-5 w-full overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
