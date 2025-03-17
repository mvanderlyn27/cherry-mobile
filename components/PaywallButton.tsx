import { StyleSheet, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useSuperwall } from "@/hooks/useSuperwall";
import { SUPERWALL_TRIGGERS } from "@/config/superwall";

export function PaywallButton() {
  const { showPaywall } = useSuperwall();

  const handlePress = () => {
    showPaywall(SUPERWALL_TRIGGERS.ONBOARDING);
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handlePress}>
      <Text className="text-blue-100">Show Paywall</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#0a7ea4",
    alignItems: "center",
  },
});
