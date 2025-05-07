import React from "react";
import { View, Text, TouchableOpacity, useColorScheme } from "react-native";
import { IconSymbol } from "./IconSymbol";
import { Icon } from "@/types/app";
import { observer } from "@legendapp/state/react"; // Removed use$
const colors = require("config/colors.ts");

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
    return (
      <View
        style={
          bottomBorder && {
            borderBottomWidth: 0.5,
            borderBottomColor: colors["tab_bar_border"][colorScheme || "light"],
            // opacity: 20, // Opacity removed as discussed
          }
        }>
        <View className="flex flex-row items-center px-4  py-3">
          {/* Left Actions Container */}
          <View className=" flex-row justify-start">
            {leftActions.map((action, index) => (
              <TouchableOpacity key={index} className="mr-4" onPress={action.onPress}>
                <IconSymbol name={action.icon} size={32} color="#E57373" />
              </TouchableOpacity>
            ))}
          </View>

          {/* Title Container - NO flex-1 here, mx-2 for spacing */}
          <View className="flex-1 items-center justify-center mx-2">
            {subTitle ? (
              <View className="flex-col items-center justify-center">
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  className={`font-kaisei-bold text-xl text-story-light dark:text-story-dark ${titleClassName}`}>
                  {title}
                </Text>
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  className={`font-kaisei-bold text-md text-[#B25959] ${titleClassName}`}>
                  {subTitle}
                </Text>
              </View>
            ) : (
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                className={`font-kaisei-bold text-3xl text-[#B25959] ${titleClassName}`}>
                {title}
              </Text>
            )}
          </View>

          {/* Right Actions Container */}
          <View className=" flex-row justify-end">
            {rightActions.map((action, index) => (
              <TouchableOpacity key={index} className="ml-4" onPress={action.onPress}>
                <IconSymbol name={action.icon} size={32} color="#E57373" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    );
  }
);
export default Header;
