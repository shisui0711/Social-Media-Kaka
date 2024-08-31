
import { google } from "@/auth";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { Client, SwaggerException } from "@/app/web-api-client";
import { BASE_API_URL } from "@/app/app.config";
import axios from "axios";

export async function GET(req: NextRequest){
  const code = req.nextUrl.searchParams.get('code')
  const state = req.nextUrl.searchParams.get('state')

  const storedState = cookies().get('state')?.value
  const storedCodeVerifier = cookies().get('code_verifier')?.value

  if(
    !code || !state || !storedState || !storedCodeVerifier || state !== storedState
  ){
    return new Response(null,{status:400})
  }

  try {
    const tokens = await google.validateAuthorizationCode(code,storedCodeVerifier)

    const client = new Client(BASE_API_URL,axios.create({transformResponse: (data) => data}));
    var data = await client.googleSignIn({idToken: tokens.idToken});

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

    return new Response(null,{
      status: 302,
      headers: {
        Location: '/'
      }
    })

  } catch (error) {
    console.log(error)
    if(error instanceof SwaggerException && error.status === 401){
      return new Response(null,{status:401})
    }
    return new Response(null,{status:500})
  }
}