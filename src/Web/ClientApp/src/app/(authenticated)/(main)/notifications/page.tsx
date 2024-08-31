

import RightSidebar from "@/components/RightSidebar";
import React from "react";
import NotificationContent from "./NotificationContent";

const NotificationsPage = () => {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="bg-card rounded-2xl p-3 w-full min-w-0 space-y-5">
        <NotificationContent />
      </div>
      <RightSidebar />
    </main>
  );
};

export default NotificationsPage;
