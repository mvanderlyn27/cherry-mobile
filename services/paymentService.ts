import { observable } from "@legendapp/state";
import Purchases, { MakePurchaseResult, PurchasesPackage } from "react-native-purchases";
import { Platform } from "react-native";
import { appStore$, purchaseStore$ } from "@/stores/appStores";
import { LoggingService } from "./loggingService";
import { Component } from "react";
import { AuthService } from "./authService";

// Credit package options
export type CreditPackage = {
  id: string;
  name: string;
  credits: number;
  price: number;
  discount?: number; // percentage discount
  featured?: boolean;
};

// Available credit packages
export const creditPackages: CreditPackage[] = [
  {
    id: "basic",
    name: "Basic",
    credits: 50,
    price: 2.49,
  },
  {
    id: "popular",
    name: "Popular",
    credits: 100,
    price: 5.99,
    discount: 15,
    featured: true,
  },
  {
    id: "premium",
    name: "Premium",
    credits: 250,
    price: 7.99,
    discount: 25,
  },
  {
    id: "ultimate",
    name: "Ultimate",
    credits: 700,
    price: 39.99,
    discount: 30,
  },
];

export class PaymentService {
  // interact with revenu cat  for IAP, and restoring purchases
  static initializeRevenueCat = (userId: string) => {
    // Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
    if (Platform.OS === "ios") {
      Purchases.configure({ apiKey: process.env.EXPO_PUBLIC_REVENUE_CAT_IOS_API_KEY!, appUserID: userId });
    } else if (Platform.OS === "android") {
      Purchases.configure({ apiKey: process.env.EXPO_PUBLIC_REVENUE_CAT_ANDROID_API_KEY!, appUserID: userId });
    }
    appStore$.revenueCatReady.set(true);
  };

  static loadCreditPackages = async () => {
    try {
      const offerings = await Purchases.getOfferings();
      if (offerings.current !== null && offerings.current.availablePackages.length !== 0) {
        // Display packages for sale
        const packages: PurchasesPackage[] = offerings.all["cherries"].availablePackages;
        purchaseStore$.cherryPackages.set(packages);
        appStore$.cherryPackagesReady.set(true);
      } else {
        LoggingService.handleError(
          new Error("no cherry packages loaded"),
          { components: "PaymentService.getCreditPackages" },
          false
        );
        purchaseStore$.cherryPackages.set([]);
      }
    } catch (e) {
      LoggingService.handleError(e, { components: "PaymentService.getCreditPackages" }, false);
      purchaseStore$.cherryPackages.set([]);
    }
  };

  static purchaseCreditPackage = async (
    cherryPackage: PurchasesPackage
  ): Promise<{ data: MakePurchaseResult | null; error: string | null }> => {
    try {
      const purchase = await Purchases.purchasePackage(cherryPackage);
      return { data: purchase, error: null };
    } catch (e) {
      console.log("purchase error", e);
      return { data: null, error: JSON.stringify(e) };
    }
  };
}
