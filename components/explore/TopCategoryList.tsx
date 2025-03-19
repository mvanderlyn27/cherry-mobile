import React from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { LegendList } from "@legendapp/list";
import { Book } from "@/types/app";
import { BookCover } from "../ui/BookCover";
import { categoryData } from "@/config/testData";
import { useColorScheme } from "nativewind";
import { LinearGradient } from "expo-linear-gradient";
const colors = require("@/config/colors");

type CategoryData = {
  name: string;
  books: Book[];
};

type Props = {
  onBookPress: (category: string) => void;
  selectedCategory?: string;
};

export const TopCategoryList: React.FC<Props> = ({ onBookPress, selectedCategory }) => {
  const { colorScheme } = useColorScheme();
  const screenWidth = Dimensions.get("window").width;

  return (
    <View className="flex flex-col px-6">
      {categoryData.map((category, index) => (
        <View key={index} className="flex flex-col">
          <View className="px-4 mb-2">
            <Text className="text-xl font-kaisei-bold text-buttons_text-light dark:text-buttons_text-dark font-bold">
              {category.name}
            </Text>
          </View>
          <View style={{ position: "relative" }}>
            <LegendList
              style={{ height: 180 }}
              className="flex flex-1"
              horizontal
              data={category.books}
              showsHorizontalScrollIndicator={false}
              estimatedItemSize={100}
              recycleItems
              renderItem={({ item }) => (
                <View className="mx-1">
                  <BookCover book={item} size={"small"} onPress={() => onBookPress(item.id)} />
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
