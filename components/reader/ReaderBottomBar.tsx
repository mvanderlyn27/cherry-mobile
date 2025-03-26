import React from "react";
import { View, TouchableOpacity } from "react-native";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Icon } from "@/types/app";
import { useColorScheme } from "nativewind";
import * as Haptics from "expo-haptics";

type ReaderBottomBarProps = {
  onSettingsPress: () => void;
};

export const ReaderBottomBar = ({ onSettingsPress }: ReaderBottomBarProps) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const handlePress = (callback: () => void) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    callback();
  };

  return (
    <View className="flex-row justify-around items-center  border-gray-200 dark:border-gray-800 py-2">
      <TouchableOpacity className="" onPress={() => handlePress(onSettingsPress)}>
        <IconSymbol name={Icon.settings} size={28} color={isDark ? "#fff" : "#000"} />
      </TouchableOpacity>
      <TouchableOpacity className="">
        <IconSymbol name={Icon.bookmark} size={28} color={isDark ? "#fff" : "#000"} />
      </TouchableOpacity>
      <TouchableOpacity className="">
        <IconSymbol name={Icon.heart} size={28} color={isDark ? "#fff" : "#000"} />
      </TouchableOpacity>
      <TouchableOpacity className="">
        <IconSymbol name={Icon.comment} size={28} color={isDark ? "#fff" : "#000"} />
      </TouchableOpacity>
    </View>
  );
};
