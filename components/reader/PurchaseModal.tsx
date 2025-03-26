import React, { useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { Chapter } from "@/types/app";
import { useColorScheme } from "nativewind";
import * as Haptics from "expo-haptics";

type PurchaseModalProps = {
  chapter: Chapter;
  credits: number;
  onPurchase: () => void;
  onClose: () => void;
};

export const PurchaseModal = ({ chapter, credits, onPurchase, onClose }: PurchaseModalProps) => {
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
      })
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
      })
    ]).start(() => {
      onClose();
    });
  };
  
  const handlePurchase = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPurchase();
  };
  
  return (
    <View className="absolute inset-0 z-30 flex items-center justify-center">
      <Animated.View 
        style={{ opacity: fadeAnim }}
        className="absolute inset-0 bg-black/70"
      >
        <TouchableOpacity 
          className="w-full h-full" 
          activeOpacity={1} 
          onPress={handleClose} 
        />
      </Animated.View>
      
      <Animated.View 
        className="w-5/6 max-w-md bg-white dark:bg-gray-900 rounded-xl p-6"
        style={{ 
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }]
        }}
      >
        <Text className="text-xl font-bold mb-4 text-center text-gray-900 dark:text-white">
          Unlock Chapter
        </Text>
        
        <Text className="text-lg mb-6 text-center text-gray-800 dark:text-gray-200">
          Would you like to unlock Chapter {chapter.chapter_number}: {chapter.title}?
        </Text>
        
        <View className="flex-row items-center justify-center mb-6">
          <Text className="text-2xl font-bold text-red-500">50</Text>
          <Text className="ml-2 text-lg text-gray-800 dark:text-gray-200">
            credits (You have: {credits})
          </Text>
        </View>
        
        <View className="flex-row">
          <TouchableOpacity 
            className="flex-1 py-3 mr-2 bg-gray-200 dark:bg-gray-800 rounded-lg"
            onPress={handleClose}
          >
            <Text className="text-center font-semibold text-gray-800 dark:text-gray-200">
              Cancel
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="flex-1 py-3 ml-2 bg-red-500 rounded-lg"
            onPress={handlePurchase}
          >
            <Text className="text-center font-semibold text-white">
              Unlock
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};