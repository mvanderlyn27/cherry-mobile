import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { observer } from "@legendapp/state/react";
import { books$, categories$ } from "@/stores/bookStore";
import { syncState } from "@legendapp/state";
import { Category } from "@/types/app";

type ExploreTab = "top" | "forYou" | "categories";

const Page = observer(() => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ExploreTab>("top");
  const { width } = Dimensions.get("window");

  // const userId = userSelectors.userId.get();
  // const allBooks = bookSelectors.allBooks.get();
  const allCategories = Object.values(categories$.get() || {});

  const isLoading = syncState(books$).isGetting;

  // useEffect(() => {
  //   // Fetch data when component mounts
  //   bookActions.fetchBooks();
  //   bookActions.fetchCategories();

  //   if (userId) {
  //     bookActions.fetchSavedBooks(userId);
  //     bookActions.fetchPurchases(userId);
  //   }
  // }, [userId]);

  const handleBookPress = (bookId: string) => {
    router.push(`/reader/${bookId}`);
  };

  // const handleSaveBook = async (bookId: string) => {
  //   if (!userId) return;

  //   const isSaved = bookSelectors.isBookSaved(bookId).get();

  //   if (isSaved) {
  //     await bookActions.unsaveBook(userId, bookId);
  //   } else {
  //     await bookActions.saveBook(userId, bookId);
  //   }
  // };

  const renderTopBooks = () => {
    // Get top 5 books for the carousel
    const topBooks = Object.values(books$.get() || {}).slice(0, 5);

    return (
      <View style={styles.carouselContainer}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={width}>
          {topBooks.map((book) => (
            <View key={book.id} style={{ width: width }} className="h-20 bg-slate-400">
              {/* <BookCard
                book={book}
                layout="3d"
                onPress={() => handleBookPress(book.id)}
                onSave={() => handleSaveBook(book.id)}
                isSaved={bookSelectors.isBookSaved(book.id).get()}
                isOwned={bookSelectors.isBookOwned(book.id).get()}
              /> */}
              <Text>{book.title}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderCategoryShelf = (category: Category) => {
    // Get books for this category (in a real app, you'd filter by category)
    const categoryBooks = Object.values(books$.get() || {}).slice(0, 5);
    return (
      <View key={category.id} style={styles.categoryShelf}>
        <Text style={styles.categoryTitle}>{category.name}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categoryBooks.map((book) => (
            <View key={book.id} style={{ width: width }} className="h-20 bg-slate-400">
              {/* <BookCard
              book={book}
              layout="3d"
              onpress={() => handlebookpress(book.id)}
              onsave={() => handlesavebook(book.id)}
              issaved={bookselectors.isbooksaved(book.id).get()}
              isowned={bookSelectors.isBookOwned(book.id).get()}
            /> */}
              <Text>{book.title}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderForYouBooks = () => {
    // In a real app, these would be personalized recommendations
    const recommendedBooks = Object.values(books$.get() || {}).slice(0, 5);

    return (
      <View style={styles.forYouContainer}>
        {recommendedBooks.map((book) => (
          <View key={book.id} style={{ width: width }} className="h-20 bg-slate-400">
            {/* <BookCard
            book={book}
            layout="3d"
            onPress={() => handleBookPress(book.id)}
            onSave={() => handleSaveBook(book.id)}
            isSaved={bookSelectors.isBookSaved(book.id).get()}
            isOwned={bookSelectors.isBookOwned(book.id).get()}
          /> */}
            <Text>{book.title}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "top":
        return (
          <ScrollView>
            {renderTopBooks()}
            {allCategories.map(renderCategoryShelf)}
          </ScrollView>
        );
      case "forYou":
        return renderForYouBooks();
      case "categories":
        return <ScrollView>{allCategories.map(renderCategoryShelf)}</ScrollView>;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <Text style={styles.title}>Explore</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "top" && styles.activeTab]}
          onPress={() => setActiveTab("top")}>
          <Text style={[styles.tabText, activeTab === "top" && styles.activeTabText]}>Top</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "forYou" && styles.activeTab]}
          onPress={() => setActiveTab("forYou")}>
          <Text style={[styles.tabText, activeTab === "forYou" && styles.activeTabText]}>For You</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "categories" && styles.activeTab]}
          onPress={() => setActiveTab("categories")}>
          <Text style={[styles.tabText, activeTab === "categories" && styles.activeTabText]}>Categories</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      ) : (
        renderTabContent()
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
  carouselContainer: {
    height: 350,
    marginBottom: 24,
  },
  carouselItem: {
    justifyContent: "center",
    alignItems: "center",
  },
  categoryShelf: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  shelfItem: {
    marginRight: 16,
    width: 120,
  },
  bookCard: {
    width: 120,
  },
  forYouContainer: {
    padding: 16,
  },
  forYouItem: {
    marginBottom: 16,
  },
});

export default Page;
