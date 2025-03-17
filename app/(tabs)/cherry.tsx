import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { SUPERWALL_TRIGGERS } from "@/config/superwall";
import { PaywallButton } from "@/components/PaywallButton";
import { superwallService } from "@/services/superwall";
import { useSuperwall } from "@/hooks/useSuperwall";

export default function Page() {
  // This screen will immediately show the paywall
  const { showPaywall } = useSuperwall();
  useEffect(() => {
    // You can add any logic here to handle the paywall, such as showing a modal or redirecting to the paywall screen
    // For now, let's just log a message
    console.log("Paywall screen is shown");
    showPaywall(SUPERWALL_TRIGGERS.ONBOARDING);
  }, []);
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <PaywallButton />
    </SafeAreaView>
  );
}
