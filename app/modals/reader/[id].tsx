import React, { useState, useRef } from "react";
import { View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { observer } from "@legendapp/state/react";
import { ReaderView } from "@/components/reader/ReaderView";
import { ReaderHeader } from "@/components/reader/ReaderHeader";
import { ReaderBottomBar } from "@/components/reader/ReaderBottomBar";
import { ChapterSidebar } from "@/components/reader/ChapterSidebar";
import { SettingsSheet } from "@/components/reader/SettingsSheet";
import { PurchaseModal } from "@/components/reader/PurchaseModal";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { ErrorScreen } from "@/components/ui/ErrorScreen";
import { sampleChapters } from "@/config/testData";
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

const ReaderScreen = observer(() => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Animation values
  const scrollY = useSharedValue(0);
  const lastScrollY = useSharedValue(0);
  const [uiVisible, setUiVisible] = useState(true);

  // Threshold for UI visibility (how many pixels to scroll before UI starts fading)
  const SCROLL_THRESHOLD = 20;

  // State
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [showChapterList, setShowChapterList] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [chapterToUnlock, setChapterToUnlock] = useState<number | null>(null);

  // Use sample chapters from testData
  const [chapters] = useState(sampleChapters);
  const [book] = useState({ title: "Dragon's Quest", author: "J.R. Blackwood" });
  const [credits] = useState(100);
  const [isLoading] = useState(false);

  // Scroll handler to track scroll position
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const currentScrollY = event.contentOffset.y;
      const scrollDelta = currentScrollY - lastScrollY.value;

      // Use smaller increments for smoother transitions
      const animationRate = 0.15; // Reduced for smoother animation

      // Only update when scrolling down and past threshold
      if (scrollDelta > 0 && currentScrollY > SCROLL_THRESHOLD) {
        // Use withTiming for smoother transitions
        scrollY.value = withTiming(Math.min(scrollY.value + scrollDelta * animationRate, 1), { duration: 150 });

        if (scrollY.value > 0.9 && uiVisible) {
          runOnJS(setUiVisible)(false);
        }
      } else if (scrollDelta < 0) {
        // Scrolling up - gradually restore UI with smooth animation
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
    // Restore UI on tap with smoother animation
    scrollY.value = withTiming(0, { duration: 300 });
    setUiVisible(true);
  };

  // Get current chapter
  const currentChapter = chapters[currentChapterIndex] || chapters[0];

  // Handle chapter selection
  const handleChapterSelect = (index: number) => {
    if (chapters[index].is_locked) {
      setChapterToUnlock(index);
      setShowPurchaseModal(true);
    } else {
      setCurrentChapterIndex(index);
      setShowChapterList(false);
    }
  };

  // Handle chapter purchase
  const handlePurchaseChapter = () => {
    if (chapterToUnlock === null) return;

    // Check if user has enough credits
    if (credits >= 50) {
      // Assuming 50 credits per chapter
      // Update chapter to unlocked
      chapters[chapterToUnlock].is_locked = false;

      // Navigate to the chapter
      setCurrentChapterIndex(chapterToUnlock);
      setShowPurchaseModal(false);
      setShowChapterList(false);
    } else {
      // Not enough credits, show cherry modal
      router.push("/modals/cherry");
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!chapters || chapters.length === 0) {
    return <ErrorScreen message="No chapters found for this book." onBack={() => router.back()} />;
  }

  // Add font size state
    const [fontSize, setFontSize] = useState(18);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View
        style={{ flex: 1, flexDirection: "column", overflow: "hidden" }}
        className="bg-background-light dark:bg-background-dark">
        {/* Header */}
        <Animated.View
          style={[
            {
              width: "100%",
              height: 120, // Initial fixed height
              paddingTop: insets.top,
            },
            headerAnimatedStyle,
          ]}>
          <ReaderHeader
            title={book.title}
            chapter={currentChapter}
            onMenuPress={() => setShowChapterList(true)}
            onClosePress={() => router.back()}
          />
        </Animated.View>

        {/* Main content */}
        <Animated.View style={[{ flex: 1, paddingHorizontal: 20 }, contentAnimatedStyle]}>
          <ReaderView 
            chapter={currentChapter} 
            onScroll={scrollHandler} 
            onPress={handleContentPress}
            fontSize={fontSize} 
          />
        </Animated.View>

        {/* Footer */}
        <Animated.View
          style={[
            {
              width: "100%",
              paddingBottom: insets.bottom,
              height: 80, // Initial fixed height
            },
            footerAnimatedStyle,
          ]}>
          <ReaderBottomBar onSettingsPress={() => setShowSettings(true)} />
        </Animated.View>
      </View>

      {/* Modals */}
      {showChapterList && (
        <ChapterSidebar
          chapters={chapters}
          currentChapterIndex={currentChapterIndex}
          onChapterSelect={handleChapterSelect}
          onClose={() => setShowChapterList(false)}
        />
      )}

      {showSettings && (
        <SettingsSheet 
          onClose={() => setShowSettings(false)} 
          fontSize={fontSize}
          onFontSizeChange={setFontSize}
        />
      )}

      {showPurchaseModal && chapterToUnlock !== null && (
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
