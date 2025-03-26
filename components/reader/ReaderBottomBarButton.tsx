import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Icon } from "@/types/app";
import { useColorScheme } from "nativewind";
const colors = require("@/config/colors");

type ReaderBottomBarButtonProps = {
  icon: Icon;
  label: string;
  onPress: () => void;
};

export const ReaderBottomBarButton = ({ icon, label, onPress }: ReaderBottomBarButtonProps) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <TouchableOpacity className="items-center" onPress={onPress}>
      <IconSymbol
        name={icon}
        size={28}
        color={isDark ? colors.tabs_selected.dark : colors.tabs_selected.light}
      />
      <Text className="text-xs mt-1 text-tabs_selected-light dark:text-tabs_selected-dark">
        {label}
      </Text>
    </TouchableOpacity>
  );
};