import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  withSpring,
  Easing,
  SlideInRight,
  FadeIn,
} from "react-native-reanimated";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Icon } from "@/types/app";
import { AuthService } from "@/services/authService";
const colors = require("@/config/colors");

export default function WelcomeGiftScreen() {
  const router = useRouter();
  const contentOpacity = useSharedValue(0);
  const buttonOpacity = useSharedValue(0);
  const giftScale = useSharedValue(0.5);
  const giftRotate = useSharedValue(0);
  const cherryOpacity = useSharedValue(0);
  const cherryScale = useSharedValue(0.5);
  const cherryY = useSharedValue(-20);

  useEffect(() => {
    // Animate content
    contentOpacity.value = withTiming(1, { duration: 400 });

    // Animate gift box
    giftScale.value = withDelay(150, withSpring(1, { damping: 10, stiffness: 100 }));

    // Animate gift opening
    setTimeout(() => {
      giftRotate.value = withSequence(
        withTiming(-0.05, { duration: 100 }),
        withTiming(0.05, { duration: 100 }),
        withTiming(-0.03, { duration: 75 }),
        withTiming(0.03, { duration: 75 }),
        withTiming(0, { duration: 50 })
      );

      // Make gift disappear
      setTimeout(() => {
        giftScale.value = withTiming(0, { duration: 200 });

        // Show cherries after gift disappears
        setTimeout(() => {
          cherryOpacity.value = withTiming(1, { duration: 250 });
          cherryScale.value = withSpring(1, { damping: 12, stiffness: 100 });
          cherryY.value = withSpring(0, { damping: 8, stiffness: 80 });

          // Show button
          setTimeout(() => {
            buttonOpacity.value = withTiming(1, { duration: 250 });
          }, 250);
        }, 200);
      }, 350);
    }, 750);
  }, []);

  const contentStyle = useAnimatedStyle(() => {
    return {
      opacity: contentOpacity.value,
    };
  });

  const giftStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: giftScale.value }, { rotate: `${giftRotate.value}rad` }],
    };
  });

  const cherryStyle = useAnimatedStyle(() => {
    return {
      opacity: cherryOpacity.value,
      transform: [{ scale: cherryScale.value }, { translateY: cherryY.value }],
    };
  });

  const buttonStyle = useAnimatedStyle(() => {
    return {
      opacity: buttonOpacity.value,
    };
  });

  const handleFinish = () => {
    // Navigate to main app
    AuthService.welcomeGift();
    router.replace("/(tabs)");
  };

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <SafeAreaView className="flex-1">
        <View className="flex-1 px-6 py-6">
          <Animated.View style={contentStyle} className="flex-1 justify-center items-center">
            <View className="relative">
              <Animated.View style={giftStyle} className="mb-8">
                <IconSymbol name={Icon.gift} size={120} color={colors.cherry.light} />
              </Animated.View>

              <Animated.View
                style={cherryStyle}
                className="absolute top-0 left-0 right-0 bottom-0 items-center justify-center">
                <View className="flex-row items-center">
                  <IconSymbol name={Icon.cherry} size={120} color={colors.cherry.light} />
                  <Text className="text-5xl font-bold text-cherry-light dark:text-cherry-dark ml-2 font-kaisei-bold">
                    50
                  </Text>
                </View>
              </Animated.View>
            </View>

            <Animated.Text
              entering={FadeIn.withInitialValues({ opacity: 0 })}
              className="text-3xl font-bold text-center text-story-light dark:text-story-dark px-4 mb-4 font-kaisei-bold mt-16">
              Lets get started!
            </Animated.Text>

            <Animated.Text
              entering={FadeIn.delay(200).withInitialValues({ opacity: 0 })}
              className="text-lg opacity-70 text-center text-story-light dark:text-story-dark leading-6 mb-8 px-4 font-kaisei-bold">
              We've added 50 cherries to your account to get you started. Enjoy unlocking premium chapters!
            </Animated.Text>
          </Animated.View>

          <View className="items-center mt-4">
            <Animated.View style={buttonStyle}>
              <TouchableOpacity
                className="bg-buttons-light dark:bg-buttons-dark py-5 rounded-2xl items-center shadow-md"
                onPress={handleFinish}>
                <Text className="bg-cherry-light rounded-full  px-6 py-3 text-white font-bold text-lg font-kaisei-bold">
                  Lets Go!
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
