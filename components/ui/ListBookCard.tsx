import React from "react";
import { View, Text, Image } from "react-native";
import { IconSymbol } from "./IconSymbol";
import { Icon } from "@/types/app";
import { ActionButton } from "./ActionButton";

type BookTag = {
  label: string;
  color?: string;
};

type ListBookCardProps = {
  id: string;
  title: string;
  coverUrl: string;
  description: string;
  readingTime?: string;
  tags: BookTag[];
  isLocked?: boolean;
  onPress: (id: string) => void;
  onUnlock?: (id: string) => void;
  credits?: number;
};

export const ListBookCard: React.FC<ListBookCardProps> = ({
  id,
  title,
  coverUrl,
  description,
  readingTime,
  tags,
  isLocked = false,
  onPress,
  onUnlock,
  credits,
}) => {
  return (
    <View className="flex flex-row mb-4 overflow-hidden py-3">
      <View className="relative mr-3">
        <Image source={{ uri: coverUrl }} className="w-48 h-48 rounded-3xl" resizeMode="cover" />
        {readingTime && (
          <View className="absolute top-2 left-2 bg-[#673AB7]/80 rounded-full px-2 py-1 flex flex-row items-center">
            <IconSymbol name={Icon.time} size={14} color="white" />
            <Text className="text-white text-xs ml-1">{readingTime}</Text>
          </View>
        )}
        {isLocked && (
          <View className="absolute top-2 right-2 bg-black/30 rounded-full p-1">
            <IconSymbol name={Icon.lock} size={16} color="white" />
          </View>
        )}
      </View>

      <View className="flex-1">
        <Text className="font-kaisei-bold text-lg text-[#4A2B2B] mb-1">{title}</Text>

        <View className="flex flex-row flex-wrap mb-2">
          {tags.map((tag, index) => (
            <View key={index} className={`rounded-full px-2 py-1 mr-1 mb-1 ${tag.color || "bg-[#E57373]"}`}>
              <Text className="text-white text-xs">{tag.label}</Text>
            </View>
          ))}
        </View>

        <Text className="text-sm text-gray-600 mb-2" numberOfLines={2}>
          {description}
        </Text>

        <View className="flex-col flex flex-1 justify-end px-4 ">
          {credits && onUnlock ? (
            <ActionButton mode="unlock" credits={credits} onPress={() => onUnlock(id)} />
          ) : (
            <ActionButton mode="read" onPress={() => onPress(id)} />
          )}
        </View>
      </View>
    </View>
  );
};
