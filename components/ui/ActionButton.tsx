import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { IconSymbol } from "./IconSymbol";
import { Icon } from "@/types/app";

type ActionButtonMode = "read" | "unlock" | "buy" | "review" | "continue" | "rate";

type ButtonConfig = {
  icon: Icon;
  defaultLabel: string;
  bgColor: string;
  textColor: string;
  hasShadow: boolean;
  shadowColor?: string;
};

type ActionButtonProps = {
  mode: ActionButtonMode;
  onPress: () => void;
  credits?: number;
  label?: string;
};

export const ActionButton: React.FC<ActionButtonProps> = ({ mode, onPress, credits, label }) => {
  // Configuration for different modes
  const config: Record<ActionButtonMode, ButtonConfig> = {
    read: {
      icon: Icon.book,
      defaultLabel: "Read Now",
      bgColor: "bg-[#4CAF50]",
      textColor: "text-white",
      hasShadow: false,
    },
    unlock: {
      icon: Icon.cherry,
      defaultLabel: "| Unlock Full Story",
      bgColor: "bg-[#F8C471]",
      textColor: "text-[#E74C3C]",
      hasShadow: true,
      shadowColor: "#F8C471",
    },
    buy: {
      icon: Icon.diamond,
      defaultLabel: "Buy Now",
      bgColor: "bg-[#9C27B0]",
      textColor: "text-white",
      hasShadow: true,
      shadowColor: "#9C27B0",
    },
    review: {
      icon: Icon.star,
      defaultLabel: "Write Review",
      bgColor: "bg-[#2196F3]",
      textColor: "text-white",
      hasShadow: false,
    },
    continue: {
      icon: Icon.play,
      defaultLabel: "Continue Reading",
      bgColor: "bg-[#FF5722]",
      textColor: "text-white",
      hasShadow: false,
    },
    rate: {
      icon: Icon.star,
      defaultLabel: "Rate Story",
      bgColor: "bg-[#FFC107]",
      textColor: "text-[#5D4037]",
      hasShadow: false,
    },
  };

  const currentConfig = config[mode];
  const buttonLabel = label || currentConfig.defaultLabel;

  return (
    <TouchableOpacity
      className={`${currentConfig.bgColor} rounded-full px-4 py-3 flex flex-row items-center justify-center`}
      style={
        currentConfig.hasShadow
          ? {
              shadowColor: currentConfig.shadowColor,
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.5,
              shadowRadius: 5,
              elevation: 5,
            }
          : {}
      }
      onPress={onPress}>
      <IconSymbol
        name={currentConfig.icon}
        size={18}
        color={currentConfig.textColor === "text-white" ? "white" : "#E74C3C"}
      />

      {credits !== undefined && (
        <>
          <Text className={`font-medium ml-1 ${currentConfig.textColor}`}>{credits}</Text>
        </>
      )}

      <Text className={`font-medium ml-2 ${currentConfig.textColor}`}>{buttonLabel}</Text>
    </TouchableOpacity>
  );
};
