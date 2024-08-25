"use server";
import { BASE_API_URL } from "@/app/app.config";
import { Client } from "@/app/web-api-client";
import { signUpSchema, SignUpValues } from "@/lib/validation";
import { isRedirectError } from "next/dist/client/components/redirect";
import { redirect } from "next/navigation";

export async function signUp(
  credentials: SignUpValues
): Promise<{ error: string }> {
  try {
    const { password, repassword } = signUpSchema.parse(credentials);

    if(password !== repassword) return { error: "Mật khẩu không khớp" };
    const client = new Client(BASE_API_URL)
    await client.signUp(credentials)
    redirect("/sign-in");
  } catch (error:any) {
    if(isRedirectError(error)) throw error;
    console.log("Error throwed while sign up: ", error);
    return {
      error: error.message
    };
  }
}
