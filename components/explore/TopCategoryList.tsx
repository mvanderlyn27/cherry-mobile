import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { LegendList } from "@legendapp/list";
import { Book } from "@/types/app";
import { BookCover } from "../ui/BookCover";
import { categoryData } from "@/config/testData";

type CategoryData = {
  name: string;
  books: Book[];
};

type Props = {
  onCategoryPress: (category: string) => void;
  selectedCategory?: string;
};

export const TopCategoryList: React.FC<Props> = ({ onCategoryPress, selectedCategory }) => {
  return (
    <View className="flex flex-col gap-2">
      {categoryData.map((category, index) => (
        <View key={index} className="flex flex-col">
          <Text className="text-xl font-bold px-4 py-2">{category.name}</Text>
          <LegendList
            style={{ height: 154 }}
            horizontal
            data={category.books}
            showsHorizontalScrollIndicator={false}
            estimatedItemSize={100}
            recycleItems
            renderItem={({ item }) => (
              <View className="mx-1">
                <BookCover book={item} size={"small"} onPress={() => onCategoryPress(category.name)} />
              </View>
            )}
          />
        </View>
      ))}
    </View>
  );
};
