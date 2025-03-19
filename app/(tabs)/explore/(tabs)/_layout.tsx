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
    { id: "/explore", label: "Top" },
    { id: "/explore/forYou", label: "For You" },
    { id: "/explore/categories", label: "Categories" },
  ];

  const handleTabChange = (path: string) => {
    // const path = `/(tabs)/explore/(tabs)/${tab}` as Href;
    // console.log("path: ", path, pathname);
    router.replace(path as Href);
  };

  return (
    <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark" edges={["top", "left", "right"]}>
      <Header title="Explore" rightActions={[{ icon: Icon.search, onPress: () => router.push("/explore/search") }]} />
      <TabFilter options={tabOptions} activeTab={pathname || ""} onTabChange={handleTabChange} />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: "none" },
          animation: "shift",
        }}>
        <Tabs.Screen name="index" />
        <Tabs.Screen name="forYou" />
        <Tabs.Screen name="categories" />
      </Tabs>
    </SafeAreaView>
  );
}
