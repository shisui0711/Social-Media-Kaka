import { tokenCache } from "@/lib/auth";
import { useAuthorizeApiClient } from "@/store";

export async function deletePost(id: string) {
  const token = tokenCache.getToken("access");
  if (!token) return null;
  const { client } = useAuthorizeApiClient();
  const deletedPost = await client.removePost(id).catch(() => {
    throw new Error("Post not found");
  });
  return deletedPost;
}
