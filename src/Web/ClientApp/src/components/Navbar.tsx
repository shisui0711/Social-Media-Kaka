"use client"

import Link from "next/link";
import React from "react";
import UserButton from "./UserButton";
import SearchField from "./SearchField";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Check, Monitor } from "lucide-react";
import NotificationButton from "./NotificationButton";
import MobileNav from "./posts/MobileNav";

const Navbar = () => {

  const { theme ,setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-10 bg-card shadow-sm">
      <div className="w-full flex items-center justify-between flex-wrap gap-5 px-5 py-3">
        <div className="flex gap-6 items-center">
          <Link href="/" className="text-2xl font-bold text-primary">
            Kaka
          </Link>
          <SearchField />
          <MobileNav/>
        </div>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="hidden sm:flex">
              <Button variant="outline" size="icon">
                <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")} className="flex gap-2 items-center">
                <SunIcon/>
                Sáng
                {theme === "light" && <Check  className="ml-auto"/>}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")} className="flex gap-2 items-center">
                <MoonIcon/>
                Tối
                {theme === "dark" && <Check className="ml-auto" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")} className="flex gap-2 items-center">
                <Monitor />
                Mặc định
                {theme === "system" && <Check className="ml-auto" />}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <NotificationButton/>
          <UserButton />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
