import { Text, View, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function SolutionScreen() {
  const router = useRouter();

  const handleNext = () => {
    router.push("/onboarding/final");
  };

  return (
    <View>
      <SafeAreaView>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View>
            <MaterialCommunityIcons name="lightbulb-on" size={48} color="#0A7EA4" />
            <Text>Introducing a Better Way</Text>
          </View>

          <View>
            <Text>Your App's Core Value</Text>
            <Text>One clear, powerful sentence that explains exactly how you solve the user's problem.</Text>
          </View>

          <View>
            <View>
              <MaterialCommunityIcons name="check-circle" size={24} color="#0A7EA4" />
              <Text>Key benefit or feature that solves their pain</Text>
            </View>
            <View>
              <MaterialCommunityIcons name="check-circle" size={24} color="#0A7EA4" />
              <Text>Another important advantage of your solution</Text>
            </View>
            <View>
              <MaterialCommunityIcons name="check-circle" size={24} color="#0A7EA4" />
              <Text>A third compelling reason to use your app</Text>
            </View>
          </View>
        </ScrollView>

        <View>
          <TouchableOpacity onPress={handleNext}>
            <Text>Show Me How</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}
