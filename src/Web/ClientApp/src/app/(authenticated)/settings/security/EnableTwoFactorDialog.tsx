import { MyUserDto } from "@/app/web-api-client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChevronRight, Pencil } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  changePasswordSchema,
  ChangePasswordValues,
  changePhoneNumberSchema,
  ChangePhoneNumberValues,
} from "@/lib/validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { ChangePassowrd } from "../information/actions";
import { useToast } from "@/components/ui/use-toast";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";

interface Props {
  user: MyUserDto;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EnableTwoFactorDialog = ({ user, open, onOpenChange }: Props) => {
  const { toast } = useToast();
  const { isPending, mutate } = useMutation({
    mutationFn: ChangePassowrd,
    onSuccess(data) {
      if (data) {
        toast({
          title: "Cập nhật mật khẩu thành công",
        });
      } else {
        toast({
          title: "Mật khẩu hiện tại không đúng",
          variant: "destructive",
        });
      }
    },
    onError(error) {
      toast({
        title: "Có lỗi xảy ra vui lòng thử lại sau.",
        variant: "destructive",
      });
    },
  });
  const form = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      repassword: "",
    },
  });

  async function onSubmit(values: ChangePasswordValues) {
    if (values.newPassword !== values.repassword) {
      toast({
        title: "Mật khẩu mới không khớp",
        variant: "destructive",
      });
      return;
    }
    mutate(values);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger className="w-full">
        <Button className="flex items-center justify-between gap-2 w-full">
          <p>Bật xác thực 2 yếu tố</p>
          <ChevronRight size={15} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-primary">
            Bật xác thực 2 yếu tố
          </DialogTitle>
          <Separator />
          <DialogDescription className="space-y-3">
            <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <Button type="button" className="w-full">
              Xác thực
              <Loader
                className={cn(
                  "animate-spin ml-2 hidden",
                  isPending && "inline-block"
                )}
              />
            </Button>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default EnableTwoFactorDialog;
