"use server";

import { PostDto } from "@/app/web-api-client";
import { getApiClient } from "@/lib/apiClient";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function removePost(id: string): Promise<PostDto> {
  const token = cookies().get("admin_token")?.value;
  if (!token) redirect("/sign-in");
  const client = getApiClient(token);
  const deletedPost = await client.removePostWithAdmin(id).catch(() => {
    throw new Error("Post not found");
  });
  return deletedPost;
}
