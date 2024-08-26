import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import ListAllFriend from "./ListAllFriend";
import ListSendedFriend from "./ListSendedFriend";
import ListReceivedFriend from "./ListReceivedFriend";

const FriendPage = () => {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="rounded-2xl p-3 w-full min-w-0 space-y-5">
        <Tabs defaultValue="all">
          <TabsList className="w-full bg-card flex">
            <TabsTrigger
              value="all"
              className="flex-1 data-[state=active]:font-bold"
            >
              Tất cả
            </TabsTrigger>
            <TabsTrigger
              value="received"
              className="flex-1 data-[state=active]:font-bold"
            >
              Đã nhận
            </TabsTrigger>
            <TabsTrigger
              value="sended"
              className="flex-1 data-[state=active]:font-bold"
            >
              Đã yêu cầu
            </TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <ListAllFriend />
          </TabsContent>
          <TabsContent value="received">
            <ListReceivedFriend />
          </TabsContent>
          <TabsContent value="sended">
            <ListSendedFriend />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default FriendPage;
