import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { SignInValues, signInSchema } from "@/lib/validation";
import { Lock, User } from "lucide-react-native";
import { ActivityIndicator, Text, View } from "react-native";
import { Link, Redirect, router } from "expo-router";
import { refreshSession, SignIn } from "@/actions/auth.actions";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner-native";
import CustomButton from "./CustomButton";
import InputField from "./InputField";

const SignInForm = () => {
  const [isRefreshing, setIsRefreshing] = useState(true);

  useEffect(() => {
    refreshSession().then((success) => {
      setIsRefreshing(false);
      if (success) return <Redirect href="/(root)/(tabs)/home" />;
    });
  }, []);

  const { isPending, mutate } = useMutation({
    mutationFn: SignIn,
    onSuccess({ error }) {
      if (!error) router.replace("/(root)/(tabs)/home");
      else toast.error(error);
    },
  });

  const { control, handleSubmit } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: SignInValues) {
    mutate(values);
  }

  return (
    <View className="space-y-5">
      <Controller
        control={control}
        name={"username"}
        render={({
          field: { value, onChange, onBlur },
          fieldState: { error },
        }) => (
          <>
            <InputField
              Icon={() => (
                <User size={30} className="text-muted-foreground ml-4" />
              )}
              placeholder="Nhập tên đăng nhập"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
            />
            {error && (
              <Text className="text-destructive font-InterBold">
                {error.message}
              </Text>
            )}
          </>
        )}
      />
      <Controller
        control={control}
        name={"password"}
        render={({
          field: { value, onChange, onBlur },
          fieldState: { error },
        }) => (
          <>
            <InputField
              Icon={() => (
                <Lock size={30} className="text-muted-foreground ml-4" />
              )}
              placeholder="Nhập mật khẩu"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              secureTextEntry
            />
            {error && (
              <Text className="text-destructive font-InterBold">
                {error.message}
              </Text>
            )}
          </>
        )}
      />
      <CustomButton
        onPress={handleSubmit(onSubmit)}
        title="Đăng nhập"
        disabled={isPending || isRefreshing}
        IconRight={() => (
          <ActivityIndicator className={`${!isPending && "hidden"}`} />
        )}
      />
      {/* <View className="flex items-center gap-3">
        <View className="h-px flex-1 bg-muted" />
        <Text>hoặc</Text>
        <View className="h-px flex-1 bg-muted" />
      </View>
      <View className="flex-center gap-3">
        OAuth
      </View> */}

      <Link
        href="/(auth)/forgotten"
        className="text-center block text-destructive text-lg"
      >
        Quên mật khẩu?
      </Link>
      <Link href="/sign-up" className="block text-center text-primary text-lg">
        Chưa có tài khoản? Đăng ký
      </Link>
    </View>
  );
};

export default SignInForm;
