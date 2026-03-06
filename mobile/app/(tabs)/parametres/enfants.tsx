import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../lib/api";
import { Trash2, Plus, Baby } from "lucide-react-native";
import { theme } from "../../../lib/theme";

interface Enfant {
  id: string;
  prenom: string;
  sexe: string;
}

export default function EnfantsScreen() {
  const queryClient = useQueryClient();
  const [prenom, setPrenom] = useState("");
  const [sexe, setSexe] = useState<string>("garcon");
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["enfants"],
    queryFn: async () => {
      const res = await api.get("/api/mobile/profile");
      return res.data.enfants as Enfant[];
    },
  });

  const addEnfant = useMutation({
    mutationFn: async () => {
      await api.post("/api/mobile/profile/enfants", {
        prenom: prenom.trim(),
        sexe,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enfants"] });
      setPrenom("");
      setShowForm(false);
    },
    onError: (err: any) => {
      Alert.alert("Erreur", err?.response?.data?.error || "Erreur serveur.");
    },
  });

  const removeEnfant = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/mobile/profile/enfants/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enfants"] });
    },
  });

  const handleRemove = (id: string, name: string) => {
    Alert.alert("Supprimer", `Retirer ${name} de la liste ?`, [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: () => removeEnfant.mutate(id),
      },
    ]);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data ?? []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          showForm ? (
            <View style={styles.form}>
              <TextInput
                style={styles.formInput}
                placeholder="Prénom de l'enfant"
                value={prenom}
                onChangeText={setPrenom}
              />
              <View style={styles.sexeRow}>
                {[
                  { value: "garcon", label: "Garçon" },
                  { value: "fille", label: "Fille" },
                ].map((opt) => (
                  <TouchableOpacity
                    key={opt.value}
                    style={[
                      styles.sexeOption,
                      sexe === opt.value && styles.sexeOptionSelected,
                    ]}
                    onPress={() => setSexe(opt.value)}
                  >
                    <Text
                      style={[
                        styles.sexeOptionText,
                        sexe === opt.value && styles.sexeOptionTextSelected,
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.formButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowForm(false)}
                >
                  <Text style={styles.cancelButtonText}>Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => addEnfant.mutate()}
                  disabled={!prenom.trim() || addEnfant.isPending}
                >
                  <Text style={styles.addButtonText}>Ajouter</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Baby size={48} color={theme.colors.gray[200]} />
            <Text style={styles.emptyText}>Aucun enfant enregistré</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View>
              <Text style={styles.itemName}>{item.prenom}</Text>
              <Text style={styles.itemSexe}>
                {item.sexe === "garcon" ? "Garçon" : "Fille"}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => handleRemove(item.id, item.prenom)}
              style={styles.deleteButton}
            >
              <Trash2 size={18} color="#dc2626" />
            </TouchableOpacity>
          </View>
        )}
      />

      {!showForm && (data ?? []).length < 20 && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setShowForm(true)}
        >
          <Plus size={28} color={theme.colors.white} />
        </TouchableOpacity>
      )}
    </View>
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
  listContent: {
    padding: 16,
    gap: 8,
  },
  form: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.gray[200],
    borderRadius: theme.spacing.borderRadius,
    padding: 16,
    marginBottom: 16,
    gap: 12,
  },
  formInput: {
    borderWidth: 1,
    borderColor: theme.colors.gray[200],
    borderRadius: theme.spacing.borderRadius,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: theme.colors.gray[50],
  },
  sexeRow: {
    flexDirection: "row",
    gap: 8,
  },
  sexeOption: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.gray[200],
    borderRadius: theme.spacing.borderRadius,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  sexeOptionSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: "#EFF6FF",
  },
  sexeOptionText: {
    textAlign: "center",
    fontWeight: "500",
    color: theme.colors.gray[600],
  },
  sexeOptionTextSelected: {
    color: theme.colors.primary,
  },
  formButtons: {
    flexDirection: "row",
    gap: 8,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.gray[200],
    borderRadius: theme.spacing.borderRadius,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    textAlign: "center",
    color: theme.colors.gray[600],
  },
  addButton: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.spacing.borderRadius,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    textAlign: "center",
    color: theme.colors.white,
    fontWeight: "600",
  },
  empty: {
    paddingVertical: 48,
    alignItems: "center",
  },
  emptyText: {
    color: theme.colors.gray[400],
    marginTop: 16,
  },
  item: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.gray[200],
    borderRadius: theme.spacing.borderRadius,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemName: {
    fontSize: 16,
    fontWeight: "500",
    color: theme.colors.gray[900],
  },
  itemSexe: {
    fontSize: 14,
    color: theme.colors.gray[500],
  },
  deleteButton: {
    padding: 8,
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: theme.colors.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
});
