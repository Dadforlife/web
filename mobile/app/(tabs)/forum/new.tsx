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
  Switch,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../lib/api";
import { theme } from "../../../lib/theme";

export default function NewDiscussionScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  const { data: categories } = useQuery({
    queryKey: ["forum-categories"],
    queryFn: async () => {
      const res = await api.get("/api/mobile/forum/categories");
      return res.data.categories as Array<{
        id: string;
        name: string;
        slug: string;
      }>;
    },
  });

  const createDiscussion = useMutation({
    mutationFn: async () => {
      const res = await api.post("/api/mobile/forum/discussions", {
        title: title.trim(),
        content: content.trim(),
        categoryId,
        isAnonymous,
      });
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["forum-discussions"] });
      router.replace(`/(tabs)/forum/discussion/${data.discussion.id}`);
    },
    onError: (err: any) => {
      Alert.alert(
        "Erreur",
        err?.response?.data?.error || "Impossible de créer la discussion."
      );
    },
  });

  const handleCreate = () => {
    if (!title.trim() || title.trim().length < 5) {
      Alert.alert("Erreur", "Le titre doit contenir au moins 5 caractères.");
      return;
    }
    if (!content.trim() || content.trim().length < 10) {
      Alert.alert("Erreur", "Le contenu doit contenir au moins 10 caractères.");
      return;
    }
    if (!categoryId) {
      Alert.alert("Erreur", "Veuillez choisir une catégorie.");
      return;
    }
    createDiscussion.mutate();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ marginBottom: 16 }}>
          <Text style={styles.label}>Catégorie *</Text>
          <View style={styles.categoryRow}>
            {(categories ?? []).map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryChip,
                  categoryId === cat.id ? styles.categoryChipActive : styles.categoryChipInactive,
                ]}
                onPress={() => setCategoryId(cat.id)}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    categoryId === cat.id
                      ? styles.categoryChipTextActive
                      : styles.categoryChipTextInactive,
                  ]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={styles.label}>Titre *</Text>
          <TextInput
            style={styles.input}
            placeholder="Titre de votre discussion"
            placeholderTextColor={theme.colors.gray[400]}
            value={title}
            onChangeText={setTitle}
            maxLength={200}
          />
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={styles.label}>Contenu *</Text>
          <TextInput
            style={[styles.input, styles.inputMultiline]}
            placeholder="Partagez votre expérience ou posez votre question..."
            placeholderTextColor={theme.colors.gray[400]}
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
          />
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Publier anonymement</Text>
          <Switch
            value={isAnonymous}
            onValueChange={setIsAnonymous}
            trackColor={{ true: theme.colors.primary, false: theme.colors.gray[200] }}
          />
        </View>

        <TouchableOpacity
          style={[styles.submitBtn, createDiscussion.isPending && { opacity: 0.6 }]}
          onPress={handleCreate}
          disabled={createDiscussion.isPending}
        >
          <Text style={styles.submitText}>
            {createDiscussion.isPending ? "Publication..." : "Publier la discussion"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: theme.colors.gray[700],
    marginBottom: 8,
  },
  categoryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  categoryChip: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryChipActive: {
    borderColor: theme.colors.primary,
    backgroundColor: "#eff6ff",
  },
  categoryChipInactive: {
    borderColor: theme.colors.gray[200],
    backgroundColor: theme.colors.white,
  },
  categoryChipText: {
    fontSize: 14,
  },
  categoryChipTextActive: {
    color: theme.colors.primary,
    fontWeight: "600",
  },
  categoryChipTextInactive: {
    color: theme.colors.gray[700],
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.gray[200],
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: theme.colors.white,
    color: theme.colors.gray[900],
  },
  inputMultiline: {
    minHeight: 150,
    textAlignVertical: "top",
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.gray[200],
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
  },
  switchLabel: {
    fontSize: 14,
    color: theme.colors.gray[700],
  },
  submitBtn: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
