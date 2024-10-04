import { Client, MyUserDto } from "@/lib/api-client";
import { tokenCache } from "@/lib/auth";
import axios from "axios";
import { create } from "zustand";

export const useApiClient = create<{ client: Client }>(() => ({
  client: new Client(
    `${process.env.EXPO_PUBLIC_BASE_API_URL}`,
    axios.create({ transformResponse: (data) => data })
  ),
}));

export const useAuthorizeApiClient = create<{ client: Client }>(() => ({
  client: new Client(
    `${process.env.EXPO_PUBLIC_BASE_API_URL}`,
    axios.create({
      headers: {
        Authorization: `Bearer ${tokenCache.getToken("access")}`,
      },
      transformResponse: (data) => data,
    })
  ),
}));
