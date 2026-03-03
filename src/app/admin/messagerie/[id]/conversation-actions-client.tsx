"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCheck, Lock, Unlock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  assignVolunteer,
  closeConversation,
  reopenConversation,
} from "../actions";

interface Volunteer {
  id: string;
  fullName: string;
}

interface ConversationActionsProps {
  conversationId: string;
  currentVolunteerId: string | null;
  conversationStatus: string;
  volunteers: Volunteer[];
}

export function ConversationActions({
  conversationId,
  currentVolunteerId,
  conversationStatus,
  volunteers,
}: ConversationActionsProps) {
  const [selectedVolunteer, setSelectedVolunteer] = useState(
    currentVolunteerId || ""
  );
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleAssign = () => {
    if (!selectedVolunteer) return;
    startTransition(async () => {
      try {
        await assignVolunteer(conversationId, selectedVolunteer);
        toast.success("Bénévole assigné avec succès");
        router.refresh();
      } catch {
        toast.error("Erreur lors de l'assignation");
      }
    });
  };

  const handleClose = () => {
    startTransition(async () => {
      try {
        await closeConversation(conversationId);
        toast.success("Conversation fermée");
        router.refresh();
      } catch {
        toast.error("Erreur lors de la fermeture");
      }
    });
  };

  const handleReopen = () => {
    startTransition(async () => {
      try {
        await reopenConversation(conversationId);
        toast.success("Conversation rouverte");
        router.refresh();
      } catch {
        toast.error("Erreur lors de la réouverture");
      }
    });
  };

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="text-base">Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Assign volunteer */}
        <div className="space-y-2">
          <Label className="flex items-center gap-1.5">
            <UserCheck className="h-4 w-4" />
            Assigner un bénévole
          </Label>
          <div className="flex gap-2">
            <Select
              value={selectedVolunteer}
              onValueChange={setSelectedVolunteer}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Choisir un bénévole" />
              </SelectTrigger>
              <SelectContent>
                {volunteers.map((v) => (
                  <SelectItem key={v.id} value={v.id}>
                    {v.fullName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={handleAssign}
              disabled={!selectedVolunteer || isPending}
              size="sm"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Assigner"
              )}
            </Button>
          </div>
        </div>

        {/* Close / Reopen */}
        <div className="pt-2 border-t">
          {conversationStatus === "open" ? (
            <Button
              variant="destructive"
              onClick={handleClose}
              disabled={isPending}
              className="w-full"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Lock className="h-4 w-4 mr-2" />
              )}
              Fermer la conversation
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={handleReopen}
              disabled={isPending}
              className="w-full"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Unlock className="h-4 w-4 mr-2" />
              )}
              Rouvrir la conversation
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
