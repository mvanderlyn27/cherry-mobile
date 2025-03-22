import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useRouter } from "expo-router";

export default function PrivacyPolicyScreen() {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 p-4 bg-background-light dark:bg-background-dark">
      <View className="bg-tabs-light dark:bg-tabs-dark rounded-xl p-4 mb-4">
        <Text className="text-xl font-kaisei-bold text-text-light dark:text-text-dark mb-4">Privacy Policy</Text>
        <Text className="text-text-light dark:text-text-dark mb-4">Last Updated: June 1, 2023</Text>

        <Text className="text-lg font-heebo-medium text-text-light dark:text-text-dark mb-2">
          1. Information We Collect
        </Text>
        <Text className="text-buttons_text-light dark:text-buttons_text-dark mb-4">
          We collect information you provide directly, such as account information, payment details, and usage data. We
          also collect information automatically, including device information and usage statistics.
        </Text>

        <Text className="text-lg font-heebo-medium text-text-light dark:text-text-dark mb-2">
          2. How We Use Your Information
        </Text>
        <Text className="text-buttons_text-light dark:text-buttons_text-dark mb-4">
          We use your information to provide and improve our services, process transactions, communicate with you, and
          personalize your experience.
        </Text>

        <Text className="text-lg font-heebo-medium text-text-light dark:text-text-dark mb-2">
          3. Information Sharing
        </Text>
        <Text className="text-buttons_text-light dark:text-buttons_text-dark mb-4">
          We do not sell your personal information. We may share information with service providers, for legal reasons,
          or in connection with business transfers.
        </Text>

        <Text className="text-lg font-heebo-medium text-text-light dark:text-text-dark mb-2">4. Data Security</Text>
        <Text className="text-buttons_text-light dark:text-buttons_text-dark mb-4">
          We implement reasonable security measures to protect your information. However, no method of transmission over
          the internet is 100% secure.
        </Text>

        <Text className="text-lg font-heebo-medium text-text-light dark:text-text-dark mb-2">5. Your Choices</Text>
        <Text className="text-buttons_text-light dark:text-buttons_text-dark mb-4">
          You can access, update, or delete your account information. You can also opt out of marketing communications.
        </Text>

        <Text className="text-lg font-heebo-medium text-text-light dark:text-text-dark mb-2">
          6. Changes to Privacy Policy
        </Text>
        <Text className="text-buttons_text-light dark:text-buttons_text-dark mb-4">
          We may update this policy from time to time. We will notify you of any significant changes.
        </Text>
      </View>
    </ScrollView>
  );
}
