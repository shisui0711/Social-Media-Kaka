"use server"

import { validateRequest } from "@/auth";
import { updateUserProfileSchema, UpdateUserProfileValues } from "@/lib/validation";
import { cookies } from "next/headers";
import { getApiClient } from "@/lib/apiClient";
import { redirect } from "next/navigation";

export async function updateUserProfile(values:UpdateUserProfileValues){
  const validatedValues = updateUserProfileSchema.parse(values);

  const { user } = await validateRequest();
  const token = cookies().get("token")?.value;
  if(!token) redirect('/sign-in')
  const client = getApiClient(token);

  if(!user || !token) throw new Error("Not authenticated");
  if(user.userNameLastChange && new Date(user.userNameLastChange) > new Date(new Date().setDate(new Date().getDate() - 30))){
    throw new Error("Bạn chỉ có thể đổi username 1 lần trong 30 ngày")
  }


  const updatedUser = await client.updateMyProfile(validatedValues)
  .catch(()=>{
    throw new Error("User not found");
  })

  return updatedUser;
}