import React, { Suspense } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { TopBookCarousel } from "./TopBookCarousel";
import { TopCategoryList } from "./TopCategoryList";
import { categoryData } from "@/config/testData";
import { exploreStore$ } from "@/stores/appStores";
import { use$ } from "@legendapp/state/react";

type Props = {
  onBookPress: (id: string, bookIds: string[]) => void;
};

export const TopSection: React.FC<Props> = ({ onBookPress }) => {
  // Use the first few books from the Romance category for the carousel
  const carouselBooks = use$(exploreStore$.featuredBooks);
  const onBookSave = (id: string) => {
    console.log("Save", id);
  };

  return (
    <ScrollView className="flex-1">
      <Suspense fallback={<ActivityIndicator size="large" />}>
        <TopBookCarousel books={carouselBooks} onBookPress={onBookPress} onBookSave={onBookSave} />
        <TopCategoryList onBookPress={onBookPress} selectedCategory="Romance" />
      </Suspense>
    </ScrollView>
  );
};
