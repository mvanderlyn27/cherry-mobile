import { authStore$ } from "@/stores/authStore";
import { supabase } from "./supabase";
import { Platform } from "react-native";
import { LoggingService } from "./loggingService";
import { appStore$ } from "@/stores/appStores";
import { create } from "react-test-renderer";
import { users$ } from "@/stores/supabaseStores";

export class AuthService {
  // Track the current auth state

  /**
   * Initialize the auth service and ensure user is signed in
   * This should be called on app startup
   */
  static async initialize(): Promise<void> {
    try {
      // Check for existing session
      authStore$.assign({ isLoading: true });
      const {
        data: { user },
      } = await supabase.auth.getUser();
      console.log("user", user);

      if (user) {
        // User already has a session
        const authState = user.app_metadata?.provider === "anonymous" ? "anonymous" : "authenticated";

        console.log(`[AuthService] User already signed in as ${authState}`);
        authStore$.assign({ userId: user.id, isLoading: false, authState });
        if (user.is_anonymous) {
          appStore$.anonymous.set(true);
        } else {
          appStore$.loggedIn.set(true);
        }
        return;
      }

      // No session, create anonymous user
      await this.createAnonymousUser();
    } catch (error) {
      LoggingService.handleError(error, { service: "AuthService", method: "initialize" });
      authStore$.assign({ isLoading: false, authState: "unauthenticated" });
    }
  }
  static welcomeGift = () => {
    console.log("welcome gift");
    const userId = authStore$.userId.get();
    if (!userId) {
      LoggingService.handleError(new Error("No user found"), { service: "AuthService", method: "welcomeGift" }, false);
      return;
    }
    const cherries = users$[userId].credits.get();
    if (cherries === null) {
      LoggingService.handleError(new Error("No user found"), { service: "AuthService", method: "welcomeGift" }, false);
      return;
    }
    users$[userId].credits.set(cherries + 100);
  };

  /**
   * Create an anonymous user
   */
  static async createAnonymousUser(): Promise<void> {
    try {
      await supabase.auth.signOut();
      const { data, error } = await supabase.auth.signInAnonymously();

      if (error) throw error;
      if (!data.user) throw new Error("No user returned");

      console.log("[AuthService] Anonymous user created");
      //get old user id from secure store
      authStore$.assign({ userId: data.user.id, isLoading: false, authState: "anonymous" });
      appStore$.assign({ anonymous: true, loggedIn: false });
    } catch (error) {
      LoggingService.handleError(error, { service: "AuthService", method: "createAnonymousUser" }, true);
      authStore$.assign({ isLoading: false, authState: "unauthenticated" });
    }
  }
  /**
   * Sign out the current user and create a new anonymous user
   */
  static async signOut(): Promise<void> {
    try {
      authStore$.assign({ isLoading: true, authState: "unauthenticated" });
      await supabase.auth.signOut();
      //new anon account
      await this.createAnonymousUser();
    } catch (error) {
      LoggingService.handleError(error, { service: "AuthService", method: "signOut" });
    }
  }

  /**
   *
   */
  static async deleteAccount(
    userId: string,
    createAnonAfter: boolean = true
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.rpc("delete_user_data", { p_user_id: userId });
      if (error) throw error;
      console.log("[AuthService] Account deleted");
      authStore$.assign({ isLoading: false, authState: "unauthenticated" });
      if (createAnonAfter) {
        await this.createAnonymousUser();
      }
      return { success: true }; // Return success tru
    } catch (error) {
      LoggingService.handleError(error, { service: "AuthService", method: "deleteAccount" });
      return { success: false, error: JSON.stringify(error) };
    }
  }
  /**
   * Get the current user
   */
  static async getCurrentUser() {
    try {
      return await supabase.auth.getUser();
    } catch (error) {
      LoggingService.handleError(error, { service: "AuthService", method: "getCurrentUser" }, false);
      throw error; // Re-throw as this is likely used in other methods that need the result
    }
  }

  /**
   * Check if the current session is anonymous
   */
  static async isAnonymousSession(): Promise<boolean> {
    try {
      const { data } = await this.getCurrentUser();
      return data.user?.app_metadata?.provider === "anonymous";
    } catch (error) {
      LoggingService.handleError(error, { service: "AuthService", method: "isAnonymousSession" });
      return false; // Default to false if we can't determine
    }
  }
  //maybe add authstatechange listener to update auth store

  /**
   * Sign in with Google
   */
  static async signInWithGoogle(token: string): Promise<void> {
    authStore$.isLoading.set(false);
    appStore$.loggedIn.set(false);
    try {
      // Get current anonymous user ID before signing in
      const { data: currentUserData } = await this.getCurrentUser();
      const currentUserId = currentUserData.user?.id;

      // if (!currentUserId) {
      //   throw new Error("No current user found before Google sign-in");
      // }

      // Sign in with Google
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: "google",
        token,
      });

      if (error) throw error;

      // After successful sign-in, get the new user
      const newUserId = data.user?.id;

      if (!newUserId) {
        throw new Error("Failed to get new user ID after Google sign-in");
      }
      if (currentUserId) {
        console.log("migrating: ", currentUserId, " -> ", newUserId);
        // Migrate user data using Supabase RPC function
        const { data: migrationData, error: migrationError } = await supabase.rpc("migrate_user_data", {
          old_user_id: currentUserId,
          new_user_id: newUserId,
        });

        if (migrationError) {
          console.error("Error migrating user data:", migrationError);
          LoggingService.handleError(
            migrationError,
            {
              service: "AuthService",
              method: "signInWithGoogle",
              oldUserId: currentUserId,
              newUserId: newUserId,
            },
            false
          );
        }
        // const { success, error: deleteAnonError } = await this.deleteAccount(currentUserId, false);
        // if (deleteAnonError) {
        //   // Update auth store with new user ID
        //   LoggingService.handleError(
        //     deleteAnonError,
        //     {
        //       service: "AuthService",
        //       method: "signInWithGoogle",
        //       oldUserId: currentUserId,
        //       newUserId: newUserId,
        //     },
        //     false
        //   );
        // }
      }
      appStore$.loggedIn.set(true);
      console.log("[AuthService] Successfully signed in with Google and migrated data");
    } catch (e) {
      LoggingService.handleError(e, { service: "AuthService", method: "signInWithGoogle" }, true);
      // Try to restore anonymous session if social login fails
      appStore$.loggedIn.set(true);
    }
  }

  /**
   * Sign in with Apple
   */
  static async signInWithApple(token: string): Promise<void> {
    appStore$.loggedIn.set(false);
    authStore$.isLoading.set(true);
    try {
      // Get current anonymous user ID before signing in
      const { data: currentUserData } = await this.getCurrentUser();
      const currentUserId = currentUserData.user?.id;

      // if (!currentUserId) {
      //   throw new Error("No current user found before Apple sign-in");
      // }

      // Sign in with Apple
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: "apple",
        token,
      });

      if (error) throw error;

      const newUserId = data.user?.id;

      if (!newUserId) {
        throw new Error("Failed to get new user ID after Apple sign-in");
      }

      //only migrate/delete old account if it exists
      // Migrate user data using Supabase RPC function
      if (currentUserId) {
        console.log("migrating: ", currentUserId, " -> ", newUserId);
        const { data: migrationData, error: migrationError } = await supabase.rpc("migrate_user_data", {
          old_user_id: currentUserId,
          new_user_id: newUserId,
        });

        if (migrationError) {
          console.error("Error migrating user data:", migrationError);
          LoggingService.handleError(
            migrationError,
            {
              service: "AuthService",
              method: "signInWithApple",
              oldUserId: currentUserId,
              newUserId: newUserId,
            },
            false
          );
        }

        // after migration remove old anon account
        // const { success, error: deleteAnonError } = await this.deleteAccount(currentUserId, false);
        // if (deleteAnonError) {
        //   // Update auth store with new user ID
        //   LoggingService.handleError(
        //     deleteAnonError,
        //     {
        //       service: "AuthService",
        //       method: "signInWithGoogle",
        //       oldUserId: currentUserId,
        //       newUserId: newUserId,
        //     },
        //     false
        //   );
        // }
      }
      // Update auth store with new user ID
      authStore$.assign({
        userId: newUserId,
        isLoading: false,
        authState: "authenticated",
      });
      appStore$.anonymous.set(false);
      appStore$.loggedIn.set(true);
      console.log("[AuthService] Successfully signed in with Apple and migrated data");
    } catch (e) {
      LoggingService.handleError(e, { service: "AuthService", method: "signInWithApple" }, true);
      authStore$.isLoading.set(false);
      // Try to restore anonymous session if social login fails
    }
  }
}
