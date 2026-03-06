import { View, Text, Switch, ScrollView, ActivityIndicator, Alert, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../lib/api";
import { useState, useEffect } from "react";
import { theme } from "../../../lib/theme";

interface Preferences {
  emailAccount: boolean;
  emailForum: boolean;
  emailCommunity: boolean;
  emailProgramme: boolean;
  emailAdmin: boolean;
  emailEngagement: boolean;
  emailMessagerie: boolean;
  inappAccount: boolean;
  inappForum: boolean;
  inappCommunity: boolean;
  inappProgramme: boolean;
  inappAdmin: boolean;
  inappEngagement: boolean;
  inappMessagerie: boolean;
}

const CATEGORIES = [
  { key: "Account", label: "Compte" },
  { key: "Forum", label: "Forum" },
  { key: "Community", label: "Communauté" },
  { key: "Programme", label: "Programme" },
  { key: "Admin", label: "Administration" },
  { key: "Engagement", label: "Engagement" },
  { key: "Messagerie", label: "Messagerie" },
];

export default function NotificationPrefsScreen() {
  const queryClient = useQueryClient();
  const [prefs, setPrefs] = useState<Preferences | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["notification-preferences"],
    queryFn: async () => {
      const res = await api.get("/api/mobile/profile/notification-preferences");
      return res.data as Preferences;
    },
  });

  useEffect(() => {
    if (data) setPrefs(data);
  }, [data]);

  const savePrefs = useMutation({
    mutationFn: async () => {
      await api.put("/api/mobile/profile/notification-preferences", prefs);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notification-preferences"] });
      Alert.alert("Succès", "Préférences sauvegardées.");
    },
    onError: () => {
      Alert.alert("Erreur", "Impossible de sauvegarder les préférences.");
    },
  });

  const toggle = (key: keyof Preferences) => {
    setPrefs((prev) => (prev ? { ...prev, [key]: !prev[key] } : prev));
  };

  if (isLoading || !prefs) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {CATEGORIES.map((cat) => {
        const emailKey = `email${cat.key}` as keyof Preferences;
        const pushKey = `inapp${cat.key}` as keyof Preferences;

        return (
          <View key={cat.key} style={styles.category}>
            <Text style={styles.categoryTitle}>{cat.label}</Text>
            <View style={styles.toggles}>
              <View style={styles.toggleRow}>
                <Text style={styles.toggleLabel}>Email</Text>
                <Switch
                  value={prefs[emailKey] as boolean}
                  onValueChange={() => toggle(emailKey)}
                  trackColor={{ true: theme.colors.primary }}
                />
              </View>
              <View style={styles.toggleRow}>
                <Text style={styles.toggleLabel}>Push notification</Text>
                <Switch
                  value={prefs[pushKey] as boolean}
                  onValueChange={() => toggle(pushKey)}
                  trackColor={{ true: theme.colors.primary }}
                />
              </View>
            </View>
          </View>
        );
      })}

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.saveButton, savePrefs.isPending && styles.saveButtonPending]}
          onPress={() => savePrefs.mutate()}
          disabled={savePrefs.isPending}
        >
          <Text style={styles.saveButtonText}>
            {savePrefs.isPending ? "Sauvegarde..." : "Sauvegarder"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.gray[50],
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.gray[50],
  },
  content: {
    paddingBottom: 32,
  },
  category: {
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[100],
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.gray[900],
    marginBottom: 12,
  },
  toggles: {
    gap: 12,
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toggleLabel: {
    fontSize: 14,
    color: theme.colors.gray[600],
  },
  footer: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  saveButton: {
    borderRadius: theme.spacing.borderRadius,
    paddingVertical: 16,
    backgroundColor: theme.colors.primary,
  },
  saveButtonPending: {
    backgroundColor: theme.colors.primary,
    opacity: 0.8,
  },
  saveButtonText: {
    color: theme.colors.white,
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
});
