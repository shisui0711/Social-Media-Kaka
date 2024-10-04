import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { signUpSchema, SignUpValues } from "@/lib/validation";
import { toast } from "sonner-native";
import { Lock, Mail, User } from "lucide-react-native";
import { useAuthorizeApiClient } from "@/store";
import { useMutation } from "@tanstack/react-query";
import { ActivityIndicator, Text, View } from "react-native";
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";

const SignUpForm = () => {
  const { client } = useAuthorizeApiClient();
  const { isPending, mutate } = useMutation({
    mutationFn: client.signUp,
    onError(error) {
      toast.error(error.message);
    },
  });

  const { control, handleSubmit } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      repassword: "",
      firstName: "",
      lastName: "",
    },
  });

  async function onSubmit(values: SignUpValues) {
    mutate(values);
  }

  return (
    <View className="space-y-3">
      <Controller
        control={control}
        name={"firstName"}
        render={({
          field: { value, onChange, onBlur },
          fieldState: { error },
        }) => (
          <>
            <InputField
              Icon={() => (
                <User size={30} className="text-muted-foreground ml-4" />
              )}
              placeholder="Nhập họ"
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
        name={"lastName"}
        render={({
          field: { value, onChange, onBlur },
          fieldState: { error },
        }) => (
          <>
            <InputField
              Icon={() => (
                <User size={30} className="text-muted-foreground ml-4" />
              )}
              placeholder="Nhập tên"
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
        name={"email"}
        render={({
          field: { value, onChange, onBlur },
          fieldState: { error },
        }) => (
          <>
            <InputField
              Icon={() => (
                <Mail size={30} className="text-muted-foreground ml-4" />
              )}
              placeholder="Nhập địa chỉ email"
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
      <Controller
        control={control}
        name={"repassword"}
        render={({
          field: { value, onChange, onBlur },
          fieldState: { error },
        }) => (
          <>
            <InputField
              Icon={() => (
                <Lock size={30} className="text-muted-foreground ml-4" />
              )}
              placeholder="Nhập lại mật khẩu"
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
        title="Đăng ký"
        disabled={isPending}
        IconRight={() => (
          <ActivityIndicator className={`${!isPending && "hidden"}`} />
        )}
      />
    </View>
  );
};

export default SignUpForm;
