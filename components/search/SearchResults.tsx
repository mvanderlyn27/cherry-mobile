import React, { useMemo } from "react";
import { View, Text, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { Book, ExtendedBook } from "@/types/app";
import { ListBookCard } from "@/components/ui/ListBookCard";
import { LegendList } from "@legendapp/list";
import { bookDetailsStore$, searchStore$ } from "@/stores/appStores";
import { use$ } from "@legendapp/state/react";

type SortType = "topRated" | "mostViewed" | "newest";

type SearchResultsProps = {};

export const SearchResults: React.FC<SearchResultsProps> = ({}) => {
  const router = useRouter();

  // Sort books based on the selected sort type
  const books = use$(searchStore$.results);
  console.log("books", books);

  // Handle book selection
  const handleBookPress = (bookId: string, bookIds: string[]) => {
    console.log("going to book", bookId);
    bookDetailsStore$.bookIds.set(bookIds);
    router.navigate(`/modals/book/${bookId}`);
  };

  const handleBookRead = (bookId: string) => {
    router.navigate(`/modals/reader/${bookId}`);
  };

  return (
    <View className="flex-1 mt-4">
      <Text className="text-buttons_text-light dark:text-white font-medium mb-2">{books.length} Results</Text>

      {books.length > 0 ? (
        <LegendList
          estimatedItemSize={178}
          data={books}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ListBookCard
              book={item as Book}
              onRead={() => handleBookRead(item.id)}
              onClick={() =>
                handleBookPress(
                  item.id,
                  books.slice(0, 5).map((book) => book.id)
                )
              }
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
