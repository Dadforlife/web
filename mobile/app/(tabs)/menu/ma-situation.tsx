import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter, Stack } from "expo-router";
import { useAuthStore } from "../../../lib/stores/auth";
import { useDashboard } from "../../../lib/hooks/useDashboard";
import { theme } from "../../../lib/theme";
import { FileText, Calendar, MessageCircle } from "lucide-react-native";

export default function MaSituationScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { data } = useDashboard();

  const diagnostic = data && "diagnostic" in data ? data.diagnostic : null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: "Ma situation", headerStyle: { backgroundColor: "#2F5BFF" }, headerTintColor: "#fff", headerTitleStyle: { fontWeight: "700" } }} />
      <View style={styles.userCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.fullName?.[0]?.toUpperCase() ?? "P"}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.userName}>{user?.fullName}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>
      </View>

      {diagnostic ? (
        <View style={styles.diagnosticCard}>
          <Text style={styles.cardLabel}>Votre diagnostic</Text>
          <Text style={styles.diagnosticClass}>{diagnostic.classification}</Text>
          <Text style={styles.diagnosticScore}>
            Score global : {diagnostic.scoreGlobal}/100
          </Text>
          <Text style={styles.diagnosticPlan}>{diagnostic.planTitle}</Text>
        </View>
      ) : (
        <View style={styles.emptyCard}>
          <FileText size={40} color={theme.colors.gray[400]} />
          <Text style={styles.emptyTitle}>Diagnostic non effectué</Text>
          <Text style={styles.emptySubtitle}>
            Complétez votre diagnostic pour recevoir un plan d'accompagnement personnalisé adapté à votre situation.
          </Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>Actions rapides</Text>

      <TouchableOpacity
        style={styles.actionCard}
        onPress={() => router.push("/(tabs)/rdv")}
      >
        <Calendar size={24} color={theme.colors.primary} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.actionTitle}>Prendre un rendez-vous</Text>
          <Text style={styles.actionDesc}>
            Échangez avec un bénévole ou un professionnel
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.actionCard}
        onPress={() => router.push("/(tabs)/messagerie")}
      >
        <MessageCircle size={24} color={theme.colors.primary} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.actionTitle}>Envoyer un message</Text>
          <Text style={styles.actionDesc}>
            Contactez directement un bénévole
          </Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.surface },
  content: { padding: 16, paddingBottom: 40 },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.white,
    borderRadius: theme.spacing.borderRadius,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.gray[100],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: { color: "#fff", fontSize: 20, fontWeight: "700" },
  userName: { fontSize: 18, fontWeight: "700", color: theme.colors.gray[900] },
  userEmail: { fontSize: 14, color: theme.colors.gray[500], marginTop: 2 },
  diagnosticCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.spacing.borderRadius,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: theme.colors.gray[100],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardLabel: { fontSize: 12, fontWeight: "600", color: theme.colors.gray[500], marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 },
  diagnosticClass: { fontSize: 20, fontWeight: "700", color: theme.colors.gray[900] },
  diagnosticScore: { fontSize: 14, color: theme.colors.gray[600], marginTop: 4 },
  diagnosticPlan: { fontSize: 14, color: theme.colors.gray[500], marginTop: 8 },
  emptyCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.spacing.borderRadius,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: theme.colors.gray[100],
    alignItems: "center",
  },
  emptyTitle: { fontSize: 18, fontWeight: "600", color: theme.colors.gray[900], marginTop: 12 },
  emptySubtitle: { fontSize: 14, color: theme.colors.gray[500], textAlign: "center", marginTop: 8, lineHeight: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: theme.colors.gray[900], marginBottom: 12 },
  actionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.white,
    borderRadius: theme.spacing.borderRadius,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.colors.gray[100],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  actionTitle: { fontSize: 16, fontWeight: "600", color: theme.colors.gray[900] },
  actionDesc: { fontSize: 14, color: theme.colors.gray[500], marginTop: 2 },
});
