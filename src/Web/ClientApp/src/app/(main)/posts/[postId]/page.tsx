"use server"
import { validateRequest } from "@/auth";
import UserInfoSidebar from "@/components/UserInfoSidebar";
import { Loader } from "lucide-react";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import React, { cache, Suspense } from "react";
import PostComponent from "@/components/posts/Post";
import { getApiClient } from "@/lib/apiClient";

interface PageProps {
  params: {
    postId: string;
  };
}

const getPost = cache(async (postId: string) => {
  const token = cookies().get("token")?.value;
  if (!token) redirect("/sign-in");
  const client = getApiClient(token)

const post = await client.getPostInfo(postId)
.catch(()=> notFound())

return post;
});

const PostPage = async ({ params: { postId } }: PageProps) => {
  const { user: signedInUser } = await validateRequest();
  if (!signedInUser) redirect("/sign-in");

  const post = await getPost(postId);

  return (
    <main className="flex w-full min-w-0 gap-5 relative">
      <div className="w-full min-w-0 space-y-5">
        <PostComponent post={post} />
      </div>
      <div className="sticky top-0 hidden h-fit w-80 flex-none lg:block">
        <Suspense fallback={<Loader className="mx-auto animate-spin" />}>
          <UserInfoSidebar user={post.user} />
        </Suspense>
      </div>
    </main>
  );
};

export default PostPage;
