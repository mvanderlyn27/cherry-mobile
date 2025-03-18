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
          className={`flex-1 mx-2 py-3 rounded-full ${activeTab === option.id ? "bg-[#E57373]" : "bg-[#FFCDD2]"}`}
          onPress={() => onTabChange(option.id)}>
          <Text
            className={`text-md font-medium text-center ${activeTab === option.id ? "text-white" : "text-[#B71C1C]"}`}>
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};
