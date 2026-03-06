import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import type { LucideIcon } from "lucide-react-native";
import { ChevronRight } from "lucide-react-native";
import { theme } from "../../lib/theme";

interface MenuItemProps {
  icon: LucideIcon;
  label: string;
  onPress: () => void;
}

export function MenuItem({ icon: Icon, label, onPress }: MenuItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={styles.container}
    >
      <View style={styles.iconBox}>
        <Icon size={20} color={theme.colors.primary} />
      </View>
      <Text style={styles.label}>{label}</Text>
      <ChevronRight size={20} color={theme.colors.gray[400]} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.white,
    borderRadius: theme.spacing.borderRadius,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.colors.gray[100],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: theme.colors.gray[100],
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  label: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: theme.colors.gray[900],
  },
});
