import { useState, useRef, useCallback, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useMessages, useSendMessage, useMarkAsRead } from "../../../lib/hooks/useConversations";
import { useAuthStore } from "../../../lib/stores/auth";
import { Send } from "lucide-react-native";
import { MessageBubble } from "../../../components/ui/MessageBubble";
import { theme } from "../../../lib/theme";

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const user = useAuthStore((s) => s.user);
  const [messageText, setMessageText] = useState("");
  const flatListRef = useRef<FlatList>(null);

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMessages(id);

  const sendMessage = useSendMessage(id);
  const markAsRead = useMarkAsRead(id);

  useEffect(() => {
    markAsRead.mutate();
  }, [data]);

  const allMessages = data?.pages.flatMap((p) => p.messages) ?? [];

  const handleSend = useCallback(() => {
    const text = messageText.trim();
    if (!text) return;
    sendMessage.mutate({ content: text });
    setMessageText("");
  }, [messageText, sendMessage]);

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const hasText = messageText.trim().length > 0;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
      keyboardVerticalOffset={88}
    >
      {isLoading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={allMessages}
          keyExtractor={(item) => item.id}
          inverted
          contentContainerStyle={styles.messageList}
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            isFetchingNextPage ? (
              <ActivityIndicator color={theme.colors.primary} style={{ paddingVertical: 16 }} />
            ) : null
          }
          renderItem={({ item }) => {
            const isMe = item.senderId === user?.id;
            return (
              <MessageBubble
                content={item.content}
                isMe={isMe}
                senderName={!isMe ? item.sender.fullName : undefined}
                timestamp={item.createdAt}
                attachmentName={item.attachmentName ?? undefined}
              />
            );
          }}
        />
      )}

      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          placeholder="Votre message..."
          placeholderTextColor={theme.colors.gray[400]}
          value={messageText}
          onChangeText={setMessageText}
          multiline
          textAlignVertical="center"
        />
        <TouchableOpacity
          style={[styles.sendBtn, { backgroundColor: hasText ? theme.colors.primary : theme.colors.gray[400] }]}
          onPress={handleSend}
          disabled={!hasText || sendMessage.isPending}
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
  },
  messageList: {
    padding: 16,
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
