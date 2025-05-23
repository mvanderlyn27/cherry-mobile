import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { observer, use$ } from "@legendapp/state/react";
import { categoryData } from "@/config/testData";
import { userBookStatus } from "@/config/userTestData";
import { LibraryEmptyState } from "@/components/library/LibraryEmptyState";
import { LibraryList } from "@/components/library/LibraryList";
import { books$, users$ } from "@/stores/supabaseStores";
import { authStore$ } from "@/stores/authStore";
import { BookService } from "@/services/bookService";
import { appStore$, bookDetailsStore$ } from "@/stores/appStores";
import { Book } from "@/types/app";

const UnreadPage = () => {
  const router = useRouter();
  //need logic to get this, will be unread owned books, and saved books
  const userId = use$(authStore$.userId);
  const authState = use$(authStore$.authState);
  const loggedIn = use$(appStore$.loggedIn);
  const credits = use$(users$[userId || "placeholder"].credits);
  const books = use$(() => BookService.getUnreadBooks(userId));

  const isLoading = userId === null;
  console.log(
    "userid",
    userId,
    "unread book ids",
    books.map((book) => book.id)
  );
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
      {isLoading || authState === "unauthenticated" ? (
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
};

export default UnreadPage;
