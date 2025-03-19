import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";

type CategoryCardProps = {
  name: string;
  imageUrl: string;
  onPress: () => void;
};

export const CategoryCard: React.FC<CategoryCardProps> = ({ name, imageUrl, onPress }) => {
  return (
    <TouchableOpacity 
      onPress={onPress}
      className="m-2 rounded-2xl overflow-hidden"
      style={{ height: 120, width: "100%" }}
    >
      <View className="relative w-full h-full">
        <Image
          source={{ uri: imageUrl }}
          style={{ width: '100%', height: '100%' }}
          contentFit="cover"
          cachePolicy="memory-disk"
        />
        <LinearGradient 
          colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.5)"]} 
          style={{ position: 'absolute', width: '100%', height: '100%' }}
        />
        <View className="absolute w-full h-full items-center justify-center">
          <Text className="text-white text-xl font-kaisei-bold">
            {name}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
