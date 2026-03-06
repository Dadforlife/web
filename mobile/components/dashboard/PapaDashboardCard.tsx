import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import {
  Sun,
  CloudRain,
  CloudLightning,
  AlertTriangle,
  Calendar,
  MessageCircle,
} from "lucide-react-native";
import { theme } from "../../lib/theme";

interface Props {
  data: {
    diagnostic: {
      scoreGlobal: number;
      classification: string;
      planTitle: string;
    } | null;
    nextAppointment: {
      type: string;
      scheduledAt: string;
      duration: number;
      location: string | null;
      volunteer: { fullName: string };
    } | null;
  };
}

function getMeteoIcon(classification: string) {
  switch (classification) {
    case "Situation maîtrisée":
      return <Sun size={32} color="#16a34a" />;
    case "Sous tension":
      return <CloudRain size={32} color="#eab308" />;
    case "Conflit élevé":
      return <CloudLightning size={32} color="#f97316" />;
    case "Risque critique":
      return <AlertTriangle size={32} color="#dc2626" />;
    default:
      return <Sun size={32} color={theme.colors.gray[500]} />;
  }
}

function getMeteoStyles(classification: string) {
  switch (classification) {
    case "Situation maîtrisée":
      return { backgroundColor: "#F0FDF4", borderColor: "#BBF7D0" };
    case "Sous tension":
      return { backgroundColor: "#FEFCE8", borderColor: "#FEF08A" };
    case "Conflit élevé":
      return { backgroundColor: "#FFF7ED", borderColor: "#FED7AA" };
    case "Risque critique":
      return { backgroundColor: "#FEF2F2", borderColor: "#FECACA" };
    default:
      return {
        backgroundColor: theme.colors.gray[50],
        borderColor: theme.colors.gray[200],
      };
  }
}

export function PapaDashboardCard({ data }: Props) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Diagnostic Meteo */}
      {data.diagnostic ? (
        <View
          style={[
            styles.diagnosticCard,
            {
              backgroundColor: getMeteoStyles(data.diagnostic.classification)
                .backgroundColor,
              borderColor: getMeteoStyles(data.diagnostic.classification)
                .borderColor,
            },
          ]}
        >
          <View style={styles.diagnosticHeader}>
            {getMeteoIcon(data.diagnostic.classification)}
            <View style={styles.diagnosticContent}>
              <Text style={styles.diagnosticTitle}>
                {data.diagnostic.classification}
              </Text>
              <Text style={styles.diagnosticScore}>
                Score global : {data.diagnostic.scoreGlobal}/100
              </Text>
            </View>
          </View>
          <Text style={styles.diagnosticPlan}>
            {data.diagnostic.planTitle}
          </Text>
        </View>
      ) : (
        <View style={styles.emptyDiagnostic}>
          <Text style={styles.emptyTitle}>Diagnostic non effectué</Text>
          <Text style={styles.emptySubtitle}>
            Complétez votre diagnostic pour recevoir un plan personnalisé.
          </Text>
        </View>
      )}

      {/* Next Appointment */}
      {data.nextAppointment && (
        <View style={styles.appointmentCard}>
          <View style={styles.appointmentHeader}>
            <Calendar size={20} color={theme.colors.primary} />
            <Text style={styles.appointmentTitle}>Prochain rendez-vous</Text>
          </View>
          <Text style={styles.appointmentDate}>
            {new Date(data.nextAppointment.scheduledAt).toLocaleDateString(
              "fr-FR",
              {
                weekday: "long",
                day: "numeric",
                month: "long",
                hour: "2-digit",
                minute: "2-digit",
              }
            )}
          </Text>
          <Text style={styles.appointmentMeta}>
            Avec {data.nextAppointment.volunteer.fullName} •{" "}
            {data.nextAppointment.type === "accompagnement_terrain"
              ? "Sur le terrain"
              : "Téléphonique"}
          </Text>
        </View>
      )}

      {/* Quick Actions */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push("/(tabs)/messagerie")}
        >
          <MessageCircle size={24} color={theme.colors.white} />
          <Text style={styles.actionText}>Messages</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push("/(tabs)/calendrier/demande-rdv")}
        >
          <Calendar size={24} color={theme.colors.white} />
          <Text style={styles.actionText}>Demander un RDV</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  diagnosticCard: {
    borderWidth: 1,
    borderRadius: theme.spacing.borderRadius,
    padding: 20,
  },
  diagnosticHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  diagnosticContent: {
    flex: 1,
  },
  diagnosticTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.gray[900],
  },
  diagnosticScore: {
    fontSize: 14,
    color: theme.colors.gray[600],
  },
  diagnosticPlan: {
    fontSize: 14,
    color: theme.colors.gray[600],
    marginTop: 4,
  },
  emptyDiagnostic: {
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    borderRadius: theme.spacing.borderRadius,
    padding: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E40AF",
  },
  emptySubtitle: {
    fontSize: 14,
    color: theme.colors.primary,
    marginTop: 4,
  },
  appointmentCard: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.gray[200],
    borderRadius: theme.spacing.borderRadius,
    padding: 20,
  },
  appointmentHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  appointmentTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.gray[900],
  },
  appointmentDate: {
    fontSize: 14,
    color: theme.colors.gray[600],
  },
  appointmentMeta: {
    fontSize: 14,
    color: theme.colors.gray[500],
    marginTop: 4,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.spacing.borderRadius,
    padding: 16,
    alignItems: "center",
  },
  actionText: {
    color: theme.colors.white,
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
  },
});
