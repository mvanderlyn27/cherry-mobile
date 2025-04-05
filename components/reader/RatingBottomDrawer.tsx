import React, { useCallback, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Icon } from "@/types/app";
import { useColorScheme } from "nativewind";
import Slider from "@react-native-community/slider";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from "@gorhom/bottom-sheet";
const colors = require("@/config/colors");

type RatingSheetProps = {
  onClose?: () => void;
};

export const RatingSheet = ({ onClose }: RatingSheetProps) => {
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
      //   if (index === -1) onClose();
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
          <Text className="text-xl font-bold text-center text-gray-900 dark:text-white mb-6">How'd You Like it?</Text>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};
