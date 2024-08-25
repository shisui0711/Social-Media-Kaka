"use server"
import { validateRequest } from "@/auth";
import { Metadata } from "next";
import React, { cache } from "react";
import UserProfile from "../UserProfile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserPosts from "./UserPosts";
import TaggedPosts from "./TaggedPosts";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { getApiClient } from "@/lib/apiClient";

interface ProfilePageProps {
  params: {
    username: string;
  };
}

const getUser = cache(async (username: string) => {
  const token = cookies().get("token")?.value;
  if (!token) redirect("/sign-in");
  const client = getApiClient(token)
  if (username.length === 36) {
    const user = await client.getUserInfoById(username)
    .catch( () => null);

    if (!user) notFound();

    return user;
  } else {
    const user = await client.getUserInfo(username)
    .catch( () => null)

    if (!user) notFound();

    return user;
  }
});

export async function generateMetadata({
  params: { username },
}: ProfilePageProps): Promise<Metadata> {
  const { user: signedInUser } = await validateRequest();
  if (!signedInUser) return {};

  const user = await getUser(username);

  return {
    title: `@${user.userName}`,
  };
}

const ProfilePage = async ({ params: { username } }: ProfilePageProps) => {
  const { user: signedInUser } = await validateRequest();
  if (!signedInUser)
    return (
      <div className="text-destructive">
        Để truy cập vào trang này. Hãy đang nhập
      </div>
    );

  const user = await getUser(username);

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <UserProfile signedInUserId={signedInUser.id} user={user} />
        <Tabs defaultValue="owner">
          <TabsList className="w-full bg-card flex">
            <TabsTrigger
              value="owner"
              className="flex-1 data-[state=active]:font-bold"
            >
              Bài viết
            </TabsTrigger>
            <TabsTrigger
              value="tagged"
              className="flex-1 data-[state=active]:font-bold"
            >
              Được nhắc đến
            </TabsTrigger>
          </TabsList>
          <TabsContent value="owner">
            <UserPosts userId={user.id} />
          </TabsContent>
          <TabsContent value="tagged">
            <TaggedPosts userName={user.userName} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default ProfilePage;
