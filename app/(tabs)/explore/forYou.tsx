import React, { memo } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { ForYouSection } from "@/components/explore/ForYouSection";
import { bookDetailsStore$ } from "@/stores/appStores";

const Page = memo(() => {
  const router = useRouter();

  const handleBookRead = (id: string) => {
    router.push(`/modals/reader/${id}`);
  };
  const handleMoreInfo = (id: string) => {
    bookDetailsStore$.bookIds.set([id]);
    router.push(`/modals/book/${id}`);
  };

  return (
    <View className="flex-1">
      <ForYouSection onRead={handleBookRead} onMoreInfo={handleMoreInfo} />
    </View>
  );
});

Page.displayName = "ForYouTab";
export default Page;
