import React, { memo } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { CategoriesSection } from "@/components/explore/CategoriesSection";

const CategoriesTab = memo(() => {
  const router = useRouter();

  const handleBookPress = (id: string) => {
    router.push(`/explore/view/${id}`);
  };

  return (
    <View className="flex-1">
      <CategoriesSection onBookPress={handleBookPress} />
    </View>
  );
});

CategoriesTab.displayName = 'CategoriesTab';
export default CategoriesTab;