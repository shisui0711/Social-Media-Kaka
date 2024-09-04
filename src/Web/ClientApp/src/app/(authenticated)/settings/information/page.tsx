"use client"
import { Input } from "@/components/ui/input";
import EditEmailDialog from "./EditEmailDialog";
import { useAuthorization } from "@/providers/AuthorizationProvider";
import { useState } from "react";
import { ShieldCheck, ShieldX } from "lucide-react";
import EditBirthDayDialog from "./EditBirthDayDialog";
import EditPhoneNumberDialog from "./EditPhoneNumberDialog";
const InformationPage = () => {
  const { user } = useAuthorization();
  const [openEmailDialog, setOpenEmailDialog] = useState(false);
  const [openBirthDayDialog, setOpenBirthDayDialog] = useState(false);
  return (
    <section className="flex flex-col gap-5 items-start">
      <div className="flex-center gap-3">
        <p className="hidden md:block min-w-32 text-end">Địa chỉ email:</p>
        <Input type="text" readOnly className="w-fit" value={user?.email} />
        <EditEmailDialog user={user} open={openEmailDialog} onOpenChange={setOpenEmailDialog} />
        <div className="flex items-center gap-3 bg-background p-2 rounded-2xl">
          {user.emailConfirmed ? (
            <>
              <ShieldCheck className="text-card fill-primary" />
              <p className="hidden md:block">Đã xác minh</p>
            </>
          ):(
            <>
              <ShieldX className="text-card fill-red-500" />
              <p className="hidden md:block">Chưa xác minh</p>
            </>
          )}
        </div>
      </div>
      <div className="flex-center gap-3">
        <p className="hidden md:block min-w-32 text-end">Số điện thoại:</p>
        <Input type="text" readOnly className="w-fit" value={user?.phoneNumber ?? "Chưa có"} />
        <EditPhoneNumberDialog user={user} open={openEmailDialog} onOpenChange={setOpenEmailDialog}  />
        <div className="flex items-center gap-3 bg-background p-2 rounded-2xl">
          {user.phoneNumberConfirmed ? (
            <>
              <ShieldCheck className="text-card fill-primary" />
              <p className="hidden md:block">Đã xác minh</p>
            </>
          ):(
            <>
              <ShieldX className="text-card fill-red-500" />
              <p className="hidden md:block">Chưa xác minh</p>
            </>
          )}
        </div>
      </div>
      <div className="flex-center gap-3">
        <p className="hidden md:block min-w-32 text-end" >Ngày sinh:</p>
        <Input type="text" readOnly className="w-fit" value={user?.birthDay ?? "Chưa có"} />
        <EditBirthDayDialog user={user} open={openBirthDayDialog} onOpenChange={setOpenBirthDayDialog}  />
      </div>
    </section>
  );
};

export default InformationPage;
