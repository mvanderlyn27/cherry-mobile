import React from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { observer, use$ } from "@legendapp/state/react";
import { userStore$ } from "@/stores/userStore";
import { categoryData } from "@/config/testData";
import { userBookStatus } from "@/config/userTestData";
import { LibraryEmptyState } from "@/components/library/LibraryEmptyState";
import { LibraryList } from "@/components/library/LibraryList";

const UnreadPage = observer(() => {
  const router = useRouter();
  const credits = use$(userStore$.credits.get());

  const allBooks = categoryData.flatMap((category) => category.books);
  const unreadBooks = allBooks.filter((book) => {
    const status = userBookStatus.find((s) => s.bookId === book.id);
    return !status?.started;
  });

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      {unreadBooks.length === 0 ? (
        <LibraryEmptyState />
      ) : (
        <LibraryList
          books={unreadBooks}
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
