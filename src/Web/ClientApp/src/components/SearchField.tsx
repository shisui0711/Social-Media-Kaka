"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

const SearchField = () => {
  const router = useRouter();
  const [openDialog, setOpenDialog] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setOpenDialog(false)
    const form = e.currentTarget;
    const q = (form.q as HTMLInputElement).value.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <>
      <div className="relative hidden md:flex">
        <form onSubmit={handleSubmit}>
          <Input
            name="q"
            placeholder="Tìm kiếm trên Kaka"
            className="flex pe-10 rounded-full"
          />
          <button
            className="absolute cursor-pointer right-3 top-[18px] -translate-y-1/2 size-5 transform text-muted-foreground"
            type="submit"
          >
            <Search />
          </button>
        </form>
      </div>
      <div className="md:hidden">
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button className="rounded-full p-0 px-2">
              <Search />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <div className="flex flex-col relative">
              <h1 className="text-2xl font-semibold text-primary text-center">
                Tìm kiếm
              </h1>
              <Separator className="my-3" />
              <div className="relative">
                <form onSubmit={handleSubmit}>
                  <Input
                    name="q"
                    placeholder="Tìm kiếm trên Kaka"
                    className="flex pe-10 rounded-full"
                  />
                  <button
                    className="absolute cursor-pointer right-3 top-[18px] -translate-y-1/2 size-5 transform text-muted-foreground"
                    type="submit"
                  >
                    <Search />
                  </button>
                </form>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default SearchField;
