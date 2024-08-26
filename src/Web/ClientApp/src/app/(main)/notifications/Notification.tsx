import UserAvatar from "@/components/UserAvatar";
import { calculateTimeDifference, cn } from "@/lib/utils";
import { ArrowBigUp, MessageCircle, UserRoundPlus } from "lucide-react";
import Link from "next/link";
import useNotification from "@/app/hooks/useNotification";
import { usePathname } from "next/navigation";
import { NotificationDto } from "@/app/web-api-client";

interface NotificationProps {
  notification: NotificationDto;
}

export default function Notification({ notification }: NotificationProps) {
  const { markAsReadNotification } = useNotification()
  const pathname = usePathname()
  const getInfo = (type:string):{ message: string; icon: JSX.Element; href: string } => {
    switch (type) {
      case "FOLLOW":
        return {
          message: `${notification.issuer?.displayName} đã theo dõi bạn`,
          icon: <UserRoundPlus className="size-7 text-primary " />,
          href: `/profile/${notification.issuer?.userName}`,
        };
      case "COMMENT":
        return {
          message: `${notification.issuer?.displayName} đã bình luận bài viết của bạn`,
          icon: <MessageCircle className="size-7 fill-primary text-primary" />,
          href: `/posts/${notification?.post?.id}`,
        };
      case "LIKE":
        return {
          message: `${notification.issuer?.displayName} đã thích bài viết của bạn`,
          icon: <ArrowBigUp className="size-7 fill-primary text-primary" />,
          href: `/posts/${notification?.post?.id}`,
        }
      case "ADDFRIEND":
        return {
          message: `${notification.issuer?.displayName} đã gửi lời mời kết bạn`,
          icon: <UserRoundPlus className="size-7 text-primary " />,
          href: `/profile/${notification.issuer?.userName}`,
        }
      case "ACCEPTFRIEND":
        return {
          message: `${notification.issuer?.displayName} đã chấp nhận lời mời kết bạn`,
          icon: <UserRoundPlus className="size-7 text-primary " />,
          href: `/profile/${notification.issuer?.userName}`,
        }
      default:
        throw new Error("Invalid notification type");
    }
  }
  const { message, icon, href } = getInfo(notification.type);

  return (
    <Link href={href} className="block" onClick={()=>markAsReadNotification(notification.id)}>
      <article
        className={cn(
          "flex gap-3 items-center rounded-2xl bg-card p-5 shadow-sm transition-colors hover:bg-card/70",
          !notification.seen && "bg-primary/10",
        )}
      >
        <div className="my-1">{icon}</div>
        <div className="space-y-3 w-full">
          <div className="flex justify-between gap-3 w-full items-center">
            <div className="flex gap-2 items-center">
            <UserAvatar avatarUrl={notification.issuer?.avatarUrl} size={36} />
              <div className="flex flex-col">
              <span className="font-bold">{notification.issuer?.displayName}</span>{" "}
              <span>{message}</span>
              </div>
            </div>
            <span>{calculateTimeDifference(notification.created)}</span>
          </div>
          { pathname === '/notifications' && notification.post && (
            <div className="line-clamp-3 whitespace-pre-line text-muted-foreground">
              {notification.post.content}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}