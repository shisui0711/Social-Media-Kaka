import React from "react";
import { Image, ScrollView, Text, View } from "react-native";
import SignInForm from "../../components/SignInForm";
import { images } from "@/constants";

const SignInPage = () => {
  return (
    <ScrollView>
      <View className="h-screen flex items-center justify-center p-5">
        <View className="flex w-full max-w-[32rem] rounded-2xl overflow-hidden bg-card shadow-2xl">
          <View className="w-full space-y-10 p-10">
            <View className="space-y-1">
              <Image
                source={images.logo}
                alt="Logo"
                className="mx-auto w-12 h-12"
              />
              <Text className="text-3xl font-bold text-center ">
                Đăng nhập vào Kaka
              </Text>
              <Text className="text-muted-foreground text-center">
                Nơi giao lưu với mọi người
              </Text>
            </View>
            <SignInForm />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignInPage;
