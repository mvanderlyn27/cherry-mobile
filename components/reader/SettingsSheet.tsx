import React, { useCallback, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Icon } from "@/types/app";
import { useColorScheme } from "nativewind";
import Slider from "@react-native-community/slider";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from "@gorhom/bottom-sheet";
const colors = require("@/config/colors");

type SettingsSheetProps = {
  onClose: () => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
};

export const SettingsSheet = ({ onClose, fontSize, onFontSizeChange }: SettingsSheetProps) => {
  const insets = useSafeAreaInsets();
  const { colorScheme, setColorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);

  // variables - use percentage-based snap points for better adaptability
  //   const snapPoints = [];

  // Open the sheet when component mounts
  useEffect(() => {
    // Small delay to ensure proper rendering
    const timer = setTimeout(() => {
      bottomSheetRef.current?.expand();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // callbacks
  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) onClose();
    },
    [onClose]
  );

  // Render backdrop
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.7} pressBehavior="close" />
    ),
    []
  );

  return (
    <View style={StyleSheet.absoluteFillObject}>
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        // snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enablePanDownToClose={true}
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={{
          backgroundColor: isDark ? "#777" : "#999",
          width: 40,
        }}
        backgroundStyle={{
          backgroundColor: isDark ? colors.background.dark : colors.background.light,
        }}
        handleStyle={{
          backgroundColor: isDark ? colors.background.dark : colors.background.light,
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
        }}>
        <BottomSheetView className="flex-1 px-4 pt-2" style={{ paddingBottom: insets.bottom }}>
          <Text className="text-xl font-bold text-center text-gray-900 dark:text-white mb-6">Reading Settings</Text>

          <View className="flex-row justify-between items-center mb-6">
            <TouchableOpacity className="p-2" onPress={() => onFontSizeChange(Math.max(14, fontSize - 1))}>
              <IconSymbol name={Icon.font} size={16} color={isDark ? "#fff" : "#000"} />
            </TouchableOpacity>
            <Slider
              style={{ flex: 1, height: 40, marginHorizontal: 10 }}
              minimumValue={14}
              maximumValue={24}
              step={1}
              value={fontSize}
              onValueChange={onFontSizeChange}
              minimumTrackTintColor={isDark ? colors.buttons.dark : colors.buttons.light}
              maximumTrackTintColor={isDark ? "#555" : "#ddd"}
              thumbTintColor={isDark ? colors.cherry.dark : colors.cherry.light}
            />
            <TouchableOpacity className="p-2" onPress={() => onFontSizeChange(Math.min(24, fontSize + 1))}>
              <IconSymbol name={Icon.font} size={24} color={isDark ? "#fff" : "#000"} />
            </TouchableOpacity>
          </View>

          {/* <View className="flex-row gap-4 mb-6">
            <TouchableOpacity
              className={` flex-1 px-3 py-5 bg-white border rounded-3xl  ${
                !isDark ? `border-2 border-${colors.cherry.light}` : "border-buttons_text-light"
              } flex flex-row justify-center  gap-2 items-center`}
              onPress={() => setColorScheme("light")}>
              <IconSymbol name={Icon.sun} size={24} color={colors.buttons_text.light} />
              <Text className="mt-1 text-gray-900">Light</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={` flex-1 px-3 py-5 bg-story-light border rounded-3xl ${
                isDark ? `border-2 border-${colors.cherry.dark}` : "border-gray-700"
              }  flex flex-row gap-2 justify-center items-center`}
              onPress={() => setColorScheme("dark")}>
              <IconSymbol name={Icon.moon} size={24} color="#fff" />
              <Text className="mt-1 text-white">Dark</Text>
            </TouchableOpacity>
          </View> */}
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};
