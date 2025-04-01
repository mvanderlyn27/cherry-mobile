import React, { memo } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { CategoriesSection } from "@/components/explore/CategoriesSection";
import { searchStore$ } from "@/stores/appStores";
import { use$ } from "@legendapp/state/react";
import { tags$ } from "@/stores/supabaseStores";
import { when } from "@legendapp/state";
import { Tag } from "@/types/app";
import { BookService } from "@/services/bookService";

const Page = memo(() => {
  const router = useRouter();

  const handleCategoryPress = (tag: Tag) => {
    searchStore$.tags.set([tag]);
    router.push(`/modals/search`);
  };
  const categories = use$(() => BookService.getUserTags());
  if (!categories || categories.length === 0) return null;
  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <CategoriesSection categories={categories} onCategoryPress={handleCategoryPress} />
    </View>
  );
});

Page.displayName = "CategoriesTab";
export default Page;
