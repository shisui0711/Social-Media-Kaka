"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CircleCheck, CircleX, Loader } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import {
  recoveryPasswordSchema,
  RecoveryPasswordValues,
} from "@/lib/validation";
import { RecoveryPassword } from "./actions";
import { useRouter, useSearchParams } from 'next/navigation';

const RecoveryForm = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");
  const router = useRouter();

  const { isPending, data, mutate, isSuccess, isError } = useMutation({
    mutationFn: RecoveryPassword,
  });

  const form = useForm<RecoveryPasswordValues>({
    resolver: zodResolver(recoveryPasswordSchema),
    defaultValues: {
      password: "",
      repassword: "",
    },
  });

  if (!email || !token) {
    router.push("/sign-in");
    return null;
  }

  async function onSubmit({ password }: RecoveryPasswordValues) {
    if (email && token) {
      mutate({ email, token, newPassword: password });
    }
  }

  if (isSuccess && !data)
    return (
      <div className="flex-center flex-col bg-background rounded-xl p-5">
        <CircleX className="size-40 text-red-500" />
        <h1 className="text-xl text-center text-red-400">
          Đường dẫn đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.
        </h1>
      </div>
    );

  if (isSuccess && data) {
    router.push("/sign-in");
    return (
      <div className="flex-center flex-col bg-background rounded-2xl p-5">
        <CircleCheck className="size-20 text-primary" />
        <h1 className="text-xl text-center">
          Đặt lại mật khẩu thành công. Đang chuyển hướng đến trang đăng nhập.
        </h1>
      </div>
    );
  }

  if (isError)
    return (
      <div className="flex-center flex-col bg-background rounded-xl p-5">
        <CircleX className="size-40 text-red-500" />
        <h1 className="text-xl text-center text-red-400">
          Có lỗi xảy ra vui lòng thử lại sau.
        </h1>
      </div>
    );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mật khẩu</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Nhập mật khẩu" {...field} />
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
              <FormLabel>Nhập lại mật khẩu</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Nhập lại mật khẩu"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isPending} type="submit" className="w-full">
          Đặt lại mật khẩu
          <Loader
            className={cn(
              "animate-spin ml-2 hidden",
              isPending && "inline-block"
            )}
          />
        </Button>
      </form>
    </Form>
  );
};

export default RecoveryForm;
