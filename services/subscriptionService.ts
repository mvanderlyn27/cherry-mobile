//handle subscription with revenue cat, and checking if the user is a subscriber
import RevenueCatUI, { PAYWALL_RESULT } from "react-native-purchases-ui";
import Purchases from "react-native-purchases";
import { LoggingService } from "./loggingService";
import { authStore$ } from "@/stores/authStore";
import { users$ } from "@/stores/supabaseStores";
import { appStore$ } from "@/stores/appStores";
import { PaymentService } from "./paymentService";
import { ChapterService } from "./chapterService";
import { AuthService } from "./authService";
import { NotificationService } from "./notificationService";

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
  static async presentPaywall(): Promise<{ success: boolean; subscribed: boolean; error?: string }> {
    // Present paywall for current offering:
    const offerings = await this.getSubscriptionOfferings();
    if (offerings === null || offerings.current === null) {
      LoggingService.handleError(new Error("No subscriptions found"), {}, true);
      return { success: false, subscribed: false, error: "No subscriptions found" };
    }

    const paywallResult: PAYWALL_RESULT = await RevenueCatUI.presentPaywall({
      offering: offerings.current, // Optional Offering object obtained through getOfferings
      fontFamily: "KaiseiDecol_400Regular",
    });

    switch (paywallResult) {
      case PAYWALL_RESULT.NOT_PRESENTED:
        return { success: false, subscribed: false, error: "error presenting paywall" };
      case PAYWALL_RESULT.ERROR:
        return { success: false, subscribed: false, error: "paywall error" };
      case PAYWALL_RESULT.CANCELLED:
        return { success: true, subscribed: false };
      case PAYWALL_RESULT.PURCHASED:
        return { success: true, subscribed: true };
      case PAYWALL_RESULT.RESTORED:
        return { success: true, subscribed: true };
      default:
        return { success: false, subscribed: false, error: "unknown paywall result" };
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
      const hasPremium = info.entitlements.active["Pro"] !== undefined;
      users$[userId].premium_user.set(hasPremium);
      appStore$.subscriptionStatusReady.set(true);
    });
  }

  static async restoreSubscriptions() {
    appStore$.revenueCatReady.set(false);
    try {
      // Restore subscriptions via revenue cat
      await Purchases.restorePurchases();
      appStore$.revenueCatReady.set(true);
    } catch (e) {
      LoggingService.handleError(e, { service: "SubscriptionService", method: "restoreSubscriptions" }, false);
      NotificationService.showInfo("Restore Failed", "please try again or reach out to our support team");
      appStore$.revenueCatReady.set(true);
    }
  }
}
