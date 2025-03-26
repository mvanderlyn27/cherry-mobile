import ErrorBoundary from "@/components/ErrorBoundary";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ReaderLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="[id]" />
    </Stack>
  );
}
