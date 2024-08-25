"use client";
import React, { useEffect, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { SignInValues, signInSchema } from "@/lib/validation";
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
import { SendVerifyEmail, SignIn } from "./actions";
import { Loader } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { refreshSession } from "../actions";
import { useAuthorization } from "@/providers/AuthorizationProvider";
import { useRouter } from "next/navigation";

const SignInForm = () => {
  useEffect(() => {
    refreshSession();
  }, []);

  const { toast } = useToast();
  const router = useRouter()

  const [username, setUsername] = useState<string|undefined>()
  const [unVerifyEmail, setUnVerifyEmail] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sended, setSended] = useState(false);

  const [isPending, startTransition] = useTransition();

  const handleSendEmail = async() => {
    setIsSending(true);
    const { error } = await SendVerifyEmail(username!);
    if (error) {
      toast({
        title: error,
      });
      setIsSending(false);
    } else {
      setSended(true);
      setTimeout(() => {
        setIsSending(false);
      }, 60000);
    }
  }

  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: SignInValues) {
    startTransition(async () => {
      const { error } = await SignIn(values);
      toast({
        title: error,
        variant: "destructive",
      });
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        {unVerifyEmail && !sended && (
          <div className="bg-red-200 rounded-2xl flex">
            <div className="text-sm text-red-500 p-2">
              Email chưa được xác thực. Hãy kiểm tra hòm thư của bạn để xác thực
              email
            </div>
            <button
              type="button"
              disabled={isSending}
              onClick={handleSendEmail}
              className={cn(
                "rounded-e-2xl text-nowrap p-2 bg-background text-primary hover:underline"
              )}
            >
              Gửi lại
            </button>
          </div>
        )}
        {sended && <div className="bg-primary/30 rounded-2xl flex">
            <div className="text-sm text-primary p-2">
              Xác thực email. Hãy kiểm tra hòm thư của bạn để xác thực
              email
            </div>
            <button
              type="button"
              disabled={isSending}
              onClick={handleSendEmail}
              className={cn(
                "rounded-e-2xl text-nowrap p-2 bg-background text-primary hover:underline"
              )}
            >
              Gửi lại
            </button>
          </div>}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên đăng nhập</FormLabel>
              <FormControl>
                <Input placeholder="Nhập tên đăng nhập hoặc email" {...field} />
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
                <Input type="password" placeholder="Nhập mật khẩu" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isPending} type="submit" className="w-full">
          Đăng nhập
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

export default SignInForm;
