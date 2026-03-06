import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { useConversations } from "../../../lib/hooks/useConversations";
import { useAuthStore } from "../../../lib/stores/auth";
import { MessageCircle, Plus } from "lucide-react-native";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { theme } from "../../../lib/theme";

export default function ConversationsScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { data, isLoading, refetch, isRefetching } = useConversations();
  const isMember =
    user?.roles.includes("member") &&
    !user?.roles.includes("admin") &&
    !user?.roles.includes("volunteer");

  const conversations = data?.conversations ?? [];

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        refreshing={isRefetching}
        onRefresh={refetch}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <MessageCircle size={48} color={theme.colors.gray[400]} />
            <Text style={styles.emptyTitle}>
              Vous n'avez pas encore de messages.
            </Text>
            <Text style={styles.emptySubtitle}>
              Un bénévole ou un professionnel pourra bientôt vous répondre.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => router.push(`/(tabs)/messagerie/${item.id}`)}
          >
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {(user?.roles.includes("volunteer") || user?.roles.includes("admin")
                  ? item.father?.fullName
                  : item.volunteer?.fullName || "?")?.[0] ?? "?"}
              </Text>
            </View>
            <View style={styles.cardBody}>
              <View style={styles.cardHeader}>
                <Text style={styles.subject} numberOfLines={1}>
                  {item.subject}
                </Text>
                {item.unreadCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {item.unreadCount > 99 ? "99+" : item.unreadCount}
                    </Text>
                  </View>
                )}
              </View>
              <Text style={styles.contactName} numberOfLines={1}>
                {user?.roles.includes("volunteer") || user?.roles.includes("admin")
                  ? item.father?.fullName
                  : item.volunteer?.fullName || "En attente d'un bénévole"}
              </Text>
              {item.lastMessage && (
                <Text style={styles.preview} numberOfLines={1}>
                  {item.lastMessage.content}
                </Text>
              )}
            </View>
            <Text style={styles.timestamp}>
              {item.lastMessage
                ? formatDistanceToNow(new Date(item.lastMessage.createdAt), {
                    addSuffix: true,
                    locale: fr,
                  })
                : ""}
            </Text>
          </TouchableOpacity>
        )}
      />

      {isMember && (
        <TouchableOpacity
          style={styles.fab}
          activeOpacity={0.85}
          onPress={() => router.push("/(tabs)/messagerie/new")}
        >
          <Plus size={28} color="#fff" />
        </TouchableOpacity>
      )}
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
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.white,
    borderRadius: theme.spacing.borderRadius,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.gray[100],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  cardBody: {
    flex: 1,
    minWidth: 0,
    marginRight: 8,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  subject: {
    flex: 1,
    marginRight: 8,
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.gray[900],
  },
  badge: {
    backgroundColor: theme.colors.primary,
    borderRadius: 999,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
  contactName: {
    fontSize: 14,
    color: theme.colors.gray[500],
    marginBottom: 2,
  },
  preview: {
    fontSize: 14,
    color: theme.colors.gray[400],
  },
  timestamp: {
    fontSize: 12,
    color: theme.colors.gray[400],
  },
  emptyBox: {
    paddingVertical: 48,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 16,
    color: theme.colors.gray[500],
    marginTop: 16,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    color: theme.colors.gray[400],
    marginTop: 8,
    textAlign: "center",
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
