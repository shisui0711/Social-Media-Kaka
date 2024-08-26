"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
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
import { useQuery } from "@tanstack/react-query";

const SearchMesssageButton = () => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<UserDto[]>([]);
  const debouncedValue = useDebounce<string>(search, 500);
  const client = useApiClient();
  const [open, setOpen] = useState(false);
  const {
    data,
    error,
    isFetching
  } = useQuery({
    queryKey: ["search-friend", debouncedValue],
    queryFn: () => client.getMyFriendByName(debouncedValue),
    enabled: !!debouncedValue,
    retry: true,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60, // 1 hours
  })

  useEffect(() => {
    if(data)
      setResults(data)
  },[data])

  useEffect(() => {
    if(error) setResults([])
  },[error])

  useEffect(()=>{
    if(!open){
      setSearch("")
      setResults([])
    }
  },[open])

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
              {isFetching ? (
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
