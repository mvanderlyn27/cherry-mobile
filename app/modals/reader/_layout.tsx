import ErrorBoundary from "@/components/ErrorBoundary";
import { Stack } from "expo-router";

export default function ReaderLayout() {
  return (
    <ErrorBoundary>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="[id]" />
      </Stack>
    </ErrorBoundary>
  );
}
