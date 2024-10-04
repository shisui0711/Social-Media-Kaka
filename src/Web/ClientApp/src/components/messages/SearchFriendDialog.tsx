"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader } from "lucide-react";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { useDebounce } from "@/app/hooks/useDebounce";
import { UserDto } from "@/app/web-api-client";
import { useApiClient } from "@/app/hooks/useApiClient";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import UserAvatar from "../UserAvatar";

interface Props {
  title: string;
  placeholder: string;
  onUserClick?: (userId: string) => void;
  open: boolean;
  onClose: () => void;
}

const SearchFriendDialog = ({
  title,
  placeholder,
  onUserClick,
  open,
  onClose,
}: Props) => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<UserDto[]>([]);
  const debouncedValue = useDebounce<string>(search, 500);
  const client = useApiClient();
  const { data, error, isFetching } = useQuery({
    queryKey: ["search-friend", debouncedValue],
    queryFn: () => client.getMyFriendByName(debouncedValue),
    enabled: !!debouncedValue,
    retry(failureCount, error) {
      if (error instanceof AxiosError && error.status === 404) {
        return false;
      }
      return failureCount < 3;
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60, // 1 hours
  });

  useEffect(() => {
    if (data) setResults(data);
  }, [data]);

  useEffect(() => {
    if (error) setResults([]);
  }, [error]);

  useEffect(() => {
    if (!open) {
      setSearch("");
      setResults([]);
    }
  }, [open]);

  function handleOpenChange(open: boolean) {
    if (!open || !isFetching) {
      onClose();
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[70vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-primary text-center">
            {title}
          </DialogTitle>
          <Separator />
          <DialogDescription>
            <div className="relative flex">
              <Input
                name="q"
                placeholder={placeholder}
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
                    <div onClick={onClose} key={user.id}>
                      <button
                        onClick={() => {
                          if (onUserClick) onUserClick(user.id);
                        }}
                        className="flex flex-col items-center gap-2 max-w-28"
                      >
                        <UserAvatar avatarUrl={user.avatarUrl} />
                        <p className="text-sm text-center line-clamp-1 break-all">
                          {user.displayName}
                        </p>
                      </button>
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

export default SearchFriendDialog;
