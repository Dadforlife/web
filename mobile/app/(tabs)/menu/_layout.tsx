import { Stack } from "expo-router";

export default function MenuLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#2F5BFF" },
        headerTintColor: "#ffffff",
        headerTitleStyle: { fontWeight: "700" },
      }}
    />
  );
}
