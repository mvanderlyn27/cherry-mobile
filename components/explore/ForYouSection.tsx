import React from "react";
import { View, Text, Dimensions } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, { Pagination } from "react-native-reanimated-carousel";
import { Book } from "@/types/app";
import { categoryData } from "@/config/testData";
import { BookCard } from "./BookCard";
import { useColorScheme } from "nativewind";
import { exploreStore$ } from "@/stores/appStores";
import { use$ } from "@legendapp/state/react";
const colors = require("@/config/colors");

type Props = {
  onRead: (id: string) => void;
  onMoreInfo: (id: string) => void;
};

// Sample data - replace with your actual data

export const ForYouSection: React.FC<Props> = ({ onRead, onMoreInfo }) => {
  const recommendedBooks = use$(exploreStore$.recommendedBooks);
  const { colorScheme } = useColorScheme();
  const width = Dimensions.get("window").width;
  const height = Dimensions.get("window").height;
  const progress = useSharedValue<number>(0);

  const onPressPagination = (index: number) => {
    // Handle pagination press if needed
    console.log(`Pagination pressed: ${index}`);
  };

  const renderBookCard = ({ item }: { item: Book; index: number }) => {
    return (
      <BookCard
        book={item}
        onRead={onRead}
        onMoreInfo={onMoreInfo}
        onSave={(id, saved) => console.log(`Book ${id} ${saved ? "saved" : "unsaved"}`)}
      />
    );
  };

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <View className="flex-1 flex-row">
        {/* Main carousel container - takes 90% of width */}
        <View className="flex-1 items-center justify-center">
          <Carousel
            data={recommendedBooks}
            vertical
            renderItem={renderBookCard}
            width={width * 0.9}
            height={height * 0.7}
            loop
            mode="parallax"
            modeConfig={{
              parallaxScrollingScale: 0.95,
              parallaxScrollingOffset: 15, // Reduced from 30 to 15 for tighter spacing
            }}
            onProgressChange={progress}
          />
        </View>

        {/* Pagination container - takes 10% of width */}
        <View className="absolute right-0 h-full items-center justify-center">
          <Pagination.Basic
            horizontal={false}
            progress={progress}
            data={recommendedBooks}
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
            containerStyle={{
              gap: 10,
              flexDirection: "column",
              position: "absolute",
              right: 10,
              top: "50%",
              transform: [{ translateY: -50 }],
            }}
            onPress={onPressPagination}
          />
        </View>
      </View>
    </View>
  );
};
