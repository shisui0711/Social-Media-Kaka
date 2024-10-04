import { Tabs } from "expo-router";
import React from "react";
import { View } from "react-native";
import {
  Bell,
  CircleUser,
  House,
  MessageCircleMore,
} from "lucide-react-native";

const TabIcon = ({
  focused,
  Icon,
}: {
  Icon: () => React.ReactElement;
  focused: boolean;
}) => {
  return (
    <View
      className={`flex flex-row justify-center items-center rounded-full ${
        focused && "bg-general-300"
      }`}
    >
      <View
        className={`rounded-full w-12 h-12 items-center justify-center ${
          focused && "bg-general-400"
        }`}
      >
        <Icon />
      </View>
    </View>
  );
};

const TabLayout = () => {
  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "white",
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#333333",
          borderRadius: 50,
          paddingBottom: 0,
          overflow: "hidden",
          marginHorizontal: 20,
          marginBottom: 20,
          height: 78,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
          position: "absolute",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} Icon={() => <House />} />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "notifications",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} Icon={() => <Bell />} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "chat",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} Icon={() => <MessageCircleMore />} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "profile",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} Icon={() => <CircleUser />} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
