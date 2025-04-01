import React from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { LegendList } from "@legendapp/list";
import { Book, ExtendedBook, Tag } from "@/types/app";
import { BookCover } from "../ui/BookCover";
import { useColorScheme } from "nativewind";
import { LinearGradient } from "expo-linear-gradient";
import { observer, use$ } from "@legendapp/state/react";
import { tags$ } from "@/stores/supabaseStores";
import { BookService } from "@/services/bookService";
import { authStore$ } from "@/stores/authStore";
const colors = require("@/config/colors");
type Props = {
  // tagBooks: Map<string, ExtendedBook[]>;
  onBookPress: (category: string, bookIds: string[]) => void;
  onSave: (bookId: string) => void;
};

export const TopCategoryList: React.FC<Props> = ({ onBookPress, onSave }) => {
  const userId = use$(authStore$.userId);
  if (!userId) return null;
  const { colorScheme } = useColorScheme();
  const screenWidth = Dimensions.get("window").width;
  const tagBooks = use$(() => BookService.getTopTagsBooks());

  // Convert Map to array for rendering
  const categoryEntries: [string, ExtendedBook[]][] = tagBooks ? Array.from(tagBooks.entries()) : [];
  return (
    <View className="flex flex-col px-6">
      {categoryEntries.map(([tagId, books], index) => {
        return (
          <View key={tagId} className="flex flex-col">
            <View className="px-4 mb-2">
              <Text className="text-xl font-kaisei-bold text-buttons_text-light dark:text-buttons_text-dark font-bold">
                {tags$[tagId].name.get()}
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
                extraData={books}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                  return (
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
                        onSave={() => onSave(item.id)}
                      />
                    </View>
                  );
                }}
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
        );
      })}
    </View>
  );
};
