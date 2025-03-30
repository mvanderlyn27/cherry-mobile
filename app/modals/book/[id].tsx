import React, { useEffect } from "react";
import { View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Header from "@/components/ui/Header";
import { Icon } from "@/types/app";
import { categoryData } from "@/config/testData";
import { BookPage } from "@/components/explore/BookPage";
import { books$, generateId, savedBooks$ } from "@/stores/supabaseStores";
import { use$ } from "@legendapp/state/react";
import { bookDetailsStore$, exploreStore$, libraryStore$ } from "@/stores/appStores";
import { authStore$ } from "@/stores/authStore";
import { BookService } from "@/services/bookService";

export default function Page() {
  const { id }: { id: string } = useLocalSearchParams();
  const router = useRouter();

  // Get all relevant books (current book + related books if available)
  // const currentBook = use$(bookDetailsStore$.currentBook);

  // Combine current book with category books for display
  const bookDetails = use$(bookDetailsStore$);
  const userId = use$(authStore$.userId);
  if (!userId) return null;
  const bookIds = use$(bookDetailsStore$.bookIds.get());
  const allBooks = use$(bookDetailsStore$.books.get());
  console.log("bookIds", bookIds, "books", allBooks, "id", id, "userId", userId, "bookDetails", bookDetails);
  if (!allBooks || allBooks.length === 0) return null;
  const index = allBooks.findIndex((book) => book?.id === id);
  if (index === -1) return null;
  const handleReadNow = (bookId: string) => {
    router.push(`/modals/reader/${bookId}`);
  };
  const handleSaveToggle = (bookId: string) => {
    console.log("bookId", bookId);
    BookService.toggleSavedBook(bookId, userId);
  };
  return (
    <View className="h-full bg-background-light dark:bg-background-dark">
      <Header
        title={allBooks[index].title}
        subTitle={allBooks[index].author || undefined}
        rightActions={[{ icon: Icon.close, onPress: () => router.back() }]}
      />

      <BookPage books={allBooks} initialBookIndex={index} onReadNow={handleReadNow} toggleSave={handleSaveToggle} />
    </View>
  );
}
