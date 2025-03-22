import { View, Text, TouchableOpacity } from "react-native";
import { IconSymbol } from "../ui/IconSymbol";
import { Icon } from "@/types/app";
import { useColorScheme } from "nativewind";
const colors = require("@/config/colors");
type AdOptionProps = {
  cherries: number;
  adCount: number;
  onWatch: () => void;
  colorScheme?: "light" | "dark" | "system"; // Add colorScheme as a prop
};

const AdOption = ({ cherries, adCount, onWatch, colorScheme }: AdOptionProps) => (
  <TouchableOpacity onPress={onWatch} className="overflow-hidden ">
    <View className="flex-1 flex-row items-center justify-between mb-4 bg-background-light dark:bg-background-dark rounded-3xl px-4 py-2">
      <View className="flex-row  items-center justify-center bg-white rounded-3xl py-3 px-6">
        <IconSymbol name={Icon.cherry} size={24} color="#FF6B6B" />
        <Text className="text-lg font-bold text-cherry-light dark:text-cherry-dark ml-2">{cherries}</Text>
      </View>
      <Text className="text-text-light dark:text-text-dark flex-1 text-center font-heebo-medium text-lg">
        Watch {adCount} {adCount === 1 ? "ad" : "ads"}
      </Text>
      <View className="bg-white dark:white p-3 rounded-full">
        <IconSymbol name={Icon.play} size={24} color={colors["story"][colorScheme || "light"]} />
      </View>
    </View>
  </TouchableOpacity>
);

export const WatchAdsCard = () => {
  const { colorScheme } = useColorScheme();
  return (
    <View className=" bg-buttons_text-light dark:bg-buttons_text-dark p-4 mb-4 rounded-2xl border-2 border-white">
      <View className="flex flex-row gap-2">
        <IconSymbol name={Icon.tv} size={26} color="white" />
        <Text className="text-2xl font-kaisei-bold text-white dark:text-white mb-4">Watch Ads</Text>
      </View>
      <AdOption cherries={10} adCount={1} colorScheme={colorScheme} onWatch={() => console.log("Watch 1 ad")} />
      <AdOption cherries={25} adCount={3} colorScheme={colorScheme} onWatch={() => console.log("Watch 3 ads")} />
      <AdOption cherries={50} adCount={5} colorScheme={colorScheme} onWatch={() => console.log("Watch 5 ads")} />
    </View>
  );
};
