import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useLocalSearchParams, useRouter } from "expo-router";
import Header from "@/components/ui/Header";
import { Icon } from "@/types/app";

export default function Page() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
      <StatusBar style="dark" />
      <Header
        title="Explore"
        rightActions={[
          { icon: Icon.share, onPress: () => console.log("Share") },
          { icon: Icon.close, onPress: () => router.back() },
        ]}
      />
    </SafeAreaView>
  );
}
