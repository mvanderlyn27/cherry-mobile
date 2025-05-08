import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Header from "@/components/ui/Header";
import { Icon } from "@/types/app";
import { categoryData } from "@/config/testData";
import { BookPage } from "@/components/explore/BookPage";
import { books$, generateId, savedBooks$ } from "@/stores/supabaseStores";
import { use$ } from "@legendapp/state/react";
import { bookDetailsStore$ } from "@/stores/appStores";
import { authStore$ } from "@/stores/authStore";
import { BookService } from "@/services/bookService";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  const { id }: { id: string } = useLocalSearchParams();
  const router = useRouter();
  // Get all relevant books (current book + related books if available)
  // const currentBook = use$(bookDetailsStore$.currentBook);

  // Combine current book with category books for display
  const userId = use$(authStore$.userId);
  if (!userId) return null;
  const allBooks = use$(bookDetailsStore$.books);
  if (!allBooks || allBooks.length === 0) return null;
  const initialBookIndex = allBooks.findIndex((book) => book?.id === id); // Renamed for clarity
  if (initialBookIndex === -1) {
    return null;
  }

  const [headerBookIndex, setHeaderBookIndex] = useState(initialBookIndex);

  const handleReadNow = (bookId: string) => {
    router.push(`/modals/reader/${bookId}`);
  };
  const handleSaveToggle = (bookId: string) => {
    console.log("bookId", bookId);
    BookService.toggleSavedBook(userId, bookId);
  };
  return (
    <SafeAreaView
      className="flex-1 w-full h-full bg-background-light dark:bg-background-dark"
      edges={["top", "left", "right", "bottom"]}>
      <Header
        title={allBooks[headerBookIndex].title}
        subTitle={allBooks[headerBookIndex].author || undefined}
        rightActions={[{ icon: Icon.close, onPress: () => router.back() }]}
      />

      <BookPage
        initialBookIndex={initialBookIndex}
        onReadNow={handleReadNow}
        toggleSave={handleSaveToggle}
        onCarouselSnap={setHeaderBookIndex}
      />
    </SafeAreaView>
  );
}
