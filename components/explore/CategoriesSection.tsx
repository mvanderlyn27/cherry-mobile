import React, { useState } from "react";
import { View, Dimensions } from "react-native";
import { LegendList } from "@legendapp/list";
import Animated, { Layout, FadeIn, FadeOut, LinearTransition } from "react-native-reanimated";
import { TagCard } from "./TagCard";
import { ExtendedTag, Tag } from "@/types/app";
import { BookService } from "@/services/bookService";
import { use$ } from "@legendapp/state/react";
import { authStore$ } from "@/stores/authStore";

type Props = {
  categories: ExtendedTag[];
  onCategoryPress: (tag: Tag) => void;
};

export const CategoriesSection: React.FC<Props> = ({ categories, onCategoryPress }) => {
  const screenWidth = Dimensions.get("window").width;
  const columnWidth = (screenWidth - 48) / 2;
  const userId = use$(authStore$.userId);

  // Manage favorites state, move to legend state when we use supabase

  // Sort categories with favorites first

  return (
    <View className="flex-1 px-4">
      <LegendList
        data={categories}
        numColumns={2}
        estimatedItemSize={120}
        extraData={categories}
        keyExtractor={(item) => `category-${item.id}`}
        renderItem={({ item }) => (
          <Animated.View
            key={`category-${item.id}`}
            style={{ width: columnWidth, padding: 4 }}
            layout={LinearTransition.springify().damping(20)}
            entering={FadeIn}
            exiting={FadeOut}>
            <TagCard
              tag={item}
              onFavoritePress={() => userId && BookService.toggleSaveTag(userId, item.id)}
              onPress={() => onCategoryPress(item)}
            />
          </Animated.View>
        )}
      />
    </View>
  );
};
