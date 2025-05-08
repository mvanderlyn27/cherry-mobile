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
import { computed } from "@legendapp/state"; // Import computed from @legendapp/state
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
  onCarouselSnap?: (index: number) => void; // Added optional prop
};

export const BookPage: React.FC<BookPageProps> = ({ initialBookIndex, onReadNow, toggleSave, onCarouselSnap }) => {
  const router = useRouter();
  const { colorScheme } = useColorScheme();

  const [currentBookIndex, setCurrentBookIndex] = useState(initialBookIndex);
  const [isLoading, setIsLoading] = useState(false);
  const userId = use$(authStore$.userId);
  const booksArray = use$(bookDetailsStore$.books); // This is now the plain array

  // currentBook will be reactive.
  const currentBook = booksArray?.[currentBookIndex];

  // Define allIndividualChaptersOwned as a computed observable (lowercase c)
  const allIndividualChaptersOwned$ = computed(() => {
    if (!currentBook || !userId) {
      // currentBook here refers to the one derived from booksArray
      return false;
    }
    const bookChapters = ChapterService.getChapters(currentBook.id);

    if (bookChapters && Object.keys(bookChapters).length > 0) {
      return Object.values(bookChapters).every((chapter) => chapter.is_owned);
    } else if (currentBook.is_owned) {
      return true;
    }
    return false;
  });

  const allChaptersOwned = use$(allIndividualChaptersOwned$);

  // Updated isUnlocked logic
  const isUnlocked = currentBook?.is_owned || allChaptersOwned;

  // Define heights for the bottom action button container based on number of buttons
  // A large ActionButton has py-4 (16px vert padding). Assume content height ~24px. Total button height ~56px.
  // Container has py-4 (16px vert padding) and gap-2 (8px).
  const singleButtonContainerHeight = 16 + 56 + 16; // 88px
  const doubleButtonContainerHeight = 16 + 56 + 8 + 56 + 16; // 152px
  const fixedBottomBarHeight = isUnlocked ? singleButtonContainerHeight : doubleButtonContainerHeight;

  if (!userId || !currentBook) {
    return (
      <View className="flex-1 justify-center items-center bg-background-light dark:bg-background-dark">
        <Text className="text-text-light dark:text-text-dark">Loading book details...</Text>
      </View>
    );
  }

  //get like count
  const like_count = currentBook.like_count || 0;
  //get tags
  const tags: Tag[] = use$(() => currentBook.tags.map((bookTag: BookTag) => tags$[bookTag.tag_id].get()));
  //get if the user can buy the book
  const curCredits = use$(users$[userId].credits);
  //check if we can buy
  const canBuy = curCredits ? curCredits >= currentBook.price : false;
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
    if (booksArray) {
      // Use booksArray directly
      const newIndex = booksArray.findIndex((b: ExtendedBook) => b.id === bookId);
      if (newIndex !== -1) {
        setCurrentBookIndex(newIndex);
      }
    }
  };

  return (
    <View className="flex-1 relative bg-background-light dark:bg-background-dark">
      {/* Top section with Carousel or BookCover */}
      <ScrollView
        className="flex-1 px-6"
        contentContainerStyle={{ paddingBottom: fixedBottomBarHeight }} // Add paddingBottom here
        showsVerticalScrollIndicator={false} // Optional: hide scrollbar if not needed
      >
        <View className="w-full flex justify-center items-center p-8">
          {booksArray && booksArray.length > 1 ? ( // Use booksArray directly
            <BookPageCarousel
              initialIndex={currentBookIndex}
              onBookPress={handleBookChange} // For snapping, updates details
              onCenterItemPress={onReadNow} // For clicking the center book to read
              onBookSave={toggleSave}
              onCarouselSnap={onCarouselSnap} // Pass down the prop
            />
          ) : (
            <BookCover
              book={currentBook}
              size={"large"}
              onSave={toggleSave}
              onPress={() => onReadNow(currentBook.id)}
            />
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
        </View>

        {/* Scrollable content area */}

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
        {/* REMOVE mb-36 from here, it's now handled by ScrollView's paddingBottom */}
        <Animated.View
          className="py-2" // Removed mb-36
          key={currentBook.id}
          entering={FadeIn.duration(300)
            .delay(100)
            .withInitialValues({ transform: [{ translateX: -20 }] })}>
          <TagList tags={tags} />
        </Animated.View>
      </ScrollView>
      {/* Fixed Read Now Button Bar - Give it a fixed height */}
      {/* <View
        className=" bg-background-light dark:bg-background-dark"
        // style={{ height: fixedBottomBarHeight }} // Apply the fixed height
      > */}
      {/* Inner container for padding and flex layout - ensure it fills the fixed height */}
      {/* Using justify-end to push buttons to the bottom of this fixed height view, with py-4 for vertical padding within the button area */}
      <View className=" flex flex-col justify-end gap-4 px-8 py-4">
        <ActionButton mode="read" size="large" onPress={() => onReadNow(currentBook.id)} />
        {!isUnlocked ? (
          canBuy ? (
            <ActionButton
              mode="buy"
              size="large"
              credits={currentBook.price}
              onPress={() => handleBuyBook(currentBook.id)}
              isLoading={isLoading}
              discountPercentage={
                currentBook.discount_percent && currentBook.discount_percent > 0
                  ? currentBook.discount_percent
                  : undefined
              }
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
        {/* </View> */}
      </View>
    </View>
  );
};
