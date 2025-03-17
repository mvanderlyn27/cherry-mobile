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
    <View className="flex flex-row justify-between  py-2 space-x-2">
      {options.map((option) => (
        <TouchableOpacity
          key={option.id}
          className={`px-4 py-2 rounded-full ${activeTab === option.id ? "bg-[#E57373]" : "bg-[#FFCDD2]"}`}
          onPress={() => onTabChange(option.id)}>
          <Text className={`text-sm font-medium ${activeTab === option.id ? "text-white" : "text-[#B71C1C]"}`}>
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};
