
import { cookies } from "next/headers"
import { BASE_API_URL } from "./app/app.config"
import { Facebook, GitHub, Google } from "arctic";
import { cache } from "react";
import { Client, MyUserDto, } from "./app/web-api-client";
import axios from "axios";
import { parseStringify } from "./lib/utils";
import { OAuth2Client } from "oslo/oauth2";

export const validateRequest = cache(
  async(): Promise<
  {user:MyUserDto, token:string} | { user:null, token: null}
  > => {
    const token = cookies().get("token")?.value ?? null
    if(!token)
      return { user: null, token: null}
    const client = new Client(BASE_API_URL,axios.create({headers:{"Authorization":`Bearer ${token}`}, transformResponse: data=>data}))

    try {
      const user = parseStringify(await client.getMyInfo())
      if(!user) return { user: null, token: null}
      return { user, token }
    } catch (error) {
      return { user: null, token: null}
    }
  }
)

export const google = new Google(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback/google`
)

export const facebook = new Facebook(
  process.env.FACEBOOK_CLIENT_ID!,
  process.env.FACEBOOK_CLIENT_SECRET!,
  `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback/facebook`
)

export const github = new GitHub(
  process.env.GITHUB_CLIENT_ID!,
  process.env.GITHUB_CLIENT_SECRET!,
  {
    redirectURI: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback/github`
  }
)

export const zalo = new OAuth2Client(
  process.env.ZALO_CLIENT_ID!,
  process.env.ZALO_AUTHORIZE_ENDPOINT!,
  process.env.ZALO_TOKEN_ENDPOINT!,
  {
    redirectURI: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback/zalo`
  }
)