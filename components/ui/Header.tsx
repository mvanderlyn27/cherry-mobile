import React from "react";
import { View, Text, TouchableOpacity, useColorScheme } from "react-native";
import { IconSymbol } from "./IconSymbol";
import { Icon } from "@/types/app";
import { observer, use$ } from "@legendapp/state/react";
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
            opacity: 20,
          }
        }>
        <View className="flex flex-row items-center justify-between  px-6 py-3  ">
          {leftActions.length > 0 && (
            <View className="flex flex-row">
              {leftActions.map((action, index) => (
                <TouchableOpacity key={index} className="mr-4" onPress={action.onPress}>
                  <IconSymbol name={action.icon} size={32} color="#E57373" />
                </TouchableOpacity>
              ))}
            </View>
          )}

          {subTitle ? (
            <View className="flex-col  items-center justify-center">
              <Text className={`font-kaisei-bold text-2xl text-story-light dark:text-story-dark ${titleClassName}`}>
                {title}
              </Text>
              <Text className={`font-kaisei-bold text-md text-[#B25959] ${titleClassName}`}>{subTitle}</Text>
            </View>
          ) : (
            <Text className={`font-kaisei-bold text-3xl text-[#B25959] ${titleClassName}`}>{title}</Text>
          )}

          {rightActions.length > 0 && (
            <View className="flex flex-row">
              {rightActions.map((action, index) => (
                <TouchableOpacity key={index} className="ml-4" onPress={action.onPress}>
                  <IconSymbol name={action.icon} size={32} color="#E57373" />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>
    );
  }
);
export default Header;
