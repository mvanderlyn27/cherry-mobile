import React, { useEffect } from "react";
import { Text, View, Image } from "react-native";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  FadeIn,
  SlideInRight,
} from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function FreeChaptersScreen() {
  const router = useRouter();
  const imageOpacity = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const buttonOpacity = useSharedValue(0);

  useEffect(() => {
    imageOpacity.value = withTiming(1, { duration: 800 });
    contentOpacity.value = withDelay(400, withTiming(1, { duration: 800 }));
    buttonOpacity.value = withDelay(800, withTiming(1, { duration: 800 }));
  }, []);

  const imageStyle = useAnimatedStyle(() => {
    return {
      opacity: imageOpacity.value,
    };
  });

  const contentStyle = useAnimatedStyle(() => {
    return {
      opacity: contentOpacity.value,
    };
  });

  const buttonStyle = useAnimatedStyle(() => {
    return {
      opacity: buttonOpacity.value,
    };
  });

  const handleNext = () => {
    router.push("/onboarding/unlock-chapters");
  };

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <SafeAreaView className="flex-1">
        <View className="flex-1 px-6 justify-between py-6">
          <View className="flex-1 items-center justify-center gap-6">
            <Animated.View style={imageStyle} className="relative">
              <Image
                source={require("@/assets/images/book_cover/1.png")}
                className="w-64 h-80 rounded-lg shadow-lg"
                resizeMode="cover"
              />
              <Animated.View
                entering={SlideInRight.delay(600).springify()}
                className="absolute top-4 right-0 bg-cherry-light px-4 py-2 rounded-l-lg shadow-md">
                <Text className="text-white font-bold font-kaisei-bold">Chapter 1: Free!</Text>
              </Animated.View>
            </Animated.View>

            <Animated.Text
              style={contentStyle}
              className="text-3xl font-bold text-center text-story-light dark:text-story-dark px-4 mt-6 font-kaisei-bold">
              Try Out Any Book
            </Animated.Text>

            <Animated.View style={contentStyle} className="px-8">
              <Text className="text-xl opacity-70 text-center text-story-light dark:text-story-dark leading-6 font-kaisei-bold">
                Every story starts with a free first chapter. Sample any book no strings attached!
              </Text>
            </Animated.View>
          </View>

          <View className="items-end mt-4">
            <Animated.View style={buttonStyle}>
              <TouchableOpacity
                className="bg-buttons-light dark:bg-buttons-dark py-5 rounded-2xl items-center shadow-md"
                onPress={handleNext}>
                <Text className="bg-cherry-light rounded-full  px-6 py-3 text-white font-bold text-lg font-kaisei-bold">
                  Next
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
