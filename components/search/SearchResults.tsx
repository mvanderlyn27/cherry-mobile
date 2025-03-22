import React, { useMemo } from "react";
import { View, Text, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { Book } from "@/types/app";
import { categoryData } from "@/config/testData";
import { ListBookCard } from "@/components/ui/ListBookCard";
import { LegendList } from "@legendapp/list";

type SortType = "topRated" | "mostViewed" | "newest";

type SearchResultsProps = {
  searchQuery: string;
  selectedTags: string[];
  sortBy: SortType;
};

export const SearchResults: React.FC<SearchResultsProps> = ({ searchQuery, selectedTags, sortBy }) => {
  const router = useRouter();

  // Filter and sort books based on search criteria
  const filteredBooks = useMemo(() => {
    // Get all books
    let books = categoryData.flatMap((category) => {
      // Add category to each book for filtering
      return category.books.map((book) => ({
        ...book,
        category: category.name,
      }));
    });

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      books = books.filter(
        (book) => book.title.toLowerCase().includes(query) || (book.author && book.author.toLowerCase().includes(query))
      );
    }

    // Filter by selected tags
    if (selectedTags.length > 0) {
      books = books.filter((book) => selectedTags.includes(book.category));
    }

    // Sort books
    switch (sortBy) {
      case "topRated":
        // For demo purposes, we'll sort by price as a stand-in for rating
        return books.sort((a, b) => (b.price || 0) - (a.price || 0));
      case "mostViewed":
        return books.sort((a, b) => (b.reader_count || 0) - (a.reader_count || 0));
      case "newest":
        return books.sort((a, b) => new Date(b.created_at || "").getTime() - new Date(a.created_at || "").getTime());
      default:
        return books;
    }
  }, [searchQuery, selectedTags, sortBy]);

  // Handle book selection
  const handleBookPress = (bookId: string, categoryName: string) => {
    router.navigate(`/modals/book/${bookId}?categoryId=${categoryName}`);
  };
  const handleBookRead = (bookId: string) => {
    router.navigate(`/modals/reader/${bookId}`);
  };

  return (
    <View className="flex-1 mt-4">
      {/* <Text className="text-buttons_text-light dark:text-white font-medium mb-2">{filteredBooks.length} Results</Text> */}

      {filteredBooks.length > 0 ? (
        <LegendList
          estimatedItemSize={178}
          data={filteredBooks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ListBookCard
              book={item as Book}
              onRead={() => handleBookRead(item.id)}
              onClick={() => handleBookPress(item.id, item.category)}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      ) : (
        <View className="flex-1 justify-center items-center">
          <Text className="text-buttons_text-light dark:text-white text-center">
            No books found. Try adjusting your search.
          </Text>
        </View>
      )}
    </View>
  );
};
