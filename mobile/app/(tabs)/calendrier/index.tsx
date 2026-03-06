import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { Calendar as RNCalendar } from "react-native-calendars";
import { useQuery } from "@tanstack/react-query";
import api from "../../../lib/api";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { AppointmentCard } from "../../../components/ui/AppointmentCard";
import { Calendar } from "lucide-react-native";
import { theme } from "../../../lib/theme";

interface Appointment {
  id: string;
  type: string;
  scheduledAt: string;
  duration: number;
  status: string;
  location: string | null;
  otherParty: string;
}

export default function CalendarScreen() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  const [currentMonth, setCurrentMonth] = useState(
    format(new Date(), "yyyy-MM")
  );

  const { data, isLoading } = useQuery({
    queryKey: ["appointments", currentMonth],
    queryFn: async () => {
      try {
        const res = await api.get("/api/mobile/appointments", {
          params: { month: currentMonth },
        });
        return res.data?.appointments as Appointment[];
      } catch {
        return [];
      }
    },
  });

  const appointments = data ?? [];

  const markedDates: Record<string, object> = {};
  appointments.forEach((apt) => {
    const date = format(new Date(apt.scheduledAt), "yyyy-MM-dd");
    markedDates[date] = { marked: true, dotColor: theme.colors.primary };
  });
  markedDates[selectedDate] = {
    ...markedDates[selectedDate],
    selected: true,
    selectedColor: theme.colors.primary,
  };

  const dayAppointments = appointments.filter(
    (apt) => format(new Date(apt.scheduledAt), "yyyy-MM-dd") === selectedDate
  );

  const noAppointmentsAtAll = appointments.length === 0 && !isLoading;
  const noAppointmentsToday = dayAppointments.length === 0 && !isLoading;

  return (
    <View style={styles.container}>
      <RNCalendar
        onDayPress={(day: { dateString: string }) => setSelectedDate(day.dateString)}
        onMonthChange={(month: { year: number; month: number }) =>
          setCurrentMonth(`${month.year}-${String(month.month).padStart(2, "0")}`)
        }
        markedDates={markedDates}
        theme={{
          todayTextColor: theme.colors.primary,
          arrowColor: theme.colors.primary,
          selectedDayBackgroundColor: theme.colors.primary,
          textMonthFontWeight: "bold",
          textDayHeaderFontWeight: "600",
        }}
      />

      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.dateTitle}>
          {format(new Date(selectedDate + "T00:00:00"), "EEEE d MMMM", {
            locale: fr,
          })}
        </Text>

        {isLoading ? (
          <ActivityIndicator color={theme.colors.primary} />
        ) : noAppointmentsAtAll ? (
          <View style={styles.emptyCard}>
            <Calendar size={48} color={theme.colors.gray[400]} />
            <Text style={styles.emptyTitle}>
              Vous n'avez pas encore de rendez-vous.
            </Text>
            <Text style={styles.emptySubtitle}>
              Vous pouvez en prendre un avec le bouton +
            </Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/rdv")}>
              <Text style={styles.emptyLink}>Prendre un rendez-vous</Text>
            </TouchableOpacity>
          </View>
        ) : noAppointmentsToday ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptySubtitle}>Aucun rendez-vous ce jour</Text>
          </View>
        ) : (
          dayAppointments.map((item) => (
            <AppointmentCard
              key={item.id}
              date={item.scheduledAt}
              time={format(new Date(item.scheduledAt), "HH:mm")}
              type={item.type}
              status={item.status}
              onPress={() => router.push(`/(tabs)/calendrier/demandes/${item.id}`)}
              onCancel={() => {}}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  scrollArea: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  dateTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.gray[900],
    marginBottom: 12,
    textTransform: "capitalize",
  },
  emptyCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.spacing.borderRadius,
    padding: 24,
    borderWidth: 1,
    borderColor: theme.colors.gray[100],
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 16,
    color: theme.colors.gray[600],
    textAlign: "center",
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: theme.colors.gray[500],
    textAlign: "center",
    marginTop: 8,
  },
  emptyLink: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.primary,
    marginTop: 16,
  },
});
