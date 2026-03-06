import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from "../../lib/hooks/useNotifications";
import { Bell, CheckCheck } from "lucide-react-native";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { theme } from "../../lib/theme";

export default function NotificationsScreen() {
  const router = useRouter();
  const { data, isLoading, refetch, isRefetching } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const handlePress = (notification: {
    id: string;
    isRead: boolean;
    link: string | null;
  }) => {
    if (!notification.isRead) {
      markRead.mutate(notification.id);
    }
  };

  return (
    <View style={styles.container}>
      {data && data.notifications.some((n) => !n.isRead) && (
        <TouchableOpacity
          style={styles.markAllBar}
          onPress={() => markAllRead.mutate()}
        >
          <CheckCheck size={16} color={theme.colors.primary} />
          <Text style={styles.markAllText}>Tout marquer comme lu</Text>
        </TouchableOpacity>
      )}

      {isLoading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={data?.notifications ?? []}
          keyExtractor={(item) => item.id}
          refreshing={isRefetching}
          onRefresh={refetch}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Bell size={48} color={theme.colors.gray[400]} />
              <Text style={styles.emptyText}>Aucune notification</Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.card,
                item.isRead ? styles.cardRead : styles.cardUnread,
              ]}
              onPress={() => handlePress(item)}
            >
              <View style={styles.cardRow}>
                <View style={styles.cardBody}>
                  <Text
                    style={[
                      styles.cardTitle,
                      !item.isRead && { color: theme.colors.gray[900] },
                    ]}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={[
                      styles.cardDesc,
                      !item.isRead && { color: theme.colors.gray[600] },
                    ]}
                    numberOfLines={2}
                  >
                    {item.body}
                  </Text>
                </View>
                <Text style={styles.cardTime}>
                  {formatDistanceToNow(new Date(item.createdAt), {
                    addSuffix: true,
                    locale: fr,
                  })}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  markAllBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[200],
  },
  markAllText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 8,
  },
  loadingBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
    borderRadius: theme.spacing.borderRadius,
    padding: 16,
    borderWidth: 1,
    marginBottom: 8,
  },
  cardRead: {
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.gray[200],
  },
  cardUnread: {
    backgroundColor: "#eff6ff",
    borderColor: "#bfdbfe",
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  cardBody: {
    flex: 1,
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.gray[700],
  },
  cardDesc: {
    fontSize: 14,
    color: theme.colors.gray[400],
    marginTop: 2,
  },
  cardTime: {
    fontSize: 12,
    color: theme.colors.gray[400],
  },
});
