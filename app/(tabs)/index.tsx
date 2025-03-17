import { Text, Image, StyleSheet, Platform, View, ScrollView } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import { useSuperwall } from "@/hooks/useSuperwall";
import { useRouter } from "expo-router";
import { SUPERWALL_TRIGGERS } from "@/config/superwall";

export default function HomeScreen() {
  const { showPaywall } = useSuperwall();
  const router = useRouter();

  const handleRestartOnboarding = async () => {
    router.push("/onboarding");
  };

  const handleShowPaywall = () => {
    showPaywall(SUPERWALL_TRIGGERS.ONBOARDING);
  };

  return (
    <ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleShowPaywall}>
          <Text className="font-bold p-6 bg-slate-600 rounded-lg text-white">Show Paywall</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={handleRestartOnboarding}>
          <Text>Restart Onboarding</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  buttonContainer: {
    marginTop: 24,
    gap: 12,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#0A7EA4",
  },
  buttonText: {
    color: "white",
  },
  secondaryButton: {
    backgroundColor: "#0A7EA420",
  },
  secondaryButtonText: {
    color: "#0A7EA4",
  },
});
