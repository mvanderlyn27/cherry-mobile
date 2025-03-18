import React, { useState } from "react";
import { View, Text, TouchableOpacity, Switch, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Icon } from "@/types/app";
import { useColorScheme } from "nativewind";

// Mock user data - replace with your actual auth logic
const mockUser: null | { name: string; email: string } = null; // Set to null to show logged out state

export default function Page() {
  const { setColorScheme } = useColorScheme();
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const handleCreateAccount = () => {
    // Navigate to sign up screen or show modal
    console.log("Create account");
  };

  const handleRestorePurchases = () => {
    // Logic to restore purchases
    console.log("Restore purchases");
  };

  const handleLogout = () => {
    // Logic to log user out
    console.log("Logout");
  };

  const renderSettingItem = (icon: Icon, title: string, onPress?: () => void, rightElement?: React.ReactNode) => (
    <TouchableOpacity
      className="flex-row items-center py-4 px-4 border-b border-gray-100"
      onPress={onPress}
      disabled={!onPress}>
      <View className="w-8 h-8 rounded-full bg-pink-100 items-center justify-center mr-3">
        <IconSymbol name={icon} size={18} color="#E57373" />
      </View>
      <Text className="flex-1 text-gray-800 font-medium">{title}</Text>
      {rightElement || (onPress && <IconSymbol name={Icon["right-arrow"]} size={18} color="#999" />)}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      <View className="px-4 py-4 border-b border-gray-100">
        <Text className="font-kaisei-bold text-2xl text-gray-800">Account</Text>
      </View>

      <ScrollView>
        {!mockUser ? (
          // Logged out state
          <View className="mb-6">
            <View className="bg-pink-50 mx-4 my-4 p-4 rounded-xl">
              <Text className="font-kaisei-medium text-lg text-gray-800 mb-2">Create an account</Text>
              <Text className="text-gray-600 mb-4">Sign up to sync your library and purchases across devices</Text>
              <TouchableOpacity className="bg-[#E57373] py-3 rounded-lg items-center" onPress={handleCreateAccount}>
                <Text className="text-white font-medium">Create Account</Text>
              </TouchableOpacity>
            </View>

            {renderSettingItem(Icon.diamond, "Restore Purchases", handleRestorePurchases)}
          </View>
        ) : (
          // Logged in state
          <View className="mb-6">
            <View className="flex-row items-center p-4 border-b border-gray-100">
              <Image
                source={{ uri: "https://randomuser.me/api/portraits/women/44.jpg" }}
                className="w-16 h-16 rounded-full mr-4"
              />
              <View>
                <Text className="font-kaisei-medium text-lg">{mockUser.name}</Text>
                <Text className="text-gray-500">{mockUser.email}</Text>
              </View>
            </View>

            {renderSettingItem(Icon.account, "Edit Profile", () => console.log("Edit profile"))}

            {renderSettingItem(Icon.diamond, "My Purchases", () => console.log("View purchases"))}

            {renderSettingItem(Icon.logout, "Logout", handleLogout)}
          </View>
        )}

        <View className="mb-6">
          <Text className="px-4 py-2 text-sm font-medium text-gray-500 uppercase">Preferences</Text>

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

          {renderSettingItem(Icon.font, "Reading Settings", () => console.log("Reading settings"))}
        </View>

        <View className="mb-6">
          <Text className="px-4 py-2 text-sm font-medium text-gray-500 uppercase">Support</Text>

          {renderSettingItem(Icon.question, "Help & Support", () => console.log("Help"))}

          {renderSettingItem(Icon.document, "Terms of Service", () => console.log("Terms"))}

          {renderSettingItem(Icon.shield, "Privacy Policy", () => console.log("Privacy"))}
        </View>

        <View className="items-center py-6">
          <Text className="text-gray-400 text-sm">Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
