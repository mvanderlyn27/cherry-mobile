import React, { memo } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { ForYouSection } from "@/components/explore/ForYouSection";

const Page = memo(() => {
  const router = useRouter();

  const handleBookPress = (id: string) => {
    router.push(`/reader/${id}`);
  };

  return (
    <View className="flex-1">
      <ForYouSection onBookPress={handleBookPress} />
    </View>
  );
});

Page.displayName = "ForYouTab";
export default Page;
