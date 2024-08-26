import { useAuthorization } from "@/providers/AuthorizationProvider"
import { BASE_API_URL } from "../app.config"
import { Client } from "../web-api-client"
import axios from "axios"

export const useApiClient = () => {
  const {token} = useAuthorization()
  const client = ApiClient.getInstance(token);
  return client;
}
class ApiClient {
  private static instance: Client;
  public static getInstance(token:string): Client {
    if (!ApiClient.instance) {
      ApiClient.instance = new Client(BASE_API_URL,axios.create({
        headers: {
          Authorization: `Bearer ${token}`
        },
        transformResponse: data => data
      }));
    }
    return ApiClient.instance;
  }
}