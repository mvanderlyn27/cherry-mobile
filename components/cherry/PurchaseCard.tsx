import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { IconSymbol } from "../ui/IconSymbol";
import { Icon } from "@/types/app";
import ActionButton from "../ui/ActionButton";
import { LinearGradient } from "expo-linear-gradient";
import { useColorScheme } from "nativewind";
const colors = require("@/config/colors");

type PurchaseOptionProps = {
  cherries: number;
  price: string;
  onBuy: () => void;
};

const PurchaseOption = ({ cherries, price, onBuy }: PurchaseOptionProps) => {
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
        <Text className="text-xl font-bold text-center w-full text-white">{cherries}</Text>
      </LinearGradient>
      <Text className="text-sm text-buttons_text-light dark:text-buttons_text-dark mb-2">{price}</Text>
      {/* <ActionButton mode="buy" onPress={onBuy} label="Buy" /> */}
      <View
        style={{
          shadowColor: "#DA6CFF",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.8,
          shadowRadius: 8,
          elevation: 0,
        }}>
        <TouchableOpacity className="rounded-full overflow-hidden border-[1.5px] border-white">
          <LinearGradient colors={["#DA6CFF", "#7E98FF"]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
            <Text className="py-2 px-6 font-heebo-medium text-white">Buy</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const PurchaseCard = () => {
  const { colorScheme } = useColorScheme();

  return (
    <View className="border-2 border-white rounded-2xl mb-4 overflow-hidden">
      <LinearGradient colors={["#FFFFFF", colors.background[colorScheme || "light"]]} style={{ flex: 1, padding: 16 }}>
        <View className="flex flex-row items-center justify-start gap-2 mb-2">
          <IconSymbol name={Icon.heart} size={26} color={"#000"} />
          <Text className="text-2xl font-kaisei-bold text-text-light dark:text-text-dark ">Purchase Cherries</Text>
        </View>
        <View className="flex-row justify-between gap-4">
          <PurchaseOption cherries={50} price="$2.49" onBuy={() => console.log("Buy 100")} />
          <PurchaseOption cherries={100} price="$5.99" onBuy={() => console.log("Buy 500")} />
          <PurchaseOption cherries={250} price="$7.99" onBuy={() => console.log("Buy 1000")} />
        </View>
      </LinearGradient>
    </View>
  );
};
