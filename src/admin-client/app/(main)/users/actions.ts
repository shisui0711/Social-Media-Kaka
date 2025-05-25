"use server";

import { UserDto } from "@/app/web-api-client";
import { getApiClient } from "@/lib/apiClient";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function removeUser(id: string): Promise<UserDto> {
  const token = cookies().get("admin_token")?.value;
  if (!token) redirect("/sign-in");
  const client = getApiClient(token);
  const deletedUser = await client.removeUser(id).catch(() => {
    throw new Error("User not found");
  });
  return deletedUser;
}
