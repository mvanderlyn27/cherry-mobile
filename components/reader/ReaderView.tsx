import React, { useRef, useState } from "react";
import { Text, View, StyleSheet, NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import * as Haptics from "expo-haptics";
import Animated, { runOnJS, useAnimatedScrollHandler } from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import ActionButton from "../ui/ActionButton";
import { router } from "expo-router";

type ReaderViewProps = {
  content: string;
  // onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  lastChapter: boolean;
  onPress: () => void;
  onScroll: () => void;
  fontSize: number;
  onScrollEnd?: (isAtBottom: boolean) => void;
};

export const ReaderView = ({ content, onScroll, lastChapter, onPress, fontSize, onScrollEnd }: ReaderViewProps) => {
  const scrollViewRef = useRef<any>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);

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

  // Handle scroll with debouncing for bottom detection
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    onScroll();
  };

  // Check if user has reached the bottom when scrolling stops
  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!onScrollEnd) return;

    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 20;
    const currentIsAtBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;

    // Only call the callback if we're at the bottom
    if (currentIsAtBottom) {
      onScrollEnd(true);
    }

    setIsScrolling(false);
  };

  return (
    <GestureDetector gesture={tapGesture}>
      <View className="flex-1">
        <Animated.ScrollView
          ref={scrollViewRef}
          onScroll={handleScroll}
          onMomentumScrollEnd={handleScrollEnd}
          scrollEventThrottle={32}
          overScrollMode={"always"}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: 30,
            paddingHorizontal: 20,
            paddingBottom: 200,
          }}>
          <Text
            style={{ fontSize: fontSize, lineHeight: fontSize * 2 }}
            className="leading-7 font-kaisei-medium text-story-light dark:text-gray-200 pb-10">
            {content}
          </Text>
          {lastChapter && (
            <View className="flex-col gap-4">
              <Text className="text-center text-text-light dark:text-text-dark font-kaisei-medium text-xl">
                Congratulations! You did it!
              </Text>
              <View className="flex justify-center items-center">
                <ActionButton
                  label="Find More Stories"
                  mode={"read"}
                  onPress={() => {
                    router.dismissAll();
                    router.navigate("/explore");
                  }}
                />
              </View>
            </View>
          )}
        </Animated.ScrollView>
      </View>
    </GestureDetector>
  );
};
