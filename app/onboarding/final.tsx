import { Text, View, ScrollView } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useSuperwall } from "@/hooks/useSuperwall";
import { SUPERWALL_TRIGGERS } from "@/config/superwall";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { MaterialCommunityIcons as IconType } from "@expo/vector-icons";
import { router } from "expo-router";

export default function FinalScreen() {
  const { showPaywall } = useSuperwall();

  const handleGetStarted = async () => {
    try {
      await showPaywall(SUPERWALL_TRIGGERS.ONBOARDING);
      router.push("/");
    } catch (error) {
      console.error("Failed to show paywall:", error);
    }
  };

  return (
    <View>
      <SafeAreaView>
        <ScrollView>
          <View>
            <MaterialCommunityIcons name="rocket-launch" size={48} color="#0A7EA4" />
            <Text>Start Building Today</Text>
            <Text>
              You're all set to create your next great app. Get started now and save weeks of development time!
            </Text>
          </View>

          <View>
            <Benefit icon="lightning-bolt" text="Launch faster" />
            <Benefit icon="palette" text="Professional design" />
            <Benefit icon="cash-multiple" text="Ready for monetization" />
          </View>
        </ScrollView>

        <TouchableOpacity onPress={handleGetStarted}>
          <Text>Get Started Now</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

function Benefit({ icon, text }: { icon: keyof typeof IconType.glyphMap; text: string }) {
  return (
    <View>
      <View>
        <MaterialCommunityIcons name={icon} size={24} color="#0A7EA4" />
      </View>
      <Text>{text}</Text>
    </View>
  );
}
