import React from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { TopSection } from "@/components/explore/TopSection";
import { bookDetailsStore$ } from "@/stores/appStores";

export default function Page() {
  const router = useRouter();

  const handleBookPress = (bookId: string, bookIds: string[]) => {
    bookDetailsStore$.bookIds.set(bookIds);
    router.push(`/modals/book/${bookId}`);
  };

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <TopSection onBookPress={handleBookPress} />
    </View>
  );
}
