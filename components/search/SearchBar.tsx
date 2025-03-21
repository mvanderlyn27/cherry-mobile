import React from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Icon } from "@/types/app";
import { useColorScheme } from "nativewind";
const colors = require("@/config/colors");

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  onSortPress: () => void;
};

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChangeText, onSortPress }) => {
  const { colorScheme } = useColorScheme();
  return (
    <View className="flex-row items-center bg-white dark:bg-story-dark rounded-3xl border-2 border-tags-light dark:boder-tags-dark my-4 px-4 py-5">
      <IconSymbol name={Icon.search} color={colors["tabs_selected"][colorScheme || "light"]} size={20} />
      <TextInput
        className="flex-1 ml-2 text-buttons_text-light dark:text-white"
        placeholder="Find your romance..."
        placeholderTextColor={colors["tags"][colorScheme || "light"]}
        value={value}
        onChangeText={onChangeText}
      />
      <TouchableOpacity onPress={onSortPress}>
        <IconSymbol name={Icon.sort} color={colors["tabs_selected"][colorScheme || "light"]} size={20} />
      </TouchableOpacity>
    </View>
  );
};
