import React, { useState } from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { observer, use$ } from "@legendapp/state/react";
import { books$, users$ } from "@/stores/supabaseStores";
import { syncState } from "@legendapp/state";
import Header from "@/components/ui/Header";
import { TabFilter } from "@/components/ui/TabFilter";
import { Icon } from "@/types/app";
import { categoryData } from "@/config/testData";
import { userBookStatus } from "@/config/userTestData";
import { LibraryEmptyState } from "@/components/library/LibraryEmptyState";
import { LibraryList } from "@/components/library/LibraryList";
import { authStore$ } from "@/stores/authStore";
import { BookService } from "@/services/bookService";
import { bookDetailsStore$ } from "@/stores/appStores";

const Page = observer(() => {
  const router = useRouter();
  // const isLoading = syncState(books$).isGetting;

  // console.log("books", books);
  const userId = use$(authStore$.userId);

  const books = use$(() => (userId ? BookService.getReadingBooks() : []));
  const credits = use$(users$[userId || "placeholder"].credits);

  // if (!credits) {
  //   return null;
  // }
  console.log("userId", credits);
  // const isLoading = use$(libraryStore$.isLoading);
  const isLoading = false;
  const handleBookPress = (id: string) => {
    bookDetailsStore$.bookIds.set([id]);
    router.push(`/modals/book/${id}`);
  };

  const handleBookRead = (id: string) => {
    // readerStore$.set([id]);
    router.push(`/modals/reader/${id}`);
  };
  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-600">Loading...</Text>
        </View>
      ) : books.length === 0 ? (
        <LibraryEmptyState />
      ) : (
        <LibraryList
          books={books}
          onBookPress={(id) => handleBookPress(id)}
          onBookRead={(id) => handleBookRead(id)}
          onUnlockBook={(id) => console.log("Unlock book:", id)}
          credits={credits || 0}
        />
      )}
    </View>
  );
});

export default Page;
