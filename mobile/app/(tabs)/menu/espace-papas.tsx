import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter, Stack } from "expo-router";
import { theme } from "../../../lib/theme";
import { Users, MessageSquare, Shield } from "lucide-react-native";

export default function EspacePapasScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: "Espace Papas", headerStyle: { backgroundColor: "#2F5BFF" }, headerTintColor: "#fff", headerTitleStyle: { fontWeight: "700" } }} />
      <View style={styles.headerCard}>
        <Users size={40} color={theme.colors.primary} />
        <Text style={styles.headerTitle}>Espace Papas</Text>
        <Text style={styles.headerDesc}>
          Un espace d'échange bienveillant réservé aux pères. Partagez votre expérience, posez vos questions et trouvez du soutien auprès d'autres papas qui vivent des situations similaires.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.actionCard}
        onPress={() => router.push("/(tabs)/forum")}
      >
        <MessageSquare size={24} color={theme.colors.primary} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.actionTitle}>Forum des discussions</Text>
          <Text style={styles.actionDesc}>
            Parcourez les catégories et participez aux discussions
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.actionCard}
        onPress={() => router.push("/(tabs)/forum/new")}
      >
        <MessageSquare size={24} color={theme.colors.primary} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.actionTitle}>Poser une question</Text>
          <Text style={styles.actionDesc}>
            Créez une nouvelle discussion dans le forum
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.rulesCard}>
        <Shield size={20} color={theme.colors.primary} />
        <Text style={styles.rulesTitle}>Règles de l'espace</Text>
        <Text style={styles.rulesText}>
          • Respect mutuel entre les membres{"\n"}
          • Pas de contenu haineux ou discriminant{"\n"}
          • Les échanges restent confidentiels{"\n"}
          • Publication anonyme possible{"\n"}
          • Modération bienveillante par l'équipe
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.surface },
  content: { padding: 16, paddingBottom: 40 },
  headerCard: {
    backgroundColor: theme.colors.white, borderRadius: theme.spacing.borderRadius,
    padding: 24, marginBottom: 20, borderWidth: 1, borderColor: theme.colors.gray[100],
    alignItems: "center",
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  headerTitle: { fontSize: 20, fontWeight: "700", color: theme.colors.gray[900], marginTop: 12 },
  headerDesc: { fontSize: 14, color: theme.colors.gray[500], textAlign: "center", marginTop: 8, lineHeight: 20 },
  actionCard: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: theme.colors.white, borderRadius: theme.spacing.borderRadius,
    padding: 16, marginBottom: 10, borderWidth: 1, borderColor: theme.colors.gray[100],
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
  },
  actionTitle: { fontSize: 16, fontWeight: "600", color: theme.colors.gray[900] },
  actionDesc: { fontSize: 14, color: theme.colors.gray[500], marginTop: 2 },
  rulesCard: {
    backgroundColor: "#eff6ff", borderRadius: theme.spacing.borderRadius,
    padding: 20, marginTop: 12, borderWidth: 1, borderColor: "#bfdbfe",
  },
  rulesTitle: { fontSize: 16, fontWeight: "600", color: theme.colors.primary, marginTop: 8, marginBottom: 8 },
  rulesText: { fontSize: 14, color: "#1e40af", lineHeight: 22 },
});
