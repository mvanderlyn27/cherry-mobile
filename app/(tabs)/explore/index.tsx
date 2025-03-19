import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { MotiView } from "moti";
import Header from "@/components/ui/Header";
import { TabFilter } from "@/components/ui/TabFilter";
import { Icon } from "@/types/app";
import { TopSection } from "@/components/explore/TopSection";
import { ForYouSection } from "@/components/explore/ForYouSection";
import { CategoriesSection } from "@/components/explore/CategoriesSection";

type ExploreTab = "top" | "forYou" | "categories";

export default function ExplorePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ExploreTab>("top");

  const tabOptions = [
    { id: "top", label: "Top" },
    { id: "forYou", label: "For You" },
    { id: "categories", label: "Categories" },
  ];

  const handleBookPress = (id: string) => {
    router.push(`/explore/view/${id}`);
  };

  const renderSection = () => {
    return (
      <MotiView
        from={{ opacity: 0, translateX: 20 }}
        animate={{ opacity: 1, translateX: 0 }}
        exit={{ opacity: 0, translateX: -20 }}
        transition={{ type: "timing", duration: 500 }}
        key={activeTab}
        className="flex-1" // Add this to ensure the section takes up available space
      >
        {(() => {
          switch (activeTab) {
            case "top":
              return <TopSection onBookPress={handleBookPress} />;
            case "forYou":
              return <ForYouSection onBookPress={handleBookPress} />;
            case "categories":
              return <CategoriesSection onBookPress={handleBookPress} />;
          }
        })()}
      </MotiView>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
      <StatusBar style="dark" />
      <Header title="Explore" rightActions={[{ icon: Icon.search, onPress: () => router.push("/explore/search") }]} />
      <TabFilter options={tabOptions} activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab as ExploreTab)} />
      {renderSection()}
    </SafeAreaView>
  );
}
