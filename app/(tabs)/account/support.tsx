import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Linking } from "react-native";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Icon } from "@/types/app";
import { useColorScheme } from "nativewind";
const colors = require("@/config/colors");

export default function SupportScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();

  return (
    <ScrollView className="flex-1 p-4 bg-background-light dark:bg-background-dark">
      <View className="bg-tabs-light dark:bg-tabs-dark rounded-xl p-4 mb-4">
        <Text className="text-lg font-kaisei-bold text-text-light dark:text-text-dark mb-2">Contact Support</Text>
        <Text className="text-text-light dark:text-text-dark mb-4">
          We're here to help! Reach out to our support team with any questions or issues.
        </Text>

        <TouchableOpacity
          className="flex-row items-center py-3 border-b border-background-light dark:border-background-dark"
          onPress={() => Linking.openURL("mailto:support@cherryapp.com")}>
          <IconSymbol name={Icon.mail} size={20} color={colors.cherry[colorScheme || "light"]} />
          <Text className="ml-3 text-cherry-light dark:text-cherry-dark">support@cherryapp.com</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center py-3"
          onPress={() => Linking.openURL("https://cherryapp.com/support")}>
          <IconSymbol name={Icon.globe} size={20} color={colors.cherry[colorScheme || "light"]} />
          <Text className="ml-3 text-cherry-light dark:text-cherry-dark">Visit Support Center</Text>
        </TouchableOpacity>
      </View>

      <View className="bg-tabs-light dark:bg-tabs-dark rounded-xl p-4 mb-4">
        <Text className="text-lg font-kaisei-bold text-text-light dark:text-text-dark mb-2">
          Frequently Asked Questions
        </Text>

        <View className="py-3 border-b border-background-light dark:border-background-dark">
          <Text className="font-heebo-medium text-text-light dark:text-text-dark mb-1">How do I earn cherries?</Text>
          <Text className="text-buttons_text-light dark:text-buttons_text-dark">
            You can earn cherries by maintaining a daily streak, watching ads, or purchasing them directly.
          </Text>
        </View>

        <View className="py-3 border-b border-background-light dark:border-background-dark">
          <Text className="font-heebo-medium text-text-light dark:text-text-dark mb-1">
            How do I restore my purchases?
          </Text>
          <Text className="text-buttons_text-light dark:text-buttons_text-dark">
            Go to Account → Restore Purchases and follow the instructions.
          </Text>
        </View>

        <View className="py-3">
          <Text className="font-heebo-medium text-text-light dark:text-text-dark mb-1">Can I read offline?</Text>
          <Text className="text-buttons_text-light dark:text-buttons_text-dark">
            Yes! Downloaded stories are available to read even without an internet connection.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
