import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { BookPageCarousel } from "./BookPageCarousel";
import { TagList } from "../ui/TagList";
import { IconSymbol } from "../ui/IconSymbol";
import { useColorScheme } from "nativewind";
import { formatReadingTime } from "@/utils/time";
import { Book, BookTag, ExtendedBook, Icon, Tag } from "@/types/app";
import { BookCover } from "../ui/BookCover";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  withSpring,
  useAnimatedStyle,
  withTiming,
  FadeIn,
  FadeOut,
  Layout,
  SlideInRight,
  SlideOutLeft,
  LinearTransition,
  FlipInXDown,
  FlipInXUp,
  FlipInEasyX,
  FlipInEasyY,
  FadeInDown,
  FlipOutEasyX,
  SlideInLeft,
} from "react-native-reanimated";
import ActionButton from "../ui/ActionButton";
import { useRouter } from "expo-router";
import { appStore$ } from "@/stores/appStores";
import { authStore$ } from "@/stores/authStore";
import { use$ } from "@legendapp/state/react";
import { tags$, users$ } from "@/stores/supabaseStores";
const colors = require("@/config/colors");

type BookPageProps = {
  books: ExtendedBook[];
  initialBookIndex: number;
  onReadNow: (bookId: string) => void;
  toggleSave: (bookId: string) => void;
};

export const BookPage: React.FC<BookPageProps> = ({ books, initialBookIndex, onReadNow, toggleSave }) => {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const [currentBookIndex, setCurrentBookIndex] = useState(initialBookIndex);
  const [isLoading, setIsLoading] = useState(false);
  const userId = use$(authStore$.userId);
  if (!userId) {
    return null;
  }

  // get current book
  const currentBook: ExtendedBook = books[currentBookIndex];
  //get like count
  const like_count = currentBook.chapters.reduce((acc, curr) => acc + (curr.likes_count || 0), 0);
  //get tags
  const tags: Tag[] = use$(() => currentBook.tags.map((bookTag: BookTag) => tags$[bookTag.tag_id].get()));
  //get is owned
  const isUnlocked = currentBook.is_owned;
  //get if the user can buy the book
  const curCredits = use$(users$[userId].credits) || 0;
  //check if we can buy
  const canBuy = curCredits >= currentBook.price;
  console.log("current book", currentBook);

  const handleBuyBook = async (bookId: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 4000));
      console.log("Book purchased:", bookId);
    } catch (error) {
      console.error("Failed to purchase book:", error);
    } finally {
      setIsLoading(false);
      onReadNow(bookId);
    }
  };
  const handleBookChange = (bookId: string) => {
    const newIndex = books.findIndex((b) => b.id === bookId);
    if (newIndex !== -1) {
      setCurrentBookIndex(newIndex);
    }
  };

  return (
    <SafeAreaView className="h-full relative">
      <View className="w-full flex justify-center items-center p-8">
        {books.length > 1 ? (
          <BookPageCarousel books={books} initialIndex={currentBookIndex} onBookPress={handleBookChange} />
        ) : (
          <BookCover book={currentBook} size={"large"} />
        )}
      </View>

      <View className="px-6">
        {/* Action Buttons */}
        <View className="flex-row justify-between py-4">
          <Animated.View
            layout={LinearTransition.springify()}
            className="flex-1 flex-row items-center justify-center gap-2 bg-time-light dark:bg-time-dark mx-2 rounded-2xl py-3">
            <IconSymbol name={Icon.time} color={"#fff"} />
            <View className="overflow-hidden">
              <Animated.Text
                entering={FlipInEasyX.duration(300).delay(300)}
                // exiting={FlipOutEasyX.duration(300)}
                key={currentBook.id}
                className="text-sm mt-1 text-white dark:text-white">
                {formatReadingTime(currentBook.reading_time || 0, 100)}
              </Animated.Text>
            </View>
          </Animated.View>

          <Animated.View
            layout={LinearTransition.springify()}
            className="flex-1 flex-row items-center justify-center gap-2 bg-white mx-2 rounded-2xl py-3">
            <IconSymbol name={Icon.eye} color={colors["buttons_text"][colorScheme || "light"]} />
            <View className="overflow-hidden">
              <Animated.Text
                entering={FadeIn.duration(300).delay(300)}
                // exiting={FlipOutEasyX.duration(300)}
                key={currentBook.id}
                className="text-sm mt-1 text-buttons_text-light dark:text-buttons_text-dark">
                {like_count}
              </Animated.Text>
            </View>
          </Animated.View>
          <TouchableOpacity
            onPress={() => toggleSave(currentBook.id)}
            className="flex-1 flex-row items-center justify-center gap-2 bg-story-light dark:bg-story-dark mx-2 rounded-2xl py-3">
            <IconSymbol name={currentBook.is_saved ? Icon.saved : Icon.save} color={"white"} />
            <Text className="text-sm mt-1 text-white">Save</Text>
          </TouchableOpacity>
        </View>

        {/* Summary Section */}
        <View className="py-4">
          <Animated.Text
            className="text-text-light dark:text-text-dark opacity-80"
            key={currentBook.id}
            entering={FadeIn.duration(300)}
            // exiting={FadeInDown.duration(300)}
          >
            <Text className="text-lg font-bold mb-2 text-story-light dark:text-story-dark">Summary: </Text>
            {currentBook.description}
          </Animated.Text>
        </View>

        {/* Tags Section */}
        <Animated.View
          className="py-2 mb-4"
          key={currentBook.id}
          entering={FadeIn.duration(300)
            .delay(100)
            .withInitialValues({ transform: [{ translateX: -20 }] })}>
          <TagList tags={tags} />
        </Animated.View>
      </View>

      {/* Fixed Read Now Button */}
      <View className="flex flex-col gap-2 px-4 py-4 mx-4 mb-6 bg-background-light dark:bg-background-dark">
        <ActionButton mode="read" size="large" onPress={() => onReadNow(currentBook.id)} />
        {!isUnlocked ? (
          canBuy ? (
            <ActionButton
              mode="buy"
              size="large"
              credits={currentBook.price}
              onPress={() => handleBuyBook(currentBook.id)}
              isLoading={isLoading}
            />
          ) : (
            <ActionButton
              mode="buyGradient"
              size="large"
              credits={currentBook.price}
              onPress={() => router.push("/modals/cherry")}
            />
          )
        ) : (
          <></>
        )}
      </View>
    </SafeAreaView>
  );
};
