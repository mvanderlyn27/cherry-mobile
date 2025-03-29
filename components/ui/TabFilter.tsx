import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

type TabOption = {
  id: string;
  label: string;
};

type TabFilterProps = {
  options: TabOption[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
};

export const TabFilter: React.FC<TabFilterProps> = ({ options, activeTab, onTabChange }) => {
  return (
    <View className="flex flex-row justify-between px-6 py-4">
      {options.map((option) => (
        <TouchableOpacity
          key={option.id}
          className={`flex-1 mx-2 py-3 rounded-full ${
            activeTab === option.id
              ? "bg-tabs_selected-light dark:bg-tabs_selected-dark"
              : "bg-tabs-light dark: bg-tabs-dark]"
          }`}
          onPress={() => onTabChange(option.id)}>
          <Text
            className={`text-md font-medium text-center ${
              activeTab === option.id ? "text-white" : "text-buttons-light dark:text-buttons-dark"
            }`}>
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};
