import { useAuth } from "@/hooks/useAuth";
import { Redirect } from "expo-router";
import React from "react";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const IndexPage = () => {
  const { user, isLoading } = useAuth();
  if (isLoading)
    return (
      <SafeAreaView className="flex justify-center items-center w-full h-screen">
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  if (user) return <Redirect href="/(root)/(tabs)/home" />;
  return <Redirect href="/(auth)/sign-up" />;
};

export default IndexPage;
