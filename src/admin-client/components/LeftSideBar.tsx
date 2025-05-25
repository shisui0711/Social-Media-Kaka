import React from "react";
import Link from "next/link";
import { Home, LogOut, ScrollText, UsersRound } from "lucide-react";
import { cn } from "@/lib/utils";

const LeftSidebar = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "sticky top-[5.25rem] left-5 h-[87vh] hidden md:flex flex-col justify-between w-[300px] p-2  space-y-3 rounded-2xl bg-card shadow-sm",
        className
      )}
    >
      <section>
        <Link
          href="/"
          className="flex items-center gap-3 rounded-2xl p-3 hover:bg-background"
        >
          <Home />
          <span>Trang chủ</span>
        </Link>
        <Link
          href="/users"
          className="flex items-center gap-3 rounded-2xl p-3 hover:bg-background"
        >
          <UsersRound />
          <span>Người dùng</span>
        </Link>
        <Link
          href="/posts"
          className="flex items-center gap-3 rounded-2xl p-3 hover:bg-background"
        >
          <ScrollText />
          <span>Bài viết</span>
        </Link>
        {/* <Link
          href="/settings"
          className="flex items-center gap-3 rounded-2xl p-3 hover:bg-background"
        >
          <Settings />
          <span>Cài đặt hệ thống</span>
        </Link> */}
      </section>
      <button className="flex items-center gap-3 rounded-2xl p-3 hover:bg-background w-full">
        <LogOut />
        <span>Đăng xuất</span>
      </button>
    </div>
  );
};

export default LeftSidebar;
