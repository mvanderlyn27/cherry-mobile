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
import { purchaseStore$, readerStore$ } from "@/stores/appStores";
import { ChapterService } from "@/services/chapterService";
import { ExtendedChapter } from "@/types/app";
import { generateId, users$ } from "@/stores/supabaseStores";
import { when } from "@legendapp/state";
import { RatingSheet } from "@/components/reader/RatingBottomDrawer";
import { LoggingService } from "@/services/loggingService";
import { TransactionService } from "@/services/transactionService";

const ReaderScreen = observer(() => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const userId = use$(authStore$.userId);
  if (!id || !userId) return null;
  const router = useRouter();

  // Use Legend state from readerStore
  const book = use$(readerStore$.book);
  const chapters = use$(readerStore$.chapters);
  const currentChapterNumber = use$(readerStore$.currentChapterNumber);
  const chapterContent = use$(readerStore$.chapterContent);
  const loading = use$(readerStore$.loading);
  const credits = use$(users$[userId].credits);
  const error = use$(readerStore$.error);
  const purchaseStatus = use$(purchaseStore$.purchaseStatus);
  const purchaseError = use$(purchaseStore$.error);

  // Derived state for current chapter
  const currentChapter = use$(() => {
    if (!chapters || currentChapterNumber === null) return null;
    return chapters[currentChapterNumber];
  });

  // UI state (kept in component)
  const [showChapterList, setShowChapterList] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [chapterToUnlock, setChapterToUnlock] = useState<number | null>(null);
  const [fontSize, setFontSize] = useState(18);
  const [uiVisible, setUiVisible] = useState(true);
  const [isInitialized, setInitialized] = useState(false);
  const [showRatingDrawer, setShowRatingDrawer] = useState(false);
  const insets = useSafeAreaInsets();

  // Animation values
  const scrollY = useSharedValue(0);
  const lastScrollY = useSharedValue(0);
  // Initialize reader when component mounts
  useEffect(() => {
    console.log("Initializing reader with book ID:", id);

    // Only initialize once
    if (!isInitialized) {
      readerStore$.initialize(id);
      setInitialized(true);
    }

    // Cleanup function
    return () => {
      // Reset reader store when component unmounts
      readerStore$.book.set(null);
      readerStore$.chapters.set(null);
      readerStore$.currentChapterNumber.set(null);
      readerStore$.chapterContent.set(null);
    };
  }, [id, isInitialized]);

  // Threshold for UI visibility
  const SCROLL_THRESHOLD = 20;
  const ANIMATION_DURATION = 300;

  // Add a new function to handle scroll end
  const handleScrollEnd = (isAtBottom: boolean) => {
    // If we're at the bottom and chapter isn't completed, show UI and complete chapter
    if (
      isAtBottom &&
      chapters &&
      currentChapterNumber !== null &&
      chapters[currentChapterNumber] &&
      chapters[currentChapterNumber].progress?.status !== "completed"
    ) {
      console.log("At bottom, completing chapter");
      handleChapterComplete();
    }
    setUiVisible(true);
    scrollY.value = withTiming(0, { duration: ANIMATION_DURATION });
  };

  // Scroll handler to track scroll position
  const handleScroll = () => {
    console.log("Handling scroll");
    setUiVisible(false);
    scrollY.value = withTiming(1, { duration: ANIMATION_DURATION });
  };

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
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10,
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
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 10,
    };
  });

  // Animated styles for content
  const contentAnimatedStyle = useAnimatedStyle(() => {
    // Adjust padding based on UI visibility
    const paddingTop = interpolate(scrollY.value, [0, 1], [130, 0], Extrapolate.CLAMP);
    const paddingBottom = interpolate(scrollY.value, [0, 1], [80, 0], Extrapolate.CLAMP);

    return {
      paddingTop,
      paddingBottom,
      flex: 1,
    };
  });

  // Handle tap on reading area
  const handleContentPress = () => {
    // Toggle UI visibility on tap
    const newVisibility = !uiVisible;
    setUiVisible(newVisibility);

    // Animate UI elements
    if (newVisibility) {
      scrollY.value = withTiming(0, { duration: ANIMATION_DURATION });
    } else {
      scrollY.value = withTiming(1, { duration: ANIMATION_DURATION });
    }
  };

  // Handle chapter selection - updated to use chapter number
  const handleChapterSelect = async (index: number) => {
    if (!book || !chapters) return;

    const chapterNumber = chapters[index].chapter_number;

    if (!chapters[index].is_owned) {
      setChapterToUnlock(chapterNumber);
      setShowPurchaseModal(true);
    } else {
      // Update current chapter
      readerStore$.setChapter(chapterNumber);
      setShowChapterList(false);
    }
  };

  // Navigate to previous chapter - updated to use chapter number
  const goToPreviousChapter = () => {
    if (!currentChapter || !chapters || currentChapterNumber === null) return;

    const prevChapterNumber = currentChapterNumber - 1;
    if (prevChapterNumber < 1) return; // Already at first chapter

    const prevChapter = chapters[prevChapterNumber];
    if (!prevChapter.is_owned) {
      setChapterToUnlock(prevChapterNumber);
      setShowPurchaseModal(true);
      return;
    }

    readerStore$.setChapter(prevChapterNumber);
    // Reset scroll position for new chapter
    scrollY.value = 0;
  };

  // Navigate to next chapter - updated to use chapter number
  const goToNextChapter = () => {
    if (!currentChapter || !chapters || currentChapterNumber === null) return;

    const nextChapterNumber = currentChapterNumber + 1;
    if (nextChapterNumber > Object.keys(chapters).length) return; // Already at last chapter

    const nextChapter = chapters[nextChapterNumber];
    if (!nextChapter.is_owned) {
      setChapterToUnlock(nextChapterNumber);
      setShowPurchaseModal(true);
      return;
    }

    readerStore$.setChapter(nextChapterNumber);
    // Reset scroll position for new chapter
    scrollY.value = 0;
  };

  // Add a new state for the rating drawer

  // Update the handleChapterComplete function
  const handleChapterComplete = () => {
    console.log("Handling chapter complete");
    if (!chapters || currentChapterNumber === null) {
      LoggingService.handleError("Chapters not found", { bookId: id }, false);
      return;
    }

    // Make sure currentChapter exists before accessing it
    const currentChapter = chapters[currentChapterNumber];
    if (currentChapter) {
      // Let the ChapterService handle the completion logic and percentage calculation
      ChapterService.finishReadingChapter(currentChapter, id, 0); // The percentage will be calculated in the service

      // Check if all chapters are completed to show rating drawer
      const chaptersArray = Object.values(chapters || {});
      const completedChapters = chaptersArray.filter(
        (chapter) =>
          chapter.progress?.status === "completed" ||
          (chapter.chapter_number === currentChapterNumber && chapter.progress?.status === "reading")
      ).length;

      const totalChapters = chaptersArray.length;
      const isBookCompleted = completedChapters >= totalChapters;

      if (isBookCompleted) {
        // Show rating drawer and confetti for book completion
        setShowRatingDrawer(true);
      }

      // Finish the current chapter UI updates
      scrollY.value = withTiming(0, { duration: ANIMATION_DURATION });
      setUiVisible(true);
    } else {
      LoggingService.handleError(
        "Current chapter not found",
        {
          bookId: id,
          chapterNumber: currentChapterNumber,
        },
        false
      );
    }
  };

  // Check if navigation buttons should be disabled
  const isPreviousDisabled = () => {
    if (currentChapterNumber === null || !chapters) return true;

    const prevDisabled = currentChapterNumber - 1 <= 0;
    return prevDisabled;
  };
  const isNextOwned = () => {
    if (currentChapterNumber === null || !chapters) return true;
    const ownsPrevChapter = chapters[currentChapterNumber + 1]?.is_owned;
    return ownsPrevChapter;
  };
  const isPreviousOwned = () => {
    if (currentChapterNumber === null || !chapters) return true;
    const ownsPrevChapter = chapters[currentChapterNumber - 1]?.is_owned;
    return ownsPrevChapter;
  };
  const isNextDisabled = () => {
    if (currentChapterNumber === null || !chapters) return true;

    // const ownsPrevChapter = chapters[currentChapterNumber + 1]?.is_owned;
    const nextDisabled = currentChapterNumber + 1 > Object.keys(chapters).length;
    return nextDisabled;
  };

  // Handle chapter purchase
  const handlePurchaseChapter = async () => {
    if (!chapters || !chapterToUnlock) {
      console.log("chapters, chapterToUnlock", chapters, chapterToUnlock, currentChapterNumber);
      LoggingService.handleError("missing info for chapter purchase", { bookId: id }, false);
      return;
    }
    const { success } = TransactionService.buyChapter(chapters[chapterToUnlock!]?.id);
    if (success) {
      try {
        await ChapterService.refreshData(id);
        readerStore$.setChapter(chapterToUnlock); // Assuming this method exists in readerStore$
        setShowPurchaseModal(false);
        setShowChapterList(false);
      } catch (error) {
        LoggingService.handleError("Failed to refresh after purchase", { bookId: id, error }, false);
      }
    }

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

  if (chapters && Object.values(chapters).length === 0) {
    return <ErrorScreen message="No chapters found for this book." onBack={() => router.back()} />;
  }
  const handleLikePress = () => {
    // Handle like button press
    if (currentChapterNumber === null || !book) return;
    ChapterService.toggleChapterLike(currentChapterNumber);
  };
  if (!book || !chapters || currentChapterNumber === null || !chapterContent) {
    // console.log("loading", book, chapters, currentChapterNumber, chapterContent);
    return <LoadingScreen />;
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ChapterSidebar
        chapters={chapters}
        currentChapterNumber={currentChapterNumber}
        onChapterSelect={handleChapterSelect}
        isOpen={showChapterList}
        onClose={() => setShowChapterList(false)}>
        <View style={{ flex: 1, flexDirection: "column" }} className="bg-background-light dark:bg-background-dark">
          {/* Main content - takes full screen with animated padding */}
          <Animated.View style={[{ flex: 1 }, contentAnimatedStyle]}>
            {chapterContent && !loading ? (
              <ReaderView
                content={chapterContent}
                onScroll={handleScroll}
                onPress={handleContentPress}
                onScrollEnd={handleScrollEnd} // Add the new scroll end handler
                fontSize={fontSize}
                lastChapter={currentChapterNumber === Object.keys(chapters).length}
              />
            ) : (
              <LoadingScreen />
            )}
          </Animated.View>

          {/* Header - positioned absolutely */}
          <Animated.View style={[headerAnimatedStyle]}>
            {currentChapterNumber ? (
              <ReaderHeader
                title={book.title}
                chapter={chapters[currentChapterNumber]}
                onMenuPress={() => setShowChapterList(true)}
                onClosePress={() => router.back()}
              />
            ) : (
              <LoadingScreen />
            )}
          </Animated.View>

          {/* Footer - positioned absolutely */}
          <Animated.View style={[footerAnimatedStyle]}>
            <ReaderBottomBar
              isLiked={chapters[currentChapterNumber].is_liked || false}
              onLikePress={handleLikePress}
              onSettingsPress={() => setShowSettings(true)}
              onPreviousPress={goToPreviousChapter}
              onNextPress={goToNextChapter}
              isNextOwned={isNextOwned()}
              purchaseNext={() => {
                setChapterToUnlock(currentChapterNumber + 1);
                setShowPurchaseModal(true);
              }}
              isPreviousOwned={isPreviousOwned()}
              purchasePrevious={() => {
                setChapterToUnlock(currentChapterNumber - 1);
                setShowPurchaseModal(true);
              }}
              isPreviousDisabled={isPreviousDisabled()}
              isNextDisabled={isNextDisabled()}
            />
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
          credits={credits || 0}
          onPurchase={handlePurchaseChapter}
          onClose={() => {
            setShowPurchaseModal(false);
            purchaseStore$.error.set(null);
            purchaseStore$.purchaseStatus.set(null);
          }}
          status={purchaseStatus}
          error={purchaseError}
        />
      )}

      {/* Book Completion Rating Drawer */}
      {/* {showRatingDrawer && book && <RatingSheet />} */}

      {/* Confetti effect when book is completed */}
      {/* {showRatingDrawer && <ConfettiCannon count={100} origin={{ x: -10, y: 0 }} autoStart={true} fadeOut={true} />} */}
    </GestureHandlerRootView>
  );
});

export default ReaderScreen;
