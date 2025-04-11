import React from "react";
import { View, StyleSheet } from "react-native";
import { Icon } from "@/types/app";
import * as Haptics from "expo-haptics";
import { ReaderBottomBarButton } from "./ReaderBottomBarButton";

type ReaderBottomBarProps = {
  isLiked: boolean;
  onLikePress: () => void;
  onSettingsPress: () => void;
  onPreviousPress: () => void;
  onNextPress: () => void;
  isPreviousDisabled: boolean;
  isNextDisabled: boolean;
  isNextOwned: boolean;
  isPreviousOwned: boolean;
  purchaseNext: () => void;
  purchasePrevious: () => void;
};

export const ReaderBottomBar = ({
  isLiked,
  onLikePress,
  onSettingsPress,
  onPreviousPress,
  onNextPress,
  isNextOwned,
  isPreviousOwned,
  purchaseNext,
  purchasePrevious,
  isPreviousDisabled,
  isNextDisabled,
}: ReaderBottomBarProps) => {
  const handlePress = (callback: () => void) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    callback();
  };

  return (
    <View className="flex-row justify-around items-center border-t-[1px] border-tab_bar_border-light dark:border-tab_bar_border-dark py-2">
      {/* Previous Chapter Button */}

      {/* Settings Button */}
      <ReaderBottomBarButton icon={Icon.settings} label="Settings" onPress={() => handlePress(onSettingsPress)} />

      {/* Like Button */}
      <ReaderBottomBarButton
        icon={isLiked ? Icon.heart : Icon.heart_empty}
        label="Like"
        onPress={() => handlePress(onLikePress)}
      />
      <ReaderBottomBarButton
        icon={Icon["left-arrow"]}
        label="Previous"
        onPress={() => (isNextOwned ? handlePress(onPreviousPress) : purchasePrevious())}
        disabled={isPreviousDisabled}
      />

      {/* Next Chapter Button */}
      <ReaderBottomBarButton
        icon={Icon["right-arrow"]}
        label="Next"
        onPress={() => (isNextOwned ? handlePress(onNextPress) : purchaseNext())}
        disabled={isNextDisabled}
      />
    </View>
  );
};
