import PostEditor from "@/components/posts/editor/PostEditor";
import ForYouFeed from "./ForYouFeed";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FollowingFeed from "./FollowingFeed";
import RightSidebar from "@/components/RightSidebar";
export default async function Home() {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <PostEditor />
        <Tabs defaultValue="for-you">
          <TabsList className="w-full bg-card flex">
            <TabsTrigger
              value="for-you"
              className="flex-1 data-[state=active]:font-bold"
            >
              Dành cho bạn
            </TabsTrigger>
            <TabsTrigger
              value="following"
              className="flex-1 data-[state=active]:font-bold"
            >
              Đang theo dõi
            </TabsTrigger>
          </TabsList>
          <TabsContent value="for-you">
            <ForYouFeed />
          </TabsContent>
          <TabsContent value="following">
            <FollowingFeed />
          </TabsContent>
        </Tabs>
      </div>
      <RightSidebar />
    </main>
  );
}
