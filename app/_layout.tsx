import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import "../global.css";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Platform } from "react-native";
import "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PostHogProvider } from "posthog-react-native";
import { superwallService } from "@/services/superwall";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  useFonts,
  KaiseiDecol_400Regular,
  KaiseiDecol_500Medium,
  KaiseiDecol_700Bold,
} from "@expo-google-fonts/kaisei-decol";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    KaiseiDecol_400Regular,
    KaiseiDecol_500Medium,
    KaiseiDecol_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }} />
    </GestureHandlerRootView>
  );
}
