import { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../../lib/api";
import { Send } from "lucide-react-native";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { theme } from "../../../../lib/theme";

interface DiscussionDetail {
  id: string;
  title: string;
  content: string;
  authorName: string;
  isAnonymous: boolean;
  createdAt: string;
  messages: Array<{
    id: string;
    content: string;
    authorName: string;
    createdAt: string;
  }>;
}

export default function DiscussionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [reply, setReply] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["forum-discussion", id],
    queryFn: async () => {
      const res = await api.get(`/api/mobile/forum/discussions/${id}`);
      return res.data as DiscussionDetail;
    },
  });

  const sendReply = useMutation({
    mutationFn: async (content: string) => {
      await api.post(`/api/mobile/forum/discussions/${id}/messages`, {
        content,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forum-discussion", id] });
      setReply("");
    },
    onError: (err: any) => {
      Alert.alert(
        "Erreur",
        err?.response?.data?.error || "Impossible d'envoyer la réponse."
      );
    },
  });

  const handleSend = useCallback(() => {
    const text = reply.trim();
    if (text.length < 3) {
      Alert.alert("Erreur", "La réponse doit contenir au moins 3 caractères.");
      return;
    }
    sendReply.mutate(text);
  }, [reply, sendReply]);

  const hasText = reply.trim().length > 0;

  if (isLoading || !data) {
    return (
      <View style={styles.loadingBox}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
      keyboardVerticalOffset={88}
    >
      <FlatList
        data={data.messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.headerCard}>
            <Text style={styles.headerTitle}>{data.title}</Text>
            <Text style={styles.headerMeta}>
              Par {data.isAnonymous ? "Anonyme" : data.authorName} •{" "}
              {formatDistanceToNow(new Date(data.createdAt), {
                addSuffix: true,
                locale: fr,
              })}
            </Text>
            <Text style={styles.headerContent}>{data.content}</Text>
          </View>
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Aucune réponse pour l'instant
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.replyCard}>
            <View style={styles.replyHeader}>
              <Text style={styles.replyAuthor}>{item.authorName}</Text>
              <Text style={styles.replyTime}>
                {formatDistanceToNow(new Date(item.createdAt), {
                  addSuffix: true,
                  locale: fr,
                })}
              </Text>
            </View>
            <Text style={styles.replyContent}>{item.content}</Text>
          </View>
        )}
      />

      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          placeholder="Votre réponse..."
          placeholderTextColor={theme.colors.gray[400]}
          value={reply}
          onChangeText={setReply}
          multiline
        />
        <TouchableOpacity
          style={[
            styles.sendBtn,
            { backgroundColor: hasText ? theme.colors.primary : theme.colors.gray[400] },
          ]}
          onPress={handleSend}
          disabled={!hasText || sendReply.isPending}
        >
          <Send size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  loadingBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surface,
  },
  listContent: {
    padding: 16,
  },
  headerCard: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.gray[200],
    borderRadius: theme.spacing.borderRadiusLg,
    padding: 20,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.gray[900],
  },
  headerMeta: {
    fontSize: 12,
    color: theme.colors.gray[500],
    marginTop: 4,
  },
  headerContent: {
    fontSize: 14,
    color: theme.colors.gray[700],
    marginTop: 12,
    lineHeight: 20,
  },
  emptyText: {
    color: theme.colors.gray[400],
    textAlign: "center",
    paddingVertical: 32,
    fontSize: 16,
  },
  replyCard: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.gray[100],
    borderRadius: theme.spacing.borderRadius,
    padding: 16,
    marginBottom: 8,
  },
  replyHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  replyAuthor: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.gray[900],
  },
  replyTime: {
    fontSize: 12,
    color: theme.colors.gray[400],
  },
  replyContent: {
    fontSize: 14,
    color: theme.colors.gray[700],
    lineHeight: 20,
  },
  inputBar: {
    backgroundColor: theme.colors.white,
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray[200],
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  input: {
    flex: 1,
    backgroundColor: theme.colors.gray[100],
    borderRadius: theme.spacing.borderRadius,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 96,
    marginRight: 8,
    color: theme.colors.gray[900],
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
