import { Href, Stack, usePathname } from "expo-router";
import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Header from "@/components/ui/Header";
import { TabFilter } from "@/components/ui/TabFilter";
import { Icon } from "@/types/app";

export default function ExploreStackLayout() {
  const router = useRouter();
  const pathname = usePathname();

  const tabOptions = [
    { id: "/explore/top", label: "Top" },
    { id: "/explore/forYou", label: "For You" },
    { id: "/explore/categories", label: "Categories" },
  ];
  return (
    <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark" edges={["top", "left", "right"]}>
      <Header title="Account" />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="index">
        <Stack.Screen name="index" />
        <Stack.Screen name="readingSettings" options={{ presentation: "modal" }} />
        <Stack.Screen name="restorePurchases" options={{ presentation: "modal" }} />
        <Stack.Screen name="support" options={{ presentation: "modal" }} />
        <Stack.Screen name="termsOfService" options={{ presentation: "modal" }} />
        <Stack.Screen name="privacyPolicy" options={{ presentation: "modal" }} />
        <Stack.Screen name="deleteAccount" options={{ presentation: "modal" }} />
      </Stack>
    </SafeAreaView>
  );
}
