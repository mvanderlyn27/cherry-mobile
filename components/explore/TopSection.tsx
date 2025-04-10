import React, { Suspense } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { TopBookCarousel } from "./TopBookCarousel";
import { TopCategoryList } from "./TopCategoryList";
import { categoryData } from "@/config/testData";
import { Memo, observer, use$ } from "@legendapp/state/react";
import { authStore$ } from "@/stores/authStore";
import { BookService } from "@/services/bookService";

type Props = {
  onBookPress: (id: string, bookIds: string[]) => void;
};

export const TopSection: React.FC<Props> = observer(({ onBookPress }) => {
  // Use the first few books from the Romance category for the carousel
  const userId = use$(authStore$.userId);
  if (!userId) return null;
  const onBookSave = (id: string) => {
    BookService.toggleSavedBook(userId, id);
  };

  return (
    <ScrollView className="flex-1">
      <Suspense fallback={<ActivityIndicator size="large" />}>
        <TopBookCarousel onBookPress={onBookPress} onBookSave={onBookSave} />
        <TopCategoryList onBookPress={onBookPress} onSave={onBookSave} />
      </Suspense>
    </ScrollView>
  );
});
