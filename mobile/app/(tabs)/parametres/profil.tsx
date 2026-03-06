import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
} from "react-native";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../../../lib/stores/auth";
import api from "../../../lib/api";
import { theme } from "../../../lib/theme";

export default function ProfilScreen() {
  const user = useAuthStore((s) => s.user);
  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [phone, setPhone] = useState("");

  const updateProfile = useMutation({
    mutationFn: async () => {
      const res = await api.patch("/api/mobile/profile", {
        fullName: fullName.trim(),
        phone: phone.trim() || null,
      });
      return res.data;
    },
    onSuccess: () => {
      Alert.alert("Succès", "Votre profil a été mis à jour.");
    },
    onError: (err: any) => {
      Alert.alert("Erreur", err?.response?.data?.error || "Erreur serveur.");
    },
  });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <View>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.inputDisabled}
          value={user?.email}
          editable={false}
        />
      </View>

      <View>
        <Text style={styles.label}>Nom complet</Text>
        <TextInput
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
        />
      </View>

      <View>
        <Text style={styles.label}>Téléphone</Text>
        <TextInput
          style={styles.input}
          placeholder="06 12 34 56 78"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          updateProfile.isPending && styles.buttonPending,
        ]}
        onPress={() => updateProfile.mutate()}
        disabled={updateProfile.isPending}
      >
        <Text style={styles.buttonText}>
          {updateProfile.isPending ? "Enregistrement..." : "Enregistrer"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.gray[50],
  },
  content: {
    padding: 16,
    gap: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: theme.colors.gray[700],
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.gray[200],
    borderRadius: theme.spacing.borderRadius,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: theme.colors.white,
  },
  inputDisabled: {
    borderWidth: 1,
    borderColor: theme.colors.gray[200],
    borderRadius: theme.spacing.borderRadius,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: theme.colors.gray[100],
    color: theme.colors.gray[500],
  },
  button: {
    borderRadius: theme.spacing.borderRadius,
    paddingVertical: 16,
    backgroundColor: theme.colors.primary,
  },
  buttonPending: {
    backgroundColor: theme.colors.primary,
    opacity: 0.8,
  },
  buttonText: {
    color: theme.colors.white,
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
});
