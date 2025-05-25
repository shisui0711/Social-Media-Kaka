import { cache } from "react";
import { Client, MyUserDto } from "./app/web-api-client";
import { cookies } from "next/headers";
import axios from "axios";

export const validateRequest = cache(
  async (): Promise<
    { user: MyUserDto; token: string } | { user: null; token: null }
  > => {
    const token = cookies().get("admin_token")?.value ?? null;
    if (!token) return { user: null, token: null };
    const client = new Client(
      process.env.NEXT_PUBLIC_BASE_API_URL,
      axios.create({
        headers: { Authorization: `Bearer ${token}` },
        transformResponse: (data) => data,
      })
    );

    try {
      const user = await client.getMyInfo();
      if (!user) return { user: null, token: null };
      return { user, token };
    } catch {
      return { user: null, token: null };
    }
  }
);
