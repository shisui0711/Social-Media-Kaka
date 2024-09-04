"use server"

import { getApiClient } from "@/lib/apiClient";
import { ChangeEmailValues, ChangePasswordValues, ChangePhoneNumberValues } from "@/lib/validation";
import { cookies } from 'next/headers';
import { redirect } from "next/navigation";

export async function ChangeEmail(values:ChangeEmailValues) : Promise<boolean>
{
  const token = cookies().get("token")?.value;
  if(!token) redirect('/sign-in')
  const client = await getApiClient(token)
  return await client.changeEmail(values);
}

export async function ChangePassowrd({oldPassword, newPassword}:ChangePasswordValues) : Promise<boolean>
{
  const token = cookies().get("token")?.value
  if(!token) redirect('/sign-in')
  const client = await getApiClient(token)
  return await client.changePassword({oldPassword,newPassword})
}

export async function ChangePhoneNumber(values:ChangePhoneNumberValues) : Promise<boolean>
{
  const token = cookies().get("token")?.value
  if(!token) redirect('/sign-in')
  const client = await getApiClient(token)
  return await client.changePhoneNumber(values)
}

export async function ChangeBirthDay(date:Date) : Promise<boolean>
{
  const token = cookies().get("token")?.value
  if(!token) redirect('/sign-in')
  const client = await getApiClient(token)
  return await client.changeBirthDay({birhtDay:date.toDateString()})
}