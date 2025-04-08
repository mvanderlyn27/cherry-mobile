//handle subscription with revenue cat, and checking if the user is a subscriber
import RevenueCatUI, { PAYWALL_RESULT } from "react-native-purchases-ui";
import Purchases from "react-native-purchases";
import { LoggingService } from "./loggingService";
import { authStore$ } from "@/stores/authStore";
import { users$ } from "@/stores/supabaseStores";
import { appStore$ } from "@/stores/appStores";

export class SubscriptionService {
  //handles checking setting, subscriptions with revenue cat
  static async getSubscriptionOfferings() {
    const offerings = await Purchases.getOfferings();
    if (offerings.current !== null && offerings.current.availablePackages.length !== 0) {
      // Display packages for sale
      return offerings;
    } else {
      return null;
    }
  }
  static async presentPaywall(): Promise<boolean> {
    // Present paywall for current offering:
    const offerings = await this.getSubscriptionOfferings();
    if (offerings === null || offerings.current === null) {
      LoggingService.handleError(new Error("No subscriptions found"), {}, true);
      return false;
    }

    const paywallResult: PAYWALL_RESULT = await RevenueCatUI.presentPaywall({
      offering: offerings.current, // Optional Offering object obtained through getOfferings
    });

    switch (paywallResult) {
      case PAYWALL_RESULT.NOT_PRESENTED:
      case PAYWALL_RESULT.ERROR:
      case PAYWALL_RESULT.CANCELLED:
        return false;
      case PAYWALL_RESULT.PURCHASED:
      case PAYWALL_RESULT.RESTORED:
        return true;
      default:
        return false;
    }
  }
  static async checkSubscriptionStatus(userId: string): Promise<boolean> {
    //gets if the user is premium, and updates supabse status
    appStore$.subscriptionStatusReady.set(false);
    const purchaserInfo = await Purchases.getCustomerInfo();
    const hasPremium: boolean = purchaserInfo.entitlements.active["Pro"] !== undefined;
    console.log("userId", userId, "hasPremium", hasPremium);
    users$[userId].premium_user.set(hasPremium);
    appStore$.subscriptionStatusReady.set(true);
    return hasPremium;
  }
  static listenToSubscriptionStatus(userId: string) {
    //listens to subscription status changes
    Purchases.addCustomerInfoUpdateListener((info) => {
      // handle any changes to purchaserInfo
      appStore$.subscriptionStatusReady.set(false);
      console.log("subscription info", info);
      const hasPremium = info.entitlements.active["Pro"] !== undefined;
      console.log("Listener: userId", userId, "hasPremium", hasPremium);
      users$[userId].premium_user.set(hasPremium);
      appStore$.subscriptionStatusReady.set(true);
    });
  }
}
