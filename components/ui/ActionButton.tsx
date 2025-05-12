import React, { useEffect } from "react";
import { TouchableOpacity, Text, View, ActivityIndicator, Dimensions } from "react-native"; // Import Dimensions
import { IconSymbol } from "./IconSymbol";
import { Icon } from "@/types/app";
import { useColorScheme } from "nativewind";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  interpolateColor,
} from "react-native-reanimated";
const colors = require("@/config/colors");

// Update the ActionButtonMode type to include the new mode
type ActionButtonMode =
  | "read"
  | "unlock"
  | "info"
  | "buy"
  | "buyGradient"
  | "review1"
  | "review2"
  | "continue"
  | "cancel";
type ActionButtonSize = "small" | "medium" | "large";

type ActionButtonProps = {
  mode: ActionButtonMode;
  onPress: () => void;
  label?: string;
  credits?: number;
  isLoading?: boolean;
  size?: ActionButtonSize;
  discountPercentage?: number;
};

const ActionButton = ({
  mode,
  onPress,
  credits,
  label,
  isLoading = false,
  size = "medium",
  discountPercentage,
}: ActionButtonProps) => {
  const { colorScheme } = useColorScheme();
  const screenWidth = Dimensions.get("window").width; // Get screen width

  // Determine effective size based on screen width
  let effectiveSize = size;
  if (screenWidth < 380) {
    // Small screen adjustments
    if (size === "large") {
      effectiveSize = "medium";
    } else if (size === "medium") {
      effectiveSize = "small";
    }
    // If size is 'small', it remains 'small'
  }
  // Add more breakpoints/adjustments if needed for medium screens etc.

  // Animation values
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.95);
  const progress = useSharedValue(0);

  // Setup the loading animation
  useEffect(() => {
    if (isLoading) {
      // Fade in and scale up animation
      opacity.value = withTiming(0.7, { duration: 300, easing: Easing.inOut(Easing.ease) });
      scale.value = withTiming(1, { duration: 300, easing: Easing.inOut(Easing.ease) });

      // Start the pulsing animation
      progress.value = withRepeat(
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        -1, // Infinite repeat
        true // Reverse
      );
    } else {
      // Fade out and scale down animation
      opacity.value = withTiming(0, { duration: 300, easing: Easing.inOut(Easing.ease) });
      scale.value = withTiming(0.95, { duration: 300, easing: Easing.inOut(Easing.ease) });
    }
  }, [isLoading]);

  // Create animated styles
  const loadingOverlayStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [colors.story[colorScheme || "light"] + "99", colors.story[colorScheme || "light"] + "66"]
    );

    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
      backgroundColor,
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: 999,
      justifyContent: "center",
      alignItems: "center",
      zIndex: 10,
    };
  });

  const getButtonClasses = () => {
    switch (mode) {
      case "read":
        return "bg-buttons-light dark:bg-buttons-dark";
      case "unlock":
        return "bg-buttons_2-light dark:bg-buttons_2-dark";
      case "buy":
        return "bg-white dark:bg-white";
      case "info":
        return "bg-white dark:bg-buttons-dark";
      case "review1":
        return "bg-white dark:white";
      case "review2":
        return "bg-buttons-light dark:bg-buttons-dark";
      case "continue":
        return "bg-buttons-light dark:bg-buttons-dark";
      default:
        return "bg-buttons-light dark:bg-buttons-dark";
    }
  };

  const getTextClasses = () => {
    switch (mode) {
      case "continue":
        return "text-white";
      case "review1":
        return "text-buttons_text-light dark:buttons_text-text-dark";
      case "review2":
        return "text-white";
      case "buy":
        return "text-cherry-light dark:text-cherry-dark";
      case "unlock":
      case "read":
        return "text-white";
      case "info":
        return "text-buttons_text-light dark:buttons_text-text-dark";
      case "buyGradient":
        return "text-white";
      default:
        return "text-story-light dark:text-story-dark";
    }
  };

  const getIcon = () => {
    switch (mode) {
      case "unlock":
        return Icon.cherry;
      case "buy":
        return Icon.cherry;
      case "buyGradient":
        return Icon.cherry;
      default:
        return null;
    }
  };

  const getDefaultLabel = () => {
    switch (mode) {
      case "read":
        return "Read Now";
      case "unlock":
        return "| Unlock";
      case "buy":
        return "| Unlock Full Story";
      case "buyGradient":
        return "| Add More Cherries";
      case "review1":
        return "Read Story";
      case "review2":
        return "Rate Now";
      case "continue":
        return "Continue";
      case "info":
        return "More Info";
      default:
        return "Read Now";
    }
  };
  // Get shadow configuration
  const getShadowClasses = () => {
    switch (mode) {
      case "unlock":
        return `shadow-[0_0_5px_${colors["buttons_2_shadow"][colorScheme || "light"] || "white"}]`;
      case "buy":
        return `shadow-[0_0_5px_${colors["cherry"][colorScheme || "light"]}]`;
      default:
        return "";
    }
  };

  // Get border configuration for buy and unlock modes
  const getBorderClasses = () => {
    switch (mode) {
      case "unlock":
        return "border border-white";
      case "buy":
        return "border border-cherry-light dark:border-cherry-dark";
      case "buyGradient":
        return "border border-white dark:border-white";
      default:
        return "";
    }
  };
  // Get padding based on effective size
  const getPaddingClasses = () => {
    switch (
      effectiveSize // Use effectiveSize
    ) {
      case "small":
        return "px-3 py-1.5"; // Slightly reduced vertical padding for small
      case "large":
        return "px-6 py-4";
      case "medium":
      default:
        return "px-4 py-2.5"; // Slightly reduced vertical padding for medium
    }
  };

  // Get font size based on effective size
  const getFontSizeClass = () => {
    switch (
      effectiveSize // Use effectiveSize
    ) {
      case "small":
        return "text-sm"; // Reduced from md
      case "large":
        return "text-xl";
      case "medium":
      default:
        return "text-base"; // Reduced from lg
    }
  };

  // Get icon size based on effective button size
  const getIconSize = () => {
    switch (
      effectiveSize // Use effectiveSize
    ) {
      case "small":
        return 12; // Reduced from 14
      case "large":
        return 22;
      case "medium":
      default:
        return 16; // Reduced from 18
    }
  };

  const icon = getIcon();
  const buttonLabel = label || getDefaultLabel();
  const buttonClasses = getButtonClasses();
  const textClasses = getTextClasses();
  const borderClasses = getBorderClasses();
  const shadowClasses = getShadowClasses();
  const paddingClasses = getPaddingClasses();
  const fontSizeClass = getFontSizeClass();
  const iconSize = getIconSize();

  const getIconColor = () => {
    switch (mode) {
      case "buy":
        return colors.cherry[colorScheme || "light"];
      case "unlock":
      case "read":
        return "#FFFFFF";
      case "buyGradient":
        return "#FFFFFF";
      case "info":
        return colors.buttons_text[colorScheme || "light"];
      default:
        return colors.story[colorScheme || "light"];
    }
  };

  // Get shadow configuration
  const getShadowStyle = () => {
    switch (mode) {
      case "unlock":
        return {
          shadowColor: colors.buttons_2_shadow[colorScheme || "light"],
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 1,
          shadowRadius: 5,
          elevation: 5,
        };
      case "buy":
        return {
          shadowColor: colors.cherry[colorScheme || "light"],
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 1,
          shadowRadius: 5,
          elevation: 5,
        };
      case "buyGradient":
        return {
          shadowColor: "#DA6CFF",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.5,
          shadowRadius: 5,
          elevation: 5,
        };
      default:
        return {};
    }
  };

  // Get border configuration
  const getBorderStyle = () => {
    switch (mode) {
      case "unlock":
        return {
          borderWidth: 1,
          borderColor: "#FFFFFF",
        };
      case "buy":
        return {
          borderWidth: 1,
          borderColor: colors.cherry[colorScheme || "light"],
        };
      case "buyGradient":
        return {
          borderWidth: 1,
          borderColor: "white",
        };
      default:
        return {};
    }
  };

  // Render the button with gradient if mode is buyGradient
  if (mode === "buyGradient") {
    return (
      <View
        style={{
          shadowColor: "#DA6CFF",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.8,
          shadowRadius: 8,
          elevation: 0,
        }}>
        <TouchableOpacity
          className="rounded-full overflow-hidden border-[1.5px] border-white"
          onPress={onPress}
          disabled={isLoading}>
          <LinearGradient colors={["#DA6CFF", "#7E98FF"]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
            <View className="flex flex-row justify-center items-center p-4 relative">
              {icon && <IconSymbol name={icon} size={iconSize} color={getIconColor()} />}
              {credits !== undefined && (
                <Text className={`text-center font-heebo-medium ml-1 mr-1 ${textClasses} ${fontSizeClass}`}>
                  {credits}
                </Text>
              )}
              <Text className={`text-center font-heebo-medium ${textClasses} ${fontSizeClass}`}>{buttonLabel}</Text>

              {/* Loading overlay */}
              {isLoading && (
                <Animated.View style={loadingOverlayStyle}>
                  <ActivityIndicator size="small" color="#FFFFFF" />
                </Animated.View>
              )}
            </View>
          </LinearGradient>
        </TouchableOpacity>
        {discountPercentage && !isLoading && (
          <View
            style={{
              position: "absolute",
              top: -14,
              right: -14,
              backgroundColor: "red",
              width: 38,
              height: 38,
              borderRadius: 24,
              justifyContent: "center",
              alignItems: "center",
              zIndex: 20,
              elevation: 5, // For Android shadow
              shadowColor: "#000", // For iOS shadow
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 2,
            }}>
            <Text
              style={{
                color: "white",
                fontSize: 12,
                fontWeight: "bold",
              }}>
              {`-${discountPercentage}%`}
            </Text>
          </View>
        )}
      </View>
    );
  }

  // Regular button rendering for other modes
  return (
    <TouchableOpacity
      style={!isLoading && [getShadowStyle(), getBorderStyle()]}
      className={`${buttonClasses} rounded-full ${paddingClasses} flex flex-row items-center justify-center relative`}
      onPress={onPress}
      disabled={isLoading}>
      {icon && <IconSymbol name={icon} size={iconSize} color={getIconColor()} />}
      {credits !== undefined && mode !== "read" && mode !== "info" && mode !== "continue" && (
        <Text className={`text-center font-heebo-medium ml-1 mr-1 ${textClasses} ${fontSizeClass}`}>{credits}</Text>
      )}
      <Text className={`text-center font-heebo-medium ${textClasses} ${fontSizeClass}`}>{buttonLabel}</Text>

      {/* Loading overlay */}
      {isLoading && <Animated.View style={loadingOverlayStyle}></Animated.View>}

      {/* Discount Badge */}
      {discountPercentage && !isLoading && (
        <View
          style={{
            position: "absolute",
            top: -14,
            right: -14,
            backgroundColor: "red",
            width: 38,
            height: 38,
            borderRadius: 24,
            justifyContent: "center",
            alignItems: "center",
            zIndex: 20,
            elevation: 5, // For Android shadow
            shadowColor: "#000", // For iOS shadow
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 2,
          }}>
          <Text
            style={{
              color: "white",
              fontSize: 12,
              fontWeight: "bold",
            }}>
            {`-${discountPercentage}%`}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default ActionButton;
