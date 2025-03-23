import React from "react";
import { View, Text } from "react-native";
import { ListBookCard } from "../ui/ListBookCard";
import { Book } from "@/types/app";
import { LegendList } from "@legendapp/list";

type LibraryListProps = {
  books: Book[];
  onBookPress: (id: string) => void;
  onBookRead: (id: string) => void;
  onUnlockBook: (id: string) => void;
  credits: number;
};

export const LibraryList = ({ books = [], onBookPress, onBookRead, onUnlockBook, credits }: LibraryListProps) => {
  if (!books || books.length === 0) {
    return <Text>No Data</Text>;
  }

  return (
    <LegendList
      data={books}
      className="flex-1"
      recycleItems
      estimatedItemSize={178}
      renderItem={({ item }) => (
        <View className="px-4">
          <ListBookCard
            book={item}
            owned={false}
            progress={10}
            onClick={onBookPress}
            onRead={onBookRead}
            buyBook={onUnlockBook}
            canBuy={credits >= (item?.price || 0)}
            started={false}
          />
        </View>
      )}
      keyExtractor={(item) => item?.id || Math.random().toString()}
      showsVerticalScrollIndicator={false}
    />
  );
};
