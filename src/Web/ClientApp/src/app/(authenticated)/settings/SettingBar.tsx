'use client'

import { cn } from "@/lib/utils";
import { KeyRound, User2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const SettingBar = () => {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "sticky md:top-[5.25rem] md:h-[85vh] flex flex-row md:flex-col left-5 w-full md:w-[400px] p-2 gap-3 rounded-2xl bg-card shadow-sm"
      )}
    >
      <Link
        href="/settings/information"
        className={cn("flex items-center gap-3 rounded-2xl p-3 hover:bg-background",
          pathname === '/settings/information' && "bg-background"
        )}
      >
        <User2 />
        <span className="hidden md:block">Thông tin cá nhân</span>
      </Link>
      <Link
        href="/settings/security"
        className={cn("flex items-center gap-3 rounded-2xl p-3 hover:bg-background",
          pathname === '/settings/security' && "bg-background"
        )}
      >
        <KeyRound />
        <span className="hidden md:block">Bảo mật</span>
      </Link>
    </div>
  );
};

export default SettingBar;
