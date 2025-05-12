import React, { useRef } from "react";
import { View, Dimensions } from "react-native";
import Carousel, { ICarouselInstance, Pagination } from "react-native-reanimated-carousel";
import Animated, { interpolate, useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { BookCover } from "../ui/BookCover"; // Assuming BookCoverSize is "x-large" | "large" | "medium" | "small"
import { Book, ExtendedBook } from "@/types/app";
import { useColorScheme } from "nativewind";
import { bookDetailsStore$ } from "@/stores/appStores";
import { use$ } from "@legendapp/state/react";
const colors = require("@/config/colors");

type Props = {
  initialIndex: number;
  onBookPress: (id: string) => void; // For snap changes to update details
  onCenterItemPress: (id: string) => void; // For click on the centered item to read
  onBookSave?: (id: string) => void;
  onCarouselSnap?: (index: number) => void; // Added optional prop
};

// Define BookCoverSize type based on BookCover.tsx (or import if exported)
type CarouselBookCoverSize = "medium" | "large"; // Only medium/large needed here based on request

// Custom parallax animation function
const customParallaxLayout = ({ size }: { size: number }) => {
  // Keep this line as is
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

export const BookPageCarousel: React.FC<Props> = ({
  initialIndex,
  onBookPress,
  onCenterItemPress,
  onBookSave,
  onCarouselSnap,
}) => {
  const books = use$(bookDetailsStore$.books);
  if (!books || books.length === 0) return null;
  const { colorScheme } = useColorScheme();
  const screenWidth = Dimensions.get("window").width;

  // Determine BookCover size and page dimensions based on screen width
  let bookCoverSize: CarouselBookCoverSize = "large";
  let pageWidthMultiplier = 0.7; // Default for large
  let pageHeightMultiplier = 1; // Default aspect ratio for large

  if (screenWidth < 768) {
    // Use medium for screens narrower than tablets
    bookCoverSize = "medium";
    pageWidthMultiplier = 0.7; // Slightly smaller width percentage for medium
    pageHeightMultiplier = 1; // Aspect ratio for medium cover (192x256)
  }

  const PAGE_WIDTH = screenWidth * pageWidthMultiplier;
  const PAGE_HEIGHT = PAGE_WIDTH * pageHeightMultiplier; // Use multiplier for aspect ratio
  const progress = useSharedValue<number>(0);
  const carouselRef = useRef<ICarouselInstance>(null);

  // Initialize carousel to correct index
  React.useEffect(() => {
    if (carouselRef.current && initialIndex > 0) {
      carouselRef.current.scrollTo({ index: initialIndex, animated: false });
    }
  }, [initialIndex]);

  return (
    <View style={{ height: PAGE_HEIGHT }} className="flex flex-col gap-4">
      <Carousel
        ref={carouselRef}
        loop
        width={PAGE_WIDTH}
        height={PAGE_HEIGHT}
        data={books}
        defaultIndex={initialIndex}
        scrollAnimationDuration={300}
        autoPlay={false}
        pagingEnabled={true}
        snapEnabled={true}
        onProgressChange={progress}
        onSnapToItem={(index) => {
          onBookPress(books[index].id);
          if (onCarouselSnap) {
            onCarouselSnap(index);
          }
        }}
        style={{
          width: screenWidth,
          height: PAGE_HEIGHT,
          justifyContent: "center",
          alignItems: "center",
        }}
        customAnimation={customParallaxLayout({ size: PAGE_WIDTH })}
        renderItem={({ item, index, animationValue }) => (
          <CustomBookCard
            book={item}
            animationValue={animationValue}
            bookCoverSize={bookCoverSize} // Pass the determined size
            onCardActivated={onCenterItemPress}
            onSave={onBookSave || (() => console.log("Save", item.id))}
          />
        )}
      />

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
        onPress={(index) => {
          carouselRef.current?.scrollTo({
            count: index - progress.value,
            animated: true,
          });
        }}
      />
    </View>
  );
};

interface CustomBookCardProps {
  book: ExtendedBook;
  animationValue: Animated.SharedValue<number>;
  bookCoverSize: CarouselBookCoverSize; // Added prop
  onCardActivated: (id: string) => void;
  onSave: (id: string) => void;
}

// In the CustomBookCard component
const CustomBookCard: React.FC<CustomBookCardProps> = ({
  book,
  animationValue,
  bookCoverSize,
  onCardActivated,
  onSave,
}) => {
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
      onCardActivated(book.id); // Changed from onPress to onCardActivated
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
