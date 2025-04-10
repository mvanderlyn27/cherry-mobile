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
import Toast from "react-native-toast-message";
import { posthog } from "@/services/posthog";
import { AuthService } from "@/services/authService";
import { appStore$ } from "@/stores/appStores";
import { use$ } from "@legendapp/state/react";
import { BookService } from "@/services/bookService";
import { waitForStoresLoaded } from "@/stores/supabaseStores";
import { useColorScheme } from "nativewind";
import { PaymentService } from "@/services/paymentService";
import { authStore$ } from "@/stores/authStore";
import { SubscriptionService } from "@/services/subscriptionService";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { setColorScheme } = useColorScheme();
  const loading = use$(
    () =>
      appStore$.fontsReady &&
      (appStore$.loggedIn || appStore$.anonymous) &&
      appStore$.storesLoaded &&
      appStore$.revenueCatReady &&
      appStore$.subscriptionStatusReady &&
      appStore$.cherryPackagesReady
  );
  const userId = use$(authStore$.userId);
  const [fontsLoaded, error] = useFonts({
    KaiseiDecol_400Regular,
    KaiseiDecol_500Medium,
    KaiseiDecol_700Bold,
    Heebo_400Regular,
    Heebo_500Medium,
    Heebo_700Bold,
  });
  useEffect(() => {
    //initialize all services
    const init = async () => {
      setColorScheme("light");
      await AuthService.initialize();
      await waitForStoresLoaded();
      await PaymentService.loadCreditPackages();
    };
    init();
  }, []);
  useEffect(() => {
    //initialize all services
    if (userId) {
      PaymentService.initializeRevenueCat(userId);
      SubscriptionService.listenToSubscriptionStatus(userId);
    }
  }, [userId]);
  useEffect(() => {
    if (!loading) {
      //if we're logged in and all services are ready, hide the splash screen
      SplashScreen.hideAsync();
    }
  }, [loading]);

  useEffect(() => {
    if (fontsLoaded) {
      appStore$.fontsReady.set(true);
    }
  }, [fontsLoaded]);
  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView className="flex-1 bg-background-light dark:bg-background-dark">
      <PostHogProvider client={posthog}>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="modals/search" options={{ presentation: "modal" }} />
          <Stack.Screen name="modals/book/[id]" options={{ presentation: "modal" }} />
          <Stack.Screen name="modals/cherry" options={{ presentation: "modal" }} />
          <Stack.Screen name="modals/reader" options={{ presentation: "fullScreenModal" }} />
          <Stack.Screen name="modals/cherryInfo" options={{ presentation: "modal" }} />
          <Stack.Screen name="modals/signIn" options={{ presentation: "modal" }} />
        </Stack>
        <Toast />
      </PostHogProvider>
    </GestureHandlerRootView>
  );
}
