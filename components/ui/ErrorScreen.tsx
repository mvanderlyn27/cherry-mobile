import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconSymbol } from "./IconSymbol";
import { Icon } from "@/types/app";

type ErrorScreenProps = {
  message: string;
  onBack: () => void;
};

export const ErrorScreen = ({ message, onBack }: ErrorScreenProps) => {
  return (
    <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
      <View className="flex-1 justify-center items-center p-6">
        <IconSymbol name={Icon.error} size={48} color="#EF4444" />
        <Text className="mt-4 text-lg text-center text-gray-800 dark:text-gray-200">
          {message}
        </Text>
        <TouchableOpacity 
          className="mt-6 px-6 py-3 bg-primary rounded-lg"
          onPress={onBack}
        >
          <Text className="text-white font-medium">Go Back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};