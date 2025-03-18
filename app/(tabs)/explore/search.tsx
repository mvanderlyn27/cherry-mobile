import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import Header from "@/components/ui/Header";
import { Icon } from "@/types/app";
import { View } from "react-native";

export default function Page() {
  const router = useRouter();

  return (
    // <SafeAreaView
    //   className="flex-1 bg-background-light dark:bg-background-dark"
    //   edges={["top", "left", "right", "bottom"]} // Add 'bottom' to edges
    // >
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <Header title="Search" rightActions={[{ icon: Icon.close, onPress: () => router.back() }]} />
    </View>
    // </SafeAreaView>
  );
}
