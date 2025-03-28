import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { BookCover } from "../ui/BookCover";
import { Book, Tag } from "@/types/app";
import { TagList } from "../ui/TagList";

type BookCardProps = {
  book: Book;
  onRead: (id: string) => void;
  onMoreInfo: (id: string) => void;
  onSave?: (id: string, saved: boolean) => void;
};

export const BookCard: React.FC<BookCardProps> = ({ book, onRead, onMoreInfo, onSave }) => {
  const tags = [{ name: "18+" }, { name: "tag1" }] as Tag[];
  return (
    <View className="bg-buttons-light/10 dark:bg-button-dark/20 rounded-3xl overflow-hidden  flex-1 flex flex-col p-8">
      <View className="flex-1 items-center">
        <BookCover book={book} size="x-large" onSave={() => onSave?.(book.id, true)} />

        <View className="flex-1 w-full">
          <Text className="text-4xl text-center font-kaisei-bold text-story-light dark:text-story-dark mt-4 mb-2">
            {book.title}
          </Text>
          <TagList tags={tags} />
          <Text className="text-md text-story-light font-heebo-medium dark:text-story-dark opacity-80 my-2 flex-1">
            {book.description}
          </Text>
        </View>
      </View>

      <View className="flex-row gap-4 mt-1">
        <TouchableOpacity
          className="flex-1 bg-white dark:bg-buttons-dark rounded-full py-5"
          onPress={() => onMoreInfo?.(book.id)}>
          <Text className="text-center text-buttons_text-light dark:text-buttons_text-dark font-bold">More Info</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 bg-buttons-light dark:bg-buttons-dark rounded-full py-5 border-[1px] border-white"
          onPress={() => onRead(book.id)}>
          <Text className="text-center text-white font-bold">Read Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
