import React from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { observer, use$ } from "@legendapp/state/react";
import { categoryData } from "@/config/testData";
import { userBookStatus } from "@/config/userTestData";
import { LibraryEmptyState } from "@/components/library/LibraryEmptyState";
import { LibraryList } from "@/components/library/LibraryList";
import { books$, users$ } from "@/stores/supabaseStores";
import { authStore$ } from "@/stores/authStore";
import { libraryStore$ } from "@/stores/appStores";

const CompletedPage = observer(() => {
  const router = useRouter();

  const userId = use$(authStore$.userId);
  const credits = use$(() => (userId ? users$[userId].credits : 0));
  //need logic to get this, will be finished owned books
  const finishedBooks = ["992280da-51ca-4a52-8f9f-ed6f90f168c1"];
  const books = use$(libraryStore$.completedBooks);
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
          onBookPress={(id) => router.push(`/modals/book/${id}`)}
          onBookRead={(id) => router.push(`/modals/reader/${id}`)}
          onUnlockBook={(id) => console.log("Unlock book:", id)}
          credits={credits}
        />
      )}
    </View>
  );
});

export default CompletedPage;
