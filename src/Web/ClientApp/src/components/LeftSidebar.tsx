"use client";

import React from "react";
import Link from "next/link";
import { Bookmark, Home, MessageCircle, User, UsersRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthorization } from "@/providers/AuthorizationProvider";
import UserAvatar from "./UserAvatar";

const LeftSidebar = ({ className }: { className?: string }) => {
  const { user } = useAuthorization();

  return (
    <div
      className={cn(
        "sticky top-[5.25rem] left-5 h-[87vh] hidden md:block w-[300px] p-2 flex-none space-y-3 rounded-2xl bg-card shadow-sm",
        className
      )}
    >
      <Link
        href={`/profile/${user.userName}`}
        className="flex items-center gap-3 rounded-2xl p-3 hover:bg-background"
      >
        <UserAvatar avatarUrl={user.avatarUrl} />
        <span>{user.displayName}</span>
      </Link>
      <Link
        href="/"
        className="flex items-center gap-3 rounded-2xl p-3 hover:bg-background"
      >
        <Home />
        <span>Trang chủ</span>
      </Link>
      <Link
        href="/messages"
        className="flex items-center gap-3 rounded-2xl p-3 hover:bg-background"
      >
        <MessageCircle />
        <span>Tin nhắn</span>
      </Link>
      <Link
        href="/bookmarked"
        className="flex items-center gap-3 rounded-2xl p-3 hover:bg-background"
      >
        <Bookmark />
        <span>Đã lưu</span>
      </Link>
      <Link
        href="/friends"
        className="flex items-center gap-3 rounded-2xl p-3 hover:bg-background"
      >
        <UsersRound />
        <span>Bạn bè</span>
      </Link>
    </div>
  );
};

export default LeftSidebar;
