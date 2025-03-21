import React from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Icon } from "@/types/app";

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  onSortPress: () => void;
};

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChangeText, onSortPress }) => {
  return (
    <View className="flex-row items-center bg-white dark:bg-story-dark rounded-full my-4 px-4 py-2">
      <IconSymbol name={Icon.search} color="#8F4647" size={20} />
      <TextInput
        className="flex-1 ml-2 text-buttons_text-light dark:text-white"
        placeholder="Search books, authors..."
        placeholderTextColor="#B25557"
        value={value}
        onChangeText={onChangeText}
      />
      <TouchableOpacity onPress={onSortPress}>
        <IconSymbol name={Icon.sort} color="#8F4647" size={20} />
      </TouchableOpacity>
    </View>
  );
};