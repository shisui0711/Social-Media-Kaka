import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  otpSchema,
  OtpValues,
} from "@/lib/validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useRouter } from "next/navigation";
import { VerifyTwoFactor } from '../security/actions';

interface Props {
  open: boolean,
  onClose: () => void;

}

const VerifyEmailDialog = ({open,onClose}:Props) => {
  const router = useRouter();
  const { toast } = useToast();
  const verifyTwoFactor = useMutation({
    mutationFn: VerifyTwoFactor,
    onSuccess(success) {
      if (success) {
        toast({
          title: "Xác thực email thành công",
        });
        router.refresh();
      } else {
        toast({
          title: "Mã xác thực không hợp lệ",
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
  const form = useForm<OtpValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  function handleOpenChange(open: boolean) {
    if(open){
      
    }
    if (!open || !verifyTwoFactor.isPending) {
      onClose();
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-primary">
            Bật xác thực 2 yếu tố
          </DialogTitle>
          <Separator />
          <DialogDescription className="space-y-3">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(({otp}) => verifyTwoFactor.mutate(otp))}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <InputOTP maxLength={6} {...field} pattern={REGEXP_ONLY_DIGITS}>
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Xác thực
                  <Loader
                    className={cn(
                      "animate-spin ml-2 hidden",
                      verifyTwoFactor.isPending && "inline-block"
                    )}
                  />
                </Button>
              </form>
            </Form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default VerifyEmailDialog