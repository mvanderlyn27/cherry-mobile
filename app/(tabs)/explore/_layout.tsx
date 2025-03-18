import { Stack } from "expo-router";

export default function ExploreLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="search" options={{ presentation: "modal" }} />
      <Stack.Screen name="view/[id]" options={{ presentation: "modal" }} />
    </Stack>
  );
}
