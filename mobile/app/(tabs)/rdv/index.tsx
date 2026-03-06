import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../lib/api";
import { format, addDays } from "date-fns";
import { fr } from "date-fns/locale";
import { theme } from "../../../lib/theme";

type ContactType = "benevole" | "professionnel";

const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00",
];

export default function RequestAppointmentScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [contactType, setContactType] = useState<ContactType>("benevole");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [timeModalVisible, setTimeModalVisible] = useState(false);

  const nextDays = Array.from({ length: 14 }, (_, i) => addDays(new Date(), i));

  const createRequest = useMutation({
    mutationFn: async () => {
      if (!selectedDate || !selectedTime) throw new Error("Choisir date et heure");
      const [h, m] = selectedTime.split(":").map(Number);
      const scheduledAt = new Date(selectedDate);
      scheduledAt.setHours(h, m, 0, 0);
      const res = await api.post("/api/mobile/appointments/requests", {
        type: contactType === "benevole" ? "accompagnement_terrain" : "telephonique",
        scheduledAt: scheduledAt.toISOString(),
        reason: "Demande depuis l'app",
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      Alert.alert(
        "Demande envoyée",
        "Votre demande de rendez-vous a bien été enregistrée. Vous serez recontacté pour confirmation.",
        [{ text: "OK", onPress: () => router.back() }]
      );
    },
    onError: (err: unknown) => {
      const message = err && typeof err === "object" && "response" in err
        ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
        : "Impossible d'envoyer la demande.";
      Alert.alert("Erreur", message as string);
    },
  });

  const handleConfirm = () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert("Attention", "Veuillez sélectionner une date et une heure.");
      return;
    }
    createRequest.mutate();
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Prendre rendez-vous</Text>
      <Text style={styles.subtitle}>
        Choisissez avec qui et quand vous souhaitez échanger.
      </Text>

      <Text style={styles.label}>Avec qui souhaitez-vous parler ?</Text>
      <View style={styles.choiceRow}>
        <TouchableOpacity
          onPress={() => setContactType("benevole")}
          style={[
            styles.choiceBtn,
            contactType === "benevole" ? styles.choiceActive : styles.choiceInactive,
          ]}
        >
          <Text
            style={[
              styles.choiceText,
              contactType === "benevole" ? styles.choiceTextActive : styles.choiceTextInactive,
            ]}
          >
            Parler à un bénévole
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setContactType("professionnel")}
          style={[
            styles.choiceBtn,
            contactType === "professionnel" ? styles.choiceActive : styles.choiceInactive,
          ]}
        >
          <Text
            style={[
              styles.choiceText,
              contactType === "professionnel" ? styles.choiceTextActive : styles.choiceTextInactive,
            ]}
          >
            Parler à un professionnel
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Sélection date</Text>
      <TouchableOpacity
        onPress={() => setDateModalVisible(true)}
        style={styles.selector}
      >
        <Text style={styles.selectorText}>
          {selectedDate
            ? format(selectedDate, "EEEE d MMMM yyyy", { locale: fr })
            : "Choisir une date"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.label}>Sélection heure</Text>
      <TouchableOpacity
        onPress={() => setTimeModalVisible(true)}
        style={[styles.selector, { marginBottom: 32 }]}
      >
        <Text style={styles.selectorText}>
          {selectedTime ?? "Choisir une heure"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleConfirm}
        disabled={createRequest.isPending || !selectedDate || !selectedTime}
        style={[
          styles.confirmBtn,
          (!selectedDate || !selectedTime) && styles.confirmBtnDisabled,
        ]}
      >
        {createRequest.isPending ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.confirmText}>Confirmer le rendez-vous</Text>
        )}
      </TouchableOpacity>

      {/* Modal date */}
      <Modal
        visible={dateModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setDateModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setDateModalVisible(false)}
        >
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Choisir une date</Text>
            <FlatList
              data={nextDays}
              keyExtractor={(d) => d.toISOString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedDate(item);
                    setDateModalVisible(false);
                  }}
                  style={styles.modalItem}
                >
                  <Text style={styles.modalItemText}>
                    {format(item, "EEEE d MMMM", { locale: fr })}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal heure */}
      <Modal
        visible={timeModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setTimeModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setTimeModalVisible(false)}
        >
          <View style={[styles.modalSheet, { maxHeight: "50%" }]}>
            <Text style={styles.modalTitle}>Choisir une heure</Text>
            <FlatList
              data={TIME_SLOTS}
              keyExtractor={(t) => t}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedTime(item);
                    setTimeModalVisible(false);
                  }}
                  style={styles.modalItem}
                >
                  <Text style={styles.modalItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.gray[900],
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.gray[500],
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.gray[700],
    marginBottom: 8,
  },
  choiceRow: {
    flexDirection: "row",
    marginBottom: 24,
  },
  choiceBtn: {
    flex: 1,
    borderRadius: theme.spacing.borderRadius,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderWidth: 2,
    alignItems: "center",
  },
  choiceActive: {
    borderColor: theme.colors.primary,
    backgroundColor: "#eff6ff",
  },
  choiceInactive: {
    borderColor: theme.colors.gray[200],
    backgroundColor: theme.colors.white,
    marginLeft: 12,
  },
  choiceText: {
    fontWeight: "600",
    fontSize: 14,
    textAlign: "center",
  },
  choiceTextActive: {
    color: theme.colors.primary,
  },
  choiceTextInactive: {
    color: theme.colors.gray[700],
  },
  selector: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.spacing.borderRadius,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: theme.colors.gray[200],
    marginBottom: 16,
  },
  selectorText: {
    fontSize: 16,
    color: theme.colors.gray[900],
  },
  confirmBtn: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.spacing.borderRadius,
    paddingVertical: 16,
    alignItems: "center",
  },
  confirmBtnDisabled: {
    opacity: 0.5,
  },
  confirmText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "70%",
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.gray[900],
    marginBottom: 12,
  },
  modalItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[100],
  },
  modalItemText: {
    fontSize: 16,
    color: theme.colors.gray[900],
    textTransform: "capitalize",
  },
});
