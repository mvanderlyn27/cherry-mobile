import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppleSignInButton } from "./AppleSignInButton";
import GoogleSignInButton from "./GoogleSignInButton";

export const SignInPage: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Sign in to Cherry</Text>
        <Text style={styles.subtitle}>Sign in to save info across downloads/devices</Text>

        <View style={styles.buttonContainer}>
          <GoogleSignInButton />
          <View style={styles.buttonSpacer} />
          <AppleSignInButton />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
    marginBottom: 48,
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 320,
  },
  buttonSpacer: {
    height: 16,
  },
});
