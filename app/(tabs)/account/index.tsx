import React, { useState } from "react";
import { View, Text, TouchableOpacity, Switch, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Icon } from "@/types/app";
import Header from "@/components/ui/Header";
import { useColorScheme } from "nativewind";
const colors = require("@/config/colors");

// Mock user data - replace with your actual auth logic
const mockUser: null | { name: string; email: string } = null; // Set to null to show logged out state

export default function Page() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

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
    console.log("Logout");
  };
  const handleDelete = () => {
    // Logic to log user out
    console.log("Delete");
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
      {!mockUser ? (
        // Logged out state
        <View className="mb-6">
          <View className="bg-tabs_selected-light/20 mx-4 my-4 p-4 rounded-xl">
            <Text className="font-kaisei-medium text-lg text-story-light dark:text-story-dark mb-2">
              Create an account
            </Text>
            <Text className="text-story-light dark:text-story-dark mb-4">
              Sign up to sync your library and purchases across devices
            </Text>
            <TouchableOpacity
              className="bg-buttons-light dark:bg-buttons-dark py-3 rounded-lg items-center"
              onPress={handleCreateAccount}>
              <Text className="text-white font-medium">Create Account</Text>
            </TouchableOpacity>
          </View>

          {renderSettingItem(Icon.diamond, "Restore Purchases", handleRestorePurchases)}
        </View>
      ) : (
        // Logged in state
        <View className="mb-6">
          <View className="flex-row items-center p-4 border-b border-tab_bar_border-light dark:border-tab_bar_border-dark">
            <Image
              source={{ uri: "https://randomuser.me/api/portraits/women/44.jpg" }}
              className="w-16 h-16 rounded-full mr-4"
            />
            <View>
              <Text className="font-kaisei-medium text-lg">{mockUser.name}</Text>
              <Text className="text-story-light dark:text-story-dark ">{mockUser.email}</Text>
            </View>
          </View>

          {renderSettingItem(Icon.account, "Edit Profile", () => console.log("Edit profile"))}

          {renderSettingItem(Icon.diamond, "My Purchases", () => console.log("View purchases"))}

          {renderSettingItem(Icon.logout, "Logout", handleLogout)}
          {renderSettingItem(Icon.close, "Delete", handleDelete)}
        </View>
      )}

      <View className="mb-6">
        <Text className="px-4 py-2 text-sm font-medium text-story-light dark:text-story-dark  uppercase">
          Preferences
        </Text>

        {renderSettingItem(
          Icon.moon,
          "Dark Mode",
          undefined,
          <Switch
            value={darkMode}
            onValueChange={(val) => {
              setDarkMode(val);
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
      </View>

      <View className="mb-6">
        <Text className="px-4 py-2 text-sm font-medium text-story-light dark:text-story-dark  uppercase">Support</Text>

        {renderSettingItem(Icon.question, "Help & Support", () => router.navigate("/account/support"))}

        {renderSettingItem(Icon.document, "Terms of Service", () => router.navigate("/account/termsOfService"))}

        {renderSettingItem(Icon.shield, "Privacy Policy", () => router.navigate("/account/privacyPolicy"))}
      </View>

      <View className="items-center py-6">
        <Text className="text-tab_bar_border-light dark:text-tab_bar_border-dark text-sm">Version 1.0.0</Text>
      </View>
    </ScrollView>
  );
}
