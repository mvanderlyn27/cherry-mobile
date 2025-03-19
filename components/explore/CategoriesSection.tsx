import React from "react";
import { View, Dimensions } from "react-native";
import { LegendList } from "@legendapp/list";
import { CategoryCard } from "./CategoryCard";

type Category = {
  id: number;
  name: string;
  image_url: string;
};

type Props = {
  categories: Category[];
  onCategoryPress: (category: string) => void;
};

export const CategoriesSection: React.FC<Props> = ({ categories, onCategoryPress }) => {
  const screenWidth = Dimensions.get("window").width;
  const columnWidth = (screenWidth - 48) / 2; // 48 = padding (16) * 2 + gap between columns (16)

  return (
    <View className="flex-1 px-4">
      <LegendList
        data={categories}
        numColumns={2}
        estimatedItemSize={120}
        renderItem={({ item }) => (
          <View style={{ width: columnWidth, padding: 4 }}>
            <CategoryCard name={item.name} imageUrl={item.image_url} onPress={() => onCategoryPress(item.name)} />
          </View>
        )}
      />
    </View>
  );
};
