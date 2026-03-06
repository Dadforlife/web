import { useQuery, useMutation, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import api from "../api";

interface Conversation {
  id: string;
  subject: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  father: { id: string; fullName: string };
  volunteer: { id: string; fullName: string } | null;
  unreadCount: number;
  lastMessage: {
    content: string;
    createdAt: string;
    senderRole: string;
  } | null;
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderRole: string;
  isRead: boolean;
  createdAt: string;
  attachmentName?: string;
  attachmentMime?: string;
  attachmentSize?: number;
  sender: { id: string; fullName: string; roles: string[] };
}

export function useConversations(page = 1) {
  return useQuery({
    queryKey: ["conversations", page],
    queryFn: async () => {
      const res = await api.get("/api/messagerie/conversations", {
        params: { page, limit: 20 },
      });
      return res.data as {
        conversations: Conversation[];
        total: number;
        page: number;
        totalPages: number;
      };
    },
    refetchInterval: 15000,
  });
}

export function useMessages(conversationId: string) {
  return useInfiniteQuery({
    queryKey: ["messages", conversationId],
    queryFn: async ({ pageParam }) => {
      const params: Record<string, string> = { limit: "30" };
      if (pageParam) params.cursor = pageParam;
      const res = await api.get(
        `/api/messagerie/conversations/${conversationId}/messages`,
        { params }
      );
      return res.data as {
        messages: Message[];
        hasMore: boolean;
        nextCursor: string | null;
      };
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    refetchInterval: 5000,
  });
}

export function useSendMessage(conversationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { content: string; file?: FormData }) => {
      if (data.file) {
        const res = await api.post(
          `/api/messagerie/conversations/${conversationId}/messages`,
          data.file,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        return res.data;
      }
      const res = await api.post(
        `/api/messagerie/conversations/${conversationId}/messages`,
        { content: data.content }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

export function useCreateConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { subject: string; content: string }) => {
      const res = await api.post("/api/messagerie/conversations", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

export function useMarkAsRead(conversationId: string) {
  return useMutation({
    mutationFn: async () => {
      await api.post(`/api/messagerie/conversations/${conversationId}/read`);
    },
  });
}

export function useUnreadCount() {
  return useQuery({
    queryKey: ["unread-messages"],
    queryFn: async () => {
      const res = await api.get("/api/messagerie/unread-count");
      return res.data.count as number;
    },
    refetchInterval: 15000,
  });
}
