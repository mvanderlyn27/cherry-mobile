import { View, Text, ImageBackground, TouchableOpacity } from "react-native";
import { IconSymbol } from "../ui/IconSymbol";
import { Icon } from "@/types/app";
import { LinearGradient } from "expo-linear-gradient";
import { authStore$ } from "@/stores/authStore";
import { users$ } from "@/stores/supabaseStores";
import { use$ } from "@legendapp/state/react";

const image = require("@/assets/images/rectangle.png");

export const PremiumCard = ({ handleSubscribe }: { handleSubscribe: () => void }) => {
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
          <Text className="text-3xl shadow-lg font-kaisei-bold text-white dark:text-white">
            Want Unlimited Stories?
          </Text>
        </View>
        <View className="flex-row items-center  justify-center m-4">
          <Text className="text-4xl font-kaisei-bold text-story-light text-center dark:text-story-dark">
            Cherry: Premium
          </Text>
        </View>
        <Text className="font-kaisei-medium text-story-light dark:text-story-dark mb-6">
          Get access to all the stories Cherry has to offer, early access to new titles, and other perks
        </Text>

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
            <Text className="text-center font-heebo-medium text-lg text-white">See Options</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};
