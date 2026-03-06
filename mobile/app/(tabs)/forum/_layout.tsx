import { Stack } from "expo-router";

export default function ForumLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#2F5BFF" },
        headerTintColor: "#ffffff",
        headerTitleStyle: { fontWeight: "700" },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Espace Papas" }} />
      <Stack.Screen name="[categorySlug]" options={{ title: "Discussions" }} />
      <Stack.Screen
        name="discussion/[id]"
        options={{ title: "Discussion" }}
      />
      <Stack.Screen
        name="new"
        options={{ title: "Nouvelle discussion" }}
      />
    </Stack>
  );
}
