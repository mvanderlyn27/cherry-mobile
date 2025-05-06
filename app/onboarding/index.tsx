import React, { useEffect } from "react";
import { Text, View, Image } from "react-native";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";
import { SvgUri } from "react-native-svg";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Icon } from "@/types/app";
const colors = require("@/config/colors");

export default function WelcomeScreen() {
  const router = useRouter();
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);
  const titleOpacity = useSharedValue(0);
  const buttonOpacity = useSharedValue(0);
  const buttonTranslateY = useSharedValue(50);

  useEffect(() => {
    // Animate cherry icon
    scale.value = withSpring(1, { damping: 10, stiffness: 100 });
    opacity.value = withTiming(1, { duration: 1000 });

    // Animate title
    titleOpacity.value = withDelay(600, withTiming(1, { duration: 800, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }));

    // Animate button
    buttonOpacity.value = withDelay(1200, withTiming(1, { duration: 600 }));
    buttonTranslateY.value = withDelay(1200, withSpring(0, { damping: 12, stiffness: 100 }));
  }, []);

  const cherryStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  const titleStyle = useAnimatedStyle(() => {
    return {
      opacity: titleOpacity.value,
    };
  });

  const buttonStyle = useAnimatedStyle(() => {
    return {
      opacity: buttonOpacity.value,
      transform: [{ translateY: buttonTranslateY.value }],
    };
  });

  const handleNext = () => {
    router.push("/onboarding/discover");
  };

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <SafeAreaView className="flex-1">
        <View className="flex-1 px-6 justify-between py-6">
          <View className="flex-1 items-center justify-center gap-6">
            <Animated.View style={cherryStyle} className="mb-5">
              {/* <Image source={require("@/assets/icons/lucide_cherry.svg")} className="w-32 h-32" resizeMode="contain" /> */}
              <IconSymbol name={Icon.cherry} size={150} color={colors.cherry["light"]} />
            </Animated.View>

            <Animated.Text
              style={titleStyle}
              className="text-4xl font-bold text-center text-cherry-light dark:text-cherry-dark px-4 font-kaisei-bold">
              Welcome to Cherry!
            </Animated.Text>

            <Animated.View style={titleStyle} className="px-8">
              <Text className="text-lg opacity-70 text-center text-story-light dark:text-story-dark leading-6 font-kaisei-medium">
                Your gateway to endless romance stories
              </Text>
            </Animated.View>
          </View>
          <View className="items-center mt-4">
            <Animated.View style={buttonStyle}>
              <TouchableOpacity
                className="bg-buttons-light dark:bg-buttons-dark py-5 rounded-2xl items-center shadow-md"
                onPress={handleNext}>
                <Text className="bg-cherry-light rounded-full  px-6 py-3 text-white font-bold text-lg font-kaisei-bold">
                  Get Started
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
