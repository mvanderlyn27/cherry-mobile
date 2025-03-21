import React, { Suspense } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { TopBookCarousel } from "./TopBookCarousel";
import { TopCategoryList } from "./TopCategoryList";
import { categoryData } from "@/config/testData";

type Props = {
  onBookPress: (id: string, categoryName: string) => void;
};

export const TopSection: React.FC<Props> = ({ onBookPress }) => {
  // Use the first few books from the Romance category for the carousel
  const carouselBooks = categoryData[1].books.slice(0, 5);
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
