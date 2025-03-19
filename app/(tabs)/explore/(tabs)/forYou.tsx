import React, { memo } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { ForYouSection } from "@/components/explore/ForYouSection";

const ForYouTab = memo(() => {
  const router = useRouter();

  const handleBookPress = (id: string) => {
    router.push(`/explore/view/${id}`);
  };

  return (
    <View className="flex-1">
      <ForYouSection onBookPress={handleBookPress} />
    </View>
  );
});

ForYouTab.displayName = 'ForYouTab';
export default ForYouTab;