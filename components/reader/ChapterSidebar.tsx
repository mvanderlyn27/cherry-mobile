import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Chapter, ExtendedChapter, Icon } from "@/types/app";
import { useColorScheme } from "nativewind";
import * as Haptics from "expo-haptics";
import { Drawer } from "react-native-drawer-layout";

type ChapterSidebarProps = {
  chapters: Record<number, ExtendedChapter>;
  currentChapterNumber?: number;
  onChapterSelect: (chapterNumber: number) => void;
  onClose: () => void;
  isOpen: boolean;
  children: React.ReactNode;
};

export const ChapterSidebar = ({
  chapters,
  currentChapterNumber,
  onChapterSelect,
  onClose,
  isOpen,
  children,
}: ChapterSidebarProps) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  //   const drawerRef = React.useRef<Drawer>(null);

  const handleSelect = (chapterNumber: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onChapterSelect(chapterNumber);
    // onClose();
  };

  const insets = useSafeAreaInsets();
  const sortedChapters = Object.values(chapters).sort((a, b) => a.chapter_number - b.chapter_number);
  return (
    <Drawer
      open={isOpen}
      onOpen={() => {}}
      onClose={onClose}
      drawerPosition="left"
      drawerType="slide"
      drawerStyle={{}}
      renderDrawerContent={() => (
        <View
          className="flex flex-col flex-1 bg-background-light dark:bg-background-dark"
          style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
          <View className=" flex-row justify-between items-center py-4 px-6 border-b border-tab_bar_border-light dark:border-tab_bar_border-dark">
            <Text className="font-kaisei-medium text-xl font-bold text-gray-900 dark:text-white">Summary</Text>
          </View>
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            {sortedChapters.map((chapter, index) => (
              <TouchableOpacity
                key={chapter.id}
                className={`py-4 px-6 flex-row justify-between items-center border-b border-tab_bar_border-light dark:border-tab_bar_border-dark ${
                  currentChapterNumber === chapter.chapter_number ? "bg-tabs-light dark:bg-tabs-dark" : ""
                }`}
                onPress={() => handleSelect(chapter.chapter_number)}>
                <View className="flex flex-col">
                  <Text
                    className={`font-kaisei-medium text-xl flex-1 ${
                      currentChapterNumber === chapter.chapter_number
                        ? "font-bold text-story-light dark:text-story-dark"
                        : "text-gray-800 dark:text-gray-200"
                    } ${!chapter.is_owned ? "text-gray-400 dark:text-gray-500" : ""}`}>
                    Chapter {chapter.chapter_number}
                  </Text>
                  {/* <Text className="font-kaisei-medium text-tags-light dark:text-tags-dark font-thin text-sm ">
                    {chapter.title}
                  </Text> */}
                </View>
                {!chapter.is_owned && <IconSymbol name={Icon.lock} size={18} color={isDark ? "#aaa" : "#666"} />}
                {chapter.progress?.status === "completed" && (
                  <IconSymbol name={Icon.checkmark} size={18} color={isDark ? "#aaa" : "#666"} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}>
      {children}
    </Drawer>
  );
};
