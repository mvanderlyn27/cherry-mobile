import React from "react";
import { View, Text } from "react-native";
import { Image } from "expo-image";
import { IconSymbol } from "./IconSymbol";
import { Icon } from "@/types/app";
import ActionButton from "./ActionButton";
import { MotiView } from "moti";
import { router } from "expo-router";
import { formatReadingTime } from "@/utils/time";
import { MotiPressable } from "moti/interactions";

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
  owned?: boolean;
  progress?: number;
  started?: boolean;
  onRead: (id: string) => void;
  onClick: (id: string) => void;
  buyBook?: (id: string) => void;
  rateStory?: (id: string) => void;
  credits?: number;
  canBuy?: boolean;
};

export const ListBookCard: React.FC<ListBookCardProps> = ({
  id,
  title,
  coverUrl,
  description,
  readingTime,
  tags,
  owned = false,
  started = false,
  progress = 0,
  onRead,
  onClick,
  buyBook,
  rateStory,
  credits,
  canBuy,
}) => {
  const finished = progress === 100;

  return (
    <MotiPressable
      from={{
        opacity: 0,
        translateX: -20,
      }}
      animate={{
        opacity: 1,
        translateX: 0,
      }}
      transition={{
        type: "timing",
        duration: 400,
        delay: 100,
      }}
      onPress={() => onClick(id)}
      style={{
        flex: 1,
        flexDirection: "row",
        marginBottom: 16,
        overflow: "hidden",
        paddingVertical: 1,
      }}>
      <MotiView className="relative mr-3">
        <Image
          source={coverUrl}
          contentFit="cover"
          transition={200}
          style={{
            width: 160, // equivalent to w-48
            height: 160, // equivalent to h-48
            borderRadius: 24, // equivalent to rounded-3xl
          }}
        />
        {readingTime && (
          <View className="absolute top-4 left-4 bg-time-light dark:bg-time-dark rounded-full px-2 py-1 flex flex-row items-center">
            <IconSymbol name={Icon.time} size={14} color="white" />
            <Text className="text-white text-xs ml-1">{formatReadingTime(Number(readingTime), progress)}</Text>
          </View>
        )}
        {!owned && (
          <View className="absolute top-4 right-4 bg-black/30 rounded-full p-1">
            <IconSymbol name={Icon.lock} size={16} color="white" />
          </View>
        )}
        {/* Progress bar container */}
        {started && !finished && (
          <View className="absolute bottom-4 left-4 right-4 h-1 bg-white rounded-3xl overflow-hidden">
            {/* Progress bar fill */}
            <View
              className="absolute top-0 left-0 bottom-0 bg-tabs_selected-light dark:bg-tabs_selected_light-dark"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </View>
        )}
      </MotiView>

      <View className="flex-1">
        <Text className="font-kaisei-bold text-xl text-[#4A2B2B] mb-1">{title}</Text>

        <View className="flex flex-row flex-wrap mb-2">
          {tags.map((tag, index) => (
            <View
              key={index}
              className={`rounded-full px-2 py-1 mr-1 mb-1 ${tag.color || "bg-tags-light dark:bg-tags-dark"}`}>
              <Text className="text-white text-xs">{tag.label}</Text>
            </View>
          ))}
        </View>

        <Text className="text-sm text-gray-600 mb-2" numberOfLines={2}>
          {description}
        </Text>

        <View className="flex-col flex flex-1 justify-end px-4 ">
          {(() => {
            switch (true) {
              case !owned && !canBuy:
                return <ActionButton mode="buy" credits={credits} onPress={() => router.push("/(tabs)/cherry")} />;
              case !owned && canBuy && buyBook !== undefined:
                return <ActionButton mode="unlock" credits={credits} onPress={() => buyBook(id)} />;
              case finished:
                return (
                  <View className="flex flex-row gap-2 items-center justify-center">
                    <ActionButton mode="review1" credits={credits} onPress={() => onRead(id)} />
                    {rateStory && <ActionButton mode="review2" credits={credits} onPress={() => rateStory(id)} />}
                  </View>
                );
              case started && !finished:
                return <ActionButton mode="continue" onPress={() => onRead(id)} />;
              default:
                return <ActionButton mode="read" onPress={() => onRead(id)} />;
            }
          })()}
        </View>
      </View>
    </MotiPressable>
  );
};
