import React from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { observer, use$ } from "@legendapp/state/react";
import { userStore$ } from "@/stores/authStore";
import { categoryData } from "@/config/testData";
import { userBookStatus } from "@/config/userTestData";
import { LibraryEmptyState } from "@/components/library/LibraryEmptyState";
import { LibraryList } from "@/components/library/LibraryList";
import { books$ } from "@/stores/supabaseStores";

const UnreadPage = observer(() => {
  const router = useRouter();
  const credits = use$(userStore$.credits.get());
  //need logic to get this, will be unread owned books, and saved books
  const unReadBooks = ["454fc1f6-6f7d-4d9e-8788-b9524c9a9332"];
  const books = use$(() => Object.values(books$.get() || {}).filter((book) => unReadBooks.includes(book.id)));

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      {books.length === 0 ? (
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

export default UnreadPage;
