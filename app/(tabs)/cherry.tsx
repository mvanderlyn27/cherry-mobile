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
import { SubscriptionService } from "@/services/subscriptionService";

export default function Page({ modalMode }: { modalMode?: boolean }) {
  const router = useRouter();
  const handleSubscribe = async () => {
    await SubscriptionService.presentPaywall();
  };

  return (
    <SafeAreaView
      className="flex-1 bg-background-light dark:bg-background-dark"
      edges={modalMode ? ["top", "left", "right", "bottom"] : ["top", "left", "right"]}>
      <Header
        title={"Cherries"}
        rightActions={
          modalMode
            ? [
                { icon: Icon.question, onPress: () => router.navigate("/modals/cherryInfo") },
                { icon: Icon.close, onPress: () => router.back() },
              ]
            : [{ icon: Icon.question, onPress: () => router.navigate("/modals/cherryInfo") }]
        }
      />
      <ScrollView className="flex-1 px-4">
        <SubscriptionCard handleSubscribe={handleSubscribe} />
        <PurchaseCard />
        {/* <StreakCard /> */}
        {/* <WatchAdsCard /> */}
      </ScrollView>
    </SafeAreaView>
  );
}
