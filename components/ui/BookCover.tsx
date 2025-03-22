import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { IconSymbol } from "./IconSymbol";
import { Icon, Book } from "@/types/app";
import { formatReadingTime } from "@/utils/time";
import { LinearGradient } from "expo-linear-gradient";

type BookCoverSize = "x-large" | "large" | "medium" | "small";

type Props = {
  book: Book;
  size?: BookCoverSize;
  onPress?: () => void;
  onSave?: (id: string, saved: boolean) => void;
};

export const BookCover: React.FC<Props> = ({ book, size = "medium", onPress, onSave }) => {
  const tags = [{ label: "18+" }];
  const is_adult = tags.some((tag) => tag.label === "18+");
  const is_hot = true;
  const is_saved = true;

  const renderSmallCover = () => {
    return (
      <Pressable
        onPress={() => {
          onPress?.();
        }}
        className="relative flex-col flex"
        style={{ width: 100, height: 180 }} // Fixed total height
      >
        <View className="relative" style={{ width: 100, height: 140 }}>
          <Image
            source={book.cover_url}
            style={{
              width: 100,
              height: 140,
              borderRadius: 20,
            }}
            contentFit="cover"
            transition={200}
          />

          {/* Reading time badge */}
          {book.reading_time && (
            <View className="absolute top-2 left-2">
              <View className="bg-time-light dark:bg-time-dark rounded-full px-2 py-1 flex-row items-center">
                <IconSymbol name={Icon.time} size={14} color="white" />
                <Text className="text-white font-heebo-medium text-xs ml-1">
                  {formatReadingTime(book.reading_time, 100)}
                </Text>
              </View>
            </View>
          )}

          {/* Bookmark button - updated to be clickable */}
          <Pressable
            className="absolute top-2 right-2"
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            onPress={() => onSave?.(book.id, !is_saved)}>
            <IconSymbol name={is_saved ? Icon.saved : Icon.save} size={20} color="white" />
          </Pressable>

          {/* 18+ badge */}
          {is_adult && (
            <View className="absolute bottom-2 right-2">
              <View className="bg-nsfw-light dark:bg-nsfw-dark rounded-full px-1 py-1">
                <Text className="text-white text-xs font-bold">18+</Text>
              </View>
            </View>
          )}
        </View>
        {/* Title at bottom with fixed height */}
        <Text className="text-center text-sm font-kaisei-bold text-[#8B4C39]" numberOfLines={2} ellipsizeMode="tail">
          {book.title}
        </Text>
      </Pressable>
    );
  };

  const renderMediumCover = () => {
    return (
      <Pressable onPress={() => onPress?.()} style={{ width: 192, height: 256 }}>
        <Image
          source={book.cover_url}
          style={{ width: 192, height: 256, borderRadius: 16 }}
          contentFit="cover"
          transition={200}
        />

        {/* Save Button */}
        <Pressable
          onPress={() => onSave?.(book.id, !is_saved)}
          className="absolute top-2 right-2 bg-black/50 rounded-full aspect-square w-10 h-10 items-center justify-center">
          <IconSymbol name={is_saved ? Icon.saved : Icon.save} size={20} color="white" />
        </Pressable>

        <View className="absolute top-2 left-2 flex-col gap-2">
          {book.reading_time && (
            <View className="bg-time-light dark:bg-time-light rounded-full px-2 py-1 flex-row items-center">
              <IconSymbol name={Icon.time} size={18} color="white" />
              <Text className="text-white font-heebo-medium text-sm ml-1">
                {formatReadingTime(book.reading_time, 100)}
              </Text>
            </View>
          )}

          {is_hot && (
            <View className="bg-tabs_selected-light dark:bg-tabs_selected-dark rounded-full px-2 py-1 flex-row items-center">
              <IconSymbol name={Icon.fire} size={12} color="white" />
              <Text className="text-white text-xs font-heebo-medium ml-1">Hot</Text>
            </View>
          )}
        </View>

        {/* Title */}
        <View className="absolute flex-col bottom-0 left-0 right-0 rounded-b-2xl">
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.7)", "rgba(0,0,0,0.8)"]}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              borderBottomLeftRadius: 16,
              borderBottomRightRadius: 16,
            }}>
            <View className="w-full flex flex-row justify-end items-end p-2">
              {is_adult && (
                <View className="bg-nsfw-light dark:bg-nsfw-dark rounded-full p-2 py-1">
                  <Text className="text-white text-xs">18+</Text>
                </View>
              )}
            </View>
            <View className="w-full pb-4 px-2">
              <Text className="text-white font-bold text-center text-base font-kaisei-bold" numberOfLines={2}>
                {book.title}
              </Text>
            </View>
          </LinearGradient>
        </View>
      </Pressable>
    );
  };

  const renderLargeCover = () => {
    return (
      <Pressable
        onPress={() => {
          onPress?.();
        }}
        style={{ width: 200, height: 285 }}>
        <Image
          source={book.cover_url}
          style={{ width: 200, height: 285, borderRadius: 16 }}
          contentFit="cover"
          transition={200}
        />

        {/* Save Button */}
        <Pressable
          onPress={() => onSave?.(book.id, !is_saved)}
          className="absolute top-2 right-2 bg-black/50 rounded-full aspect-square w-10 h-10 items-center justify-center">
          <IconSymbol name={is_saved ? Icon.saved : Icon.save} size={20} color="white" />
        </Pressable>

        <View className="absolute top-2 left-2 flex-col gap-2">
          {book.reading_time && (
            <View className="bg-time-light dark:bg-time-light rounded-full px-2 py-1 flex-row items-center">
              <IconSymbol name={Icon.time} size={18} color="white" />
              <Text className="text-white font-heebo-medium text-sm ml-1">
                {formatReadingTime(book.reading_time, 100)}
              </Text>
            </View>
          )}

          {is_hot && (
            <View className="bg-tabs_selected-light dark:bg-tabs_selected-dark rounded-full px-2 py-1 flex-row items-center">
              <IconSymbol name={Icon.fire} size={12} color="white" />
              <Text className="text-white text-xs font-heebo-medium ml-1">Hot</Text>
            </View>
          )}
        </View>

        {/* Title */}
        <View className="absolute flex-col bottom-0 left-0 right-0 rounded-b-2xl">
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.7)", "rgba(0,0,0,0.8)"]}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              borderBottomLeftRadius: 16,
              borderBottomRightRadius: 16,
            }}>
            <View className="w-full flex flex-row justify-end items-end p-2">
              {is_adult && (
                <View className="bg-nsfw-light dark:bg-nsfw-dark rounded-full p-2 py-1">
                  <Text className="text-white text-xs">18+</Text>
                </View>
              )}
            </View>
            <View className="w-full pb-4 px-2">
              <Text className="text-white font-bold text-center text-lg font-kaisei-bold" numberOfLines={2}>
                {book.title}
              </Text>
            </View>
          </LinearGradient>
        </View>
      </Pressable>
    );
  };
  const renderXLargeCover = () => {
    return (
      <Pressable
        onPress={() => {
          onPress?.();
        }}
        style={{ width: 250, height: 350 }}>
        <Image
          source={book.cover_url}
          style={{ width: 250, height: 350, borderRadius: 16 }}
          contentFit="cover"
          transition={200}
        />

        {/* Save Button */}
        <Pressable
          onPress={() => onSave?.(book.id, !is_saved)}
          className="absolute top-2 right-4 bg-black/50 rounded-full aspect-square w-12 h-12 items-center justify-center">
          <IconSymbol name={is_saved ? Icon.saved : Icon.save} size={26} color="white" />
        </Pressable>

        <View className="absolute top-2 left-4 flex-col gap-2">
          {book.reading_time && (
            <View className="bg-time-light dark:bg-time-light rounded-full px-2 py-1 flex-row items-center">
              <IconSymbol name={Icon.time} size={18} color="white" />
              <Text className="text-white font-heebo-medium text-lg ml-2">
                {formatReadingTime(book.reading_time, 100)}
              </Text>
            </View>
          )}

          {is_hot && (
            <View className="bg-tabs_selected-light dark:bg-tabs_selected-dark rounded-full px-2 py-1 flex-row items-center">
              <IconSymbol name={Icon.fire} size={18} color="white" />
              <Text className="text-white text-md font-heebo-medium ml-2">Hot</Text>
            </View>
          )}
        </View>

        {/* Title */}
        {/* <View className="absolute flex-col bottom-0 left-0 right-0 rounded-b-2xl">
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.7)", "rgba(0,0,0,0.8)"]}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              borderBottomLeftRadius: 16,
              borderBottomRightRadius: 16,
            }}>
            <View className="w-full flex flex-row justify-end items-end p-2">
              {is_adult && (
                <View className="bg-nsfw-light dark:bg-nsfw-dark rounded-full p-2 py-1">
                  <Text className="text-white text-xs">18+</Text>
                </View>
              )}
            </View>
            <View className="w-full pb-4 px-2">
              <Text className="text-white font-bold text-center text-lg font-kaisei-bold" numberOfLines={2}>
                {book.title}
              </Text>
            </View>
          </LinearGradient>
        </View> */}
      </Pressable>
    );
  };

  // Use switch to render the appropriate cover based on size
  switch (size) {
    case "small":
      return renderSmallCover();
    case "large":
      return renderLargeCover();
    case "x-large":
      return renderXLargeCover();
    case "medium":
    default:
      return renderMediumCover();
  }
};
