import { Slot } from "expo-router";
import { View } from "react-native";

/**
 * Layout simple sans Stack pour éviter l'erreur "Unimplemented component: RNSSafeAreaView"
 * (react-native-screens) sur certains environnements (Expo Go, simulateur).
 */
export default function AuthLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: "#f1f5f9" }}>
      <Slot />
    </View>
  );
}
