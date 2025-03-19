import { Text, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function WelcomeScreen() {
  const router = useRouter();

  const handleNext = () => {
    router.push("/onboarding/solution");
  };

  return (
    <View>
      <SafeAreaView>
        <View>
          <View>
            <MaterialCommunityIcons name="star" size={64} color="#0A7EA4" />
            <Text>Your App Name</Text>
            <View>
              <Text>A short, compelling tagline that captures your app's value</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text>Get Started</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between",
    paddingVertical: 24,
  },
  main: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
  },
  title: {
    fontSize: 36,
    textAlign: "center",
    paddingHorizontal: 16,
  },
  subtitleContainer: {
    paddingHorizontal: 32,
  },
  subtitle: {
    fontSize: 18,
    opacity: 0.7,
    textAlign: "center",
    lineHeight: 24,
  },
  button: {
    backgroundColor: "#0A7EA4",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
});
