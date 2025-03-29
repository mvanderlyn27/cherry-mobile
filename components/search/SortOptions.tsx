import { SortType } from "@/stores/appStores";
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

type SortOptionsProps = {
  selectedSort: SortType;
  onSortSelect: (sort: SortType) => void;
};

export const SortOptions: React.FC<SortOptionsProps> = ({ selectedSort, onSortSelect }) => {
  return (
    <View className="my-2">
      <Text className="text-buttons_text-light dark:text-white font-medium mb-2">Sort By</Text>
      <View className="flex-row justify-between">
        {[
          { id: "topRated", label: "Top Rated" },
          { id: "mostViewed", label: "Most Viewed" },
          { id: "newest", label: "Newest" },
        ].map((option) => (
          <TouchableOpacity
            key={option.id}
            onPress={() => onSortSelect(option.id as SortType)}
            className={`flex-1 mx-1 py-3 rounded-full ${
              selectedSort === option.id ? "bg-buttons-light dark:bg-buttons-dark" : "bg-tags-light dark:bg-tags-dark"
            }`}>
            <Text className={`text-center ${selectedSort === option.id ? "text-white" : "text-white dark:text-white"}`}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
