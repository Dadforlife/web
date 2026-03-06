import { View, Text, ScrollView, TouchableOpacity, Linking, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { theme } from "../../../lib/theme";
import { Heart, CreditCard, Building2, Gift } from "lucide-react-native";

export default function FaireUnDonScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: "Faire un don", headerStyle: { backgroundColor: "#2F5BFF" }, headerTintColor: "#fff", headerTitleStyle: { fontWeight: "700" } }} />
      <View style={styles.headerCard}>
        <View style={styles.heartCircle}>
          <Heart size={32} color="#dc2626" fill="#dc2626" />
        </View>
        <Text style={styles.headerTitle}>Faire un don</Text>
        <Text style={styles.headerDesc}>
          Votre générosité permet à Papa pour la Vie de continuer à accompagner les pères en difficulté. Chaque don compte.
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Pourquoi donner ?</Text>

      {[
        { icon: Building2, text: "Financer l'accompagnement des papas sur le terrain" },
        { icon: CreditCard, text: "Soutenir les démarches juridiques des pères" },
        { icon: Gift, text: "Permettre des formations pour les bénévoles" },
      ].map((item, i) => (
        <View key={i} style={styles.reasonCard}>
          <item.icon size={20} color={theme.colors.primary} />
          <Text style={styles.reasonText}>{item.text}</Text>
        </View>
      ))}

      <TouchableOpacity
        style={styles.donateBtn}
        onPress={() => Linking.openURL("https://papapourlavie.fr/don")}
      >
        <Heart size={20} color="#fff" />
        <Text style={styles.donateBtnText}>Faire un don maintenant</Text>
      </TouchableOpacity>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Avantage fiscal</Text>
        <Text style={styles.infoText}>
          66% de votre don est déductible de vos impôts. Un reçu fiscal vous sera envoyé automatiquement.
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
    padding: 24, marginBottom: 24, borderWidth: 1, borderColor: theme.colors.gray[100],
    alignItems: "center",
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  heartCircle: {
    width: 64, height: 64, borderRadius: 32, backgroundColor: "#fef2f2",
    alignItems: "center", justifyContent: "center",
  },
  headerTitle: { fontSize: 20, fontWeight: "700", color: theme.colors.gray[900], marginTop: 12 },
  headerDesc: { fontSize: 14, color: theme.colors.gray[500], textAlign: "center", marginTop: 8, lineHeight: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: theme.colors.gray[900], marginBottom: 12 },
  reasonCard: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: theme.colors.white, borderRadius: theme.spacing.borderRadius,
    padding: 16, marginBottom: 8, borderWidth: 1, borderColor: theme.colors.gray[100],
  },
  reasonText: { flex: 1, fontSize: 14, color: theme.colors.gray[700], marginLeft: 12, lineHeight: 20 },
  donateBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    backgroundColor: "#dc2626", borderRadius: theme.spacing.borderRadius,
    paddingVertical: 16, marginTop: 16, marginBottom: 16,
    shadowColor: "#dc2626", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  donateBtnText: { color: "#fff", fontSize: 16, fontWeight: "700", marginLeft: 8 },
  infoCard: {
    backgroundColor: "#eff6ff", borderRadius: theme.spacing.borderRadius,
    padding: 16, borderWidth: 1, borderColor: "#bfdbfe",
  },
  infoTitle: { fontSize: 16, fontWeight: "600", color: theme.colors.primary, marginBottom: 4 },
  infoText: { fontSize: 14, color: "#1e40af", lineHeight: 20 },
});
