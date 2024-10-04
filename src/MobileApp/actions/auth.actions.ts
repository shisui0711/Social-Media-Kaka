import { Client, SwaggerException } from "@/lib/api-client";
import { tokenCache } from "@/lib/auth";
import { SignInValues } from "@/lib/validation";
import axios from "axios";

export const refreshSession = async () => {
  const token = tokenCache.getToken("access");
  const client = new Client(
    `${process.env.EXPO_PUBLIC_BASE_API_URL}`,
    axios.create({
      headers: { Authorization: `Bearer ${token}` },
      transformResponse: (data) => data,
    })
  );
  try {
    const data = await client.getRefreshToken();
    tokenCache.saveToken("access", data.token);
    tokenCache.saveToken("refresh", data.refreshToken);
    return true;
  } catch (error) {
    return false;
  }
};

export async function SignIn(
  credentials: SignInValues
): Promise<{ error?: string | null }> {
  try {
    const client = new Client(
      `${process.env.EXPO_PUBLIC_BASE_API_URL}`,
      axios.create({ transformResponse: (data) => data })
    );
    const data = await client.signIn(credentials);
    tokenCache.saveToken("access", data.token);
    tokenCache.saveToken("refresh", data.refreshToken);
    return { error: null };
  } catch (error: any) {
    if (error instanceof SwaggerException && error.status === 404) {
      return { error: "Tên người dùng không tồn tại" };
    } else if (error instanceof SwaggerException && error.status === 401) {
      return { error: "Mật khẩu không đúng" };
    }
    return { error: error.message };
  }
}
