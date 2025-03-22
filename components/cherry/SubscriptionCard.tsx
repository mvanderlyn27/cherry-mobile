import { View, Text, ImageBackground, TouchableOpacity } from "react-native";
import { IconSymbol } from "../ui/IconSymbol";
import { Icon } from "@/types/app";
import { LinearGradient } from "expo-linear-gradient";

const image = require("@/assets/images/subscription.png");

export const SubscriptionCard = ({ handleSubscribe }: { handleSubscribe: () => void }) => {
  return (
    <ImageBackground
      source={image}
      resizeMode="stretch"
      className="flex-1 p-4 flex-col gap-2 my-4"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 5,
      }}>
      <View className="p-4">
        <View className="flex-row items-center gap-2 mb-4">
          <IconSymbol name={Icon.diamond} size={30} color="#fff" />
          <Text className="text-3xl shadow-lg font-kaisei-bold text-white dark:text-white">Unlimited Stories</Text>
        </View>
        <View className="flex-row items-center mb-4">
          <Text className="text-5xl font-kaisei-bold text-story-light dark:text-story-dark">$2.99/ </Text>
          <Text className="text-lg font-kaisei-bold text-story-light dark:text-story-dark">For the first month</Text>
        </View>
        <Text className="font-kaisei-medium text-story-light dark:text-story-dark mb-6">
          then $4.99/mohth, cancel subscription anytime.
        </Text>
        {/* <ActionButton mode="unlock" onPress={() => console.log("Subscribe")} label="Unlock Now" /> */}
        <TouchableOpacity
          onPress={handleSubscribe}
          style={{
            shadowColor: "#fff",
            shadowOffset: { width: 0, height: 0 },
            shadowRadius: 8,
            shadowOpacity: 0.5,
            elevation: 5,
            borderRadius: 25,
          }}>
          <LinearGradient
            colors={["#FF9861", "#FF5659", "#8463F9"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              borderRadius: 25,
              borderWidth: 1,
              borderColor: "white",
              paddingVertical: 15,
              paddingHorizontal: 20,
            }}>
            <Text className="text-center font-heebo-medium text-lg text-white">Unlock Now</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};
