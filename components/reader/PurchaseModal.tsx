import React, { useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, Animated, ActivityIndicator } from "react-native";
import { Chapter } from "@/types/app";
import { useColorScheme } from "nativewind";
import * as Haptics from "expo-haptics";
import ActionButton from "../ui/ActionButton";
import { router } from "expo-router";
import { PurchaseError } from "@/types/app";

type PurchaseModalProps = {
  chapter: Chapter;
  credits: number;
  onPurchase: () => void;
  onClose: () => void;
  status?: "pending" | "completed" | "failed" | null;
  error: PurchaseError | null;
};

export const PurchaseModal = ({ chapter, credits, onPurchase, onClose, status = null, error }: PurchaseModalProps) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  const handlePurchase = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPurchase();
  };

  const handleAddCherries = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/modals/cherry");
  };
  console.log("status", status);
  // Render different content based on status and error
  const renderContent = () => {
    // Loading state
    if (status === "pending") {
      return (
        <>
          <Text className="text-xl mb-6 text-center text-gray-900 dark:text-white">Unlocking Chapter...</Text>
          <ActivityIndicator size="large" color={isDark ? "#fff" : "#000"} />
          <Text className="mt-4 text-center text-gray-700 dark:text-gray-300">
            Please wait while we process your purchase
          </Text>
        </>
      );
    }

    // Error state - needs more cherries
    if (status === "failed" && error === PurchaseError.NeedsMoreCherries) {
      return (
        <>
          <Text className="text-xl mb-4 text-center text-gray-900 dark:text-white">Not Enough Cherries</Text>

          <View className="flex-row items-center justify-center mb-4 gap-2">
            <Text className="text-lg text-gray-800 dark:text-gray-200">Current Balance:</Text>
            <Text className="text-2xl font-bold text-red-500">{credits}</Text>
          </View>

          <Text className="mb-6 text-center text-gray-700 dark:text-gray-300">
            You need {chapter.price - credits} more cherries to unlock this chapter
          </Text>

          <View className="flex-row items-center justify-center gap-4">
            <ActionButton onPress={handleClose} label="Cancel" mode="read" />
            <ActionButton onPress={handleAddCherries} label="Add Cherries" mode="buy" />
          </View>
        </>
      );
    }

    // Default state - purchase prompt
    return (
      <>
        <Text className="text-xl mb-4 text-center text-gray-900 dark:text-white">
          Unlock{" "}
          <Text className="font-bold">
            Chapter {chapter.chapter_number}: {chapter.title}
          </Text>
        </Text>

        <View className="flex-row items-center justify-center mb-6 gap-2">
          <Text className="ml-2 text-lg text-gray-800 dark:text-gray-200">Cherry Balance:</Text>
          <Text className="text-2xl font-bold text-red-500">{credits}</Text>
        </View>

        <View className="flex-row items-center justify-center gap-4">
          <ActionButton onPress={handleClose} label="Cancel" mode="read" />
          <ActionButton onPress={handlePurchase} label={`| Unlock`} credits={chapter.price} mode="buy" />
        </View>
      </>
    );
  };

  return (
    <View className="absolute inset-0 z-30 flex items-center justify-center">
      <Animated.View style={{ opacity: fadeAnim }} className="absolute inset-0 bg-black/70">
        <TouchableOpacity className="w-full h-full" activeOpacity={1} onPress={handleClose} />
      </Animated.View>

      <Animated.View
        className="w-5/6 max-w-md bg-background-light dark:bg-background-dark rounded-xl p-6"
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }}>
        {renderContent()}
      </Animated.View>
    </View>
  );
};
