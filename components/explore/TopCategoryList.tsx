import React from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { LegendList } from "@legendapp/list";
import { Book, Tag } from "@/types/app";
import { BookCover } from "../ui/BookCover";
import { useColorScheme } from "nativewind";
import { LinearGradient } from "expo-linear-gradient";
import { exploreStore$ } from "@/stores/appStores";
import { use$ } from "@legendapp/state/react";
const colors = require("@/config/colors");
type Props = {
  onBookPress: (category: string, bookIds: string[]) => void;
  selectedCategory?: string;
};

export const TopCategoryList: React.FC<Props> = ({ onBookPress, selectedCategory }) => {
  const { colorScheme } = useColorScheme();
  const screenWidth = Dimensions.get("window").width;
  const topCategoryBooks = use$(exploreStore$.topCategoryBooks);

  // Convert Map to array for rendering
  const categoryEntries = topCategoryBooks ? Array.from(topCategoryBooks.entries()) : [];

  return (
    <View className="flex flex-col px-6">
      {categoryEntries.map(([category, books], index) => (
        <View key={category.id || index} className="flex flex-col">
          <View className="px-4 mb-2">
            <Text className="text-xl font-kaisei-bold text-buttons_text-light dark:text-buttons_text-dark font-bold">
              {category.name}
            </Text>
            <View
              style={{
                width: screenWidth * 0.5,
                height: 1.5,
                backgroundColor: colors["tab_bar_border"][colorScheme || "light"],
                opacity: 0.2,
                marginBottom: 4,
              }}
            />
          </View>
          <View style={{ position: "relative" }}>
            <LegendList
              style={{ height: 180 }}
              className="flex flex-1"
              horizontal
              data={books}
              showsHorizontalScrollIndicator={false}
              estimatedItemSize={100}
              recycleItems
              renderItem={({ item }) => (
                <View className="mx-1">
                  <BookCover
                    book={item}
                    size={"small"}
                    onPress={() => {
                      onBookPress(
                        item.id,
                        books.map((book) => book.id)
                      );
                    }}
                  />
                </View>
              )}
            />
            {/* Gradient overlay on the right side */}
            <LinearGradient
              colors={["rgba(255, 233, 233, 0)", "rgba(255, 233, 233, 1)"]}
              start={{ x: 0.6, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                bottom: 0,
                width: 60,
                zIndex: 10,
                pointerEvents: "none",
              }}
            />
          </View>
        </View>
      ))}
    </View>
  );
};
