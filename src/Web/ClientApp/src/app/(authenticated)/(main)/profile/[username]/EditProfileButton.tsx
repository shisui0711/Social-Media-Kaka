"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import EditProfileDialog from "./EditProfileDialog";
import { UserDto } from "@/app/web-api-client";

interface EditProfileButtonProps {
  user: UserDto;
}

export default function EditProfileButton({ user }: EditProfileButtonProps) {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <Button variant="default" onClick={() => setShowDialog(true)}>
        Chỉnh sửa trang cá nhân
      </Button>
      <EditProfileDialog
        user={user}
        open={showDialog}
        onOpenChange={setShowDialog}
      />
    </>
  );
}