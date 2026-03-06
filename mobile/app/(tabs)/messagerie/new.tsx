import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { useCreateConversation } from "../../../lib/hooks/useConversations";
import { theme } from "../../../lib/theme";

export default function NewConversationScreen() {
  const router = useRouter();
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const createConversation = useCreateConversation();

  const handleCreate = async () => {
    if (subject.trim().length < 3) {
      Alert.alert("Erreur", "Le sujet doit contenir au moins 3 caractères.");
      return;
    }
    if (content.trim().length < 3) {
      Alert.alert("Erreur", "Le message doit contenir au moins 3 caractères.");
      return;
    }

    try {
      const result = await createConversation.mutateAsync({
        subject: subject.trim(),
        content: content.trim(),
      });
      router.replace(`/(tabs)/messagerie/${result.conversation.id}`);
    } catch (err: any) {
      Alert.alert(
        "Erreur",
        err?.response?.data?.error || "Impossible de créer la conversation."
      );
    }
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
        <View>
          <Text style={styles.label}>Sujet</Text>
          <TextInput
            style={styles.input}
            placeholder="Décrivez brièvement votre besoin"
            value={subject}
            onChangeText={setSubject}
            maxLength={200}
          />
        </View>

        <View>
          <Text style={styles.label}>Votre message</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Expliquez votre situation..."
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
            maxLength={5000}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            createConversation.isPending && styles.buttonPending,
          ]}
          onPress={handleCreate}
          disabled={createConversation.isPending}
        >
          <Text style={styles.buttonText}>
            {createConversation.isPending
              ? "Envoi en cours..."
              : "Envoyer le message"}
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
  textArea: {
    minHeight: 150,
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
