import React, { useEffect } from "react";
import { Text, View, Image } from "react-native";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
} from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function UnlockChaptersScreen() {
  const router = useRouter();
  const lockScale = useSharedValue(1);
  const lockOpacity = useSharedValue(1);
  const unlockOpacity = useSharedValue(0);
  const cherryOpacity = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const buttonOpacity = useSharedValue(0);

  useEffect(() => {
    // Animate lock to unlock transition
    setTimeout(() => {
      lockScale.value = withSequence(
        withTiming(1.2, { duration: 300, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }),
        withTiming(0.8, { duration: 300, easing: Easing.bezier(0.25, 0.1, 0.25, 1) })
      );
      lockOpacity.value = withTiming(0, { duration: 500 });
      unlockOpacity.value = withDelay(500, withTiming(1, { duration: 500 }));
      cherryOpacity.value = withDelay(800, withTiming(1, { duration: 500 }));
    }, 1000);

    contentOpacity.value = withDelay(1500, withTiming(1, { duration: 800 }));
    buttonOpacity.value = withDelay(1800, withTiming(1, { duration: 800 }));
  }, []);

  const lockStyle = useAnimatedStyle(() => {
    return {
      opacity: lockOpacity.value,
      transform: [{ scale: lockScale.value }],
    };
  });

  const unlockStyle = useAnimatedStyle(() => {
    return {
      opacity: unlockOpacity.value,
    };
  });

  const cherryStyle = useAnimatedStyle(() => {
    return {
      opacity: cherryOpacity.value,
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
    router.push("/onboarding/premium");
  };

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <SafeAreaView className="flex-1">
        <View className="flex-1 px-6 justify-between py-6">
          <View className="flex-1 items-center justify-center gap-6">
            <View className="relative w-32 h-32 items-center justify-center">
              <Animated.View style={lockStyle} className="absolute">
                <MaterialCommunityIcons name="lock" size={80} color="#E57373" />
              </Animated.View>

              <Animated.View style={unlockStyle} className="absolute">
                <MaterialCommunityIcons name="lock-open" size={80} color="#E57373" />
              </Animated.View>

              <Animated.View style={cherryStyle} className="absolute -top-4 -right-4">
                <Image
                  source={require("@/assets/icons/lucide_cherry.svg")}
                  className="w-16 h-16"
                  resizeMode="contain"
                />
              </Animated.View>
            </View>

            <Animated.Text
              style={contentStyle}
              className="text-3xl font-bold text-center text-story-light dark:text-story-dark px-4 mt-6 font-kaisei-bold">
              Liked what you saw?
            </Animated.Text>

            <Animated.View style={contentStyle} className="px-8">
              <Text className="text-lg text-start opacity-70  text-story-light dark:text-story-dark leading-6 font-kaisei-bold">
                Unlock the rest of a story by:
              </Text>

              <View className="mt-4 ml-8">
                <View className="flex-row items-center mb-2">
                  <MaterialCommunityIcons name="circle-medium" size={24} color="#E57373" />
                  <Text className="text-lg text-story-light dark:text-story-dark font-kaisei">
                    Buying the whole book
                  </Text>
                </View>

                <View className="flex-row items-center">
                  <MaterialCommunityIcons name="circle-medium" size={24} color="#E57373" />
                  <Text className="text-lg text-story-light dark:text-story-dark font-kaisei">
                    Unlocking 1 chapter at a time
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <MaterialCommunityIcons name="circle-medium" size={24} color="#E57373" />
                  <Text className="text-lg text-story-light dark:text-story-dark font-kaisei">
                    Having <Text className="font-kaisei-bold">Cherry: Unlimited</Text>
                  </Text>
                </View>
              </View>
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
