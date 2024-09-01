import { zalo } from "@/auth";
import { generateCodeVerifier, generateState } from "arctic";
import { cookies } from "next/headers";

export async function GET(){
  const state = generateState();
  const codeVerifier = generateCodeVerifier();

  const url = await zalo.createAuthorizationURL({
    state,
    codeVerifier
  })

  url.searchParams.set("app_id",url.searchParams.get("client_id")!)
  url.searchParams.delete("client_id")

  console.log("Url:",url)

  cookies().set('state',state,{
    path:'/',
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: 'lax',
  })

  return Response.redirect(url)
}