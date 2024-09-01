'use client'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { forgottenSchema, ForgottenValues } from "@/lib/validation";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CircleCheck, CircleX, Loader } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { ForgottenPassword } from "./actions";

const ForgottenForm = () => {

  const {
    isPending,
    mutate,
    isSuccess,
    isError
  } = useMutation({
    mutationFn: ForgottenPassword
  })

  const form = useForm<ForgottenValues>({
    resolver: zodResolver(forgottenSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: ForgottenValues) {
    mutate(values)
  }

  if(isSuccess) return <div className="flex-center flex-col bg-background rounded-2xl p-5">
    <CircleCheck className="size-20 text-primary" />
    <h1 className="text-xl text-center">Yêu cầu đặt lại mật khẩu đã được gửi đến email của bạn.</h1>
  </div>

  if(isError) return <div className="flex-center flex-col bg-background rounded-xl p-5">
    <CircleX className="size-40 text-red-500"/>
    <h1 className="text-xl text-center text-red-400">Có lỗi xảy ra vui lòng thử lại sau.</h1>
  </div>

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
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
        <Button
          disabled={isPending}
          type="submit"
          className="w-full"
        >
          Gửi yêu cầu
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

export default ForgottenForm;
