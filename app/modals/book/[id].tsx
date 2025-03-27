import React from "react";
import { View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Header from "@/components/ui/Header";
import { Icon } from "@/types/app";
import { categoryData } from "@/config/testData";
import { BookPage } from "@/components/explore/BookPage";
import { books$ } from "@/stores/supabaseStores";
import { use$ } from "@legendapp/state/react";

export default function Page() {
  const { id, categoryId } = useLocalSearchParams();
  const router = useRouter();

  // Get all relevant books (current book + related books if available)
  const currentBook = use$(() => Object.values(books$.get()).find((book) => book.id === id));
  const allBooks = React.useMemo(() => {
    if (!currentBook) return [];

    //get these all from the db instead of here lol
    if (categoryId) {
      const categoryBooks = categoryData.find((cat) => cat.name === categoryId)?.books || [];
      // Ensure current book is first if it's in the category
      const filteredBooks = categoryBooks.filter((book) => book.id !== currentBook.id);
      return [currentBook, ...filteredBooks];
    }

    return [currentBook];
  }, [id, categoryId]);

  if (allBooks.length === 0) return null;

  const handleReadNow = (bookId: string) => {
    router.push(`/modals/reader/${bookId}`);
  };
  return (
    <View className="h-full bg-background-light dark:bg-background-dark">
      <Header
        title={allBooks[0].title}
        subTitle={allBooks[0].author || undefined}
        leftActions={[{ icon: Icon.menu, onPress: () => console.log("menu") }]}
        rightActions={[{ icon: Icon.close, onPress: () => router.back() }]}
      />

      <BookPage books={allBooks} initialBookId={id as string} onReadNow={handleReadNow} />
    </View>
  );
}
