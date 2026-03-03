"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import {
  Trash2,
  ShieldBan,
  AlertTriangle,
  Flag,
  User as UserIcon,
} from "lucide-react";
import {
  deleteDiscussion,
  deleteMessage,
  updateDiscussionStatus,
  blockUserFromDiscussion,
} from "../actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Author {
  id: string;
  fullName: string;
  email: string;
  status?: string;
}

interface MessageData {
  id: string;
  content: string;
  isFlagged: boolean;
  createdAt: string;
  author: Author;
}

interface DiscussionData {
  id: string;
  title: string;
  content: string;
  status: string;
  isAnonymous: boolean;
  createdAt: string;
  updatedAt: string;
  reportsCount: number;
  author: Author;
  category: string;
  messages: MessageData[];
}

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  active: { label: "Active", className: "bg-green-100 text-green-800 border-0" },
  flagged: { label: "Signalée", className: "bg-orange-100 text-orange-800 border-0" },
  archived: { label: "Archivée", className: "bg-gray-100 text-gray-600 border-0" },
};

export function DiscussionDetailClient({
  discussion,
}: {
  discussion: DiscussionData;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);
  const [blockDialog, setBlockDialog] = useState<{
    open: boolean;
    userId: string;
    name: string;
  }>({ open: false, userId: "", name: "" });
  const [blockReason, setBlockReason] = useState("");

  const badge = STATUS_BADGE[discussion.status] ?? STATUS_BADGE.active;

  function handleDeleteDiscussion() {
    startTransition(async () => {
      await deleteDiscussion(discussion.id);
      toast.success("Discussion supprimée");
      router.push("/admin/discussions");
    });
  }

  function handleDeleteMessage() {
    if (!messageToDelete) return;
    startTransition(async () => {
      await deleteMessage(messageToDelete);
      toast.success("Message supprimé");
      setMessageToDelete(null);
      router.refresh();
    });
  }

  function handleStatusChange(status: string) {
    startTransition(async () => {
      await updateDiscussionStatus(
        discussion.id,
        status as "active" | "flagged" | "archived",
      );
      toast.success("Statut mis à jour");
      router.refresh();
    });
  }

  function handleBlockUser() {
    if (!blockDialog.userId || !blockReason.trim()) return;
    startTransition(async () => {
      await blockUserFromDiscussion(blockDialog.userId, blockReason);
      toast.success("Utilisateur suspendu");
      setBlockDialog({ open: false, userId: "", name: "" });
      setBlockReason("");
      router.refresh();
    });
  }

  return (
    <>
      {/* Discussion info */}
      <Card className="rounded-2xl">
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-lg">{discussion.title}</CardTitle>
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <UserIcon className="h-3.5 w-3.5" />
                {discussion.isAnonymous
                  ? "Anonyme"
                  : discussion.author.fullName || discussion.author.email}
              </span>
              <span>·</span>
              <span>{discussion.category}</span>
              <span>·</span>
              <span>{discussion.createdAt}</span>
              {discussion.reportsCount > 0 && (
                <>
                  <span>·</span>
                  <span className="flex items-center gap-1 text-orange-600">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    {discussion.reportsCount} signalement(s)
                  </span>
                </>
              )}
            </div>
          </div>
          <Badge className={badge.className}>{badge.label}</Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="whitespace-pre-wrap text-sm leading-relaxed">
            {discussion.content}
          </p>

          <div className="flex flex-wrap gap-2 border-t pt-4">
            <Select
              defaultValue={discussion.status}
              onValueChange={handleStatusChange}
              disabled={isPending}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="flagged">Signalée</SelectItem>
                <SelectItem value="archived">Archivée</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              className="text-orange-600 hover:text-orange-700"
              disabled={isPending}
              onClick={() =>
                setBlockDialog({
                  open: true,
                  userId: discussion.author.id,
                  name: discussion.author.fullName || discussion.author.email,
                })
              }
            >
              <ShieldBan className="mr-1.5 h-4 w-4" />
              Suspendre l&apos;auteur
            </Button>

            <Button
              variant="destructive"
              size="sm"
              disabled={isPending}
              onClick={() => setConfirmDelete(true)}
            >
              <Trash2 className="mr-1.5 h-4 w-4" />
              Supprimer la discussion
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Messages */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg">
            Messages ({discussion.messages.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {discussion.messages.length === 0 ? (
            <p className="text-muted-foreground py-4 text-center">
              Aucun message dans cette discussion.
            </p>
          ) : (
            discussion.messages.map((m) => (
              <div
                key={m.id}
                className="rounded-lg border p-4 space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">
                      {m.author.fullName || m.author.email}
                    </span>
                    <span className="text-muted-foreground">{m.createdAt}</span>
                    {m.isFlagged && (
                      <Badge className="bg-orange-100 text-orange-800 border-0">
                        <Flag className="mr-1 h-3 w-3" />
                        Signalé
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-orange-600 hover:text-orange-700"
                      disabled={isPending}
                      onClick={() =>
                        setBlockDialog({
                          open: true,
                          userId: m.author.id,
                          name: m.author.fullName || m.author.email,
                        })
                      }
                    >
                      <ShieldBan className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-destructive hover:text-destructive"
                      disabled={isPending}
                      onClick={() => setMessageToDelete(m.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm whitespace-pre-wrap leading-relaxed">
                  {m.content}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Confirm delete discussion */}
      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Supprimer cette discussion ?"
        description="Cette action est irréversible. La discussion et tous ses messages seront définitivement supprimés."
        confirmLabel="Supprimer"
        variant="destructive"
        loading={isPending}
        onConfirm={handleDeleteDiscussion}
      />

      {/* Confirm delete message */}
      <ConfirmDialog
        open={messageToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setMessageToDelete(null);
        }}
        title="Supprimer ce message ?"
        description="Ce message sera définitivement supprimé."
        confirmLabel="Supprimer"
        variant="destructive"
        loading={isPending}
        onConfirm={handleDeleteMessage}
      />

      {/* Block user dialog */}
      <ConfirmDialog
        open={blockDialog.open}
        onOpenChange={(open) => {
          if (!open) {
            setBlockDialog({ open: false, userId: "", name: "" });
            setBlockReason("");
          }
        }}
        title={`Suspendre ${blockDialog.name} ?`}
        description="L'utilisateur ne pourra plus accéder à la plateforme. Indiquez la raison de la suspension."
        confirmLabel="Suspendre"
        variant="destructive"
        loading={isPending}
        onConfirm={handleBlockUser}
      >
        <Input
          placeholder="Raison de la suspension…"
          value={blockReason}
          onChange={(e) => setBlockReason(e.target.value)}
          className="mt-2"
        />
      </ConfirmDialog>
    </>
  );
}
