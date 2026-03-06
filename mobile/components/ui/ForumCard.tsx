import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { theme, styles as themeStyles } from "../../lib/theme";

interface ForumCardProps {
  title: string;
  author: string;
  replyCount: number;
  date: string;
  onPress: () => void;
}

export function ForumCard({
  title,
  author,
  replyCount,
  date,
  onPress,
}: ForumCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[themeStyles.card, styles.card]}
    >
      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>
      <View style={styles.meta}>
        <Text style={styles.metaText}>{author}</Text>
        <Text style={styles.metaDot}>•</Text>
        <Text style={styles.metaText}>
          {replyCount} réponse{replyCount !== 1 ? "s" : ""}
        </Text>
        <Text style={styles.metaDot}>•</Text>
        <Text style={styles.metaDate}>
          {formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr })}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.gray[900],
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    flexWrap: "wrap",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: theme.colors.gray[500],
  },
  metaDot: {
    fontSize: 12,
    color: theme.colors.gray[400],
  },
  metaDate: {
    fontSize: 12,
    color: theme.colors.gray[400],
  },
});
