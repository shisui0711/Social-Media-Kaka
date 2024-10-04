import React from "react";
import { Image, ScrollView, Text, View } from "react-native";
import SignUpForm from "../../components/SignUpForm";
import { Link } from "expo-router";
import { images } from "@/constants";
import { SafeAreaView } from "react-native-safe-area-context";

const SignUpPage = () => {
  return (
    <ScrollView>
      <SafeAreaView className="h-screen flex items-center justify-center p-5">
        <View className="flex w-full max-w-[512px] rounded-2xl overflow-hidden bg-card shadow-2xl">
          <View className="w-full space-y-5 p-10">
            <View className="space-y-1">
              <Image
                source={images.logo}
                alt="Logo"
                className="mx-auto w-12 h-12"
              />
              <Text className="text-2xl sm:text-3xl font-bold text-center">
                Đăng ký tài khoản Kaka
              </Text>
              <Text className="text-muted-foreground text-center">
                Nơi giao lưu với mọi người
              </Text>
            </View>
            <ScrollView className="space-y-5">
              <SignUpForm />
              <Link
                href="/(auth)/sign-in"
                className="block text-center text-lg text-primary underline"
              >
                Đã có tài khoản? Đăng nhập
              </Link>
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default SignUpPage;
