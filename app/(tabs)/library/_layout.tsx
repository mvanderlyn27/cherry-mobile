import { Href, Tabs, usePathname } from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Header from "@/components/ui/Header";
import { TabFilter } from "@/components/ui/TabFilter";
import { Icon } from "@/types/app";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function LibraryLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const tabOptions = [
    { id: "/library/inProgress", label: "In Progress" },
    { id: "/library/unread", label: "Unread" },
    { id: "/library/completed", label: "Completed" },
  ];

  return (
    <ErrorBoundary>
      <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark" edges={["top", "left", "right"]}>
        <Header
          title="My Library"
          rightActions={[
            // { icon: Icon.edit, onPress: () => console.log("Edit") },
            // { icon: Icon.sort, onPress: () => console.log("Sort") },
            { icon: Icon.search, onPress: () => router.navigate("/modals/search?tags=library") },
          ]}
        />
        <TabFilter options={tabOptions} activeTab={pathname} onTabChange={(path) => router.replace(path as Href)} />
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: { display: "none" },
          }}
          initialRouteName="inProgress">
          <Tabs.Screen name="inProgress" />
          <Tabs.Screen name="unread" />
          <Tabs.Screen name="completed" />
          {/* <Tabs.Screen name="index" options={{ href: null }} /> */}
        </Tabs>
      </SafeAreaView>
    </ErrorBoundary>
  );
}
