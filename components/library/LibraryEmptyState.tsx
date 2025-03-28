import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export const LibraryEmptyState = () => {
  const router = useRouter();

  return (
    <View className="flex-1 justify-center items-center p-6">
      <Text className="font-kaisei-bold text-xl text-gray-800 mb-2">Find some books!</Text>
      <Text className="text-center text-gray-600 mb-6">
        Save books from the Explore tab to add them to your library
      </Text>
      <TouchableOpacity className="bg-[#E57373] px-6 py-3 rounded-lg" onPress={() => router.push("/explore/top")}>
        <Text className="text-white font-medium">Explore Books</Text>
      </TouchableOpacity>
    </View>
  );
};
