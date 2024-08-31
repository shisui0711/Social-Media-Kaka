import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { UserDto } from "@/app/web-api-client";
import UserAvatar from "@/components/UserAvatar";
import CancelFriendButton from "./CancelFriendButton";
import AccepFriendButton from "./AccepFriendButton";
import UserLinkWithTooltip from "@/components/UserLinkWithTooltip";
import Link from "next/link"; 

interface Props {
  user: UserDto;
  isSended?: boolean;
  isReceived?: boolean;
}

const FriendComponent = ({user,isSended,isReceived}:Props) => {
  return (
    <Card>
      <CardHeader className="flex-center">
        <Link href={`/profile/${user.userName}`}>
        <UserAvatar avatarUrl={user.avatarUrl} size={100} />
        </Link>
      </CardHeader>
      <CardContent>
        <UserLinkWithTooltip username={user.userName}>
          <p className="text-foreground hover:text-primary md:text-center">{user.displayName}</p>
        </UserLinkWithTooltip>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        {isReceived &&
        <>
          <AccepFriendButton user={user}/>
          <CancelFriendButton userId={user.id}/>
        </>
        }
        {isSended && <CancelFriendButton isSended userId={user.id} />}
      </CardFooter>
    </Card>
  );
};

export default FriendComponent;
