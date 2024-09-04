
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { changePasswordSchema, ChangePasswordValues, changePhoneNumberSchema, ChangePhoneNumberValues } from "@/lib/validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { ChangePassowrd } from "../information/actions";
import { useToast } from "@/components/ui/use-toast";

interface Props {
  user: MyUserDto;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}


const EditPasswordDialog = ({ user, open, onOpenChange }: Props) => {
  const { toast } = useToast();
  const {
    isPending,
    mutate
  } = useMutation({
    mutationFn: ChangePassowrd,
    onSuccess(data){
      if(data)
      {
        toast({
          title: "Cập nhật mật khẩu thành công"
        })
      }else{
        toast({
          title: "Mật khẩu hiện tại không đúng",
          variant: "destructive"
        })
      }
    },
    onError(error){
      toast({
        title: "Có lỗi xảy ra vui lòng thử lại sau.",
        variant: "destructive"
      });
    }
  })
  const form = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      repassword: ""
    },
  });

  async function onSubmit(values: ChangePasswordValues) {
    if(values.newPassword !== values.repassword){
      toast({
        title: "Mật khẩu mới không khớp",
        variant: "destructive"
      })
      return;
    }
    mutate(values)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger className="w-full">
        <Button className="flex items-center justify-between gap-2 w-full">
          <p>Đổi mật khẩu</p>
          <ChevronRight size={15} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-primary">
            Thay đổi mật khẩu
          </DialogTitle>
          <Separator />
          <DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-3"
              >
                <FormField
                  control={form.control}
                  name="oldPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mật khẩu hiện tại</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Nhập mật khẩu hiện tại" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mật khẩu mới</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Nhập mật khẩu mới" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="repassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mập khẩu mới</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Nhập lại mật khẩu mới" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button disabled={isPending} type="submit" className="w-full">
                  Thay đổi
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

export default EditPasswordDialog;
