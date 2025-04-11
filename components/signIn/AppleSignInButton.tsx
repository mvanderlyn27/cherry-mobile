import React from "react";
import { StyleSheet, View, Platform } from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";
import { Alert } from "react-native";
import { supabase } from "@/services/supabase";
import { AuthService } from "@/services/authService";
import { router } from "expo-router";

export const AppleSignInButton = ({ onPress }: { onPress?: () => void }) => {
  // Check if Apple authentication is available on this device
  const [isAppleAuthAvailable, setIsAppleAuthAvailable] = React.useState(false);

  React.useEffect(() => {
    const checkAvailability = async () => {
      const isAvailable = await AppleAuthentication.isAvailableAsync();
      setIsAppleAuthAvailable(isAvailable);
    };

    checkAvailability();
  }, []);

  const handleAppleSignIn = async () => {
    try {
      console.log("clicked apple auth");
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      console.log("Apple authentication successful", credential);

      // Add this code to handle the successful authentication
      if (credential.identityToken) {
        await AuthService.signInWithApple(credential.identityToken);
        // Redirect to the desired page after successful sign-in
        if (onPress) {
          onPress();
        } else {
          router.back();
        }
      } else {
        throw new Error("No identityToken.");
      }
    } catch (e: any) {
      if (e.code === "ERR_CANCELED") {
        // User canceled the sign-in flow
        console.log("User canceled Apple sign in");
      } else {
        // Handle other errors
        console.error("Apple authentication error:", e);
      }
    }
  };

  // Only show the button if Apple authentication is available
  if (!isAppleAuthAvailable) {
    return null;
  }

  return (
    <View style={styles.container}>
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={8}
        style={styles.button}
        onPress={handleAppleSignIn}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  button: {
    width: "100%",
    height: 50,
  },
});
