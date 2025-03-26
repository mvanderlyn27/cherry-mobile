import React from "react";
import { View } from "react-native";
import { Icon } from "@/types/app";
import * as Haptics from "expo-haptics";
import { ReaderBottomBarButton } from "./ReaderBottomBarButton";

type ReaderBottomBarProps = {
  onSettingsPress: () => void;
};

export const ReaderBottomBar = ({ onSettingsPress }: ReaderBottomBarProps) => {
  const handlePress = (callback: () => void) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    callback();
  };

  return (
    <View className="flex-row justify-around items-center border-t-[1px] border-tab_bar_border-light dark:border-tab_bar_border-dark py-2">
      <ReaderBottomBarButton
        icon={Icon.settings}
        label="Settings"
        onPress={() => handlePress(onSettingsPress)}
      />
      <ReaderBottomBarButton
        icon={Icon.bookmark}
        label="Bookmark"
        onPress={() => handlePress(() => {})}
      />
      <ReaderBottomBarButton
        icon={Icon.heart}
        label="Like"
        onPress={() => handlePress(() => {})}
      />
      <ReaderBottomBarButton
        icon={Icon.comment}
        label="Comment"
        onPress={() => handlePress(() => {})}
      />
    </View>
  );
};
