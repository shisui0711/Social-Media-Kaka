import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname } from "next/navigation";
import NotificationContent from "@/app/(main)/notifications/NotificationContent";
import { useSignalR } from "@/providers/SignalRProvider";
import { useApiClient } from "@/app/hooks/useApiClient";

const NotificationButton = () => {
  const [open, setOpen] = useState(false)
  const [countNotifications, setCountNotifications] = useState(0)
  const { connection } = useSignalR()
  const client = useApiClient()
  useEffect(()=>{
    const handle = () => {
      setCountNotifications(0)
    }
    window.addEventListener("notificationMarkAsReadEvent",handle)
    return ()=>{
      window.removeEventListener("notificationMarkAsReadEvent", handle)
    }
  },[])

  useEffect(()=>{
    if(connection){
      const handle = ()=>{
        setCountNotifications((prev)=>prev+1)
      }
      connection.on("ReceiveNotification", handle)
      return ()=>{
        connection.off("ReceiveNotification", handle)
      }
    }
  },[connection])

  useEffect(()=>{
    client.getTotalUnseenMyNotification()
          .then(data=>{
            setCountNotifications(data)
          })
  },[client])

  const pathname = usePathname()
  return (
    <div>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger disabled={pathname === '/notifications'}>
          <div className="bg-background size-fit p-3 relative rounded-full">
            <Bell className="text-foreground" />
            {countNotifications > 0 && <Badge className="absolute right-0 top-0 !bg-red-500">{countNotifications}</Badge>}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[22rem]" align="end"  alignOffset={-70}>
          <NotificationContent setOpen={setOpen} />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default NotificationButton;
