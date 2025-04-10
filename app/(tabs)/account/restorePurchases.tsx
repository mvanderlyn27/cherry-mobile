import React, { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Icon } from "@/types/app";
import { useColorScheme } from "nativewind";
import { SubscriptionService } from "@/services/subscriptionService";
import ActionButton from "@/components/ui/ActionButton";
const colors = require("@/config/colors");

export default function RestorePurchasesScreen() {
  const { colorScheme } = useColorScheme();
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreComplete, setRestoreComplete] = useState(false);

  const handleRestore = async () => {
    setIsRestoring(true);
    // Simulate restore process
    await SubscriptionService.restoreSubscriptions();
    setIsRestoring(false);
  };

  return (
    <View className="flex-1 p-4 bg-background-light dark:bg-background-dark">
      <View className="bg-tabs-light dark:bg-tabs-dark rounded-xl p-4 mb-4">
        <Text className="text-lg font-kaisei-bold text-text-light dark:text-text-dark mb-2">Restore Subscriptions</Text>
        <Text className="text-text-light dark:text-text-dark mb-4">
          If you have an active subscription but don't see it here, try to restore it below. (
          <Text className="font-bold">
            {" "}
            Note: for issues with cherries/book unlocks reach out to the support team below{" "}
          </Text>
          )
        </Text>

        {restoreComplete ? (
          <View className="items-center py-4">
            <IconSymbol name={Icon.checkmark} size={40} color={colors.cherry[colorScheme || "light"]} />
            <Text className="text-text-light dark:text-text-dark mt-2">Purchases Restored Successfully!</Text>
          </View>
        ) : (
          <ActionButton label="Restore" mode="buyGradient" onPress={handleRestore} isLoading={isRestoring} />
        )}
      </View>

      <View className="bg-tabs-light dark:bg-tabs-dark rounded-xl p-4">
        <Text className="text-lg font-kaisei-bold text-text-light dark:text-text-dark mb-2">Need Help?</Text>
        <Text className="text-text-light dark:text-text-dark mb-4">
          If you need help, or have issues with purchases, please contact our support team.
        </Text>

        <TouchableOpacity className="flex-row items-center">
          <IconSymbol name={Icon.mail} size={20} color={colors.cherry[colorScheme || "light"]} />
          <Text className="ml-2 text-cherry-light dark:text-cherry-dark">cherry@sliceoflifeapp.com</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
