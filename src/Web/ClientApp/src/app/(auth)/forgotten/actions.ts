"use server"

import { BASE_API_URL } from "@/app/app.config";
import { Client } from "@/app/web-api-client";
import { ForgottenValues } from "@/lib/validation";
import axios from "axios";

export async function ForgottenPassword(credentials: ForgottenValues)
{
  const client = new Client(BASE_API_URL,axios.create({transformResponse: (data) => data}))
  await client.forgottenPassword(credentials)
}