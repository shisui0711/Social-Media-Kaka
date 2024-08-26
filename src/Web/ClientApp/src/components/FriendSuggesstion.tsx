'use client'

import useFriendSuggestion from "@/app/hooks/useFriendSuggestion";
import { useAuthorization } from "@/providers/AuthorizationProvider";
import UserTooltip from "./UserTooltip";
import Link from "next/link";
import FriendButton from "./FriendButton";
import UserAvatar from "./UserAvatar";
import FriendSuggestionSkeleton from "./FriendSuggestionSkeleton";

export default function FriendSuggestion() {
  const { user: signedInUser } = useAuthorization();
  const { data: usersToFollow, isPending, isError } = useFriendSuggestion();
  if (isPending) return <FriendSuggestionSkeleton/>;
  if(isError) return (
    <div className="flex-center">
      <p className="text-center text-destructive w-full">
        Có lỗi xảy ra. Hãy tải lại trang.
      </p>
    </div>
  );
  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="text-xl font-bold">Bạn có thể biết</div>
      {usersToFollow.map((user) => (
        <div key={user.id} className="flex items-center justify-between gap-3">
          <UserTooltip user={user}>
            <Link
              href={`/profile/${user.userName}`}
              className="flex gap-2 items-center"
            >
              <UserAvatar avatarUrl={user.avatarUrl} />
              <div className="flex flex-col">
                <p className="line-clamp-1 break-all font-semibold hover:underline">
                  {user.displayName}
                </p>
                <p className="line-clamp-1 text-sm break-all text-muted-foreground">
                  @{user.userName}
                </p>
              </div>
            </Link>
          </UserTooltip>
          <FriendButton
            userId={user.id}
            initialState={{
              friends:
                user.friendRelationReceivers.filter((x) => x.accepted).length +
                user.friendRelationSenders.filter((x) => x.accepted).length,
              isSended: user.friendRelationReceivers.some(
                (x) => x.senderId == signedInUser.id
              ),
              isFriend:
                user.friendRelationReceivers.some(
                  (x) => x.senderId == signedInUser.id && x.accepted
                ) ||
                user.friendRelationSenders.some(
                  (x) => x.receiverId == signedInUser.id && x.accepted
                ),
            }}
          />
        </div>
      ))}
    </div>
  );
}
