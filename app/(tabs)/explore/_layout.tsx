import { Stack, Tabs } from "expo-router";
import React from "react";

export default function ExploreLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)/index" options={{ headerShown: false }} />
      <Stack.Screen name="search" options={{ presentation: "modal" }} />
      <Stack.Screen name="view/[id]" options={{ presentation: "modal" }} />
    </Stack>
  );
}
