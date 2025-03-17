import React, { useState } from "react";
import { Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { IconSymbol } from "./ui/IconSymbol";
import { supabase } from "@/services/supabase";
import * as Haptics from "expo-haptics";
import { Icon } from "@/types/app";

interface AuthGateProps {
  onAuthSuccess: (userId: string) => void;
  onCancel: () => void;
  title?: string;
  message?: string;
}

export function AuthGate({
  onAuthSuccess,
  onCancel,
  title = "Sign In",
  message = "Sign in to access your library and purchases",
}: AuthGateProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: "com.cherryreader://auth/callback",
        },
      });

      if (error) throw error;

      // Auth success is handled by deep link handler in app
    } catch (err) {
      console.error("[Auth] Google sign in error:", err);
      setError("Failed to sign in with Google. Please try again.");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "apple",
        options: {
          redirectTo: "com.cherryreader://auth/callback",
        },
      });

      if (error) throw error;

      // Auth success is handled by deep link handler in app
    } catch (err) {
      console.error("[Auth] Apple sign in error:", err);
      setError("Failed to sign in with Apple. Please try again.");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueAsGuest = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase.auth.getSession();

      if (!data.session) {
        // Create anonymous user
        const { data: userData, error: signUpError } = await supabase.auth.signUp({
          email: `anonymous_${Date.now()}@example.com`,
          password: `anon_${Math.random().toString(36).substring(2, 15)}`,
        });

        if (signUpError) throw signUpError;

        if (userData.user) {
          onAuthSuccess(userData.user.id);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      } else if (data.session) {
        // Already have anonymous session
        onAuthSuccess(data.session.user.id);
      }
    } catch (err) {
      console.error("[Auth] Guest sign in error:", err);
      setError("Failed to continue as guest. Please try again.");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View>
      <Text>{title}</Text>
      <Text>{message}</Text>

      {error && (
        <View>
          <Text>{error}</Text>
        </View>
      )}

      <View>
        <TouchableOpacity onPress={handleGoogleSignIn} disabled={isLoading}>
          <IconSymbol name={Icon.google} size={24} color="#4285F4" />
          <Text>Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleAppleSignIn} disabled={isLoading}>
          <IconSymbol name={Icon.apple} size={24} color="#000" />
          <Text>Continue with Apple</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleContinueAsGuest} disabled={isLoading}>
          <IconSymbol name={Icon.person} size={24} color="#666" />
          <Text>Continue as Guest</Text>
        </TouchableOpacity>
      </View>

      {isLoading && (
        <View>
          <ActivityIndicator size="large" color="#0a7ea4" />
        </View>
      )}

      <TouchableOpacity onPress={onCancel} disabled={isLoading}>
        <Text>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}
