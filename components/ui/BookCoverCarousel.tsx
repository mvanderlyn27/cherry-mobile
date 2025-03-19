import React from "react";
import { View, Dimensions } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import Animated, { interpolate, useAnimatedStyle } from "react-native-reanimated";
import { BookCover } from "./BookCover";
import { Book } from "@/types/app";

type Props = {
  books: Book[];
  onBookPress: (id: string) => void;
  onBookSave?: (id: string) => void;
};

// Custom parallax animation function
const customParallaxLayout = ({ size }: { size: number }) => {
  return (value: number, index: number) => {
    "worklet";
    const translateX = interpolate(value, [-1, 0, 1], [-size * 0.4, 0, size * 0.4]);

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

export const BookCoverCarousel: React.FC<Props> = ({ books, onBookPress, onBookSave }) => {
  const width = Dimensions.get("window").width;
  const PAGE_WIDTH = width * 0.7;
  const PAGE_HEIGHT = PAGE_WIDTH * 1.5;

  return (
    <View style={{ height: PAGE_HEIGHT, marginBottom: 20 }}>
      <Carousel
        loop
        width={PAGE_WIDTH}
        height={PAGE_HEIGHT}
        data={books}
        scrollAnimationDuration={800} // Slightly faster for more responsive feel
        autoPlay={false}
        pagingEnabled={true}
        snapEnabled={true}
        style={{
          width: width,
          height: PAGE_HEIGHT,
          justifyContent: "center",
          alignItems: "center",
        }}
        customAnimation={customParallaxLayout({ size: PAGE_WIDTH })}
        renderItem={({ item, index, animationValue }) => (
          <CustomBookCard
            book={item}
            animationValue={animationValue}
            onPress={onBookPress || (() => console.log("Save", item.id))}
            onSave={onBookSave || (() => console.log("Save", item.id))}
          />
        )}
      />
    </View>
  );
};

interface CustomBookCardProps {
  book: Book & { isHot?: boolean; isSaved?: boolean };
  animationValue: Animated.SharedValue<number>;
  onPress: (id: string) => void;
  onSave: (id: string) => void;
}

// In the CustomBookCard component
const CustomBookCard: React.FC<CustomBookCardProps> = ({ book, animationValue, onPress, onSave }) => {
  const cardStyle = useAnimatedStyle(() => {
    "worklet";
    const opacity = interpolate(animationValue.value, [-0.2, -0.05, 0, 0.05, 0.2], [0.8, 0.9, 1, 0.9, 0.8]);
    const translateY = interpolate(animationValue.value, [-1, 0, 1], [10, 0, 10]);

    return {
      opacity,
      transform: [{ translateY }],
    };
  }, [animationValue]);

  // Only allow press on the center item
  const handlePress = () => {
    // If this is the center item (value close to 0), allow the press
    if (Math.abs(animationValue.value) < 0.1) {
      onPress(book.id);
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
        },
        cardStyle,
      ]}>
      <BookCover book={book} size="large" onPress={handlePress} onSave={onSave} />
    </Animated.View>
  );
};
