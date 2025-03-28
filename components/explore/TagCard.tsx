import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

type TagCardProps = {
  name: string;
  imageUrl: string;
  onPress: () => void;
  isHot?: boolean;
  isFavorite: boolean;
  onFavoritePress: () => void;
};

export const TagCard: React.FC<TagCardProps> = ({
  name,
  imageUrl,
  onPress,
  isHot = false,
  isFavorite,
  onFavoritePress,
}) => {
  return (
    <View>
      <TouchableOpacity
        onPress={onPress}
        className="m-2 rounded-2xl overflow-hidden"
        style={{ height: 120, width: "100%" }}>
        <View className="relative w-full h-full">
          <Image
            source={{ uri: imageUrl }}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
            cachePolicy="memory-disk"
          />
          <LinearGradient
            colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.5)"]}
            style={{ position: "absolute", width: "100%", height: "100%" }}
          />

          <TouchableOpacity
            className="absolute top-2 right-2 z-20 p-2"
            onPress={(e) => {
              e.stopPropagation();
              onFavoritePress();
            }}>
            <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={24} color="white" />
          </TouchableOpacity>

          <View className="absolute w-full h-full items-center justify-center">
            <Text className="text-white text-xl font-kaisei-bold">{name}</Text>
          </View>
        </View>
      </TouchableOpacity>
      {isHot && (
        <View className="absolute left-0 -top-2 bg-red-500 w-10 h-10 rounded-full z-20 items-center justify-center">
          <Text className="text-white text-[10px] font-bold">HOT</Text>
        </View>
      )}
    </View>
  );
};
