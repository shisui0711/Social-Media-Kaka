import { github } from "@/auth";
import { generateState } from "arctic";
import { cookies } from "next/headers";

export async function GET(){
  const state = generateState();

  const url = await github.createAuthorizationURL(state,{
    scopes: ["user:email","read:user"]
  })


  cookies().set('state',state,{
    path:'/',
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: 'lax',
  })

  return Response.redirect(url)
}