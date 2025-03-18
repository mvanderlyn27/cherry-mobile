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
  leftActions?: HeaderAction[];
  rightActions?: HeaderAction[];
  titleClassName?: string;
};
const Header = observer(({ title, leftActions = [], rightActions = [], titleClassName = "" }: HeaderProps) => {
  const colorScheme = useColorScheme();
  return (
    <View
      style={{
        borderBottomWidth: 0.5,
        borderBottomColor: colors["tab_bar_border"][colorScheme || "light"],
        opacity: 20,
      }}>
      <View className="flex flex-row items-center justify-between  px-6 py-3  ">
        {leftActions.length > 0 && (
          <View className="flex flex-row">
            {leftActions.map((action, index) => (
              <TouchableOpacity key={index} className="mr-4" onPress={action.onPress}>
                <IconSymbol name={action.icon} size={24} color="#E57373" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text className={`font-kaisei-bold text-2xl text-[#B25959] ${titleClassName}`}>{title}</Text>

        {rightActions.length > 0 && (
          <View className="flex flex-row">
            {rightActions.map((action, index) => (
              <TouchableOpacity key={index} className="ml-4" onPress={action.onPress}>
                <IconSymbol name={action.icon} size={24} color="#E57373" />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </View>
  );
});
export default Header;
