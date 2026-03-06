import { View, Text, ScrollView, TouchableOpacity, Linking, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { theme } from "../../../lib/theme";
import { Stethoscope, Briefcase, Shield, Award } from "lucide-react-native";

const PROFILS = [
  { icon: Briefcase, title: "Avocat en droit de la famille", desc: "Accompagnez les pères dans leurs démarches juridiques." },
  { icon: Shield, title: "Médiateur familial", desc: "Aidez à résoudre les conflits et à trouver des accords." },
  { icon: Award, title: "Psychologue / Thérapeute", desc: "Proposez un soutien psychologique aux pères en difficulté." },
  { icon: Stethoscope, title: "Travailleur social", desc: "Orientez les pères vers les aides et dispositifs adaptés." },
];

export default function DevenirProfessionnelScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: "Devenir professionnel", headerStyle: { backgroundColor: "#2F5BFF" }, headerTintColor: "#fff", headerTitleStyle: { fontWeight: "700" } }} />
      <View style={styles.headerCard}>
        <View style={styles.iconCircle}>
          <Stethoscope size={32} color={theme.colors.primary} />
        </View>
        <Text style={styles.headerTitle}>Devenir professionnel partenaire</Text>
        <Text style={styles.headerDesc}>
          Vous êtes un professionnel du droit, de la santé ou du social ? Rejoignez notre réseau pour accompagner les pères dans leurs démarches.
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Profils recherchés</Text>

      {PROFILS.map((profil, i) => (
        <View key={i} style={styles.profilCard}>
          <View style={styles.profilIconBox}>
            <profil.icon size={20} color={theme.colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.profilTitle}>{profil.title}</Text>
            <Text style={styles.profilDesc}>{profil.desc}</Text>
          </View>
        </View>
      ))}

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Comment ça fonctionne ?</Text>
        <Text style={styles.infoText}>
          Après validation de votre profil, vous serez mis en relation avec les papas qui ont besoin de votre expertise. Vous fixez vos disponibilités et vos conditions d'intervention.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.cta}
        onPress={() => Linking.openURL("https://papapourlavie.fr/professionnel")}
      >
        <Text style={styles.ctaText}>Rejoindre le réseau professionnel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.surface },
  content: { padding: 16, paddingBottom: 40 },
  headerCard: {
    backgroundColor: theme.colors.white, borderRadius: theme.spacing.borderRadius,
    padding: 24, marginBottom: 24, borderWidth: 1, borderColor: theme.colors.gray[100],
    alignItems: "center",
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  iconCircle: {
    width: 64, height: 64, borderRadius: 32, backgroundColor: "#eff6ff",
    alignItems: "center", justifyContent: "center",
  },
  headerTitle: { fontSize: 20, fontWeight: "700", color: theme.colors.gray[900], marginTop: 12, textAlign: "center" },
  headerDesc: { fontSize: 14, color: theme.colors.gray[500], textAlign: "center", marginTop: 8, lineHeight: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: theme.colors.gray[900], marginBottom: 12 },
  profilCard: {
    flexDirection: "row", alignItems: "flex-start",
    backgroundColor: theme.colors.white, borderRadius: theme.spacing.borderRadius,
    padding: 16, marginBottom: 10, borderWidth: 1, borderColor: theme.colors.gray[100],
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
  },
  profilIconBox: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: "#eff6ff",
    alignItems: "center", justifyContent: "center", marginRight: 12,
  },
  profilTitle: { fontSize: 16, fontWeight: "600", color: theme.colors.gray[900] },
  profilDesc: { fontSize: 14, color: theme.colors.gray[500], marginTop: 2, lineHeight: 20 },
  infoCard: {
    backgroundColor: theme.colors.white, borderRadius: theme.spacing.borderRadius,
    padding: 20, marginTop: 12, marginBottom: 16, borderWidth: 1, borderColor: theme.colors.gray[100],
  },
  infoTitle: { fontSize: 16, fontWeight: "600", color: theme.colors.gray[900], marginBottom: 8 },
  infoText: { fontSize: 14, color: theme.colors.gray[500], lineHeight: 20 },
  cta: {
    backgroundColor: theme.colors.primary, borderRadius: theme.spacing.borderRadius,
    paddingVertical: 16, alignItems: "center",
    shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  ctaText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
