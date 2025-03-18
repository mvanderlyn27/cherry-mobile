import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { IconSymbol } from "./IconSymbol";
import { Icon } from "@/types/app";
import { useColorScheme } from "nativewind";
const colors = require("@/config/colors");

type ActionButtonMode = "read" | "unlock" | "buy" | "review1" | "review2" | "continue";

type ActionButtonProps = {
  mode: ActionButtonMode;
  onPress: () => void;
  credits?: number;
  label?: string;
};

const ActionButton = ({ mode, onPress, credits, label }: ActionButtonProps) => {
  const { colorScheme } = useColorScheme();

  const getButtonClasses = () => {
    switch (mode) {
      case "read":
        return "bg-buttons-light dark:bg-buttons-dark";
      case "unlock":
        return "bg-buttons_2-light dark:bg-buttons_2-dark";
      case "buy":
        return "bg-white dark:bg-white";
      case "review1":
        return "bg-white dark:white";
      case "review2":
        return "bg-white dark:white";
      case "continue":
        return "bg-white dark:white";
      default:
        return "bg-buttons-light dark:bg-buttons-dark";
    }
  };

  const getTextClasses = () => {
    switch (mode) {
      case "continue":
        return "text-buttons_text-light dark:buttons_text-text-dark";
      case "review1":
        return "text-buttons_text-light dark:buttons_text-text-dark";
      case "review2":
        return "text-buttons_text-light dark:buttons_text-text-dark";
      case "buy":
        return "text-cherry-light dark:text-cherry-dark";
      case "unlock":
      case "read":
        return "text-white";
      default:
        return "text-story-light dark:text-story-dark";
    }
  };

  const getIcon = () => {
    switch (mode) {
      case "unlock":
        return Icon.cherry;
      case "buy":
        return Icon.cherry;
      default:
        return null;
    }
  };

  const getDefaultLabel = () => {
    switch (mode) {
      case "read":
        return "Read Now";
      case "unlock":
        return "| Unlock Full Story";
      case "buy":
        return "| Get Cherries";
      case "review1":
        return "Read Story";
      case "review2":
        return "Rate Now";
      case "continue":
        return "Continue Reading";
      default:
        return "Read Now";
    }
  };
  // Get shadow configuration
  const getShadowClasses = () => {
    switch (mode) {
      case "unlock":
        return `shadow-[0_0_5px_${colors["buttons_2_shadow"][colorScheme || "light"] || "white"}]`;
      case "buy":
        return `shadow-[0_0_5px_${colors["cherry"][colorScheme || "light"]}]`;
      default:
        return "";
    }
  };

  // Get border configuration for buy and unlock modes
  const getBorderClasses = () => {
    switch (mode) {
      case "unlock":
        return "border border-white";

      case "buy":
        return "border border-cherry-light dark:border-cherry-dark";
      default:
        return "";
    }
  };
  const icon = getIcon();
  const buttonLabel = label || getDefaultLabel();
  const buttonClasses = getButtonClasses();
  const textClasses = getTextClasses();
  const borderClasses = getBorderClasses();
  const shadowClasses = getShadowClasses();

  const getIconColor = () => {
    switch (mode) {
      case "buy":
        return colors.cherry[colorScheme || "light"];
      case "unlock":
      case "read":
        return "#FFFFFF";
      default:
        return colors.story[colorScheme || "light"];
    }
  };

  // Get shadow configuration
  const getShadowStyle = () => {
    switch (mode) {
      case "unlock":
        return {
          shadowColor: colors.buttons_2_shadow[colorScheme || "light"],
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 1,
          shadowRadius: 5,
          elevation: 5,
        };
      case "buy":
        return {
          shadowColor: colors.cherry[colorScheme || "light"],
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 1,
          shadowRadius: 5,
          elevation: 5,
        };
      default:
        return {};
    }
  };

  // Get border configuration
  const getBorderStyle = () => {
    switch (mode) {
      case "unlock":
        return {
          borderWidth: 1,
          borderColor: "#FFFFFF",
        };
      case "buy":
        return {
          borderWidth: 1,
          borderColor: colors.cherry[colorScheme || "light"],
        };
      default:
        return {};
    }
  };

  return (
    <TouchableOpacity
      style={[getShadowStyle(), getBorderStyle()]}
      className={`${buttonClasses} rounded-full px-4 py-3 flex flex-row items-center justify-center`}
      onPress={onPress}>
      {icon && <IconSymbol name={icon} size={18} color={getIconColor()} />}

      {credits !== undefined && <Text className={`font-heebo-medium ml-1 ${textClasses}`}>{credits}</Text>}

      <Text className={`font-heebo-medium ml-2 ${textClasses}`}>{buttonLabel}</Text>
    </TouchableOpacity>
  );
};

export default ActionButton;
