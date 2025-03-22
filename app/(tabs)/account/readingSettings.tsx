import React, { useState } from "react";
import { View, Text, Switch, TouchableOpacity } from "react-native";
import { useColorScheme } from "nativewind";
import Slider from "@react-native-community/slider";
const colors = require("@/config/colors");

export default function ReadingSettingsScreen() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const [fontSize, setFontSize] = useState(16);
  const [autoScroll, setAutoScroll] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(5);

  return (
    <View className="flex-1 p-4 bg-background-light dark:bg-background-dark">
      <View className="bg-tabs-light dark:bg-tabs-dark rounded-xl p-4 mb-4">
        <Text className="text-lg font-kaisei-bold text-text-light dark:text-text-dark mb-4">Display Settings</Text>

        <View className="flex-row items-center justify-between py-3 border-b border-background-light dark:border-background-dark">
          <Text className="text-text-light dark:text-text-dark">Dark Mode</Text>
          <Switch
            value={colorScheme === "dark"}
            onValueChange={toggleColorScheme}
            trackColor={{ false: "#FFE9E9", true: "#542E2F" }}
            thumbColor={colorScheme === "dark" ? "#EA9092" : "#B25557"}
          />
        </View>

        <View className="py-3 border-b border-background-light dark:border-background-dark">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-text-light dark:text-text-dark">Font Size</Text>
            <Text className="text-buttons_text-light dark:text-buttons_text-dark">{fontSize}px</Text>
          </View>
          <Slider
            minimumValue={12}
            maximumValue={24}
            step={1}
            value={fontSize}
            onValueChange={setFontSize}
            minimumTrackTintColor={colors.cherry[colorScheme || "light"]}
            maximumTrackTintColor={colors.tabs[colorScheme || "light"]}
            thumbTintColor={colors.cherry[colorScheme || "light"]}
          />
        </View>
      </View>

      <View className="bg-tabs-light dark:bg-tabs-dark rounded-xl p-4">
        <Text className="text-lg font-kaisei-bold text-text-light dark:text-text-dark mb-4">Reading Settings</Text>

        <View className="flex-row items-center justify-between py-3 border-b border-background-light dark:border-background-dark">
          <Text className="text-text-light dark:text-text-dark">Auto-Scroll</Text>
          <Switch
            value={autoScroll}
            onValueChange={setAutoScroll}
            trackColor={{ false: "#FFE9E9", true: "#542E2F" }}
            thumbColor={autoScroll ? "#EA9092" : "#B25557"}
          />
        </View>

        {autoScroll && (
          <View className="py-3">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-text-light dark:text-text-dark">Scroll Speed</Text>
              <Text className="text-buttons_text-light dark:text-buttons_text-dark">{scrollSpeed}</Text>
            </View>
            <Slider
              minimumValue={1}
              maximumValue={10}
              step={1}
              value={scrollSpeed}
              onValueChange={setScrollSpeed}
              minimumTrackTintColor={colors.cherry[colorScheme || "light"]}
              maximumTrackTintColor={colors.tabs[colorScheme || "light"]}
              thumbTintColor={colors.cherry[colorScheme || "light"]}
            />
          </View>
        )}
      </View>
    </View>
  );
}
