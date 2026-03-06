import { View, Text, ScrollView, TouchableOpacity, Linking, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { theme } from "../../../lib/theme";
import { UserPlus, Heart, Clock, Users, CheckCircle } from "lucide-react-native";

const AVANTAGES = [
  { icon: Heart, text: "Aider concrètement des pères en difficulté" },
  { icon: Users, text: "Rejoindre une communauté engagée et bienveillante" },
  { icon: Clock, text: "S'engager à votre rythme, selon vos disponibilités" },
  { icon: CheckCircle, text: "Recevoir une formation complète et un accompagnement" },
];

export default function DevenirBenevoleScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: "Devenir bénévole", headerStyle: { backgroundColor: "#2F5BFF" }, headerTintColor: "#fff", headerTitleStyle: { fontWeight: "700" } }} />
      <View style={styles.headerCard}>
        <View style={styles.iconCircle}>
          <UserPlus size={32} color={theme.colors.primary} />
        </View>
        <Text style={styles.headerTitle}>Devenir bénévole</Text>
        <Text style={styles.headerDesc}>
          Vous êtes un papa qui a traversé des difficultés similaires ? Votre expérience peut aider d'autres pères. Rejoignez notre équipe de bénévoles.
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Pourquoi devenir bénévole ?</Text>

      {AVANTAGES.map((item, i) => (
        <View key={i} style={styles.avantageCard}>
          <item.icon size={20} color={theme.colors.primary} />
          <Text style={styles.avantageText}>{item.text}</Text>
        </View>
      ))}

      <View style={styles.processCard}>
        <Text style={styles.processTitle}>Comment ça marche ?</Text>
        {[
          "Remplissez le formulaire de candidature",
          "Un entretien avec l'équipe de coordination",
          "Formation initiale sur l'accompagnement",
          "Vous êtes prêt à accompagner des papas !",
        ].map((step, i) => (
          <View key={i} style={styles.stepRow}>
            <View style={styles.stepDot}>
              <Text style={styles.stepDotText}>{i + 1}</Text>
            </View>
            <Text style={styles.stepText}>{step}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={styles.cta}
        onPress={() => Linking.openURL("https://papapourlavie.fr/benevole")}
      >
        <Text style={styles.ctaText}>Postuler comme bénévole</Text>
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
  headerTitle: { fontSize: 20, fontWeight: "700", color: theme.colors.gray[900], marginTop: 12 },
  headerDesc: { fontSize: 14, color: theme.colors.gray[500], textAlign: "center", marginTop: 8, lineHeight: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: theme.colors.gray[900], marginBottom: 12 },
  avantageCard: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: theme.colors.white, borderRadius: theme.spacing.borderRadius,
    padding: 16, marginBottom: 8, borderWidth: 1, borderColor: theme.colors.gray[100],
  },
  avantageText: { flex: 1, fontSize: 14, color: theme.colors.gray[700], marginLeft: 12, lineHeight: 20 },
  processCard: {
    backgroundColor: theme.colors.white, borderRadius: theme.spacing.borderRadius,
    padding: 20, marginTop: 16, marginBottom: 16, borderWidth: 1, borderColor: theme.colors.gray[100],
  },
  processTitle: { fontSize: 16, fontWeight: "600", color: theme.colors.gray[900], marginBottom: 12 },
  stepRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  stepDot: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: theme.colors.primary,
    alignItems: "center", justifyContent: "center", marginRight: 12,
  },
  stepDotText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  stepText: { flex: 1, fontSize: 14, color: theme.colors.gray[700], lineHeight: 20 },
  cta: {
    backgroundColor: theme.colors.primary, borderRadius: theme.spacing.borderRadius,
    paddingVertical: 16, alignItems: "center",
    shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  ctaText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
