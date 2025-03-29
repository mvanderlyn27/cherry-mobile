import React, { useMemo } from "react";
import { View } from "react-native";
import Animated, { Layout, FadeIn, LinearTransition } from "react-native-reanimated";
import { Tag as TagComp } from "../ui/Tag";
import { Tag } from "@/types/app";

type TagSelectorProps = {
  tags: Tag[];
  selectedTags: Tag[];
  onTagSelect: (tag: Tag) => void;
};

export const TagSelector: React.FC<TagSelectorProps> = ({ tags, selectedTags, onTagSelect }) => {
  const sortedTags = useMemo(() => {
    return [...tags].sort((a, b) => {
      const aSelected = selectedTags.includes(a);
      const bSelected = selectedTags.includes(b);
      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;
      return 0;
    });
  }, [tags, selectedTags]);

  return (
    <View className="mb-2">
      <Animated.View className="flex-row flex-wrap">
        {sortedTags.map((tag) => (
          <Animated.View key={tag.id} entering={FadeIn} layout={LinearTransition.springify()}>
            <TagComp tag={tag} selected={selectedTags.includes(tag)} onPress={() => onTagSelect(tag)} />
          </Animated.View>
        ))}
      </Animated.View>
    </View>
  );
};
