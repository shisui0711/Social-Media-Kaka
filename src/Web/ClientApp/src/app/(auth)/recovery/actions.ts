"use server"

import { BASE_API_URL } from "@/app/app.config";
import { Client } from "@/app/web-api-client";
import axios from "axios";

interface RecoveryPasswordParams
{
  email: string,
  token: string,
  newPassword: string
}

export async function RecoveryPassword({email,token,newPassword}:RecoveryPasswordParams)
{
  const client = new Client(BASE_API_URL,axios.create({transformResponse: (data) => data}))
  return await client.recoveryPassword({email,token,newPassword})
}