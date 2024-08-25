import { BASE_API_URL } from "@/app/app.config";
import { Client } from "@/app/web-api-client";
import axios from "axios";

export const getApiClient = (token: string): Client => {
  const client = new Client(
    BASE_API_URL,
    axios.create({
      headers: {
        Authorization: `Bearer ${token}`,
      },
      transformResponse: (data) => data,
    })
  );
  return client;
};
