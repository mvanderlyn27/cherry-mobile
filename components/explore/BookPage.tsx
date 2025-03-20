import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { BookPageCarousel } from "./BookPageCarousel";
import { TagList } from "../ui/TagList";
import { IconSymbol } from "../ui/IconSymbol";
import { useColorScheme } from "nativewind";
import { formatReadingTime } from "@/utils/time";
import { Book, Icon } from "@/types/app";
import { BookCover } from "../ui/BookCover";
const colors = require("@/config/colors");

type BookPageProps = {
  book: Book;
  relatedBooks?: Book[];
  onReadNow: () => void;
};

export const BookPage: React.FC<BookPageProps> = ({ book, relatedBooks, onReadNow }) => {
  const { colorScheme } = useColorScheme();
  const booksToShow = relatedBooks ? [book, ...relatedBooks.filter((b) => b.id !== book.id)] : [book];

  return (
    <View className="flex-1">
      <ScrollView className="flex-1">
        {/* <View className="h-96"> */}
        {relatedBooks ? (
          <BookPageCarousel books={booksToShow} onBookPress={(id) => console.log("book pressed", id)} />
        ) : (
          <View className="w-full flex justify-center items-center p-8">
            <BookCover book={book} size={"large"} />
          </View>
        )}
        {/* </View> */}

        <View className="px-6">
          {/* Action Buttons */}
          <View className="flex-row justify-between py-4">
            <View className="flex-1 flex-row items-center justify-center gap-2 bg-time-light dark:bg-time-dark mx-2 rounded-2xl py-3">
              <IconSymbol name={Icon.time} color={"#fff"} />
              <Text className="text-sm mt-1 text-white dark:text-white">
                {formatReadingTime(book.reading_time || 0, 100)}
              </Text>
            </View>
            <View className="flex-1 flex-row items-center justify-center gap-2 bg-white mx-2 rounded-2xl py-3">
              <IconSymbol name={Icon.eye} color={colors["buttons_text"][colorScheme || "light"]} />
              <Text className="text-sm mt-1 text-buttons_text-light dark:text-buttons_text-dark">
                {book.reader_count?.toLocaleString() || "0"}
              </Text>
            </View>
            <TouchableOpacity className="flex-1 flex-row items-center justify-center gap-2 bg-story-light dark:bg-story-dark mx-2 rounded-2xl py-3">
              <IconSymbol name={Icon.save} color={"white"} />
              <Text className="text-sm mt-1 text-white">Save</Text>
            </TouchableOpacity>
          </View>

          {/* Summary Section */}
          <View className="py-4">
            <Text className="text-text-light dark:text-text-dark opacity-80">
              <Text className="text-lg font-bold mb-2 text-story-light dark:text-story-dark">Summary: </Text>
              {book.preview_text}
            </Text>
          </View>

          {/* Tags Section */}
          <View className="py-2 mb-4">
            <TagList tags={[{ label: "Romance" }, { label: "Drama" }, { label: "Fiction" }]} />
          </View>
        </View>
      </ScrollView>

      {/* Fixed Read Now Button */}
      <View className="px-4 py-4 mx-4 mb-6 bg-background-light dark:bg-background-dark">
        <TouchableOpacity
          className="bg-buttons-light dark:bg-buttons-dark rounded-full py-4 border-2 border-white"
          onPress={onReadNow}>
          <Text className="text-center text-white font-bold text-lg">Read Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
