import React, { useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Chapter, Icon } from "@/types/app";
import { useColorScheme } from "nativewind";
import * as Haptics from "expo-haptics";

type ChapterSidebarProps = {
  chapters: Chapter[];
  currentChapterIndex: number;
  onChapterSelect: (index: number) => void;
  onClose: () => void;
};

export const ChapterSidebar = ({ chapters, currentChapterIndex, onChapterSelect, onClose }: ChapterSidebarProps) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const slideAnim = useRef(new Animated.Value(-300)).current;
  
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: -300,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  const handleSelect = (index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onChapterSelect(index);
  };
  
  //pull this from db see if user owns this chapter
  const userOwnsChapter = true;
  
  return (
    <View className="absolute inset-0 z-20">
      <TouchableOpacity 
        className="absolute inset-0 bg-black/50" 
        activeOpacity={1} 
        onPress={handleClose} 
      />
      <Animated.View 
        className="absolute top-0 left-0 bottom-0 w-3/4 max-w-[300px] bg-white dark:bg-gray-900"
        style={{ transform: [{ translateX: slideAnim }] }}
      >
        <SafeAreaView edges={["top"]} className="flex-1">
          <View className="flex-row justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800">
            <Text className="text-xl font-bold text-gray-900 dark:text-white">Chapters</Text>
            <TouchableOpacity onPress={handleClose}>
              <IconSymbol name={Icon.close} size={24} color={isDark ? "#fff" : "#000"} />
            </TouchableOpacity>
          </View>
          <ScrollView className="flex-1">
            {chapters.map((chapter, index) => (
              <TouchableOpacity
                key={chapter.id}
                className={`p-4 flex-row justify-between items-center border-b border-gray-100 dark:border-gray-800 ${
                  currentChapterIndex === index ? "bg-blue-50 dark:bg-blue-900/30" : ""
                }`}
                onPress={() => handleSelect(index)}>
                <Text
                  className={`flex-1 ${
                    currentChapterIndex === index
                      ? "font-bold text-blue-600 dark:text-blue-400"
                      : "text-gray-800 dark:text-gray-200"
                  } ${!userOwnsChapter ? "text-gray-400 dark:text-gray-500" : ""}`}>
                  Chapter {chapter.chapter_number}: {chapter.title}
                </Text>
                {!userOwnsChapter && <IconSymbol name={Icon.lock} size={18} color={isDark ? "#aaa" : "#666"} />}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Animated.View>
    </View>
  );
};
