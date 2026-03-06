import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import api from "../../../lib/api";
import { Plus } from "lucide-react-native";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { theme } from "../../../lib/theme";

interface Discussion {
  id: string;
  title: string;
  authorName: string;
  isAnonymous: boolean;
  messageCount: number;
  createdAt: string;
  updatedAt: string;
}

export default function CategoryDiscussionsScreen() {
  const { categorySlug } = useLocalSearchParams<{ categorySlug: string }>();
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["forum-discussions", categorySlug],
    queryFn: async () => {
      const res = await api.get("/api/mobile/forum/discussions", {
        params: { categorySlug, limit: 30 },
      });
      return res.data as { discussions: Discussion[]; total: number };
    },
  });

  if (isLoading) {
    return (
      <View style={styles.loadingBox}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data?.discussions ?? []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>Aucune discussion</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/(tabs)/forum/discussion/${item.id}`)}
          >
            <Text style={styles.cardTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <View style={styles.meta}>
              <Text style={styles.metaText}>
                {item.isAnonymous ? "Anonyme" : item.authorName}
              </Text>
              <Text style={styles.metaDot}>•</Text>
              <Text style={styles.metaText}>
                {item.messageCount} réponse{item.messageCount !== 1 ? "s" : ""}
              </Text>
              <Text style={styles.metaDot}>•</Text>
              <Text style={styles.metaDate}>
                {formatDistanceToNow(new Date(item.updatedAt), {
                  addSuffix: true,
                  locale: fr,
                })}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/(tabs)/forum/new")}
      >
        <Plus size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  loadingBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surface,
  },
  listContent: {
    padding: 16,
  },
  emptyBox: {
    paddingVertical: 48,
    alignItems: "center",
  },
  emptyText: {
    color: theme.colors.gray[400],
    fontSize: 16,
  },
  card: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.gray[200],
    borderRadius: theme.spacing.borderRadius,
    padding: 16,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.gray[900],
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    flexWrap: "wrap",
  },
  metaText: {
    fontSize: 12,
    color: theme.colors.gray[500],
    marginRight: 4,
  },
  metaDot: {
    fontSize: 12,
    color: theme.colors.gray[400],
    marginRight: 4,
  },
  metaDate: {
    fontSize: 12,
    color: theme.colors.gray[400],
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
});
