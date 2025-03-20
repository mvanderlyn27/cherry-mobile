import React from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { observer, use$ } from "@legendapp/state/react";
import { userStore$ } from "@/stores/userStore";
import { categoryData } from "@/config/testData";
import { userBookStatus } from "@/config/userTestData";
import { LibraryEmptyState } from "@/components/library/LibraryEmptyState";
import { LibraryList } from "@/components/library/LibraryList";

const CompletedPage = observer(() => {
  const router = useRouter();
  const credits = use$(userStore$.credits.get());

  const allBooks = categoryData.flatMap((category) => category.books);
  const completedBooks = allBooks.filter((book) => {
    const status = userBookStatus.find((s) => s.bookId === book.id);
    return status?.started && status.progress === 100;
  });

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      {completedBooks.length === 0 ? (
        <LibraryEmptyState />
      ) : (
        <LibraryList
          books={completedBooks}
          onBookPress={(id) => router.push(`/book/${id}`)}
          onBookRead={(id) => router.push(`/reader/${id}`)}
          onUnlockBook={(id) => console.log("Unlock book:", id)}
          credits={credits}
        />
      )}
    </View>
  );
});

export default CompletedPage;
