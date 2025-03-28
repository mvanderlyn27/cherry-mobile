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
import { useMemo } from "react";
import { AuthService } from "@/services/authService";
import { authStore$ } from "@/stores/authStore";
import { libraryStore$ } from "@/stores/appStores";

const Page = observer(() => {
  const router = useRouter();
  // const isLoading = syncState(books$).isGetting;

  const books = use$(libraryStore$.readingBooks);
  console.log("books", books);
  const userId = use$(authStore$.userId);
  const credits = use$(() => (userId ? users$[userId].credits : 0));

  // if (!credits) {
  //   return null;
  // }
  console.log("userId", credits);
  // const isLoading = use$(libraryStore$.isLoading);
  const isLoading = false;

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
