import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import Header from "@/components/ui/Header";
import { Icon } from "@/types/app";
import { View } from "react-native";

export default function Page() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <Header
        title="BOOK_TITLE"
        leftActions={[{ icon: Icon.menu, onPress: () => console.log("menu") }]}
        rightActions={[{ icon: Icon.close, onPress: () => router.back() }]}
      />
    </View>
  );
}
