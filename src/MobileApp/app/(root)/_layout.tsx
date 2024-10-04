import AuthorizationProvider from "@/components/providers/AuthorizationProvider";
import { SignalRProvider } from "@/components/providers/SignalrProvider";
import { useAuth } from "@/hooks/useAuth";
import { Redirect, Stack } from "expo-router";
import React from "react";
import { ActivityIndicator, View } from "react-native";

const MainLayout = () => {
  const { user, isLoading } = useAuth();
  if (isLoading)
    return (
      <View className="flex justify-center items-center w-full h-screen">
        <ActivityIndicator size="large" />
      </View>
    );
  if (!user) {
    return <Redirect href="/(auth)/sign-in" />;
  }
  return (
    <AuthorizationProvider value={user}>
      <SignalRProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="settings" options={{ headerShown: false }} />
        </Stack>
      </SignalRProvider>
    </AuthorizationProvider>
  );
};

export default MainLayout;
