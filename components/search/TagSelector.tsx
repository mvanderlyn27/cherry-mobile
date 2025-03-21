import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";

type TagSelectorProps = {
  tags: string[];
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
};

export const TagSelector: React.FC<TagSelectorProps> = ({ tags, selectedTags, onTagSelect }) => {
  return (
    <View className="my-2">
      <Text className="text-buttons_text-light dark:text-white font-medium mb-2">Categories</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="py-2">
        {tags.map((tag) => (
          <TouchableOpacity
            key={tag}
            onPress={() => onTagSelect(tag)}
            className={`mr-2 px-4 py-2 rounded-full ${
              selectedTags.includes(tag)
                ? "bg-buttons-light dark:bg-buttons-dark"
                : "bg-tags-light dark:bg-tags-dark"
            }`}
          >
            <Text
              className={`${
                selectedTags.includes(tag)
                  ? "text-white"
                  : "text-buttons_text-light dark:text-white"
              }`}
            >
              {tag}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};