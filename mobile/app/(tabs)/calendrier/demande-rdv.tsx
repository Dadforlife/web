import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../lib/api";
import { theme } from "../../../lib/theme";

export default function DemandeRdvScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [type, setType] = useState<string>("accompagnement_terrain");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");

  const createRequest = useMutation({
    mutationFn: async () => {
      const res = await api.post("/api/mobile/appointments/requests", {
        type,
        reason: reason.trim(),
        message: message.trim(),
        city: city.trim(),
        phone: phone.trim(),
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointment-requests"] });
      Alert.alert(
        "Demande envoyée",
        "Votre demande de rendez-vous a été envoyée aux bénévoles disponibles.",
        [{ text: "OK", onPress: () => router.back() }]
      );
    },
    onError: (err: any) => {
      Alert.alert(
        "Erreur",
        err?.response?.data?.error || "Impossible d'envoyer la demande."
      );
    },
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Type selection */}
        <View>
          <Text style={styles.label}>Type de rendez-vous *</Text>
          <View style={styles.optionsGroup}>
            {[
              { value: "accompagnement_terrain", label: "Accompagnement terrain" },
              { value: "telephonique", label: "Téléphonique" },
            ].map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={[
                  styles.optionButton,
                  type === opt.value ? styles.optionSelected : styles.optionDefault,
                ]}
                onPress={() => setType(opt.value)}
              >
                <Text
                  style={[
                    styles.optionText,
                    type === opt.value ? styles.optionTextSelected : styles.optionTextDefault,
                  ]}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View>
          <Text style={styles.label}>Raison *</Text>
          <TextInput
            style={styles.input}
            placeholder="Pourquoi souhaitez-vous un rendez-vous ?"
            placeholderTextColor={theme.colors.gray[400]}
            value={reason}
            onChangeText={setReason}
          />
        </View>

        <View>
          <Text style={styles.label}>Message complémentaire</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Détails supplémentaires..."
            placeholderTextColor={theme.colors.gray[400]}
            value={message}
            onChangeText={setMessage}
            multiline
            textAlignVertical="top"
          />
        </View>

        <View>
          <Text style={styles.label}>Ville</Text>
          <TextInput
            style={styles.input}
            placeholder="Votre ville"
            placeholderTextColor={theme.colors.gray[400]}
            value={city}
            onChangeText={setCity}
          />
        </View>

        <View>
          <Text style={styles.label}>Téléphone</Text>
          <TextInput
            style={styles.input}
            placeholder="06 12 34 56 78"
            placeholderTextColor={theme.colors.gray[400]}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>

        <TouchableOpacity
          style={[
            styles.submitButton,
            createRequest.isPending && styles.submitButtonDisabled,
          ]}
          onPress={() => createRequest.mutate()}
          disabled={createRequest.isPending}
        >
          <Text style={styles.submitText}>
            {createRequest.isPending ? "Envoi..." : "Envoyer la demande"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.gray[50],
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: theme.colors.gray[700],
    marginBottom: 8,
  },
  optionsGroup: {
    gap: 8,
  },
  optionButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  optionSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: "#EFF6FF",
  },
  optionDefault: {
    borderColor: theme.colors.gray[400],
    backgroundColor: theme.colors.white,
  },
  optionText: {
    fontSize: 16,
  },
  optionTextSelected: {
    color: "#1E40AF",
    fontWeight: "600",
  },
  optionTextDefault: {
    color: theme.colors.gray[700],
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.gray[400],
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: theme.colors.white,
  },
  textArea: {
    minHeight: 100,
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.spacing.borderRadius,
    paddingVertical: 16,
    alignItems: "center",
  },
  submitButtonDisabled: {
    backgroundColor: "#93C5FD",
  },
  submitText: {
    color: theme.colors.white,
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
});
