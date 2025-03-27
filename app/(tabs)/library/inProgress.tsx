import React, { useState } from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { observer, use$ } from "@legendapp/state/react";
import { books$ } from "@/stores/supabaseStores";
import { syncState } from "@legendapp/state";
import Header from "@/components/ui/Header";
import { TabFilter } from "@/components/ui/TabFilter";
import { Icon } from "@/types/app";
import { userStore$ } from "@/stores/authStore";
import { categoryData } from "@/config/testData";
import { userBookStatus } from "@/config/userTestData";
import { LibraryEmptyState } from "@/components/library/LibraryEmptyState";
import { LibraryList } from "@/components/library/LibraryList";
import { useMemo } from "react";

const Page = observer(() => {
  const router = useRouter();
  // const isLoading = syncState(books$).isGetting;
  const readingBooks: string[] = ["17286a5a-fee4-4292-944b-b54686c16418"];

  const books = use$(() => Object.values(books$.get() || {}).filter((book) => readingBooks.includes(book.id)));
  console.log("books", books);
  const credits = use$(userStore$.credits);

  if (!credits) {
    return null;
  }
  console.log("userId", credits);
  const isLoading = false;

  // const allBooks = useMemo(() => categoryData.flatMap((category) => category.books), []);

  // const readingBooks = useMemo(
  //   () =>
  //     allBooks.filter((book) => {
  //       const status = userBookStatus.find((s) => s.bookId === book.id);
  //       return status?.started && status.progress < 100;
  //     }),
  //   [allBooks]
  // );

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      {/* {isLoading.get() ? ( */}
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-600">Loading...</Text>
        </View>
      ) : readingBooks.length === 0 ? (
        <LibraryEmptyState />
      ) : (
        <LibraryList
          books={books}
          onBookPress={(id) => router.navigate(`/modals/book/${id}`)}
          onBookRead={(id) => router.navigate(`/modals/reader/${id}`)}
          onUnlockBook={(id) => console.log("Unlock book:", id)}
          credits={credits}
        />
      )}
    </View>
  );
});

export default Page;
