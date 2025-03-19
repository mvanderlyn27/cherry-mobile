import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StoryReader } from "@/components/StoryReader";
import { observer } from "@legendapp/state/react";
// import { useSuperwall } from "@/hooks/useSuperwall";
import { SUPERWALL_TRIGGERS } from "@/config/superwall";
import { chapters$ } from "@/stores/bookStore";
import { syncState } from "@legendapp/state";

const ReaderScreen = observer(() => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  // const { showPaywall } = useSuperwall();

  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);

  // const userId = userSelectors.userId.get();
  // const isBookOwned = bookSelectors.isBookOwned(id).get();
  const chapters = Object.values(chapters$ || {}).filter((val) => val.bookId === id);
  const isLoading = syncState(chapters$).isGetting;
  console.log("getting: ", isLoading.get(), "chapters: ", chapters);
  // const bookProgress = bookSelectors.bookProgress(id).get();

  // useEffect(() => {
  //   const loadData = async () => {
  //     setIsLoading(true);
  //     try {
  //       // Fetch book chapters
  //       await bookActions.fetchChapters(id);

  //       // If there's saved progress, restore it
  //       if (bookProgress) {
  //         setCurrentChapterIndex(bookProgress.chapterId);
  //       }
  //     } catch (error) {
  //       console.error("Error loading reader data:", error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   loadData();
  // }, [id]);

  const handleChapterChange = (index: number) => {
    setCurrentChapterIndex(index);

    // Save reading progress
    // if (userId) {
    // bookActions.updateReadingProgress(userId, id, index, 0);
    // }
  };

  const handlePurchase = () => {
    // showPaywall(SUPERWALL_TRIGGERS.FEATURE_UNLOCK);
  };

  if (isLoading.get()) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0A7EA4" />
      </SafeAreaView>
    );
  }

  if (!chapters || chapters.length === 0) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <View>
          <Text>No chapters found for this book.</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StoryReader
        bookId={id}
        currentChapterIndex={currentChapterIndex}
        onChapterChange={handleChapterChange}
        // isOwned={isBookOwned}
        isOwned={false}
        onPurchase={handlePurchase}
      />
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
});

export default ReaderScreen;
