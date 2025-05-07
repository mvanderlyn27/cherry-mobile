import React from "react";
import { View, ScrollView } from "react-native";
import { Tag } from "./Tag";
import { Tag as TagData } from "@/types/app";

type TagListProps = {
  tags: TagData[];
  horizontalScroll?: boolean;
};

export const TagList: React.FC<TagListProps> = ({ tags, horizontalScroll = false }) => {
  if (horizontalScroll) {
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="flex-row gap-2">
        {tags.map((tag, idx) => (
          <Tag key={idx} tag={tag} />
        ))}
      </ScrollView>
    );
  }

  return (
    <View className="flex-row flex-wrap gap-2">
      {tags.map((tag, idx) => (
        <Tag key={idx} tag={tag} />
      ))}
    </View>
  );
};
