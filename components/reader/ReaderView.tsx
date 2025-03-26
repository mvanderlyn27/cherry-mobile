import React from "react";
import { Text, View } from "react-native";
import { Chapter } from "@/types/app";
import * as Haptics from "expo-haptics";
import Animated, { runOnJS } from "react-native-reanimated";
import { GestureDetector, Gesture } from "react-native-gesture-handler";

type ReaderViewProps = {
  chapter: Chapter & { content: string };
  onScroll?: any;
  onPress?: () => void;
  fontSize?: number; // Add fontSize prop
  paddingHorizontal?: number;
};

export const ReaderView = ({
  chapter,
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
          scrollEventThrottle={16}
          contentContainerStyle={{
            paddingVertical: 20,
            paddingHorizontal,
          }}>
          <Text
            style={{ fontSize: fontSize }}
            className="leading-7 font-kaisei-medium text-story-light dark:text-gray-200">
            {chapter.content}
          </Text>
        </Animated.ScrollView>
      </View>
    </GestureDetector>
  );
};
