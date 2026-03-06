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
import api from "../../../lib/api";
import { MessageSquare } from "lucide-react-native";
import { theme } from "../../../lib/theme";

interface Category {
  id: string;
  name: string;
  slug: string;
  discussionCount: number;
}

export default function ForumScreen() {
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["forum-categories"],
    queryFn: async () => {
      const res = await api.get("/api/mobile/forum/categories");
      return res.data.categories as Category[];
    },
    staleTime: 5 * 60 * 1000,
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
        data={data ?? []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <MessageSquare size={48} color={theme.colors.gray[400]} />
            <Text style={styles.emptyText}>Aucune catégorie</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/(tabs)/forum/${item.slug}`)}
          >
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardCount}>
              {item.discussionCount} discussion
              {item.discussionCount !== 1 ? "s" : ""}
            </Text>
          </TouchableOpacity>
        )}
      />
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
    marginTop: 16,
    fontSize: 16,
  },
  card: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.gray[200],
    borderRadius: theme.spacing.borderRadiusLg,
    padding: 20,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.gray[900],
  },
  cardCount: {
    fontSize: 14,
    color: theme.colors.gray[500],
    marginTop: 4,
  },
});
