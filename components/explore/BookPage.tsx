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
import { appStore$, bookDetailsStore$ } from "@/stores/appStores";
import { authStore$ } from "@/stores/authStore";
import { use$ } from "@legendapp/state/react";
import { tags$, users$ } from "@/stores/supabaseStores";
import { TransactionService } from "@/services/transactionService";
import { NotificationService } from "@/services/notificationService";
import { LoggingService } from "@/services/loggingService";
import { ChapterService } from "@/services/chapterService";
const colors = require("@/config/colors");

type BookPageProps = {
  initialBookIndex: number;
  onReadNow: (bookId: string) => void;
  toggleSave: (bookId: string) => void;
};

export const BookPage: React.FC<BookPageProps> = ({ initialBookIndex, onReadNow, toggleSave }) => {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const [currentBookIndex, setCurrentBookIndex] = useState(initialBookIndex);
  const [isLoading, setIsLoading] = useState(false);
  const userId = use$(authStore$.userId);
  if (!userId) {
    return null;
  }
  const books = use$(bookDetailsStore$.books.get());
  console.log(books);
  if (!books) {
    return null;
  }
  // get current book
  const currentBook: ExtendedBook = books[currentBookIndex];
  //get like count
  const like_count = currentBook.like_count || 0;
  //get tags
  const tags: Tag[] = use$(() => currentBook.tags.map((bookTag: BookTag) => tags$[bookTag.tag_id].get()));
  //get is owned
  const isUnlocked = currentBook.is_owned;
  //get if the user can buy the book
  const curCredits = use$(users$[userId].credits) || 0;
  //check if we can buy
  const canBuy = curCredits >= currentBook.price;
  //is saved
  // console.log("current book", currentBook.is_saved);

  const handleBuyBook = async (bookId: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      const { success, error } = TransactionService.buyBook(bookId);
      if (success) {
        console.log("test");
        await ChapterService.refreshData(bookId);
        bookDetailsStore$.refreshBooks();
        NotificationService.showInfo("Bought book!");
        onReadNow(bookId);
      }
      if (error) {
        LoggingService.handleError(new Error(error), { method: "handle buy book" }, true);
      }
    } catch (error) {
      NotificationService.showError("Add more credits to buy");
      console.error("Failed to purchase book:", error);
    } finally {
      setIsLoading(false);
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
          <BookPageCarousel initialIndex={currentBookIndex} onBookPress={handleBookChange} onBookSave={toggleSave} />
        ) : (
          <BookCover book={currentBook} size={"large"} onSave={toggleSave} />
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
            {currentBook.is_saved ? (
              <IconSymbol key="saved" name={Icon.saved} color={"white"} />
            ) : (
              <IconSymbol key="unsaved" name={Icon.save} color={"white"} />
            )}

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
