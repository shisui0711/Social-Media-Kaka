"use client";

import React, { useState } from "react";
import EditPasswordDialog from "./EditPasswordDialog";
import { useAuthorization } from "@/providers/AuthorizationProvider";
import DisableTwoFactorButton from "./DisableTwoFactorButton";
import EnableTwoFactorDialog from "./EnableTwoFactorDialog";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import ConfirmPasswordDialog from "./ConfirmPasswordDialog";
import { useMutation } from "@tanstack/react-query";
import { GenerateTwoFactor } from "./actions";
import { useToast } from "@/components/ui/use-toast";

const Page = () => {
  const { user } = useAuthorization();
  const [openEditPasswordDialog, setOpenEditPasswordDialog] = useState(false);
  const [openEnable2FA, setOpenEnable2FA] = useState(false);
  const [openConfirmPassword, setOpenConfirmPassword] = useState(false);

  const { toast } = useToast();

  const generateTwoFactor = useMutation({
    mutationFn: GenerateTwoFactor,
    onSuccess(success) {
      if (success) {
        setOpenConfirmPassword(false);
        setOpenEnable2FA(true);
      } else {
        toast({
          title: "Email của bạn chưa được xác thực",
          description: "Hãy xác thực email để kích hoạt chứ năng này",
          variant: "destructive",
        });
      }
    },
    onError() {
      toast({
        title: "Có lỗi xảy ra vui lòng thử lại sau.",
        variant: "destructive",
      });
    },
  });

  const onPasswordConfirmed = () => {
    generateTwoFactor.mutate();
  };
  return (
    <section className="flex flex-col gap-3 md:container">
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-bold">Đăng nhập & bảo mật</h1>
        <p>Quản lý mật khẩu và phương thức bảo mật.</p>
        <div className="bg-muted p-3 rounded-2xl max-w-96 flex flex-col gap-2">
          <EditPasswordDialog
            user={user}
            open={openEditPasswordDialog}
            onOpenChange={setOpenEditPasswordDialog}
          />
          {user.twoFactorEnabled ? (
            <DisableTwoFactorButton />
          ) : (
            <>
              <Button
                className="flex items-center justify-between gap-2 w-full"
                onClick={() => setOpenConfirmPassword(true)}
              >
                <p>Bật xác thực 2 yếu tố</p>
                <ChevronRight size={15} />
              </Button>
              <ConfirmPasswordDialog
                open={openConfirmPassword}
                onOpenChange={setOpenConfirmPassword}
                onSuccess={onPasswordConfirmed}
              />
              <EnableTwoFactorDialog
                open={openEnable2FA}
                onClose={() => setOpenEnable2FA(false)}
              />
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Page;
