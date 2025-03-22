import React from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SubscriptionCard } from "@/components/cherry/SubscriptionCard";
import { PurchaseCard } from "@/components/cherry/PurchaseCard";
import { StreakCard } from "@/components/cherry/StreakCard";
import { WatchAdsCard } from "@/components/cherry/WatchAdsCard";
import Header from "@/components/ui/Header";
import { Icon } from "@/types/app";
import { useRouter } from "expo-router";
import CherryInfoPage from "@/components/cherry/CherryInfoPage";

export default function Page() {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark" edges={["top", "left", "right"]}>
      <Header title={"Cherry Info"} leftActions={[{ icon: Icon["left-arrow"], onPress: () => router.back() }]} />
      <CherryInfoPage />
    </SafeAreaView>
  );
}
