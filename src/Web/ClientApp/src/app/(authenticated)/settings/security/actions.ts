"use server";

import { getApiClient } from "@/lib/apiClient";
import { ChangePasswordValues } from "@/lib/validation";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function ChangePassowrd({
  oldPassword,
  newPassword,
}: ChangePasswordValues): Promise<boolean> {
  const token = cookies().get("token")?.value;
  if (!token) redirect("/sign-in");
  const client = await getApiClient(token);
  return await client.changePassword({ oldPassword, newPassword });
}

export async function CheckPassword(password: string): Promise<boolean> {
  const token = cookies().get("token")?.value;
  if (!token) redirect("/sign-in");
  const client = await getApiClient(token);
  return await client.checkPassword({ password });
}

export async function GenerateTwoFactor() {
  const token = cookies().get("token")?.value;
  if (!token) redirect("/sign-in");
  const client = await getApiClient(token);
  return await client.generateTwoFactorToken();
}

export async function VerifyTwoFactor(otp: string) {
  const token = cookies().get("token")?.value;
  if (!token) redirect("/sign-in");
  const client = await getApiClient(token);
  return await client.verifyTwoFactorToken({ token: otp });
}

export async function DisableTwoFactor(){
  const token = cookies().get("token")?.value;
  if (!token) redirect("/sign-in");
  const client = await getApiClient(token);
  return await client.disableTwoFactor();
}
