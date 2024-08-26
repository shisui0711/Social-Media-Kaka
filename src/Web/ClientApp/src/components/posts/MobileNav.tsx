"use client";
import React from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Bell,
  Bookmark,
  Home,
  Menu,
  MessageCircle,
  User,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useAuthorization } from "@/providers/AuthorizationProvider";
import UserAvatar from "../UserAvatar";

const MobileNav = () => {
  const { user } = useAuthorization();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Menu size={30} className="cursor-pointer md:hidden" />
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
        <SheetClose asChild>
          <Link
            href={`/profile/${user.userName}`}
            className="flex items-center gap-3 rounded-2xl p-1 hover:bg-background"
          >
            <UserAvatar avatarUrl={user.avatarUrl} />
            <span>{user.displayName}</span>
          </Link>
        </SheetClose>
        <SheetClose asChild>
          <Link
            href="/"
            className="flex items-center gap-3 rounded-2xl p-3 hover:bg-background"
          >
            <Home />
            <span>Trang chủ</span>
          </Link>
        </SheetClose>
        <SheetClose asChild>
          <Link
            href="/messages"
            className="flex items-center gap-3 rounded-2xl p-3 hover:bg-background"
          >
            <MessageCircle />
            <span>Tin nhắn</span>
          </Link>
        </SheetClose>
        <SheetClose asChild>
          <Link
            href="/bookmarked"
            className="flex items-center gap-3 rounded-2xl p-3 hover:bg-background"
          >
            <Bookmark />
            <span>Đã lưu</span>
          </Link>
        </SheetClose>
        <SheetClose asChild>
          <Link
            href="/friends"
            className="flex items-center gap-3 rounded-2xl p-3 hover:bg-background"
          >
            <UsersRound />
            <span>Bạn bè</span>
          </Link>
        </SheetClose>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
