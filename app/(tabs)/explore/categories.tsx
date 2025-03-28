import React, { memo } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { CategoriesSection } from "@/components/explore/CategoriesSection";
import { exploreStore$ } from "@/stores/appStores";
import { use$ } from "@legendapp/state/react";

const Page = memo(() => {
  const router = useRouter();

  const handleCategoryPress = (id: string) => {
    router.push(`/modals/search?category=${id}`);
  };
  const categories = use$(exploreStore$.categories);
  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <CategoriesSection categories={categories} onCategoryPress={handleCategoryPress} />
    </View>
  );
});

Page.displayName = "CategoriesTab";
export default Page;
