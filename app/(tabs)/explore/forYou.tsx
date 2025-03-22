import React, { memo } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { ForYouSection } from "@/components/explore/ForYouSection";

const Page = memo(() => {
  const router = useRouter();

  const handleBookRead = (id: string) => {
    router.push(`/reader/${id}`);
  };
  const handleMoreInfo = (id: string) => {
    router.push(`/book/${id}`);
  };

  return (
    <View className="flex-1">
      <ForYouSection onRead={handleBookRead} onMoreInfo={handleMoreInfo} />
    </View>
  );
});

Page.displayName = "ForYouTab";
export default Page;
