import React from "react";
import { View, Text } from "react-native";

type Tag = {
  label: string;
};

type TagListProps = {
  tags: Tag[];
};

export const TagList: React.FC<TagListProps> = ({ tags }) => {
  return (
    <View className=" flex-row flex-wrap gap-2">
      {tags.map((tag, idx) => (
        <View
          key={idx}
          className={`${
            tag.label === "18+" ? "bg-nsfw-light dark:bg-nsfw-dark" : "bg-tags-light dark:bg-tags-dark"
          } rounded-full px-5 py-2`}>
          <Text className="text-white text-md">{tag.label}</Text>
        </View>
      ))}
    </View>
  );
};
