import React, { useState } from "react";
import { View, Text, TouchableOpacity, Switch, ScrollView, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Icon } from "@/types/app";
import Header from "@/components/ui/Header";
import { useColorScheme } from "nativewind";
import { authStore$ } from "@/stores/authStore";
import { users$ } from "@/stores/supabaseStores";
import { use$ } from "@legendapp/state/react";
import ActionButton from "@/components/ui/ActionButton";
import { appStore$ } from "@/stores/appStores";
import { AuthService } from "@/services/authService";
import { LoggingService } from "@/services/loggingService";
import { NotificationService } from "@/services/notificationService";
const colors = require("@/config/colors");

// Mock user data - replace with your actual auth logic

export default function Page() {
  const loggedIn = use$(appStore$.loggedIn);
  const { colorScheme, setColorScheme } = useColorScheme();
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const userId = use$(authStore$.userId);

  // Move this hook outside of the conditional
  const credits = use$(users$[userId ? userId : "placeholder"].credits);

  const handleCreateAccount = () => {
    // Navigate to sign up screen or show modal
    console.log("Create account");
    router.navigate("/modals/signIn");
  };

  const handleRestorePurchases = () => {
    // Logic to restore purchases
    console.log("Restore purchases");
    router.navigate("/account/restorePurchases");
  };

  const handleLogout = () => {
    // Logic to log user out
    AuthService.signOut();
  };
  const handleDelete = () => {
    // Show confirmation alert before deleting account
    if (!userId) {
      LoggingService.handleError(new Error("No user ID"), { component: "AccountPage", method: "handleDelete" }, true);
      return;
    }
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone and all your data will be lost.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const { success, error } = await AuthService.deleteAccount(userId);
            if (success) {
              NotificationService.showInfo("Account Deleted", "Your account has been successfully deleted.");
            } else {
              LoggingService.handleError(error, { component: "AccountPage", method: "handleDelete" }, true);
            }
            // Add actual account deletion logic here
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderSettingItem = (icon: Icon, title: string, onPress?: () => void, rightElement?: React.ReactNode) => (
    <TouchableOpacity
      className="flex-row items-center py-4 px-4 border-b border-tab_bar_border-light dark:border-tab_bar_border-dark"
      onPress={onPress}
      disabled={!onPress}>
      <View className="w-8 h-8 rounded-full bg-pink-100 items-center justify-center mr-3">
        <IconSymbol name={icon} size={18} color={colors["buttons"][colorScheme || "light"]} />
      </View>
      <Text className="flex-1 text-gray-800 font-medium">{title}</Text>
      {rightElement ||
        (onPress && (
          <IconSymbol name={Icon["right-arrow"]} size={18} color={colors["tab_bar_border"][colorScheme || "light"]} />
        ))}
    </TouchableOpacity>
  );

  return (
    <ScrollView className="bg-background-light dark:bg-background-dark">
      {!loggedIn ? (
        // Logged out state
        <View className="flex-col gap-4">
          <View className="mb-6">
            <View className="bg-tabs_selected-light/20 mx-4 my-4 p-4 rounded-xl">
              <Text className="font-kaisei-medium text-lg text-story-light dark:text-story-dark mb-2">
                Create Account
              </Text>
              <Text className="text-story-light dark:text-story-dark mb-4">
                Sign up to sync your library and purchases across devices
              </Text>
              <TouchableOpacity
                className="bg-buttons-light dark:bg-buttons-dark py-3 rounded-lg items-center"
                onPress={handleCreateAccount}>
                <Text className="text-white font-medium"> Sign Up / Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View className="mb-6">
            <View className="bg-tabs_selected-light/20 mx-4 my-4 p-4 rounded-xl flex-col items-center justify-center gap-4">
              <Text className="font-kaisei-medium  p-2  text-2xl text-story-light dark:text-story-dark mb-2">
                Cherry Balance:
              </Text>

              <Text className="font-kaisei-medium  text-5xl font-bold text-cherry-light dark:text-cherry-dark mb-4">
                {credits}
              </Text>
              <View className="flex-row justify-center items-center">
                <ActionButton label="Buy Cherries" mode={"buy"} onPress={() => router.navigate("/modals/cherry")} />
              </View>
            </View>
          </View>
        </View>
      ) : (
        // Logged in state
        <View className="mb-6">
          <View className="mb-6">
            <View className="bg-tabs_selected-light/20 mx-4 my-4 p-4 rounded-xl flex-col items-center justify-center gap-4">
              <Text className="font-kaisei-medium  p-2  text-2xl text-story-light dark:text-story-dark mb-2">
                Cherry Balance:
              </Text>

              <Text className="font-kaisei-medium  text-5xl font-bold text-cherry-light dark:text-cherry-dark mb-4">
                {credits}
              </Text>
              <View className="flex-row justify-center items-center">
                <ActionButton label="Buy Cherries" mode={"buy"} onPress={() => router.navigate("/modals/cherry")} />
              </View>
            </View>
          </View>

          {/* {renderSettingItem(Icon.account, "Edit Profile", () => console.log("Edit profile"))} */}

          {/* {renderSettingItem(Icon.diamond, "My Purchases", () => console.log("View purchases"))} */}
          <Text className="px-4 py-2 text-sm font-medium text-story-light dark:text-story-dark  uppercase">
            Account
          </Text>
          {renderSettingItem(Icon.logout, "Logout", handleLogout)}
          {renderSettingItem(Icon.close, "Delete", handleDelete)}
        </View>
      )}

      {/* <View className="mb-6">
        <Text className="px-4 py-2 text-sm font-medium text-story-light dark:text-story-dark  uppercase">
          Preferences
        </Text>

        {renderSettingItem(
          Icon.moon,
          "Dark Mode",
          undefined,
          <Switch
            value={colorScheme === "dark"}
            onValueChange={(val) => {
              setColorScheme(val ? "dark" : "light");
            }}
            trackColor={{ false: "#D1D1D6", true: "#E57373" }}
            thumbColor="#FFFFFF"
          />
        )}

         {renderSettingItem(
          Icon.bell,
          "Notifications",
          undefined,
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: "#D1D1D6", true: "#E57373" }}
            thumbColor="#FFFFFF"
          />
        )}

        {renderSettingItem(Icon.font, "Reading Settings", () => router.navigate("/account/readingSettings"))}
      </View> */}

      <View className="mb-6">
        <Text className="px-4 py-2 text-sm font-medium text-story-light dark:text-story-dark  uppercase">Support</Text>

        {renderSettingItem(Icon.question, "Help & Support", () => router.navigate("/account/support"))}

        {renderSettingItem(Icon.document, "Terms of Service", () => router.navigate("/account/termsOfService"))}

        {renderSettingItem(Icon.shield, "Privacy Policy", () => router.navigate("/account/privacyPolicy"))}
        {renderSettingItem(Icon.diamond, "Restore Purchases", handleRestorePurchases)}
      </View>

      <View className="items-center py-6">
        <Text className="text-tab_bar_border-light dark:text-tab_bar_border-dark text-sm">Version 1.0.0</Text>
      </View>
    </ScrollView>
  );
}
