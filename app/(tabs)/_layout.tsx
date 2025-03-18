import { Tabs } from "expo-router";
import React from "react";
import { Platform, useColorScheme } from "react-native";
const colors = require("config/colors");

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { getThemeColor } from "@/utils/tailwindColors";
import { Icon } from "@/types/app";
import { observer, use$ } from "@legendapp/state/react";

const TabLayout = observer(() => {
  const colorScheme = useColorScheme();
  console.log("colorScheme", colorScheme, colors);
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.buttons[colorScheme || "light"],
        tabBarInactiveTintColor: colors.tabs_selected[colorScheme || "light"],
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: colors["background"][colorScheme || "light"],
          borderColor: colors["tab_bar_border"][colorScheme || "light"],
          borderTopWidth: 1,
        },
      }}>
      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          tabBarIcon: ({ color }) => <IconSymbol size={28} name={Icon.account} color={color} />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => <IconSymbol size={28} name={Icon.explore} color={color} />,
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: "My Library",
          tabBarIcon: ({ color }) => <IconSymbol size={28} name={Icon.save} color={color} />,
        }}
      />
      <Tabs.Screen
        name="cherry"
        options={{
          title: "Cherry",
          tabBarIcon: ({ color }) => <IconSymbol size={28} name={Icon.cherry} color={color} />,
        }}
      />
    </Tabs>
  );
});
export default TabLayout;
