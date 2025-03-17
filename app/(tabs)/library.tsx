import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { observer } from "@legendapp/state/react";
import { AuthGate } from "@/components/AuthGate";
import { books$ } from "@/stores/bookStore";
import { Database } from "@/types/database";
import { Book } from "@/types/app";
import { syncState } from "@legendapp/state";

type LibraryTab = "all" | "reading" | "completed";

const LibraryScreen = observer(() => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<LibraryTab>("all");
  const [showAuthGate, setShowAuthGate] = useState(false);
  const isLoading = syncState(books$).isGetting;
  // const userId = userSelectors.userId.get();
  // const isAnonymous = userSelectors.isAnonymous.get();
  // const savedBooks = bookSelectors.savedBooks.get();
  // const purchasedBooks = bookSelectors.purchasedBooks.get();
  // const isLoading = bookStore.isLoading.savedBooks.get() || bookStore.isLoading.purchases.get();

  // useEffect(() => {
  //   if (userId) {
  //     bookActions.fetchSavedBooks(userId);
  //     bookActions.fetchPurchases(userId);
  //   }
  // }, [userId]);

  const handleBookPress = (bookId: string) => {
    router.push(`/reader/${bookId}`);
  };

  // const handleSaveBook = async (bookId: string) => {
  //   if (!userId || isAnonymous) {
  //     setShowAuthGate(true);
  //     return;
  //   }

  // const isSaved = bookSelectors.isBookSaved(bookId).get();

  //   if (isSaved) {
  //     await bookActions.unsaveBook(userId, bookId);
  //   } else {
  //     await bookActions.saveBook(userId, bookId);
  //   }
  // };

  const getFilteredBooks = (): Book[] => {
    return Object.values(books$.get() || {}) as Book[];
    //   // Combine saved and purchased books
    //   const allLibraryBooks = [...new Set([...savedBooks, ...purchasedBooks])];

    //   switch (activeTab) {
    //     case "reading":
    //       // Books that have reading progress but are not completed
    //       return allLibraryBooks.filter((book) => {
    //         const progress = bookSelectors.bookProgress(book.id).get();
    //         return progress && progress.chapterId > 0 && progress.chapterId < book.chapters_count - 1;
    //       });
    //     case "completed":
    //       // Books that have been read completely
    //       return allLibraryBooks.filter((book) => {
    //         const progress = bookSelectors.bookProgress(book.id).get();
    //         return progress && progress.chapterId >= book.chapters_count - 1;
    //       });
    //     case "all":
    //     default:
    //       return allLibraryBooks;
    //   }
  };

  // const handleAuthSuccess = (userId: string) => {
  //   setShowAuthGate(false);
  //   // Refresh data
  //   bookActions.fetchSavedBooks(userId);
  //   bookActions.fetchPurchases(userId);
  // };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>Your library is empty</Text>
      <Text style={styles.emptyText}>Save books from the Explore tab to add them to your library</Text>
      <TouchableOpacity style={styles.exploreButton} onPress={() => router.push("/explore")}>
        <Text style={styles.exploreButtonText}>Explore Books</Text>
      </TouchableOpacity>
    </View>
  );

  const renderBook = ({ item }: { item: Book }) => (
    <TouchableOpacity onPress={() => handleBookPress(item.id)}>
      <View className="w-full h-20 bg-pink-200 flex flex-row items-center justify-center">
        {/* <BookCard
        book={item}
        layout="horizontal"
        onPress={() => handleBookPress(item.id)}
        onSave={() => handleSaveBook(item.id)}
        isSaved={bookSelectors.isBookSaved(item.id).get()}
        isOwned={bookSelectors.isBookOwned(item.id).get()}
      /> */}

        <Text>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  const filteredBooks = getFilteredBooks();

  return (
    <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
      <StatusBar style="auto" />

      {/* {showAuthGate && (
        <AuthGate
          onAuthSuccess={handleAuthSuccess}
          onCancel={() => setShowAuthGate(false)}
          title="Sign in to save books"
          message="Create an account to save books to your library and track your reading progress"
        />
      )} */}

      <View style={styles.header}>
        <Text className="font-kaisei-bold text-[24px] text-text-light dark:text-text-dark">My Library</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "all" && styles.activeTab]}
          onPress={() => setActiveTab("all")}>
          <Text style={[styles.tabText, activeTab === "all" && styles.activeTabText]}>All</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "reading" && styles.activeTab]}
          onPress={() => setActiveTab("reading")}>
          <Text style={[styles.tabText, activeTab === "reading" && styles.activeTabText]}>Reading</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "completed" && styles.activeTab]}
          onPress={() => setActiveTab("completed")}>
          <Text style={[styles.tabText, activeTab === "completed" && styles.activeTabText]}>Completed</Text>
        </TouchableOpacity>
      </View>

      {isLoading.get() ? (
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      ) : filteredBooks.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={filteredBooks}
          renderItem={renderBook}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  activeTab: {
    backgroundColor: "#0A7EA4",
  },
  tabText: {
    color: "#333",
  },
  activeTabText: {
    color: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    padding: 16,
  },
  bookItem: {
    marginBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  emptyText: {
    textAlign: "center",
    marginBottom: 24,
    opacity: 0.7,
  },
  exploreButton: {
    backgroundColor: "#0A7EA4",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  exploreButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default LibraryScreen;
