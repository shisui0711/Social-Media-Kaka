"use server";
import React from "react";
import { redirect } from "next/navigation";
import { validateRequest } from "@/auth";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await validateRequest();
  if (user) redirect("/");
  return <div>{children}</div>;
}
