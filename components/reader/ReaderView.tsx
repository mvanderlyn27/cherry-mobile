import React from "react";
import { Text, View } from "react-native";
import { Chapter, ExtendedChapter } from "@/types/app";
import * as Haptics from "expo-haptics";
import Animated, { runOnJS } from "react-native-reanimated";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { authStore$ } from "@/stores/authStore";
import { use$ } from "@legendapp/state/react";
import { ReaderService } from "@/services/readerService";
import { readerStore$ } from "@/stores/appStores";

type ReaderViewProps = {
  content: string;
  onScroll?: any;
  onPress?: () => void;
  fontSize?: number; // Add fontSize prop
  paddingHorizontal?: number;
};

export const ReaderView = ({
  content,
  onScroll,
  onPress,
  fontSize = 18, // Default font size
  paddingHorizontal = 20,
}: ReaderViewProps) => {
  const handleTap = () => {
    if (onPress) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };
  // Create a tap gesture
  const tapGesture = Gesture.Tap().onEnd(() => {
    runOnJS(handleTap)();
  });

  return (
    <GestureDetector gesture={tapGesture}>
      <View className="flex-1">
        <Animated.ScrollView
          onScroll={onScroll}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          contentContainerStyle={{
            paddingVertical: 20,
            paddingHorizontal,
          }}>
          <Text
            style={{ fontSize: fontSize, lineHeight: fontSize * 2 }}
            className="leading-7 font-kaisei-medium text-story-light dark:text-gray-200">
            {content}
          </Text>
        </Animated.ScrollView>
      </View>
    </GestureDetector>
  );
};
