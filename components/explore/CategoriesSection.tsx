import React, { useState } from "react";
import { View, Dimensions } from "react-native";
import { LegendList } from "@legendapp/list";
import Animated, { Layout, FadeIn, FadeOut, LinearTransition } from "react-native-reanimated";
import { TagCard } from "./TagCard";
import { ExtendedTag } from "@/types/app";
import { BookService } from "@/services/bookService";

type Props = {
  categories: ExtendedTag[];
  onCategoryPress: (category: string) => void;
};

export const CategoriesSection: React.FC<Props> = ({ categories, onCategoryPress }) => {
  const screenWidth = Dimensions.get("window").width;
  const columnWidth = (screenWidth - 48) / 2;

  // Manage favorites state, move to legend state when we use supabase

  // Sort categories with favorites first
  const sortedTags = [...categories].sort((a, b) => {
    const aFav = a.is_saved ? 1 : 0;
    const bFav = b.is_saved ? 1 : 0;
    return bFav - aFav;
  });

  return (
    <View className="flex-1 px-4">
      <LegendList
        data={sortedTags}
        numColumns={2}
        estimatedItemSize={120}
        extraData={sortedTags}
        keyExtractor={(item) => `category-${item.id}`}
        renderItem={({ item }) => (
          <Animated.View
            key={`category-${item.id}`}
            style={{ width: columnWidth, padding: 4 }}
            layout={LinearTransition.springify().damping(20)}
            entering={FadeIn}
            exiting={FadeOut}>
            <TagCard
              isHot={item.is_hot}
              name={item.name}
              imageUrl={item.tag_image_url || ""}
              isFavorite={item.is_saved || false}
              onFavoritePress={() => BookService.handleSaveTag(item.id)}
              onPress={() => onCategoryPress(item.name)}
            />
          </Animated.View>
        )}
      />
    </View>
  );
};
