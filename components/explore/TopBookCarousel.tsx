import React, { useRef } from "react";
import { View, Dimensions } from "react-native";
import Carousel, { ICarouselInstance, Pagination } from "react-native-reanimated-carousel";
import Animated, { interpolate, SharedTransition, useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { BookCover } from "../ui/BookCover"; // Assuming BookCoverSize is "x-large" | "large" | "medium" | "small"
import { Book, ExtendedBook } from "@/types/app";
import { useColorScheme } from "nativewind";
import { BookService } from "@/services/bookService";
import { authStore$ } from "@/stores/authStore";
import { observer, use$ } from "@legendapp/state/react";
const colors = require("@/config/colors");

type Props = {
  onBookPress: (id: string, bookIds: string[]) => void;
  onBookSave?: (id: string) => void;
};

// Define BookCoverSize type based on BookCover.tsx (or import if exported)
type CarouselBookCoverSize = "small" | "medium" | "large";

// Custom parallax animation function
const customParallaxLayout = ({ size }: { size: number }) => {
  return (value: number, index: number) => {
    "worklet";
    const translateX = interpolate(value, [-1, 0, 1], [-size * 0.35, 0, size * 0.35]);

    const scale = interpolate(value, [-1, 0, 1], [0.85, 1, 0.85]);

    // Widen the z-index transition range for more stable layering
    // const zIndex = interpolate(value, [-1, 0, 1], [0, 10, 0]);
    const zIndex = Math.abs(value) < 0.6 ? 10 : 0;

    return {
      transform: [{ translateX }, { scale }],
      zIndex,
    };
  };
};

export const TopBookCarousel: React.FC<Props> = ({ onBookPress, onBookSave }) => {
  const userId = use$(authStore$.userId);
  const books: ExtendedBook[] = use$(BookService.getPopularBooks);
  if (!userId) return null;
  const { colorScheme } = useColorScheme();
  const screenWidth = Dimensions.get("window").width;

  let bookCoverSize: CarouselBookCoverSize = "medium";
  let pageWidthMultiplier = 0.65; // Default for medium

  if (screenWidth < 380) {
    // Small screens
    bookCoverSize = "small";
    pageWidthMultiplier = 0.5;
  } else if (screenWidth >= 380 && screenWidth < 768) {
    // Medium screens
    bookCoverSize = "medium";
    pageWidthMultiplier = 0.65;
  } else {
    // Large screens (screenWidth >= 768)
    bookCoverSize = "large";
    pageWidthMultiplier = 0.7;
  }

  const PAGE_WIDTH = screenWidth * pageWidthMultiplier;
  const PAGE_HEIGHT = PAGE_WIDTH * 1; // Adjusted aspect ratio for typical book covers, can be tuned
  const progress = useSharedValue<number>(0);
  const carouselRef = useRef<ICarouselInstance>(null);

  const onPressPagination = (index: number) => {
    carouselRef.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };

  return (
    <View className="flex flex-col gap-4 mb-10" style={{ height: PAGE_HEIGHT }}>
      <Carousel
        ref={carouselRef}
        loop
        width={PAGE_WIDTH}
        height={PAGE_HEIGHT}
        data={books}
        scrollAnimationDuration={800}
        autoPlay={false}
        pagingEnabled={true}
        snapEnabled={true}
        onProgressChange={progress}
        style={{
          width: screenWidth,
          height: PAGE_HEIGHT,
          justifyContent: "center",
          alignItems: "center",
        }}
        customAnimation={customParallaxLayout({ size: PAGE_WIDTH })}
        // Fix the onPress handler in renderItem
        renderItem={({ item, index, animationValue }) => {
          return (
            <CustomBookCard
              key={item.id}
              book={item}
              animationValue={animationValue}
              bookCoverSize={bookCoverSize} // Pass the determined size
              onPress={() =>
                onBookPress(
                  item.id,
                  books.map((book) => book.id)
                )
              }
              onSave={onBookSave || (() => console.log("Save", item.id))}
            />
          );
        }}
      />

      {/* Updated Pagination */}
      <Pagination.Basic
        progress={progress}
        data={books}
        dotStyle={{
          backgroundColor: colors["tabs_selected"][colorScheme || "light"],
          opacity: 0.6,
          borderRadius: 20,
        }}
        activeDotStyle={{
          backgroundColor: colors["buttons_text"][colorScheme || "light"],
          opacity: 1,
          borderRadius: 20,
        }}
        containerStyle={{ gap: 10, marginBottom: 10 }}
        onPress={onPressPagination}
      />
    </View>
  );
};

interface CustomBookCardProps {
  book: ExtendedBook;
  animationValue: Animated.SharedValue<number>;
  bookCoverSize: CarouselBookCoverSize; // Added prop
  onPress: () => void;
  onSave: (id: string) => void;
}

// In the CustomBookCard component
const CustomBookCard: React.FC<CustomBookCardProps> = ({ book, animationValue, bookCoverSize, onPress, onSave }) => {
  const cardStyle = useAnimatedStyle(() => {
    "worklet";
    const opacity = interpolate(animationValue.value, [-0.2, -0.05, 0, 0.05, 0.2], [0.8, 0.9, 1, 0.9, 0.8]);

    return {
      opacity,
    };
  }, [animationValue]);

  // Only allow press on the center item
  const handlePress = () => {
    // If this is the center item (value close to 0), allow the press
    if (Math.abs(animationValue.value) < 0.05) {
      onPress();
    }
  };
  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: 0.5,
          shadowRadius: 20,
          shadowColor: "#fff",
        },
        cardStyle,
      ]}
      sharedTransitionTag={book.id}>
      <BookCover book={book} size={bookCoverSize} onPress={handlePress} onSave={onSave} />
    </Animated.View>
  );
};
