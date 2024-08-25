"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader, Search } from "lucide-react";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { useDebounce } from "@/app/hooks/useDebounce";
import UserResultButton from "./UserResultButton";
import { UserDto } from "@/app/web-api-client";
import { useApiClient } from "@/app/hooks/useApiClient";

const SearchMesssageButton = () => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<UserDto[]>([]);
  const debouncedValue = useDebounce(search, 500);
  const [isLoading, setIsLoading] = useState(false);
  const client = useApiClient();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (debouncedValue) {
      const fetchData = async () => {
        setIsLoading(true);
          await client
          .getMyFriendByName(search)
          .then((data) => setResults(data))
          .catch(() => setResults([]))
          .finally(() => setIsLoading(false));
      };
      fetchData();
    }
  }, [debouncedValue, search, client]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="bg-background self-center w-fit sm:w-full text-muted-foreground rounded-full flex items-center gap-3 py-2 px-3 cursor-text">
        <Search />
        <h1 className="text-sm hidden sm:block">Tìm kiếm tin nhắn</h1>
      </DialogTrigger>
      <DialogContent className="max-h-[70vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-primary text-center">
            Tìm kiếm tin nhắn
          </DialogTitle>
          <Separator />
          <DialogDescription>
            <div className="relative flex">
              <Input
                name="q"
                placeholder="Tìm kiếm tin nhắn..."
                className="flex pe-10 rounded-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onLoad={() => setSearch("")}
              />
            </div>
            <div className="flex flex-wrap gap-4 mt-4">
              {isLoading ? (
                <Loader className="mx-auto animate-spin" />
              ) : (
                <>
                  {results.map((user) => (
                    <div onClick={() => setOpen(false)} key={user.id}>
                      <UserResultButton receiver={user} />
                    </div>
                  ))}
                </>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default SearchMesssageButton;
