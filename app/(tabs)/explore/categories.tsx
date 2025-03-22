import React, { memo } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { CategoriesSection } from "@/components/explore/CategoriesSection";
import { categoryData } from "@/config/testData";

const Page = memo(() => {
  const router = useRouter();

  const handleCategoryPress = (id: string) => {
    router.push(`/modals/search?category=${id}`);
  };
  const categories = categoryData.map((category) => ({
    id: Math.random(),
    name: category.name,
    image_url: "https://picsum.photos/200/300",
  }));
  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <CategoriesSection categories={categories} onCategoryPress={handleCategoryPress} />
    </View>
  );
});

Page.displayName = "CategoriesTab";
export default Page;
