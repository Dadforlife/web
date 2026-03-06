import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import api from "../../../../lib/api";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Clock } from "lucide-react-native";
import { theme } from "../../../../lib/theme";

interface AppointmentRequest {
  id: string;
  type: string;
  reason: string;
  status: string;
  userName: string;
  city: string | null;
  createdAt: string;
}

export default function DemandesRecuesScreen() {
  const router = useRouter();

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["appointment-requests"],
    queryFn: async () => {
      const res = await api.get("/api/mobile/appointments/requests");
      return res.data.requests as AppointmentRequest[];
    },
  });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data ?? []}
        keyExtractor={(item) => item.id}
        refreshing={isRefetching}
        onRefresh={refetch}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Clock size={48} color={theme.colors.gray[400]} />
            <Text style={styles.emptyText}>Aucune demande en attente</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push(`/(tabs)/calendrier/demandes/${item.id}`)
            }
          >
            <View style={styles.cardHeader}>
              <Text style={styles.userName}>{item.userName}</Text>
              <View
                style={[
                  styles.statusBadge,
                  item.status === "en_attente" && styles.statusPending,
                  item.status === "accepte" && styles.statusAccepted,
                  (item.status === "refuse" || (!["en_attente", "accepte"].includes(item.status))) &&
                    styles.statusOther,
                ]}
              >
                <Text style={styles.statusText}>
                  {item.status === "en_attente"
                    ? "En attente"
                    : item.status === "accepte"
                      ? "Accepté"
                      : item.status === "refuse"
                        ? "Refusé"
                        : item.status}
                </Text>
              </View>
            </View>
            <Text style={styles.reason}>{item.reason}</Text>
            <Text style={styles.meta}>
              {item.type === "accompagnement_terrain" ? "Terrain" : "Téléphone"}
              {item.city ? ` • ${item.city}` : ""} •{" "}
              {formatDistanceToNow(new Date(item.createdAt), {
                addSuffix: true,
                locale: fr,
              })}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
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
  listContent: {
    padding: 16,
    gap: 8,
  },
  emptyContainer: {
    paddingVertical: 80,
    alignItems: "center",
  },
  emptyText: {
    color: theme.colors.gray[400],
    marginTop: 16,
  },
  card: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.gray[200],
    borderRadius: 12,
    padding: 16,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.gray[900],
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
  },
  statusPending: {
    backgroundColor: "#FEF3C7",
  },
  statusAccepted: {
    backgroundColor: "#D1FAE5",
  },
  statusOther: {
    backgroundColor: theme.colors.gray[100],
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  reason: {
    fontSize: 14,
    color: theme.colors.gray[600],
  },
  meta: {
    fontSize: 12,
    color: theme.colors.gray[400],
    marginTop: 4,
  },
});
