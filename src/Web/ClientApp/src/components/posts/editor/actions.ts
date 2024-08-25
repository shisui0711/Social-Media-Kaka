"use server"

import { CreatePostValues } from "@/lib/validation";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getApiClient } from "@/lib/apiClient";

export async function submitPost(input:CreatePostValues) {

  const token = cookies().get("token")?.value
  if(!token) redirect("/sign-in")
  const client = getApiClient(token)
  try {
    const post = await client.createPost(input)
    return post
  } catch (error) {
    console.log(error)
    throw error;
  }
}