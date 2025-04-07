import React, { useRef } from "react";
import { Text, View, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";
import Animated, { runOnJS } from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import ActionButton from "../ui/ActionButton";
import { router } from "expo-router";

type ReaderViewProps = {
  content: string;
  onScroll: any;
  lastChapter: boolean;
  onPress: () => void;
  fontSize: number;
  onScrollEnd?: (isAtBottom: boolean) => void; // Make sure this prop is defined
};

export const ReaderView = ({ content, onScroll, lastChapter, onPress, fontSize, onScrollEnd }: ReaderViewProps) => {
  // Reference to track content size and scroll position
  const scrollViewRef = useRef<any>(null);

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

  const handleScrollEnd = (event: any) => {
    if (!onScrollEnd) return;

    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;

    // Check if we're near the bottom (within 20px)
    const paddingToBottom = 20;
    const isAtBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;

    // Notify parent component
    onScrollEnd(isAtBottom);
  };
  console.log("lastChapter", lastChapter);
  return (
    <GestureDetector gesture={tapGesture}>
      <View className="flex-1">
        <Animated.ScrollView
          ref={scrollViewRef}
          onScroll={onScroll}
          onMomentumScrollEnd={handleScrollEnd} // Check bottom on momentum scroll end
          onScrollEndDrag={handleScrollEnd} // Check bottom on drag end
          // onContentSizeChange={handleContentSizeChange}
          // onLayout={handleLayout}
          showsVerticalScrollIndicator={false}
          // scrollEventThrottle={16}
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
