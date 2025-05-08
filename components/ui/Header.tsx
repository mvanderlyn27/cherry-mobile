import React from "react";
import { View, Text, TouchableOpacity, useColorScheme } from "react-native";
import { IconSymbol } from "./IconSymbol";
import { Icon } from "@/types/app";
import { observer } from "@legendapp/state/react";
import HeaderActionButton from "./HeaderActionButton"; // Import the new component
const colors = require("config/colors.ts"); // Ensure this is correctly loaded

// Constants for sizing
const ICON_SIZE = 32;
const MARGIN_PER_BUTTON = 16; // from "mr-4" or "ml-4" (tailwind's 4 unit = 1rem = 16px by default)
const SPACE_PER_BUTTON = ICON_SIZE + MARGIN_PER_BUTTON;

type HeaderAction = {
  icon: Icon;
  onPress: () => void;
};

type HeaderProps = {
  title: string;
  subTitle?: string;
  leftActions?: HeaderAction[];
  rightActions?: HeaderAction[];
  titleClassName?: string;
  bottomBorder?: boolean;
};
const Header = observer(
  ({ title, subTitle, bottomBorder = true, leftActions = [], rightActions = [], titleClassName = "" }: HeaderProps) => {
    const colorScheme = useColorScheme();

    const numLeftActions = leftActions.length;
    const numRightActions = rightActions.length;
    const maxButtonsOnOneSide = Math.max(numLeftActions, numRightActions);
    const actionAreaWidth = maxButtonsOnOneSide * SPACE_PER_BUTTON;

    return (
      <View
        style={
          bottomBorder && {
            borderBottomWidth: 0.5,
            borderBottomColor: colors["tab_bar_border"][colorScheme || "light"],
          }
        }>
        <View className="flex flex-row items-center px-4 py-3">
          {/* Left Actions Container - Fixed width based on max buttons */}
          <View style={{ width: actionAreaWidth, justifyContent: "flex-start", flexDirection: "row" }}>
            {leftActions.map((action, index) => (
              <HeaderActionButton key={`left-${index}`} icon={action.icon} onPress={action.onPress} side="left" />
            ))}
          </View>

          {/* Title Container - Flexible and centered */}
          <View className="flex-1 items-center justify-center">
            {subTitle ? (
              <View className="flex-col items-center justify-center">
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  style={{ textAlign: "center" }}
                  className={`font-kaisei-bold text-xl text-story-light dark:text-story-dark ${titleClassName}`}>
                  {title}
                </Text>
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  style={{ textAlign: "center" }}
                  className={`font-kaisei-bold text-md text-[#B25959] ${titleClassName}`}>
                  {subTitle}
                </Text>
              </View>
            ) : (
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                style={{ textAlign: "center" }}
                className={`font-kaisei-bold text-3xl text-[#B25959] ${titleClassName}`}>
                {title}
              </Text>
            )}
          </View>

          {/* Right Actions Container - Fixed width based on max buttons */}
          <View style={{ width: actionAreaWidth, justifyContent: "flex-end", flexDirection: "row" }}>
            {rightActions.map((action, index) => (
              <HeaderActionButton key={`right-${index}`} icon={action.icon} onPress={action.onPress} side="right" />
            ))}
          </View>
        </View>
      </View>
    );
  }
);
export default Header;
