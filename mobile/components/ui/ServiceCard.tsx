import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import type { LucideIcon } from "lucide-react-native";
import { theme, styles as themeStyles } from "../../lib/theme";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  onPress: () => void;
}

export function ServiceCard({ icon: Icon, title, onPress }: ServiceCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[themeStyles.card, styles.card]}
    >
      <View style={themeStyles.cardIconBox}>
        <Icon size={24} color={theme.colors.primary} />
      </View>
      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.gray[900],
    textAlign: "center",
  },
});
