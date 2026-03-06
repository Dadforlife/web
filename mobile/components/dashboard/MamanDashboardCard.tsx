import { View, Text, StyleSheet } from "react-native";
import { CheckCircle, Clock, Circle } from "lucide-react-native";
import { theme } from "../../lib/theme";

interface Props {
  data: {
    request: {
      id: string;
      status: string;
      fatherFirstName: string;
      fatherCity: string | null;
      createdAt: string;
    } | null;
  };
}

const STEPS = [
  { key: "pending", label: "Demande enregistrée" },
  { key: "reviewing", label: "En cours d'analyse" },
  { key: "contacted", label: "Prise de contact" },
  { key: "active", label: "Accompagnement actif" },
  { key: "completed", label: "Terminé" },
];

function getStepIndex(status: string) {
  const idx = STEPS.findIndex((s) => s.key === status);
  return idx >= 0 ? idx : 0;
}

export function MamanDashboardCard({ data }: Props) {
  if (!data.request) {
    return (
      <View style={styles.emptyCard}>
        <Text style={styles.emptyTitle}>Aucune demande en cours</Text>
        <Text style={styles.emptySubtitle}>
          Vous pouvez soumettre une demande d'accompagnement depuis le site web.
        </Text>
      </View>
    );
  }

  const currentStep = getStepIndex(data.request.status);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Suivi de votre demande</Text>
        <Text style={styles.subtitle}>
          Pour {data.request.fatherFirstName}
          {data.request.fatherCity ? ` • ${data.request.fatherCity}` : ""}
        </Text>

        {/* Progress steps */}
        <View style={styles.stepsGroup}>
          {STEPS.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;

            return (
              <View key={step.key} style={styles.stepRow}>
                {isCompleted ? (
                  <CheckCircle size={20} color="#16a34a" />
                ) : isCurrent ? (
                  <Clock size={20} color={theme.colors.primary} />
                ) : (
                  <Circle size={20} color={theme.colors.gray[400]} />
                )}
                <Text
                  style={[
                    styles.stepText,
                    isCompleted && styles.stepCompleted,
                    isCurrent && styles.stepCurrent,
                    !isCompleted && !isCurrent && styles.stepPending,
                  ]}
                >
                  {step.label}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  emptyCard: {
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
  card: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.gray[200],
    borderRadius: theme.spacing.borderRadius,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.gray[900],
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.gray[500],
    marginBottom: 16,
  },
  stepsGroup: {
    gap: 12,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  stepText: {
    fontSize: 14,
  },
  stepCompleted: {
    color: "#15803D",
  },
  stepCurrent: {
    color: theme.colors.primary,
    fontWeight: "600",
  },
  stepPending: {
    color: theme.colors.gray[400],
  },
});
