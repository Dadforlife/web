import { Stack } from "expo-router";

export default function ParametresLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#2F5BFF" },
        headerTintColor: "#ffffff",
        headerTitleStyle: { fontWeight: "700" },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Paramètres" }} />
      <Stack.Screen
        name="notifications"
        options={{ title: "Notifications" }}
      />
      <Stack.Screen name="enfants" options={{ title: "Mes enfants" }} />
      <Stack.Screen name="profil" options={{ title: "Mon profil" }} />
    </Stack>
  );
}
