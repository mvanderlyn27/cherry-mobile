import React from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type LoadingScreenProps = {
  message?: string;
};

export const LoadingScreen = ({ message = "Loading..." }: LoadingScreenProps) => {
  return (
    <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0A7EA4" />
        <Text className="mt-4 text-gray-600 dark:text-gray-400">{message}</Text>
      </View>
    </SafeAreaView>
  );
};