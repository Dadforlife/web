"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import {
  AlertTriangle,
  Ban,
  Trash2,
  XCircle,
} from "lucide-react";
import {
  warnUser,
  suspendFromReport,
  deleteReportedContent,
  dismissReport,
} from "../actions";

interface ReportActionsClientProps {
  reportId: string;
  userId?: string;
  hasDiscussion: boolean;
  hasMessage: boolean;
}

type DialogType = "warn" | "suspend" | "delete" | "dismiss" | null;

export function ReportActionsClient({
  reportId,
  userId,
  hasDiscussion,
  hasMessage,
}: ReportActionsClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [openDialog, setOpenDialog] = useState<DialogType>(null);
  const [suspendReason, setSuspendReason] = useState("");

  function handleConfirm() {
    startTransition(async () => {
      switch (openDialog) {
        case "warn":
          if (userId) await warnUser(reportId, userId);
          break;
        case "suspend":
          if (userId) {
            await suspendFromReport(
              reportId,
              userId,
              suspendReason || "Suspension suite à un signalement.",
            );
          }
          break;
        case "delete":
          await deleteReportedContent(reportId);
          break;
        case "dismiss":
          await dismissReport(reportId);
          break;
      }
      setOpenDialog(null);
      setSuspendReason("");
      router.refresh();
    });
  }

  const hasContent = hasDiscussion || hasMessage;

  return (
    <>
      <div className="flex flex-wrap gap-3">
        {userId && (
          <Button
            variant="outline"
            className="border-yellow-300 text-yellow-700 hover:bg-yellow-50"
            onClick={() => setOpenDialog("warn")}
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Avertir
          </Button>
        )}

        {userId && (
          <Button
            variant="outline"
            className="border-red-300 text-red-700 hover:bg-red-50"
            onClick={() => setOpenDialog("suspend")}
          >
            <Ban className="h-4 w-4 mr-2" />
            Suspendre l&apos;auteur
          </Button>
        )}

        {hasContent && (
          <Button
            variant="outline"
            className="border-red-300 text-red-700 hover:bg-red-50"
            onClick={() => setOpenDialog("delete")}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Supprimer le contenu
          </Button>
        )}

        <Button
          variant="outline"
          onClick={() => setOpenDialog("dismiss")}
        >
          <XCircle className="h-4 w-4 mr-2" />
          Rejeter le signalement
        </Button>
      </div>

      {/* Warn dialog */}
      <ConfirmDialog
        open={openDialog === "warn"}
        onOpenChange={(open) => !open && setOpenDialog(null)}
        title="Avertir l'auteur"
        description="Un avertissement sera enregistré pour l'auteur de ce contenu. L'auteur sera notifié."
        confirmLabel="Envoyer l'avertissement"
        variant="default"
        loading={isPending}
        onConfirm={handleConfirm}
      />

      {/* Suspend dialog */}
      <ConfirmDialog
        open={openDialog === "suspend"}
        onOpenChange={(open) => {
          if (!open) {
            setOpenDialog(null);
            setSuspendReason("");
          }
        }}
        title="Suspendre l'auteur"
        description="Le compte de l'auteur sera suspendu. Il ne pourra plus accéder à la plateforme."
        confirmLabel="Suspendre le compte"
        variant="destructive"
        loading={isPending}
        onConfirm={handleConfirm}
      >
        <Textarea
          placeholder="Raison de la suspension (optionnel)"
          value={suspendReason}
          onChange={(e) => setSuspendReason(e.target.value)}
          className="mt-4"
          rows={3}
        />
      </ConfirmDialog>

      {/* Delete content dialog */}
      <ConfirmDialog
        open={openDialog === "delete"}
        onOpenChange={(open) => !open && setOpenDialog(null)}
        title="Supprimer le contenu"
        description={`${hasDiscussion ? "La discussion" : "Le message"} signalé(e) sera définitivement supprimé(e). Cette action est irréversible.`}
        confirmLabel="Supprimer"
        variant="destructive"
        loading={isPending}
        onConfirm={handleConfirm}
      />

      {/* Dismiss dialog */}
      <ConfirmDialog
        open={openDialog === "dismiss"}
        onOpenChange={(open) => !open && setOpenDialog(null)}
        title="Rejeter le signalement"
        description="Le signalement sera marqué comme rejeté. Aucune action ne sera prise contre l'auteur."
        confirmLabel="Rejeter"
        variant="default"
        loading={isPending}
        onConfirm={handleConfirm}
      />
    </>
  );
}
