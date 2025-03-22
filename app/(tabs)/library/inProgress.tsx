import React, { useState } from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { observer, use$ } from "@legendapp/state/react";
import { books$ } from "@/stores/bookStore";
import { syncState } from "@legendapp/state";
import Header from "@/components/ui/Header";
import { TabFilter } from "@/components/ui/TabFilter";
import { Icon } from "@/types/app";
import { userStore$ } from "@/stores/userStore";
import { categoryData } from "@/config/testData";
import { userBookStatus } from "@/config/userTestData";
import { LibraryEmptyState } from "@/components/library/LibraryEmptyState";
import { LibraryList } from "@/components/library/LibraryList";
import { useMemo } from "react";

const Page = observer(() => {
  const router = useRouter();
  const isLoading = syncState(books$).isGetting;
  const credits = use$(userStore$.credits.get());

  const allBooks = useMemo(() => categoryData.flatMap((category) => category.books), []);

  const readingBooks = useMemo(
    () =>
      allBooks.filter((book) => {
        const status = userBookStatus.find((s) => s.bookId === book.id);
        return status?.started && status.progress < 100;
      }),
    [allBooks]
  );

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      {isLoading.get() ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-600">Loading...</Text>
        </View>
      ) : readingBooks.length === 0 ? (
        <LibraryEmptyState />
      ) : (
        <LibraryList
          books={readingBooks}
          onBookPress={(id) => router.navigate(`/book/${id}`)}
          onBookRead={(id) => router.navigate(`/reader/${id}`)}
          onUnlockBook={(id) => console.log("Unlock book:", id)}
          credits={credits}
        />
      )}
    </View>
  );
});

export default Page;
