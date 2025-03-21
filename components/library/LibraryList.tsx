import React from "react";
import { View } from "react-native";
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

export const LibraryList = ({ books, onBookPress, onBookRead, onUnlockBook, credits }: LibraryListProps) => {
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
            owned={true}
            progress={0}
            onClick={onBookPress}
            onRead={onBookRead}
            buyBook={onUnlockBook}
            credits={item.price}
            canBuy={credits >= (item.price || 0)}
            started={false}
          />
        </View>
      )}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
    />
  );
};
