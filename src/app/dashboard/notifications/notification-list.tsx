"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  link: string | null;
  isRead: boolean;
  createdAt: string;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getTypeIcon(type: string) {
  if (type.startsWith("forum.")) return "💬";
  if (type.startsWith("account.")) return "👤";
  if (type.startsWith("community.")) return "🤝";
  if (type.startsWith("programme.")) return "📚";
  if (type.startsWith("admin.")) return "⚙️";
  if (type.startsWith("engagement.")) return "🔔";
  return "📩";
}

export function NotificationList({
  initialNotifications,
}: {
  initialNotifications: Notification[];
}) {
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAsRead = async (id: string) => {
    await fetch(`/api/notifications/${id}/read`, { method: "PATCH" });
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = async () => {
    await fetch("/api/notifications/read-all", { method: "PATCH" });
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <>
      {unreadCount > 0 && (
        <div className="flex justify-end mb-4">
          <button
            onClick={markAllAsRead}
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 font-medium transition-colors"
          >
            <CheckCheck className="h-4 w-4" />
            Tout marquer comme lu ({unreadCount})
          </button>
        </div>
      )}

      <div className="bg-background rounded-xl border border-border/60 overflow-hidden">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Bell className="h-10 w-10 mb-3 opacity-30" />
            <p className="text-sm font-medium">Aucune notification</p>
            <p className="text-xs mt-1">
              Vous serez notifié quand il se passera quelque chose.
            </p>
          </div>
        ) : (
          notifications.map((notif, i) => {
            const content = (
              <div
                className={cn(
                  "flex gap-3 px-5 py-4 transition-colors cursor-pointer",
                  !notif.isRead && "bg-primary/[0.03]",
                  i < notifications.length - 1 && "border-b border-border/30"
                )}
                onClick={() => {
                  if (!notif.isRead) markAsRead(notif.id);
                }}
              >
                <span className="text-xl shrink-0 mt-0.5">
                  {getTypeIcon(notif.type)}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p
                      className={cn(
                        "text-sm leading-tight",
                        !notif.isRead
                          ? "font-semibold text-foreground"
                          : "font-medium text-muted-foreground"
                      )}
                    >
                      {notif.title}
                    </p>
                    {!notif.isRead && (
                      <span className="h-2.5 w-2.5 rounded-full bg-primary shrink-0 mt-1" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {notif.body}
                  </p>
                  <p className="text-xs text-muted-foreground/70 mt-1.5">
                    {formatDate(notif.createdAt)}
                  </p>
                </div>
              </div>
            );

            if (notif.link) {
              return (
                <Link key={notif.id} href={notif.link}>
                  {content}
                </Link>
              );
            }

            return <div key={notif.id}>{content}</div>;
          })
        )}
      </div>
    </>
  );
}
