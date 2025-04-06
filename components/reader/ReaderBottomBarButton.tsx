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
  disabled?: boolean;
};

export const ReaderBottomBarButton = ({ 
  icon, 
  label, 
  onPress, 
  disabled = false 
}: ReaderBottomBarButtonProps) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  
  // Determine icon color based on disabled state
  const iconColor = disabled 
    ? isDark ? colors.tab_bar_border.dark : colors.tab_bar_border.light
    : isDark ? colors.tabs_selected.dark : colors.tabs_selected.light;
  
  // Determine text color based on disabled state
  const textColorClass = disabled
    ? "text-tab_bar_border-light dark:text-tab_bar_border-dark"
    : "text-tabs_selected-light dark:text-tabs_selected-dark";

  return (
    <TouchableOpacity 
      className="items-center" 
      onPress={onPress}
      disabled={disabled}
    >
      <IconSymbol
        name={icon}
        size={28}
        color={iconColor}
      />
      <Text className={`text-xs mt-1 ${textColorClass}`}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};