"use server";

import { SignInValues } from "@/lib/validation";
import { isRedirectError } from "next/dist/client/components/redirect";
import { BASE_API_URL } from "../../app.config";
import { Client, SignInCommand, SwaggerException } from "@/app/web-api-client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import axios, { isAxiosError } from "axios";

export async function SignIn(
  credentials: SignInValues
): Promise<{ error?: string }>  {
  try {
    const client = new Client(BASE_API_URL,axios.create({transformResponse: (data) => data}))
    const data = await client.signIn(credentials)
    cookies().set("token",data.token!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    })
    cookies().set("_kaka_refreshToken",data.refreshToken!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })
    redirect("/")
  } catch (error:any) {
    if (isRedirectError(error)) throw error;
    if(error instanceof SwaggerException && error.status === 404){
      return { error: "Tên người dùng không tồn tại"}
    }else if(error instanceof SwaggerException && error.status === 401){
      return { error: "Mật khẩu không đúng"}
    }
    console.log("Error throwed when sign in", error);
    return { error: error.message};
  }
}

export const SendVerifyEmail = async (username: string) => {
  try {
    const response = await fetch(`${BASE_API_URL}/auth/email/resend?email=${username}`)
    if(response.status === 404){
      return { error: "Email không tồn tại" }
    }
    else if(response.status === 400){
      return { error: "Email không hợp lệ" }
    }
    return { error: undefined}
  } catch (error) {
    return { error: "Có lỗi xảy ra. Vui lòng thử lại"}
  }
}

