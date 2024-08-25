'use server'

import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { getApiClient } from "@/lib/apiClient"

export async function deletePost(id: string){
  const token = cookies().get('token')?.value
  if(!token) redirect('/sign-in')
  const client = getApiClient(token);
  const deletedPost = await client.removePost(id)
    .catch(()=>{
      throw new Error('Post not found')
    })
  return deletedPost
}