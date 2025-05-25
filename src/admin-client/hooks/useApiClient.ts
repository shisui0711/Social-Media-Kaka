import { Client } from "@/app/web-api-client";
import { useAuthorization } from "@/providers/AuthorizationProvider";
import axios from "axios";

export const useApiClient = () => {
  const { token } = useAuthorization();
  const client = ApiClient.getInstance(token);
  return client;
};
class ApiClient {
  private static instance: Client;
  public static getInstance(token: string): Client {
    if (!ApiClient.instance) {
      ApiClient.instance = new Client(
        process.env.NEXT_PUBLIC_BASE_API_URL,
        axios.create({
          headers: {
            Authorization: `Bearer ${token}`,
          },
          transformResponse: (data) => data,
        })
      );
    }
    return ApiClient.instance;
  }
}
