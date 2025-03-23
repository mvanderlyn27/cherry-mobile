import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useRouter } from "expo-router";

export default function TermsOfServiceScreen() {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 p-4 bg-background-light dark:bg-background-dark">
      <View className="bg-tabs-light dark:bg-tabs-dark rounded-xl p-4 mb-4">
        <Text className="text-xl font-kaisei-bold text-text-light dark:text-text-dark mb-4">Delete Account</Text>
        <Text className="text-text-light dark:text-text-dark mb-4">Bye Bye</Text>
      </View>
    </ScrollView>
  );
}
