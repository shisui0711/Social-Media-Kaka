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
import { Pencil } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { changeEmailSchema, ChangeEmailValues } from "@/lib/validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { ChangeEmail } from "./actions";
import { useToast } from "@/components/ui/use-toast";

interface Props {
  user: MyUserDto;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditEmailDialog = ({ user, open, onOpenChange }: Props) => {
  const { toast } = useToast();
  const { isPending, mutate } = useMutation({
    mutationFn: ChangeEmail,
    onSuccess(success) {
      if (success) {
        toast({
          title: "Cập nhật email thành công",
        });
      } else {
        toast({
          title: "Cập nhật email thất bại",
          description: "Mật khẩu không đúng",
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
  const form = useForm<ChangeEmailValues>({
    resolver: zodResolver(changeEmailSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: ChangeEmailValues) {
    mutate(values);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger>
        <Button className="flex items-center gap-2">
          <Pencil size={15} />
          <p className="hidden md:block">Thay đổi</p>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-primary">
            Thay đổi địa chỉ email
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Địa chỉ email</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập địa chỉ email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mật khẩu</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Nhập mật khẩu"
                          {...field}
                        />
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

export default EditEmailDialog;
