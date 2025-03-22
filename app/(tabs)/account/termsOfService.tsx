import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useRouter } from "expo-router";

export default function TermsOfServiceScreen() {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 p-4 bg-background-light dark:bg-background-dark">
      <View className="bg-tabs-light dark:bg-tabs-dark rounded-xl p-4 mb-4">
        <Text className="text-xl font-kaisei-bold text-text-light dark:text-text-dark mb-4">Terms of Service</Text>
        <Text className="text-text-light dark:text-text-dark mb-4">Last Updated: June 1, 2023</Text>

        <Text className="text-lg font-heebo-medium text-text-light dark:text-text-dark mb-2">
          1. Acceptance of Terms
        </Text>
        <Text className="text-buttons_text-light dark:text-buttons_text-dark mb-4">
          By accessing or using Cherry, you agree to be bound by these Terms of Service. If you do not agree to these
          terms, please do not use our service.
        </Text>

        <Text className="text-lg font-heebo-medium text-text-light dark:text-text-dark mb-2">
          2. Description of Service
        </Text>
        <Text className="text-buttons_text-light dark:text-buttons_text-dark mb-4">
          Cherry provides a platform for users to access and read stories. Some features may require payment or
          subscription.
        </Text>

        <Text className="text-lg font-heebo-medium text-text-light dark:text-text-dark mb-2">3. User Accounts</Text>
        <Text className="text-buttons_text-light dark:text-buttons_text-dark mb-4">
          You are responsible for maintaining the confidentiality of your account information and for all activities
          that occur under your account.
        </Text>

        <Text className="text-lg font-heebo-medium text-text-light dark:text-text-dark mb-2">
          4. Payments and Subscriptions
        </Text>
        <Text className="text-buttons_text-light dark:text-buttons_text-dark mb-4">
          All purchases and subscriptions are final. Refunds are provided at our discretion. Subscriptions automatically
          renew unless canceled at least 24 hours before the end of the current period.
        </Text>

        <Text className="text-lg font-heebo-medium text-text-light dark:text-text-dark mb-2">5. Content Usage</Text>
        <Text className="text-buttons_text-light dark:text-buttons_text-dark mb-4">
          All content provided through Cherry is protected by copyright. Users may not reproduce, distribute, or create
          derivative works without permission.
        </Text>

        <Text className="text-lg font-heebo-medium text-text-light dark:text-text-dark mb-2">6. Changes to Terms</Text>
        <Text className="text-buttons_text-light dark:text-buttons_text-dark mb-4">
          We reserve the right to modify these terms at any time. Continued use of Cherry after changes constitutes
          acceptance of the new terms.
        </Text>
      </View>
    </ScrollView>
  );
}
