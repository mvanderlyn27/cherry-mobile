import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { IconSymbol } from "../ui/IconSymbol";
import { Icon } from "@/types/app";
import { useColorScheme } from "nativewind";
const colors = require("@/config/colors");

type StreakDayProps = {
  day: number;
  cherryCount: number;
  isClaimable: boolean;
  isClaimed: boolean;
  onClaim: () => void;
  colorScheme: "light" | "dark" | "system" | undefined;
};

const StreakDay = ({ day, cherryCount, isClaimable, isClaimed, onClaim, colorScheme }: StreakDayProps) => (
  <View className="flex-1 items-center">
    <Text className={`text-sm mb-2 text-story-light dark:text-story-dark`}>Day {day}</Text>
    <TouchableOpacity
      disabled={!isClaimable || isClaimed}
      onPress={onClaim}
      style={
        isClaimable
          ? {
              shadowColor: "#fff",
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.5,
              shadowRadius: 8,
              elevation: 5,
            }
          : {}
      }
      className={`w-[64px] h-[64px] border-2 border-white rounded-full items-center justify-center ${
        isClaimed ? "bg-cherry-light opacity-20" : isClaimable ? "bg-cherry-light" : "bg-white"
      }`}>
      {isClaimed ? (
        <Text className="text-white font-heebo text-sm">Claimed</Text>
      ) : (
        <View className="flex-1 flex-col justify-center items-center">
          <IconSymbol
            name={Icon.cherry}
            size={24}
            color={isClaimable ? "white" : colors.cherry[colorScheme || "light"]}
          />
          <Text
            className={`font-heebo-medium text-md ${
              isClaimable ? "text-white" : "text-cherry-light dark:text-cherry-dark"
            }`}>
            {cherryCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  </View>
);
const cherryStreaks = [
  {
    day: 1,
    cherries: 5,
  },
  {
    day: 2,
    cherries: 5,
  },
  {
    day: 3,
    cherries: 10,
  },
  {
    day: 4,
    cherries: 10,
  },
  {
    day: 5,
    cherries: 25,
  },
];
export const StreakCard = () => {
  const { colorScheme } = useColorScheme();
  return (
    <View className="bg-tabs_selected-light dark:bg-tabs_selected-dark border-2 border-white rounded-2xl p-4 mb-4">
      <View className="flex flex-row gap-2">
        <IconSymbol name={Icon.star} size={26} color="white" />
        <Text className="text-2xl font-kaisei-bold text-white dark:text-white mb-4">Streak Rewards</Text>
      </View>
      <View className="flex-row justify-between">
        {cherryStreaks.map((streak) => (
          <StreakDay
            key={streak.day}
            day={streak.day}
            cherryCount={streak.cherries}
            isClaimable={streak.day === 2}
            isClaimed={streak.day === 1}
            onClaim={() => console.log(`Claim day ${streak.day}`)}
            colorScheme={colorScheme}
          />
        ))}
      </View>
    </View>
  );
};
