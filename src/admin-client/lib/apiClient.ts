import { Client } from "@/app/web-api-client";
import axios from "axios";

export const getApiClient = (token: string): Client => {
  const client = new Client(
    process.env.NEXT_PUBLIC_BASE_API_URL,
    axios.create({
      headers: {
        Authorization: `Bearer ${token}`,
      },
      transformResponse: (data) => data,
    })
  );
  return client;
};
