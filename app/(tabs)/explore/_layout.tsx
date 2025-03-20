import { Href, Tabs, usePathname } from "expo-router";
import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Header from "@/components/ui/Header";
import { TabFilter } from "@/components/ui/TabFilter";
import { Icon } from "@/types/app";

export default function ExploreTabsLayout() {
  const router = useRouter();
  const pathname = usePathname();

  const tabOptions = [
    { id: "/explore/top", label: "Top" },
    { id: "/explore/forYou", label: "For You" },
    { id: "/explore/categories", label: "Categories" },
  ];
  return (
    <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark" edges={["top", "left", "right"]}>
      <Header title="Explore" rightActions={[{ icon: Icon.search, onPress: () => router.push("/search") }]} />
      <TabFilter options={tabOptions} activeTab={pathname} onTabChange={(path) => router.replace(path as Href)} />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: "none" },
        }}
        initialRouteName="top">
        <Tabs.Screen name="categories" />
        <Tabs.Screen name="forYou" />
        <Tabs.Screen name="top" />
        <Tabs.Screen name="index" options={{ href: null }} />
      </Tabs>
    </SafeAreaView>
  );
}
