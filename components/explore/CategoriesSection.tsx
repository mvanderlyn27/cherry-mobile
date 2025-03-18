import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";

type Props = {
  onBookPress: (id: string) => void;
};

export const CategoriesSection: React.FC<Props> = ({ onBookPress }) => {
  return (
    <ScrollView className="flex-1 px-4">
      <Text className="text-xl font-bold mb-4">Categories</Text>
      <View className="flex-row flex-wrap gap-4">
        {["Romance", "Mystery", "Thriller", "Fantasy"].map((category) => (
          <TouchableOpacity
            key={category}
            className="bg-primary-light dark:bg-primary-dark rounded-xl p-4 w-[45%]"
          >
            <Text className="text-white font-bold">{category}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};