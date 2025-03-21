import React from "react";
import { View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Header from "@/components/ui/Header";
import { Icon } from "@/types/app";
import { categoryData } from "@/config/testData";
import { BookPage } from "@/components/explore/BookPage";

export default function Page() {
  const { id, categoryId } = useLocalSearchParams();
  const router = useRouter();

  // Find the current book and related books
  const currentBook = categoryData.flatMap((cat) => cat.books).find((book) => book.id === id);
  const relatedBooks = categoryId ? categoryData.find((cat) => cat.name === categoryId)?.books : undefined;

  if (!currentBook) return null;

  const handleReadNow = () => {
    router.dismiss();
    router.push(`/reader/${currentBook.id}`);
  };

  return (
    <View className="h-full bg-background-light dark:bg-background-dark">
      <Header
        title={currentBook.title}
        subTitle={currentBook.author || undefined}
        leftActions={[{ icon: Icon.menu, onPress: () => console.log("menu") }]}
        rightActions={[{ icon: Icon.close, onPress: () => router.back() }]}
      />

      <BookPage book={currentBook} relatedBooks={relatedBooks} onReadNow={handleReadNow} />
    </View>
  );
}
