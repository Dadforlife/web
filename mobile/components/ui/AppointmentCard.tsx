import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { theme } from "../../lib/theme";

type AppointmentStatus = "a_venir" | "termine" | "annule" | string;
type AppointmentType = "benevole" | "professionnel" | string;

interface AppointmentCardProps {
  date: string;
  time: string;
  type: AppointmentType;
  status: AppointmentStatus;
  onPress?: () => void;
  onCancel?: () => void;
}

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  a_venir: { bg: "#dbeafe", text: "#1d4ed8", label: "À venir" },
  termine: { bg: "#dcfce7", text: "#15803d", label: "Terminé" },
  annule: { bg: "#f3f4f6", text: "#4b5563", label: "Annulé" },
};

export function AppointmentCard({
  date,
  time,
  type,
  status,
  onPress,
  onCancel,
}: AppointmentCardProps) {
  const config = statusColors[status] ?? { bg: "#f3f4f6", text: "#4b5563", label: status };
  const typeLabel =
    type === "benevole" || type === "accompagnement_terrain"
      ? "Bénévole"
      : type === "professionnel" || type === "telephonique"
        ? "Professionnel"
        : type;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
      style={styles.card}
    >
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.dateText}>
            {format(new Date(date), "EEEE d MMMM", { locale: fr })}
          </Text>
          <Text style={styles.timeText}>{time}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: config.bg }]}>
          <Text style={[styles.badgeText, { color: config.text }]}>
            {config.label}
          </Text>
        </View>
      </View>
      <Text style={styles.typeText}>{typeLabel}</Text>
      {onCancel && status === "a_venir" && (
        <TouchableOpacity onPress={onCancel} style={styles.cancelBtn}>
          <Text style={styles.cancelText}>Annuler le rendez-vous</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.spacing.borderRadius,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.gray[100],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.gray[900],
    textTransform: "capitalize",
  },
  timeText: {
    fontSize: 14,
    color: theme.colors.gray[600],
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "500",
  },
  typeText: {
    fontSize: 14,
    color: theme.colors.gray[500],
    marginTop: 8,
  },
  cancelBtn: {
    marginTop: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#fef2f2",
    alignItems: "center",
  },
  cancelText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#dc2626",
  },
});
