import { cn } from "@/lib/utils";
import { KeyRound, User, User2 } from "lucide-react";
import Link from "next/link";
import React from "react";

const SettingBar = () => {
  return (
    <div
      className={cn(
        "sticky md:top-[5.25rem] md:h-[85vh] flex flex-row md:flex-col left-5 w-full md:w-[300px] p-2 gap-3 rounded-2xl bg-card shadow-sm"
      )}
    >
      <Link
        href="/settings/information"
        className="flex items-center gap-3 rounded-2xl p-3 hover:bg-background"
      >
        <User2 />
        <span className="hidden md:block">Thông tin cá nhân</span>
      </Link>
      <Link
        href="/settings/security"
        className="flex items-center gap-3 rounded-2xl p-3 hover:bg-background"
      >
        <KeyRound />
        <span className="hidden md:block">Bảo mật</span>
      </Link>
    </div>
  );
};

export default SettingBar;
