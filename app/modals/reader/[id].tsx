import React, { useState, useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { observer, use$ } from "@legendapp/state/react";
import ConfettiCannon from "react-native-confetti-cannon";
import { ReaderView } from "@/components/reader/ReaderView";
import { ReaderHeader } from "@/components/reader/ReaderHeader";
import { ReaderBottomBar } from "@/components/reader/ReaderBottomBar";
import { ChapterSidebar } from "@/components/reader/ChapterSidebar";
import { SettingsSheet } from "@/components/reader/SettingsSheet";
import { PurchaseModal } from "@/components/reader/PurchaseModal";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { ErrorScreen } from "@/components/ui/ErrorScreen";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolate,
  useAnimatedScrollHandler,
  runOnJS,
} from "react-native-reanimated";
import { BookService } from "@/services/bookService";
import { authStore$ } from "@/stores/authStore";
import { readerStore$ } from "@/stores/appStores";
import { ChapterService } from "@/services/chapterService";
import { ExtendedChapter } from "@/types/app";
import { generateId } from "@/stores/supabaseStores";
import { when } from "@legendapp/state";
import { RatingSheet } from "@/components/reader/RatingBottomDrawer";

const ReaderScreen = observer(() => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const userId = use$(authStore$.userId);
  if (!id || !userId) return null;
  const router = useRouter();

  // Use Legend state from readerStore
  const book = use$(readerStore$.book);
  const chapters = use$(readerStore$.chapters);
  const currentChapter = use$(readerStore$.currentChapter);
  const chapterContent = use$(readerStore$.chapterContent);
  const loading = use$(readerStore$.loading);

  useEffect(() => {
    readerStore$.initialize(id);
  }, []);

  // UI state (kept in component)
  const [showChapterList, setShowChapterList] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [chapterToUnlock, setChapterToUnlock] = useState<number | null>(null);
  const [fontSize, setFontSize] = useState(18);
  const [credits] = useState(100);
  const [uiVisible, setUiVisible] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const insets = useSafeAreaInsets();

  // Animation values
  const scrollY = useSharedValue(0);
  const lastScrollY = useSharedValue(0);

  // Threshold for UI visibility
  const SCROLL_THRESHOLD = 20;

  // Add this useEffect to handle the bottom detection
  useEffect(() => {
    if (isAtBottom && currentChapter?.progress?.status !== "completed") {
      handleChapterComplete();
      setIsAtBottom(false); // Reset the flag
    }
  }, [isAtBottom, currentChapter]);
  // Scroll handler to track scroll position
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const currentScrollY = event.contentOffset.y;
      const scrollDelta = currentScrollY - lastScrollY.value;
      const animationRate = 0.15;

      // Check if we're near the bottom of the content
      const { layoutMeasurement, contentOffset, contentSize } = event;
      const paddingToBottom = 20; // Adjust this value as needed
      const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;

      if (isCloseToBottom && currentChapter?.progress?.status !== "completed") {
        runOnJS(setIsAtBottom)(true);
      }

      if (scrollDelta > 0 && currentScrollY > SCROLL_THRESHOLD) {
        scrollY.value = withTiming(Math.min(scrollY.value + scrollDelta * animationRate, 1), { duration: 150 });

        if (scrollY.value > 0.9 && uiVisible) {
          runOnJS(setUiVisible)(false);
        }
      } else if (scrollDelta < 0) {
        scrollY.value = withTiming(Math.max(scrollY.value + scrollDelta * animationRate, 0), { duration: 150 });

        if (scrollY.value < 0.1 && !uiVisible) {
          runOnJS(setUiVisible)(true);
        }
      }

      lastScrollY.value = currentScrollY;
    },
  });

  // Animated styles for header
  const headerAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [0, 1], [1, 0], Extrapolate.CLAMP);
    const translateY = interpolate(scrollY.value, [0, 1], [0, -130], Extrapolate.CLAMP);
    const height = interpolate(scrollY.value, [0, 1], [130, 0], Extrapolate.CLAMP);
    const paddingTop = interpolate(scrollY.value, [0, 1], [insets.top, 0], Extrapolate.CLAMP);

    return {
      opacity,
      paddingTop,
      height,
      transform: [{ translateY }],
      overflow: "hidden",
    };
  });

  // Animated styles for footer
  const footerAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [0, 1], [1, 0], Extrapolate.CLAMP);
    const translateY = interpolate(scrollY.value, [0, 1], [0, 80], Extrapolate.CLAMP);
    const height = interpolate(scrollY.value, [0, 1], [80, 0], Extrapolate.CLAMP);
    const paddingBottom = interpolate(scrollY.value, [0, 1], [insets.bottom, 0], Extrapolate.CLAMP);

    return {
      opacity,
      height,
      paddingBottom,
      transform: [{ translateY }],
      overflow: "hidden",
    };
  });

  // Animated styles for content
  const contentAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(scrollY.value, [0, 1], [1, 1.02], Extrapolate.CLAMP);
    const translateY = interpolate(scrollY.value, [0, 1], [0, -10], Extrapolate.CLAMP);

    return {
      transform: [{ scale }, { translateY }],
      flex: 1,
    };
  });

  // Handle tap on reading area
  const handleContentPress = () => {
    scrollY.value = withTiming(0, { duration: 300 });
    setUiVisible(true);
  };

  // Handle chapter selection
  const handleChapterSelect = async (index: number) => {
    if (!book || !chapters) return;

    if (!chapters[index].is_owned) {
      setChapterToUnlock(index);
      setShowPurchaseModal(true);
    } else {
      // Update chapter current chapter
      readerStore$.setChapter(chapters[index].id);
      setShowChapterList(false);
    }
  };
  // Add a new state for the rating drawer
  const [showRatingDrawer, setShowRatingDrawer] = useState(false);

  // Update the handleChapterComplete function
  const handleChapterComplete = () => {
    readerStore$.finishChapter();

    // Check if this is the last chapter
    const isLastChapter = !chapters?.find((chapter) => chapter.chapter_number > currentChapter?.chapter_number!);

    if (isLastChapter) {
      // Show rating drawer and confetti for book completion
      setShowRatingDrawer(true);
      // We'll add confetti here
      return;
    }

    // Find the next chapter
    const nextChapter = chapters?.find((chapter) => chapter.chapter_number === currentChapter?.chapter_number! + 1);
    if (!nextChapter) return;

    //if next chapter needs to be bought open modal
    if (!nextChapter.is_owned) {
      setChapterToUnlock(nextChapter.chapter_number);
      setShowPurchaseModal(true);
      return;
    }

    //otherwise go to next chapter
    readerStore$.setChapter(nextChapter.id);
    setUiVisible(true);
  };

  // Handle chapter purchase
  const handlePurchaseChapter = () => {
    // Implementation for purchasing chapters
    // if (chapterToUnlock !== null && credits >= 50) {
    //   // Update chapter to unlocked
    //   // Navigate to the chapter
    //   setShowPurchaseModal(false);
    //   setShowChapterList(false);
    // } else {
    //   router.push("/modals/cherry");
    // }
  };

  if (loading || !book || !chapters) {
    console.log("loading", book, chapters, loading);
    return <LoadingScreen />;
  }

  if (chapters.length === 0) {
    return <ErrorScreen message="No chapters found for this book." onBack={() => router.back()} />;
  }

  // Get current chapter

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ChapterSidebar
        chapters={chapters}
        currentChapterId={currentChapter?.id}
        onChapterSelect={handleChapterSelect}
        isOpen={showChapterList}
        onClose={() => setShowChapterList(false)}>
        <View
          style={{ flex: 1, flexDirection: "column", overflow: "hidden" }}
          className="bg-background-light dark:bg-background-dark">
          {/* Header */}
          <Animated.View
            style={[
              {
                width: "100%",
                height: 120,
                paddingTop: insets.top,
              },
              headerAnimatedStyle,
            ]}>
            {currentChapter ? (
              <ReaderHeader
                title={book.title}
                chapter={currentChapter}
                onMenuPress={() => setShowChapterList(true)}
                onClosePress={() => router.back()}
              />
            ) : (
              <LoadingScreen />
            )}
          </Animated.View>

          {/* Main content */}
          <Animated.View style={[{ flex: 1, paddingHorizontal: 20 }, contentAnimatedStyle]}>
            {chapterContent && !loading ? (
              <ReaderView
                content={chapterContent}
                onScroll={scrollHandler}
                onPress={handleContentPress}
                fontSize={fontSize}
              />
            ) : (
              <LoadingScreen />
            )}
          </Animated.View>

          {/* Footer */}
          <Animated.View
            style={[
              {
                width: "100%",
                paddingBottom: insets.bottom,
                height: 80,
              },
              footerAnimatedStyle,
            ]}>
            <ReaderBottomBar onSettingsPress={() => setShowSettings(true)} />
          </Animated.View>
        </View>
      </ChapterSidebar>

      {/* Modals */}
      {showSettings && (
        <SettingsSheet onClose={() => setShowSettings(false)} fontSize={fontSize} onFontSizeChange={setFontSize} />
      )}

      {showPurchaseModal && chapterToUnlock !== null && chapters && (
        <PurchaseModal
          chapter={chapters[chapterToUnlock]}
          credits={credits}
          onPurchase={handlePurchaseChapter}
          onClose={() => setShowPurchaseModal(false)}
        />
      )}

      {/* Book Completion Rating Drawer */}
      {showRatingDrawer && book && <RatingSheet />}

      {/* Confetti effect when book is completed */}
      {showRatingDrawer && <ConfettiCannon count={100} origin={{ x: -10, y: 0 }} autoStart={true} fadeOut={true} />}
    </GestureHandlerRootView>
  );
});

export default ReaderScreen;
