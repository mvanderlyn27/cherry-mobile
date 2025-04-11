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
} from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SubscriptionCard } from "@/components/cherry/SubscriptionCard";
import { SubscriptionService } from "@/services/subscriptionService";
import { LoggingService } from "@/services/loggingService";
import { PremiumCard } from "@/components/onboarding/PremiumCard";
import { authStore$ } from "@/stores/authStore";

export default function PremiumScreen() {
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
    authStore$.isNew.set(false);
    router.push("/onboarding/welcome-gift");
  };
  const handleSubscribe = async () => {
    const { success, subscribed, error } = await SubscriptionService.presentPaywall();
    if (error) {
      console.log("Subscription failed");
      LoggingService.handleError(
        new Error("Subscription failed"),
        { component: "Onboarding.PremiumPage", function: "handleSubscribe" },
        true
      );
    }
    if (subscribed) {
      console.log("Subscription successful");
      LoggingService.logEvent("Subscription successful", {
        component: "Onboarding.PremiumPage",
        function: "handleSubscribe",
      });
      handleNext();
    }
  };
  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <SafeAreaView className="flex-1">
        <View className="flex-1 px-6 justify-between py-6">
          <View className="flex-1 items-center justify-center gap-6">
            <Animated.View style={imageStyle} className="relative">
              <View className="max-h-[300px]">
                <PremiumCard handleSubscribe={handleSubscribe} />
              </View>
            </Animated.View>
          </View>
        </View>

        <View className="items-center mt-4">
          <Animated.View style={buttonStyle}>
            <TouchableOpacity
              className="bg-buttons-light dark:bg-buttons-dark py-5 rounded-2xl items-center shadow-md"
              onPress={handleNext}>
              <Text className=" rounded-full px-6 py-3 text-story-light dark:text-story-dark font-bold text-lg font-kaisei-bold">
                Not Interested
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </SafeAreaView>
    </View>
  );
}
