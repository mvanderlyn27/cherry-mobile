import React from "react";
import { View } from "react-native";
import { Tag } from "./Tag";
import { Tag as TagData } from "@/types/app";

type TagListProps = {
  tags: TagData[];
};

export const TagList: React.FC<TagListProps> = ({ tags }) => {
  return (
    <View className="flex-row flex-wrap gap-2">
      {tags.map((tag, idx) => (
        <Tag key={idx} tag={tag} />
      ))}
    </View>
  );
};
