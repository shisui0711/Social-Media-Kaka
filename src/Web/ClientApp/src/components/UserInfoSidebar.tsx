import { validateRequest } from "@/auth";
import UserTooltip from "./UserTooltip";
import Link from "next/link";
import UserAvatar from "./UserAvatar";
import Linkify from "./Linkify";
import FollowButton from "./FollowButton";
import { UserDto } from "@/app/web-api-client";

interface UserInfoSidebarProps {
  user: UserDto;
}

const UserInfoSidebar = async ({ user }: UserInfoSidebarProps) => {
  const { user: signedInUser } = await validateRequest();
  if (!signedInUser) return null;
  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="text-xl font-bold">Về người này</div>
      <UserTooltip user={user}>
        <Link
          href={`/profile/${user.userName}`}
          className="flex items-center gap-3"
        >
          <UserAvatar avatarUrl={user.avatarUrl} className="flex-none" />
          <div>
            <p className="line-clamp-1 break-all font-semibold hover:underline">
              {user.displayName}
            </p>
            <p className="line-clamp-1 break-all text-muted-foreground">
              @{user.userName}
            </p>
          </div>
        </Link>
      </UserTooltip>
      <Linkify>
        <div className="line-clamp-6 whitespace-pre-line break-words text-muted-foreground">
          {user.bio}
        </div>
      </Linkify>
      {user.id !== signedInUser.id && (
        <FollowButton
          userId={user.id}
          initialState={{
            followers: user.followers.length,
            isFollowedByUser: user.followers.some((x) => x.followerId === signedInUser.id),
          }}
        />
      )}
    </div>
  );
};

export default UserInfoSidebar