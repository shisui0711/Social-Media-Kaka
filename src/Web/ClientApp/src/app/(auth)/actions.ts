"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Client } from "../web-api-client"
import { BASE_API_URL } from "../app.config"
import axios from "axios"

export async function SignOut() {

  cookies().delete("token")
  cookies().delete("_kaka_refreshToken")
  redirect("/sign-in")
}

export const refreshSession = async () => {

  const token = cookies().get("_kaka_refreshToken")?.value
  const client = new Client(BASE_API_URL,axios.create({headers:{"Authorization":`Bearer ${token}`}, transformResponse: data=> data}))
  try {
    const data = await client.getRefreshToken()
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
    redirect("/");
  } catch (error) {

  }
}