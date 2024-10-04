"use server";

import { SignInValues } from "@/lib/validation";
import { isRedirectError } from "next/dist/client/components/redirect";
import { BASE_API_URL } from "../../app.config";
import { Client, SwaggerException } from "@/app/web-api-client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import axios from "axios";

export async function SignIn(
  credentials: SignInValues
): Promise<{ error?: string }> {
  try {
    const client = new Client(
      BASE_API_URL,
      axios.create({ transformResponse: (data) => data })
    );
    const data = await client.signIn(credentials);
    cookies().set("token", data.token!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });
    cookies().set("_kaka_refreshToken", data.refreshToken!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    redirect("/");
  } catch (error: any) {
    console.log("Error throwed when sign in", error);
    if (isRedirectError(error)) throw error;
    if (error instanceof SwaggerException && error.status === 404) {
      return { error: "Tên người dùng không tồn tại" };
    } else if (error instanceof SwaggerException && error.status === 401) {
      return { error: "Mật khẩu không đúng" };
    }
    return { error: error.message };
  }
}
