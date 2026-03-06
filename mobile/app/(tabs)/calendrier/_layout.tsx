import { Stack } from "expo-router";

export default function CalendrierLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#2F5BFF" },
        headerTintColor: "#ffffff",
        headerTitleStyle: { fontWeight: "700" },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Calendrier" }} />
      <Stack.Screen name="demande-rdv" options={{ title: "Demander un RDV" }} />
      <Stack.Screen
        name="demandes/index"
        options={{ title: "Demandes reçues" }}
      />
      <Stack.Screen
        name="demandes/[id]"
        options={{ title: "Détail demande" }}
      />
    </Stack>
  );
}
