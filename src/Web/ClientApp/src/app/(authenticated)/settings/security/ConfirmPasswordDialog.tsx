"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { confirmPasswordSchema, ConfirmPasswordValues } from "@/lib/validation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { CheckPassword } from "./actions";
import { useToast } from "@/components/ui/use-toast";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const ConfirmPasswordDialog = ({ open, onOpenChange, onSuccess }: Props) => {
  const { toast } = useToast();
  const { isPending, mutate } = useMutation({
    mutationFn: CheckPassword,
    onSuccess(success) {
      if (success) {
        onSuccess();
      } else {
        toast({
          title: "Mật khẩu không đúng. Vui lòng thử lại.",
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
  const form = useForm<ConfirmPasswordValues>({
    resolver: zodResolver(confirmPasswordSchema),
    defaultValues: {
      password: "",
    },
  });
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex flex-col text-center">
            <h1 className="text-primary text-2xl">Xác thực bảo mật</h1>
            <p className="text-sm text-muted-foreground">
              Chức năng này yêu cầu bạn xác thực lại mật khẩu
            </p>
          </DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(({ password }) => mutate(password))}
                className="space-y-3"
              >
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mật khẩu hiện tại</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Nhập mật khẩu hiện tại"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button disabled={isPending} type="submit" className="w-full">
                  Xác nhận
                  <Loader
                    className={cn(
                      "animate-spin ml-2 hidden",
                      isPending && "inline-block"
                    )}
                  />
                </Button>
              </form>
            </Form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmPasswordDialog;
