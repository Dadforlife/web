import { View, Text, StyleSheet } from "react-native";
import { Users, Calendar, AlertTriangle } from "lucide-react-native";
import { theme } from "../../lib/theme";

interface Props {
  data: {
    profile: {
      volunteerRole: string;
      maxAssignments: number;
    };
    stats: {
      assignedPapas: number;
      upcomingAppointments: number;
      activeAlerts: number;
    };
    alerts: Array<{
      id: string;
      priority: string;
      title: string;
      description: string | null;
    }>;
    upcomingAppointments: Array<{
      id: string;
      type: string;
      scheduledAt: string;
      father: { fullName: string };
    }>;
  };
}

const ROLE_LABELS: Record<string, string> = {
  accompagnateur_terrain: "Accompagnateur terrain",
  ecoute_soutien: "Écoute & soutien",
  expertise_metier: "Expertise métier",
};

export function VolunteerDashboardCard({ data }: Props) {
  const criticalAlerts = data.alerts.filter(
    (a) => a.priority === "critical" || a.priority === "high"
  );

  return (
    <View style={styles.container}>
      {/* Role badge */}
      <View style={styles.roleBadge}>
        <Text style={styles.roleText}>
          {ROLE_LABELS[data.profile.volunteerRole] || data.profile.volunteerRole}
        </Text>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Users size={24} color={theme.colors.primary} />
          <Text style={styles.statValue}>{data.stats.assignedPapas}</Text>
          <Text style={styles.statLabel}>
            Papas ({data.profile.maxAssignments} max)
          </Text>
        </View>
        <View style={styles.statCard}>
          <Calendar size={24} color={theme.colors.primary} />
          <Text style={styles.statValue}>{data.stats.upcomingAppointments}</Text>
          <Text style={styles.statLabel}>RDV à venir</Text>
        </View>
        <View style={styles.statCard}>
          <AlertTriangle
            size={24}
            color={data.stats.activeAlerts > 0 ? "#dc2626" : theme.colors.gray[500]}
          />
          <Text style={styles.statValue}>{data.stats.activeAlerts}</Text>
          <Text style={styles.statLabel}>Alertes</Text>
        </View>
      </View>

      {/* Critical alerts */}
      {criticalAlerts.length > 0 && (
        <View style={styles.alertsCard}>
          <Text style={styles.alertsTitle}>Alertes prioritaires</Text>
          {criticalAlerts.slice(0, 3).map((alert, index) => (
            <View
              key={alert.id}
              style={[
                styles.alertItem,
                index === criticalAlerts.slice(0, 3).length - 1 &&
                  styles.alertItemLast,
              ]}
            >
              <Text style={styles.alertTitle}>{alert.title}</Text>
              {alert.description && (
                <Text style={styles.alertDescription}>{alert.description}</Text>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Upcoming appointments */}
      {data.upcomingAppointments.length > 0 && (
        <View style={styles.appointmentsCard}>
          <Text style={styles.appointmentsTitle}>Prochains rendez-vous</Text>
          {data.upcomingAppointments.slice(0, 3).map((apt, index) => (
            <View
              key={apt.id}
              style={[
                styles.appointmentItem,
                index === data.upcomingAppointments.slice(0, 3).length - 1 &&
                  styles.appointmentItemLast,
              ]}
            >
              <View style={styles.appointmentContent}>
                <Text style={styles.appointmentName}>
                  {apt.father.fullName}
                </Text>
                <Text style={styles.appointmentMeta}>
                  {new Date(apt.scheduledAt).toLocaleDateString("fr-FR", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {" • "}
                  {apt.type === "accompagnement_terrain"
                    ? "Terrain"
                    : "Téléphone"}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  roleBadge: {
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    borderRadius: theme.spacing.borderRadius,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  roleText: {
    color: "#1E40AF",
    fontWeight: "600",
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.gray[200],
    borderRadius: theme.spacing.borderRadius,
    padding: 16,
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.gray[900],
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.gray[500],
  },
  alertsCard: {
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    borderRadius: theme.spacing.borderRadius,
    padding: 16,
  },
  alertsTitle: {
    color: "#991B1B",
    fontWeight: "600",
    marginBottom: 8,
  },
  alertItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#FEE2E2",
  },
  alertItemLast: {
    borderBottomWidth: 0,
  },
  alertTitle: {
    fontSize: 14,
    color: "#B91C1C",
    fontWeight: "500",
  },
  alertDescription: {
    fontSize: 12,
    color: "#DC2626",
    marginTop: 2,
  },
  appointmentsCard: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.gray[200],
    borderRadius: theme.spacing.borderRadius,
    padding: 16,
  },
  appointmentsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.gray[900],
    marginBottom: 12,
  },
  appointmentItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[100],
  },
  appointmentItemLast: {
    borderBottomWidth: 0,
  },
  appointmentContent: {
    flex: 1,
  },
  appointmentName: {
    fontSize: 14,
    fontWeight: "500",
    color: theme.colors.gray[900],
  },
  appointmentMeta: {
    fontSize: 12,
    color: theme.colors.gray[500],
  },
});
