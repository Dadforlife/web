import { View, Text, ScrollView, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { theme } from "../../../lib/theme";
import { BookOpen, CheckCircle } from "lucide-react-native";

const ETAPES = [
  { title: "Diagnostic de situation", desc: "Évaluation de votre situation familiale et juridique pour définir le plan d'accompagnement adapté." },
  { title: "Plan d'accompagnement", desc: "Un programme personnalisé est élaboré avec un bénévole ou un professionnel pour vous guider." },
  { title: "Suivi régulier", desc: "Des rendez-vous réguliers pour suivre votre progression et adapter le plan si nécessaire." },
  { title: "Accompagnement terrain", desc: "Un bénévole peut vous accompagner lors de démarches administratives ou juridiques." },
  { title: "Soutien communautaire", desc: "Échangez avec d'autres papas dans l'Espace Papas pour partager vos expériences." },
];

export default function ProgrammeScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: "Programme", headerStyle: { backgroundColor: "#2F5BFF" }, headerTintColor: "#fff", headerTitleStyle: { fontWeight: "700" } }} />
      <View style={styles.headerCard}>
        <BookOpen size={40} color={theme.colors.primary} />
        <Text style={styles.headerTitle}>Programme d'accompagnement</Text>
        <Text style={styles.headerDesc}>
          Papa pour la Vie propose un accompagnement structuré pour vous aider à maintenir le lien avec vos enfants et à faire valoir vos droits.
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Les étapes du programme</Text>

      {ETAPES.map((etape, i) => (
        <View key={i} style={styles.etapeCard}>
          <View style={styles.etapeNumber}>
            <Text style={styles.etapeNumberText}>{i + 1}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.etapeTitle}>{etape.title}</Text>
            <Text style={styles.etapeDesc}>{etape.desc}</Text>
          </View>
        </View>
      ))}

      <View style={styles.infoCard}>
        <CheckCircle size={24} color="#16a34a" />
        <Text style={styles.infoText}>
          L'accompagnement est entièrement gratuit et confidentiel. Chaque papa avance à son rythme.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.surface },
  content: { padding: 16, paddingBottom: 40 },
  headerCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.spacing.borderRadius,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: theme.colors.gray[100],
    alignItems: "center",
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  headerTitle: { fontSize: 20, fontWeight: "700", color: theme.colors.gray[900], marginTop: 12, textAlign: "center" },
  headerDesc: { fontSize: 14, color: theme.colors.gray[500], textAlign: "center", marginTop: 8, lineHeight: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: theme.colors.gray[900], marginBottom: 12 },
  etapeCard: {
    flexDirection: "row",
    backgroundColor: theme.colors.white,
    borderRadius: theme.spacing.borderRadius,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.colors.gray[100],
    alignItems: "flex-start",
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
  },
  etapeNumber: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: theme.colors.primary,
    alignItems: "center", justifyContent: "center",
    marginRight: 12, marginTop: 2,
  },
  etapeNumberText: { color: "#fff", fontSize: 14, fontWeight: "700" },
  etapeTitle: { fontSize: 16, fontWeight: "600", color: theme.colors.gray[900] },
  etapeDesc: { fontSize: 14, color: theme.colors.gray[500], marginTop: 4, lineHeight: 20 },
  infoCard: {
    flexDirection: "row",
    backgroundColor: "#f0fdf4",
    borderRadius: theme.spacing.borderRadius,
    padding: 16, marginTop: 12,
    borderWidth: 1, borderColor: "#bbf7d0",
    alignItems: "flex-start",
  },
  infoText: { flex: 1, fontSize: 14, color: "#15803d", marginLeft: 12, lineHeight: 20 },
});
