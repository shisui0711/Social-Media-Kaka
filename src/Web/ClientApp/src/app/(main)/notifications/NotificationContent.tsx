"use client";

import Link from "next/link";
import React from "react";
import NotificationMoreButton from "./NotificationMoreButton";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ListNotification from "./ListNotification";
import { usePathname } from "next/navigation";
import ListUnseenNotification from "./ListUnseenNotification";

interface Props {
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

const NotificationContent = ({ setOpen }: Props) => {
  const pathname = usePathname();
  return (
    <>
      <div className="flex items-center justify-between p-2">
        <h1 className="text-lg md:text-xl">Thông báo</h1>
        <div className="flex items-center gap-2">
          <Link
            href="/notifications"
            className="text-blue-500 hover:underline"
            hidden={pathname === "/notifications"}
            onClick={() => {
              if (setOpen) setOpen(false);
            }}
          >
            Xem tất cả
          </Link>
          <NotificationMoreButton />
        </div>
      </div>
      <Separator />
      <Tabs defaultValue="all">
        <TabsList className="w-full bg-card flex">
          <TabsTrigger
            className="flex-1 data-[state=active]:font-bold"
            value="all"
          >
            Tất cả
          </TabsTrigger>
          <TabsTrigger
            className="flex-1 data-[state=active]:font-bold"
            value="unseen"
          >
            Chưa đọc
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value="all"
        >
          <ListNotification setOpen={setOpen} />
        </TabsContent>
        <TabsContent
          value="unseen"
        >
          <ListUnseenNotification setOpen={setOpen} />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default NotificationContent;
