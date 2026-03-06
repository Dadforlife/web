import { View, Text, ScrollView, TouchableOpacity, Linking, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { theme } from "../../../lib/theme";
import { BookUser, Phone, Globe, MapPin } from "lucide-react-native";

const CONTACTS = [
  { nom: "Papa pour la Vie", type: "Association", tel: null, web: "https://papapourlavie.fr", ville: "France entière" },
  { nom: "Allô Parents en crise", type: "Écoute parentale", tel: "0 805 382 300", web: null, ville: "National" },
  { nom: "SOS Papa", type: "Association", tel: "01 43 41 45 67", web: "https://sospapa.net", ville: "Paris" },
  { nom: "Maison de la Justice et du Droit", type: "Aide juridique gratuite", tel: null, web: null, ville: "Selon votre commune" },
  { nom: "Défenseur des droits", type: "Institution publique", tel: "09 69 39 00 00", web: "https://defenseurdesdroits.fr", ville: "National" },
  { nom: "Caisse d'Allocations Familiales", type: "Aide sociale", tel: "3230", web: "https://caf.fr", ville: "Selon votre département" },
];

export default function AnnuaireScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: "Annuaire", headerStyle: { backgroundColor: "#2F5BFF" }, headerTintColor: "#fff", headerTitleStyle: { fontWeight: "700" } }} />
      <View style={styles.headerCard}>
        <BookUser size={40} color={theme.colors.primary} />
        <Text style={styles.headerTitle}>Annuaire</Text>
        <Text style={styles.headerDesc}>
          Retrouvez les contacts utiles pour vous accompagner dans vos démarches.
        </Text>
      </View>

      {CONTACTS.map((contact, i) => (
        <View key={i} style={styles.card}>
          <Text style={styles.cardName}>{contact.nom}</Text>
          <Text style={styles.cardType}>{contact.type}</Text>
          <View style={styles.cardDetails}>
            <View style={styles.detailRow}>
              <MapPin size={14} color={theme.colors.gray[400]} />
              <Text style={styles.detailText}>{contact.ville}</Text>
            </View>
            {contact.tel && (
              <TouchableOpacity
                style={styles.detailRow}
                onPress={() => Linking.openURL(`tel:${contact.tel.replace(/\s/g, "")}`)}
              >
                <Phone size={14} color={theme.colors.primary} />
                <Text style={[styles.detailText, { color: theme.colors.primary }]}>{contact.tel}</Text>
              </TouchableOpacity>
            )}
            {contact.web && (
              <TouchableOpacity
                style={styles.detailRow}
                onPress={() => Linking.openURL(contact.web!)}
              >
                <Globe size={14} color={theme.colors.primary} />
                <Text style={[styles.detailText, { color: theme.colors.primary }]} numberOfLines={1}>
                  {contact.web.replace("https://", "")}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ))}
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
  card: {
    backgroundColor: theme.colors.white, borderRadius: theme.spacing.borderRadius,
    padding: 16, marginBottom: 10, borderWidth: 1, borderColor: theme.colors.gray[100],
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
  },
  cardName: { fontSize: 16, fontWeight: "600", color: theme.colors.gray[900] },
  cardType: { fontSize: 13, color: theme.colors.gray[500], marginTop: 2 },
  cardDetails: { marginTop: 12 },
  detailRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  detailText: { fontSize: 14, color: theme.colors.gray[600], marginLeft: 8 },
});
