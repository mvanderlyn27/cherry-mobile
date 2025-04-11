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
  SlideInUp,
  SlideInRight,
  SlideInLeft,
  getAnimatedStyle,
} from "react-native-reanimated";
import GoogleSignInButton from "@/components/signIn/GoogleSignInButton";
import { AppleSignInButton } from "@/components/signIn/AppleSignInButton";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Icon } from "@/types/app";
const colors = require("@/config/colors");

export default function AccountScreen() {
  const router = useRouter();
  const contentOpacity = useSharedValue(0);

  const buttonOpacity = useSharedValue(0);

  useEffect(() => {
    contentOpacity.value = withTiming(1, { duration: 800 });
    buttonOpacity.value = withDelay(900, withTiming(1, { duration: 800 }));
  }, []);

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

  const handleGoogleSignIn = () => {
    // Handle Google sign in
    // router.push("/onboarding/welcome-gift");
    router.push("/onboarding/free-chapters");
  };

  const handleAppleSignIn = () => {
    // Handle Apple sign in
    // router.push("/onboarding/welcome-gift");
    router.push("/onboarding/free-chapters");
  };

  const handleSkip = () => {
    router.push("/onboarding/free-chapters");
  };

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <SafeAreaView className="flex-1">
        <View className="flex-1 px-6 py-6">
          <Animated.View style={contentStyle} className="flex-1 flex-col gap-6 justify-center">
            <View className="items-center mb-8">
              {/* <Image
                source={require("@/assets/icons/lucide_cherry.svg")}
                className="w-16 h-16 mb-4"
                resizeMode="contain"
              /> */}
              <IconSymbol name={Icon.cherry} size={100} color={colors.cherry["light"]} />
            </View>

            <Animated.Text
              entering={FadeIn.delay(200).withInitialValues({ opacity: 0, translateY: 100 })}
              className="text-3xl font-bold text-center text-story-light dark:text-story-dark px-4 mb-4 font-kaisei-bold">
              Save Your Progress?
            </Animated.Text>

            <Animated.Text
              entering={FadeIn.delay(400).withInitialValues({ opacity: 0 })}
              className="text-lg opacity-70 text-center text-story-light dark:text-story-dark leading-6 mb-8 px-4 font-kaisei-bold">
              Create a free account to sync your progress and purchases across devices.
            </Animated.Text>
            <View className="gap-6">
              <GoogleSignInButton onPress={handleGoogleSignIn} />

              <AppleSignInButton onPress={handleAppleSignIn} />
            </View>
          </Animated.View>
          <View className="items-center mt-4">
            <Animated.View style={buttonStyle}>
              <TouchableOpacity
                className="bg-buttons-light dark:bg-buttons-dark py-5 rounded-2xl items-center shadow-md"
                onPress={handleSkip}>
                <Text className=" rounded-full  px-6 py-3 text-story-light dark:text-story-dark font-bold text-lg font-kaisei-bold">
                  Skip Sign Up
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
