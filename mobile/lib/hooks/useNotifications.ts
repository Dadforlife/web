import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api";

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  link: string | null;
  isRead: boolean;
  createdAt: string;
}

export function useNotifications(page = 1) {
  return useQuery({
    queryKey: ["notifications", page],
    queryFn: async () => {
      const res = await api.get("/api/notifications", {
        params: { page, limit: 20 },
      });
      return res.data as {
        notifications: Notification[];
        total: number;
        page: number;
        totalPages: number;
      };
    },
    refetchInterval: 30000,
  });
}

export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: ["unread-notifications"],
    queryFn: async () => {
      const res = await api.get("/api/notifications/unread-count");
      return res.data.count as number;
    },
    refetchInterval: 30000,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.patch(`/api/notifications/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread-notifications"] });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await api.patch("/api/notifications/read-all");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread-notifications"] });
    },
  });
}
