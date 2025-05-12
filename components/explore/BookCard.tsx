import React from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native"; // Import Dimensions
import { BookCover } from "../ui/BookCover";
import { Book, ExtendedBook, Tag } from "@/types/app";
import { TagList } from "../ui/TagList";
import { tags$ } from "@/stores/supabaseStores";
import { use$ } from "@legendapp/state/react";

type BookCardProps = {
  book: ExtendedBook;
  onRead: (id: string) => void;
  onMoreInfo: (id: string) => void;
  onSave?: (id: string) => void;
};

// Define BookCoverSize type based on BookCover.tsx (or import if exported)
type BookCardCoverSize = "large" | "x-large";

export const BookCard: React.FC<BookCardProps> = ({ book, onRead, onMoreInfo, onSave }) => {
  const tags = use$(() => book?.tags.map((bookTag) => tags$[bookTag.tag_id].get())) || [];
  const screenWidth = Dimensions.get("window").width;

  // Determine BookCover size based on screen width
  let bookCoverSize: BookCardCoverSize = "x-large"; // Default
  if (screenWidth < 768) {
    // Use large for screens narrower than tablets
    bookCoverSize = "large";
  }

  return (
    // Adjust padding based on screen size
    <View className="bg-buttons-light/10 dark:bg-button-dark/20 rounded-3xl overflow-hidden flex-1 flex flex-col p-4 sm:p-6 md:p-8">
      <View className="flex-1 items-center">
        {/* Use dynamic book cover size */}
        <BookCover
          book={book}
          size={bookCoverSize}
          onPress={() => onMoreInfo(book.id)}
          onSave={() => onSave?.(book.id)}
        />

        <View className="flex-1 w-full">
          {/* Adjust title font size and margins */}
          <Text className="text-2xl sm:text-3xl md:text-4xl text-center font-kaisei-bold text-story-light dark:text-story-dark mt-2 sm:mt-3 md:mt-4 mb-1 sm:mb-2">
            {book.title}
          </Text>
          <TagList tags={tags.slice(0, 2)} />
          {/* Adjust description font size and margins */}
          {screenWidth >= 380 && (
            <Text className="text-sm sm:text-base text-story-light font-heebo-medium dark:text-story-dark opacity-80 my-1 sm:my-2 flex-1">
              {book.description}
            </Text>
          )}
        </View>
      </View>

      {/* Adjust button padding, font size and gap */}
      <View className="flex-row gap-2 sm:gap-3 md:gap-4 mt-1 sm:mt-2">
        <TouchableOpacity
          className="flex-1 bg-white dark:bg-buttons-dark rounded-full py-3 sm:py-4 md:py-5"
          onPress={() => onMoreInfo?.(book.id)}>
          {/* Adjust button text size */}
          <Text className="text-sm sm:text-base text-center text-buttons_text-light dark:text-buttons_text-dark font-bold">
            More Info
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 bg-buttons-light dark:bg-buttons-dark rounded-full py-3 sm:py-4 md:py-5 border-[1px] border-white"
          onPress={() => onRead(book.id)}>
          {/* Adjust button text size */}
          <Text className="text-sm sm:text-base text-center text-white font-bold">Read Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
