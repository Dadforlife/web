import { Stack } from "expo-router";

export default function MessagerieLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#2F5BFF" },
        headerTintColor: "#ffffff",
        headerTitleStyle: { fontWeight: "700" },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Messages" }} />
      <Stack.Screen name="[id]" options={{ title: "Conversation" }} />
      <Stack.Screen name="new" options={{ title: "Nouveau message" }} />
    </Stack>
  );
}
