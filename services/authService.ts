import { authStore$ } from "@/stores/authStore";
import { supabase, getAnonymousUser } from "./supabase";
import { Platform } from "react-native";
import { LoggingService } from "./loggingService";

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

      if (user) {
        // User already has a session
        const authState = user.app_metadata?.provider === "anonymous" ? "anonymous" : "authenticated";

        console.log(`[AuthService] User already signed in as ${authState}`);
        authStore$.assign({ userId: user.id, isLoading: false, authState });
        return;
      }

      // No session, create anonymous user
      await this.createAnonymousUser();
    } catch (error) {
      LoggingService.handleError(error, { service: "AuthService", method: "initialize" });
      authStore$.assign({ isLoading: false, authState: "unauthenticated" });
    }
  }

  /**
   * Create an anonymous user
   */
  static async createAnonymousUser(): Promise<void> {
    try {
      const { data, error } = await supabase.auth.signInAnonymously();

      if (error) throw error;
      if (!data.user) throw new Error("No user returned");

      console.log("[AuthService] Anonymous user created");
      authStore$.assign({ userId: data.user.id, isLoading: false, authState: "anonymous" });
    } catch (error) {
      LoggingService.handleError(error, { service: "AuthService", method: "createAnonymousUser" });
      authStore$.assign({ isLoading: false, authState: "unauthenticated" });
    }
  }

  /**
   * Sign out the current user and create a new anonymous user
   */
  static async signOut(): Promise<void> {
    try {
      await supabase.auth.signOut();
      authStore$.assign({ isLoading: false, authState: "unauthenticated" });

      // Create a new anonymous user
      await this.createAnonymousUser();
    } catch (error) {
      LoggingService.handleError(error, { service: "AuthService", method: "signOut" });
    }
  }

  /**
   * Link anonymous account to authenticated account
   */
  static async linkAccounts(anonymousId: string, authenticatedId: string): Promise<void> {
    try {
      console.log(`[AuthService] Linking accounts: ${anonymousId} -> ${authenticatedId}`);

      // Transfer user data between accounts
      // This could be a series of database operations to move data
      const tables = [
        "saved_books",
        "book_progress",
        "chapter_progress",
        "liked_chapters",
        "user_unlocks",
        "transactions",
        "comments",
      ];

      for (const table of tables) {
        const { error } = await supabase.from(table).update({ user_id: authenticatedId }).eq("user_id", anonymousId);

        if (error) {
          LoggingService.handleError(
            error,
            {
              service: "AuthService",
              method: "linkAccounts",
              table,
              anonymousId,
              authenticatedId,
            },
            false
          ); // Don't show toast for individual table errors
        }
      }

      // Transfer credits if applicable
      const { data: anonymousUser, error: fetchError } = await supabase
        .from("users")
        .select("credits")
        .eq("id", anonymousId)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      if (anonymousUser?.credits) {
        // Get current authenticated user credits
        const { data: authUser, error: authUserError } = await supabase
          .from("users")
          .select("credits")
          .eq("id", authenticatedId)
          .single();

        if (authUserError) {
          throw authUserError;
        }

        const newCredits = (authUser?.credits || 0) + anonymousUser.credits;

        // Update authenticated user credits
        const { error: updateError } = await supabase
          .from("users")
          .update({ credits: newCredits })
          .eq("id", authenticatedId);

        if (updateError) {
          throw updateError;
        }
      }

      console.log("[AuthService] Account linking completed");
    } catch (error) {
      LoggingService.handleError(error, {
        service: "AuthService",
        method: "linkAccounts",
        anonymousId,
        authenticatedId,
      });
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
}
