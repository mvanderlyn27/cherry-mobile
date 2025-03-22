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
import {
  useFonts,
  KaiseiDecol_400Regular,
  KaiseiDecol_500Medium,
  KaiseiDecol_700Bold,
} from "@expo-google-fonts/kaisei-decol";
import { Heebo_400Regular, Heebo_500Medium, Heebo_700Bold } from "@expo-google-fonts/heebo";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    KaiseiDecol_400Regular,
    KaiseiDecol_500Medium,
    KaiseiDecol_700Bold,
    Heebo_400Regular,
    Heebo_500Medium,
    Heebo_700Bold,
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
    <GestureHandlerRootView className="flex-1 bg-background-light dark:bg-background-dark">
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="reader" options={{ presentation: "fullScreenModal" }} />
        <Stack.Screen name="search" options={{ presentation: "modal" }} />
        <Stack.Screen name="book/[id]" options={{ presentation: "modal" }} />
        <Stack.Screen name="modals/cherry" options={{ presentation: "modal" }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
