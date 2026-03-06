import { View, Text, StyleSheet } from "react-native";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { theme } from "../../lib/theme";

interface MessageBubbleProps {
  content: string;
  isMe: boolean;
  senderName?: string;
  timestamp: string;
  attachmentName?: string;
}

export function MessageBubble({
  content,
  isMe,
  senderName,
  timestamp,
  attachmentName,
}: MessageBubbleProps) {
  return (
    <View style={[styles.wrapper, isMe ? styles.wrapperMe : styles.wrapperOther]}>
      {!isMe && senderName && (
        <Text style={styles.senderName}>{senderName}</Text>
      )}
      <View
        style={[
          styles.bubble,
          isMe ? styles.bubbleMe : styles.bubbleOther,
        ]}
      >
        <Text style={[styles.content, isMe ? styles.contentMe : styles.contentOther]}>
          {content}
        </Text>
        {attachmentName && (
          <Text style={[styles.attachment, isMe ? styles.attachmentMe : styles.attachmentOther]}>
            📎 {attachmentName}
          </Text>
        )}
      </View>
      <Text style={[styles.timestamp, isMe ? styles.timestampMe : styles.timestampOther]}>
        {formatDistanceToNow(new Date(timestamp), {
          addSuffix: true,
          locale: fr,
        })}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    maxWidth: "80%",
    marginBottom: 4,
  },
  wrapperMe: {
    alignSelf: "flex-end",
  },
  wrapperOther: {
    alignSelf: "flex-start",
  },
  senderName: {
    fontSize: 12,
    color: theme.colors.gray[500],
    marginBottom: 2,
    marginLeft: 4,
  },
  bubble: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  bubbleMe: {
    backgroundColor: theme.colors.primary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  bubbleOther: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.gray[200],
  },
  content: {
    fontSize: 14,
    lineHeight: 20,
  },
  contentMe: {
    color: "#fff",
  },
  contentOther: {
    color: theme.colors.gray[900],
  },
  attachment: {
    fontSize: 12,
    marginTop: 4,
  },
  attachmentMe: {
    color: "#bfdbfe",
  },
  attachmentOther: {
    color: theme.colors.gray[500],
  },
  timestamp: {
    fontSize: 10,
    color: theme.colors.gray[400],
    marginTop: 2,
  },
  timestampMe: {
    textAlign: "right",
    marginRight: 4,
  },
  timestampOther: {
    marginLeft: 4,
  },
});
