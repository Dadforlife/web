import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../../lib/api";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { theme } from "../../../../lib/theme";

export default function DemandeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [responseNote, setResponseNote] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["appointment-request", id],
    queryFn: async () => {
      const res = await api.get(`/api/mobile/appointments/requests/${id}`);
      return res.data;
    },
  });

  const acceptRequest = useMutation({
    mutationFn: async () => {
      await api.post(`/api/mobile/appointments/requests/${id}/accept`, {
        note: responseNote.trim(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointment-requests"] });
      Alert.alert("Demande acceptée", "Le rendez-vous a été créé.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    },
    onError: (err: any) => {
      Alert.alert("Erreur", err?.response?.data?.error || "Erreur serveur.");
    },
  });

  const refuseRequest = useMutation({
    mutationFn: async () => {
      await api.post(`/api/mobile/appointments/requests/${id}/refuse`, {
        note: responseNote.trim(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointment-requests"] });
      Alert.alert("Demande refusée", "", [
        { text: "OK", onPress: () => router.back() },
      ]);
    },
    onError: (err: any) => {
      Alert.alert("Erreur", err?.response?.data?.error || "Erreur serveur.");
    },
  });

  if (isLoading || !data) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.card}>
        <Text style={styles.title}>
          Demande de {data.userName}
        </Text>

        <View style={styles.detailGroup}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Type</Text>
            <Text style={styles.detailValue}>
              {data.type === "accompagnement_terrain"
                ? "Accompagnement terrain"
                : "Téléphonique"}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Raison</Text>
            <Text style={styles.detailValue}>{data.reason}</Text>
          </View>
          {data.message && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Message</Text>
              <Text style={styles.detailValue}>{data.message}</Text>
            </View>
          )}
          {data.city && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Ville</Text>
              <Text style={styles.detailValue}>{data.city}</Text>
            </View>
          )}
          {data.preferredDate && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Date souh.</Text>
              <Text style={styles.detailValue}>
                {format(new Date(data.preferredDate), "d MMMM yyyy", {
                  locale: fr,
                })}
              </Text>
            </View>
          )}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Demandé le</Text>
            <Text style={styles.detailValue}>
              {format(new Date(data.createdAt), "d MMMM yyyy à HH:mm", {
                locale: fr,
              })}
            </Text>
          </View>
        </View>
      </View>

      {data.status === "en_attente" && (
        <>
          <View>
            <Text style={styles.label}>
              Note de réponse (optionnel)
            </Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Message pour le papa..."
              placeholderTextColor={theme.colors.gray[400]}
              value={responseNote}
              onChangeText={setResponseNote}
              multiline
              textAlignVertical="top"
            />
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.refuseButton}
              onPress={() => refuseRequest.mutate()}
              disabled={refuseRequest.isPending}
            >
              <Text style={styles.refuseText}>Refuser</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={() => acceptRequest.mutate()}
              disabled={acceptRequest.isPending}
            >
              <Text style={styles.acceptText}>Accepter</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.gray[50],
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.gray[50],
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.gray[200],
    borderRadius: theme.spacing.borderRadius,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.gray[900],
    marginBottom: 12,
  },
  detailGroup: {
    gap: 8,
  },
  detailRow: {
    flexDirection: "row",
  },
  detailLabel: {
    fontSize: 14,
    color: theme.colors.gray[500],
    width: 96,
  },
  detailValue: {
    fontSize: 14,
    color: theme.colors.gray[900],
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: theme.colors.gray[700],
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.gray[400],
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: theme.colors.white,
  },
  textArea: {
    minHeight: 80,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 12,
  },
  refuseButton: {
    flex: 1,
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  refuseText: {
    color: "#B91C1C",
    fontWeight: "600",
  },
  acceptButton: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  acceptText: {
    color: theme.colors.white,
    fontWeight: "600",
  },
});
