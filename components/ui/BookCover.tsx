import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { IconSymbol } from "./IconSymbol";
import { Icon, Book } from "@/types/app";

type BookCoverSize = "large" | "medium" | "small";

type Props = {
  book: Book;
  size?: BookCoverSize;
  onPress?: (id: string) => void;
  onSave?: (id: string) => void;
};

const sizeStyles = {
  large: {
    image: { width: 200, height: 285 }, // Updated to fill container
    title: "text-lg",
  },
  medium: {
    image: { width: 192, height: 256 },
    title: "text-base",
  },
  small: {
    image: { width: 128, height: 176 },
    title: "text-sm",
  },
};

export const BookCover: React.FC<Props> = ({ book, size = "medium", onPress, onSave }) => {
  const styles = sizeStyles[size];
  const tags = [{ label: "18+" }];
  const is_adult = tags.some((tag) => tag.label === "18+");
  const is_hot = true;
  const is_saved = true;

  return (
    <Pressable onPress={() => onPress?.(book.id)} style={styles.image}>
      <Image source={book.cover_url} style={[styles.image, { borderRadius: 16 }]} contentFit="cover" transition={200} />

      {book.reading_time && (
        <View className="absolute top-2 left-2 bg-black/50 rounded-full px-2 py-1 flex-row items-center">
          <IconSymbol name={Icon.time} size={12} color="white" />
          <Text className="text-white text-xs ml-1">{book.reading_time}m</Text>
        </View>
      )}

      {/* Save Button */}
      <Pressable
        onPress={() => onSave?.(book.id)}
        className="absolute top-2 right-2 bg-black/50 rounded-full aspect-square w-10 h-10 items-center justify-center">
        <IconSymbol name={is_saved ? Icon.saved : Icon.save} size={20} color="white" />
      </Pressable>

      <View className="absolute top-10 left-2 flex-row gap-1">
        {is_hot && (
          <View className="bg-tabs_selected-light dark:bg-tabs_selected-dark rounded-full px-2 py-1 flex-row items-center">
            <IconSymbol name={Icon.fire} size={12} color="white" />
            <Text className="text-white text-xs ml-1">Hot</Text>
          </View>
        )}
      </View>

      {/* Title */}
      <View className="absolute flex-col bottom-0 left-0 right-0  rounded-b-2xl ">
        <View className="w-full flex flex-row justify-end items-end p-2">
          {is_adult && (
            <View className="bg-nsfw-light dark:bg-nsfw-dark rounded-full p-2 py-1">
              <Text className="text-white text-xs">18+</Text>
            </View>
          )}
        </View>
        <View className="w-full bg-black/30 rounded-b-2xl p-2 ">
          <Text className={`text-white font-bold text-center ${styles.title}`} numberOfLines={2}>
            {book.title}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};
