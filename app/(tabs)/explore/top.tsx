import React from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { TopSection } from "@/components/explore/TopSection";

export default function Page() {
  const router = useRouter();

  const handleBookPress = (id: string) => {
    router.push(`/book/${id}`);
  };

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <TopSection onBookPress={handleBookPress} />
    </View>
  );
}
