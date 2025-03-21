import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Tag as TagData } from "@/types/app";

type TagProps = {
  tag: TagData | string;
  selected?: boolean;
  onPress?: () => void;
};

export const Tag: React.FC<TagProps> = ({ tag, selected, onPress }) => {
  const label = typeof tag === "string" ? tag : tag.name;
  const isNSFW = label === "18+";

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        className={`mr-2 mb-2 px-4 py-2 rounded-full ${
          selected
            ? "bg-buttons-light dark:bg-buttons-dark border-2 border-story-light dark:border-story-dark"
            : isNSFW
            ? "bg-nsfw-light dark:bg-nsfw-dark"
            : "bg-tags-light dark:bg-tags-dark"
        }`}>
        <Text className="text-white">{label}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View
      className={`rounded-full px-5 py-2 ${
        isNSFW ? "bg-nsfw-light dark:bg-nsfw-dark" : "bg-tags-light dark:bg-tags-dark"
      }`}>
      <Text className="text-white text-md">{label}</Text>
    </View>
  );
};
