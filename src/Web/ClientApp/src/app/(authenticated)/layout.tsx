"use server";

import React from "react";
import AuthorizationProvider from "@/providers/AuthorizationProvider";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { validateRequest } from "@/auth";
import RealTimeProvder from "@/providers/RealTimeProvder";

export default async function AuthenticatedLayout({
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
      <RealTimeProvder>{children}</RealTimeProvder>
    </AuthorizationProvider>
  );
}
