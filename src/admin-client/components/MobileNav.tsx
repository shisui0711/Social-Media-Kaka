"use client";
import React from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Home, Menu, ScrollText, Settings, UsersRound } from "lucide-react";
import Link from "next/link";

const MobileNav = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Menu size={30} className="cursor-pointer md:hidden" />
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
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
            href="/users"
            className="flex items-center gap-3 rounded-2xl p-3 hover:bg-background"
          >
            <UsersRound />
            <span>Người dùng</span>
          </Link>
        </SheetClose>
        <SheetClose asChild>
          <Link
            href="/posts"
            className="flex items-center gap-3 rounded-2xl p-3 hover:bg-background"
          >
            <ScrollText />
            <span>Bài viết</span>
          </Link>
        </SheetClose>
        <SheetClose asChild>
          <Link
            href="/settings"
            className="flex items-center gap-3 rounded-2xl p-3 hover:bg-background"
          >
            <Settings />
            <span>Cài đặt hệ thống</span>
          </Link>
        </SheetClose>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
