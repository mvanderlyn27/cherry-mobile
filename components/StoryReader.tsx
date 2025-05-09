import React, { useState } from "react";
import { Text, ScrollView, View, TouchableOpacity, Dimensions, SafeAreaView, StyleSheet } from "react-native";
import { IconSymbol } from "./ui/IconSymbol";
import { SUPERWALL_TRIGGERS } from "@/config/superwall";
import { chapters$ } from "@/stores/supabaseStores";
import { books$ } from "@/stores/supabaseStores";
import { observer, use$ } from "@legendapp/state/react";
import * as Haptics from "expo-haptics";
import { Chapter, ExtendedChapter, Icon } from "@/types/app";
import { userPreferencesStore$ } from "@/stores/appStores";

interface StoryReaderProps {
  bookId: string;
  currentChapterIndex: number;
  onChapterChange: (index: number) => void;
  isOwned: boolean;
  onPurchase?: () => void;
}

type BackgroundTexture = "none" | "paper" | "sepia";

export const StoryReader = observer(
  ({ bookId, currentChapterIndex, onChapterChange, isOwned, onPurchase }: StoryReaderProps) => {
    // const { showPaywall } = useSuperwall();
    //setup a store to track this later, need to figure out if we're synching this with backend, or not for anon users
    const textSize = use$(userPreferencesStore$.fontSize);
    const backgroundTexture = use$(userPreferencesStore$.backgroundTexture);
    const [showControls, setShowControls] = useState(false);
    // const chapters = Object.values(chapters$.get() || {}).filter((val) => val?.book_id === bookId);
    const chapters: ExtendedChapter[] = [];

    if (!chapters || chapters.length === 0) {
      return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text>Loading chapters...</Text>
        </View>
      );
    }

    const currentChapter = chapters[currentChapterIndex] || chapters[0];

    if (!currentChapter) {
      return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text>Chapter not found</Text>
        </View>
      );
    }
    const { width } = Dimensions.get("window");

    const handlePurchase = () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      if (onPurchase) {
        onPurchase();
      } else {
        // showPaywall(SUPERWALL_TRIGGERS.FEATURE_UNLOCK);
      }
    };

    const handleNextChapter = () => {
      if (currentChapterIndex < chapters.length - 1) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onChapterChange(currentChapterIndex + 1);
      }
    };

    const handlePreviousChapter = () => {
      if (currentChapterIndex > 0) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onChapterChange(currentChapterIndex - 1);
      }
    };

    const toggleControls = () => {
      setShowControls(!showControls);
    };

    const handleTextSizeChange = (size: number) => {
      userPreferencesStore$.fontSize.set(size);
    };

    const handleBackgroundChange = (texture: BackgroundTexture) => {
      userPreferencesStore$.backgroundTexture.set(texture);
    };

    const getBackgroundStyle = () => {
      switch (backgroundTexture) {
        case "paper":
          return { backgroundColor: "#f8f5e6" };
        case "sepia":
          return { backgroundColor: "#f4ecd8" };
        default:
          return {};
      }
    };

    const renderTextControls = () => (
      <View>
        <TouchableOpacity className="text-[16px]" onPress={() => handleTextSizeChange(16)}>
          <Text>A</Text>
        </TouchableOpacity>
        <TouchableOpacity className="text-[32px]" onPress={() => handleTextSizeChange(32)}>
          <Text>A</Text>
        </TouchableOpacity>
        <TouchableOpacity className="text-[48px]" onPress={() => handleTextSizeChange(48)}>
          <Text>A</Text>
        </TouchableOpacity>
      </View>
    );

    const renderBackgroundControls = () => (
      <View>
        <TouchableOpacity onPress={() => handleBackgroundChange("none")}>
          <View />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleBackgroundChange("paper")}>
          <View />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleBackgroundChange("sepia")}>
          <View />
        </TouchableOpacity>
      </View>
    );

    const renderChapterNavigation = () => (
      <View>
        <TouchableOpacity onPress={handlePreviousChapter} disabled={currentChapterIndex === 0}>
          <IconSymbol name={Icon["left-arrow"]} size={24} color={currentChapterIndex === 0 ? "#ccc" : "#666"} />
        </TouchableOpacity>
        <Text>
          Chapter {currentChapter.chapter_number} of {chapters.length}
        </Text>
        <TouchableOpacity onPress={handleNextChapter} disabled={currentChapterIndex === chapters.length - 1}>
          <IconSymbol
            name={Icon["right-arrow"]}
            size={24}
            color={currentChapterIndex === chapters.length - 1 ? "#ccc" : "#666"}
          />
        </TouchableOpacity>
      </View>
    );

    // If the chapter is locked (not owned), show a preview with purchase option
    if (!isOwned && currentChapterIndex > 0) {
      return (
        <View>
          <View>
            <IconSymbol name={Icon["lock_fill"]} size={48} color="#888" />
            <Text>Chapter Locked</Text>
            <Text>Purchase this book to continue reading this chapter and unlock all content.</Text>
            <TouchableOpacity onPress={handlePurchase}>
              <Text>Unlock Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <View>
        <ScrollView>
          <Text>Chapter {currentChapter.chapter_number}</Text>
          <Text>{currentChapter.content}</Text>
        </ScrollView>

        <View>
          {renderTextControls()}
          {renderBackgroundControls()}
          {renderChapterNavigation()}
        </View>
      </View>
    );
  }
);
