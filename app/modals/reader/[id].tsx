import React, { useState, useRef, useEffect } from "react";
import { View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { observer, use$ } from "@legendapp/state/react";
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
import { ReaderService } from "@/services/readerService";
import { authStore$ } from "@/stores/authStore";
import { readerStore$ } from "@/stores/appStores";
import { ChapterService } from "@/services/chapterService";
import { ExtendedBook, ExtendedChapter } from "@/types/app";
import { LoggingService } from "@/services/loggingService";

const ReaderScreen = observer(() => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const userId = use$(authStore$.userId);
  if (!id || !userId) return null;
  const router = useRouter();

  // Use Legend state for book and chapter index
  const book: ExtendedBook | null = use$(() => BookService.getBookDetails(id));
  const chapters: ExtendedChapter[] = use$(() => ChapterService.getChapters(id));
  const [chapterContent, setChapterContent] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [chapterIndex, setChapterIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // console.log("book", book, "chapters", chapters);
    if (book && chapters && chapters.length > 0 && !isInitialized) {
      // Find the last chapter with 'reading' status
      const readingChapters = chapters.filter((chapter) => chapter.progress?.status === "reading");
      const initialIndex =
        readingChapters.length > 0
          ? chapters.findIndex((c) => c.id === readingChapters[readingChapters.length - 1].id)
          : 0;
      console.log("initialIndex", initialIndex);
      setChapterIndex(initialIndex);
      setIsInitialized(true);
    }
  }, [book, chapters, isInitialized]);

  useEffect(() => {
    console.log("chapterIndex", chapterIndex, "chapters", chapters);
    if (chapterIndex === null || !chapters) return;
    const updateChapterContent = async () => {
      setLoading(true);
      try {
        const selectedChapter = chapters[chapterIndex];
        console.log("selectedChapter", selectedChapter);
        if (selectedChapter) {
          console.log("loaded chapter content");
          const content = await ChapterService.getChapterContent(selectedChapter);
          setChapterContent(content);
          setLoading(false);
        }
      } catch (error) {
        console.error("Failed to load chapter content:", error);
      }
    };
    updateChapterContent();
  }, [chapterIndex]);

  // Animation values
  const scrollY = useSharedValue(0);
  const lastScrollY = useSharedValue(0);
  const [uiVisible, setUiVisible] = useState(true);

  // Threshold for UI visibility
  const SCROLL_THRESHOLD = 20;

  // State
  const [showChapterList, setShowChapterList] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [chapterToUnlock, setChapterToUnlock] = useState<number | null>(null);
  const [fontSize, setFontSize] = useState(18);
  const [credits] = useState(100);
  const insets = useSafeAreaInsets();

  // Scroll handler to track scroll position
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const currentScrollY = event.contentOffset.y;
      const scrollDelta = currentScrollY - lastScrollY.value;
      const animationRate = 0.15;

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
  const handleChapterSelect = (index: number) => {
    if (!book || !chapters) return;

    if (!chapters[index].is_owned) {
      setChapterToUnlock(index);
      setShowPurchaseModal(true);
    } else {
      setChapterIndex(index);
      setShowChapterList(false);
    }
  };

  // Handle chapter purchase
  const handlePurchaseChapter = () => {
    // if (chapterToUnlock === null || !book || !chapters) return;
    // if (credits >= 50) {
    //   // Update chapter to unlocked
    //   readerStore$.book.chapters[chapterToUnlock].is_owned.set(true);
    //   // Navigate to the chapter
    //   readerStore$.chapter_index.set(chapterToUnlock);
    //   setShowPurchaseModal(false);
    //   setShowChapterList(false);
    // } else {
    //   router.push("/modals/cherry");
    // }
  };

  if (!isInitialized || loading || !book || !chapters) {
    return <LoadingScreen />;
  }

  if (!chapters || chapters.length === 0) {
    return <ErrorScreen message="No chapters found for this book." onBack={() => router.back()} />;
  }

  // Get current chapter
  const currentChapter = chapterIndex !== null && chapters ? chapters[chapterIndex] : null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ChapterSidebar
        chapters={chapters}
        currentChapterIndex={chapterIndex || 0}
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
    </GestureHandlerRootView>
  );
});

export default ReaderScreen;
