import React, { Suspense } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { TopBookCarousel } from "./TopBookCarousel";
import { TopCategoryList } from "./TopCategoryList";
import { categoryData } from "@/config/testData";

type Props = {
  onBookPress: (id: string) => void;
};

export const TopSection: React.FC<Props> = ({ onBookPress }) => {
  // Use the first few books from the Romance category for the carousel
  const carouselBooks = categoryData[1].books.slice(0, 5);

  return (
    <ScrollView className="flex-1">
      <Suspense fallback={<ActivityIndicator size="large" />}>
        <TopBookCarousel books={carouselBooks} onBookPress={onBookPress} />
        <TopCategoryList 
          onCategoryPress={(category) => console.log(category)} 
          selectedCategory="Romance" 
        />
      </Suspense>
    </ScrollView>
  );
};
