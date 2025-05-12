import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { IconSymbol } from "../ui/IconSymbol";
import { Icon } from "@/types/app";
import ActionButton from "../ui/ActionButton";
import { LinearGradient } from "expo-linear-gradient";
import { useColorScheme } from "nativewind";
import { TransactionService } from "@/services/transactionService";
import { appStore$, purchaseStore$ } from "@/stores/appStores";
import { use$ } from "@legendapp/state/react";
import { PurchasesPackage } from "react-native-purchases";
import { MotiView } from "moti";
import { LoggingService } from "@/services/loggingService";
import { router } from "expo-router";
const colors = require("@/config/colors");

// Skeleton loader for purchase options
const PurchaseOptionSkeleton = () => {
  const { colorScheme } = useColorScheme();

  return (
    <View className="flex-1 items-center p-4">
      <MotiView
        from={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ type: "timing", duration: 1000, loop: true }}
        style={{
          width: "100%",
          aspectRatio: 1,
          borderRadius: 24,
          backgroundColor: colorScheme === "dark" ? "#333" : "#e0e0e0",
          marginBottom: 8,
        }}
      />
      <MotiView
        from={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ type: "timing", duration: 1000, loop: true }}
        style={{
          width: "60%",
          height: 16,
          borderRadius: 4,
          backgroundColor: colorScheme === "dark" ? "#333" : "#e0e0e0",
          marginBottom: 8,
        }}
      />
      <MotiView
        from={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ type: "timing", duration: 1000, loop: true }}
        style={{
          width: 80,
          height: 36,
          borderRadius: 18,
          backgroundColor: colorScheme === "dark" ? "#333" : "#e0e0e0",
        }}
      />
    </View>
  );
};

type PurchaseOptionProps = {
  cherryPackage: PurchasesPackage;
  cherryCount: number;
  cherryPrice: string;
  onBuy: () => void;
};

const PurchaseOption = ({ cherryPackage, cherryCount, cherryPrice, onBuy }: PurchaseOptionProps) => {
  const { colorScheme } = useColorScheme();
  return (
    <View className="flex-1 items-center border-white  p-4 ">
      <LinearGradient
        colors={[colors.nsfw[colorScheme || "light"], colors.cherry[colorScheme || "light"]]}
        style={{
          width: "100%",
          aspectRatio: 1,
          borderRadius: 24,
          padding: 12,
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 8,
        }}
        className="mb-2">
        <IconSymbol name={Icon.cherry} size={40} color="white" />
        <Text className="text-xl font-bold text-center w-full text-white">{cherryCount}</Text>
      </LinearGradient>
      <Text className="text-sm text-buttons_text-light dark:text-buttons_text-dark mb-2">$ {cherryPrice}</Text>
      {/* <ActionButton mode="buy" onPress={onBuy} label="Buy" /> */}
      <View
        style={{
          shadowColor: "#DA6CFF",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.8,
          shadowRadius: 8,
          elevation: 0,
        }}>
        <TouchableOpacity className="rounded-full overflow-hidden border-[1.5px] border-white" onPress={onBuy}>
          <LinearGradient colors={["#DA6CFF", "#7E98FF"]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
            <Text className="py-2 px-6 font-heebo-medium text-white text-sm md:text-md">Buy</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const PurchaseCard = () => {
  const loggedIn = use$(appStore$.loggedIn);
  const { colorScheme } = useColorScheme();
  const cherryPackages = use$(purchaseStore$.cherryPackages);
  const handlePurchase = async (cherryPackage: PurchasesPackage) => {
    console.log("Purchasing ", cherryPackage, " credits");
    const cherryCount: number = getCherryCount(cherryPackage.identifier);
    if (!cherryCount) {
      LoggingService.handleError(
        new Error("Invalid cherry package"),
        { component: "PurchaseCard.handlePurchase" },
        false
      );
      return;
    }
    const { success, error } = await TransactionService.buyCherries(cherryCount, cherryPackage);
    console.log("logged in ", loggedIn);
    if (!loggedIn && success) {
      router.navigate("/modals/signIn");
    }
  };
  const getCherryCount = (identifier: string): number => {
    const count = Number(identifier.split("_")[0]);
    return count ? count : 0;
  };

  const getCherryPrice = (identifier: string) => {
    const count = identifier.split("_")[2];
    return count ? count : "0";
  };

  // Determine if we should show the skeleton loader
  const isLoading = !cherryPackages || cherryPackages.length === 0;

  return (
    <View className="border-2 border-white rounded-2xl mb-4 overflow-hidden">
      <LinearGradient colors={["#FFFFFF", colors.background[colorScheme || "light"]]} style={{ flex: 1, padding: 16 }}>
        <View className="flex flex-row items-center justify-start gap-2 mb-2">
          <IconSymbol name={Icon.heart} size={26} color={"#000"} />
          <Text className="text-2xl font-kaisei-bold text-text-light dark:text-text-dark ">Purchase Cherries</Text>
        </View>
        <View className="flex-row justify-between gap-4">
          {isLoading ? (
            // Show skeleton loaders when packages are loading
            <>
              <PurchaseOptionSkeleton />
              <PurchaseOptionSkeleton />
              <PurchaseOptionSkeleton />
            </>
          ) : (
            // Show actual packages when loaded
            cherryPackages.map((cherryPackage, index) => (
              <PurchaseOption
                key={index}
                cherryPackage={cherryPackage}
                cherryCount={getCherryCount(cherryPackage.identifier)}
                cherryPrice={getCherryPrice(cherryPackage.identifier)}
                onBuy={() => handlePurchase(cherryPackage)}
              />
            ))
          )}
        </View>
      </LinearGradient>
    </View>
  );
};
