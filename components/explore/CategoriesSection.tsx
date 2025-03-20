import React, { useState } from "react";
import { View, Dimensions } from "react-native";
import { LegendList } from "@legendapp/list";
import Animated, { Layout, FadeIn, FadeOut, LinearTransition } from "react-native-reanimated";
import { CategoryCard } from "./CategoryCard";

type Category = {
  id: number;
  name: string;
  image_url: string;
  isHot?: boolean;
};

type Props = {
  categories: Category[];
  onCategoryPress: (category: string) => void;
};

export const CategoriesSection: React.FC<Props> = ({ categories, onCategoryPress }) => {
  const screenWidth = Dimensions.get("window").width;
  const columnWidth = (screenWidth - 48) / 2;

  // Manage favorites state, move to legend state when we use supabase
  const [favoriteIds, setFavoriteIds] = useState<number[]>([1, 3]); // Changed to array for better state updates

  const handleFavoriteToggle = (categoryId: number) => {
    setFavoriteIds((prevIds) => {
      const isCurrentlyFavorited = prevIds.includes(categoryId);
      if (isCurrentlyFavorited) {
        return prevIds.filter((id) => id !== categoryId);
      } else {
        return [...prevIds, categoryId];
      }
    });
  };

  // Sort categories with favorites first
  const sortedCategories = [...categories].sort((a, b) => {
    const aFav = favoriteIds.includes(a.id) ? 1 : 0;
    const bFav = favoriteIds.includes(b.id) ? 1 : 0;
    return bFav - aFav;
  });

  return (
    <View className="flex-1 px-4">
      <LegendList
        data={sortedCategories}
        numColumns={2}
        estimatedItemSize={120}
        extraData={favoriteIds}
        keyExtractor={(item) => `category-${item.id}`}
        renderItem={({ item }) => (
          <Animated.View
            key={`category-${item.id}`}
            style={{ width: columnWidth, padding: 4 }}
            layout={LinearTransition.springify().damping(20)}
            entering={FadeIn}
            exiting={FadeOut}>
            <CategoryCard
              isHot={item.isHot}
              name={item.name}
              imageUrl={item.image_url}
              isFavorite={favoriteIds.includes(item.id)}
              onFavoritePress={() => handleFavoriteToggle(item.id)}
              onPress={() => onCategoryPress(item.name)}
            />
          </Animated.View>
        )}
      />
    </View>
  );
};
