"use client";

import { useState, useTransition } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  acceptAppointmentRequest,
  refuseAppointmentRequest,
} from "../actions";
import {
  MapPin,
  Phone,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  MessageCircle,
  User,
  Inbox,
  Mail,
  Navigation,
  Tag,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const REASON_LABELS: Record<string, string> = {
  tribunal_jaf: "Tribunal (audience JAF)",
  commissariat: "Commissariat (plainte, main courante)",
  passage_bras: "Passage de bras (échange de garde)",
  gare: "Gare",
  demenagement: "Déménagement",
  point_rencontre: "Point rencontre",
  expertise_psy_sociale: "Expertise psy / sociale",
  autre: "Autre motif",
};

interface Request {
  id: string;
  type: string;
  reason: string | null;
  message: string | null;
  city: string | null;
  location: string | null;
  phone: string | null;
  preferredDate: string | null;
  status: string;
  responseNote: string | null;
  parentName: string;
  parentEmail: string;
  parentPhone: string | null;
  parentRole: string;
  volunteerName: string | null;
  createdAt: string;
}

type ActionType = "accept" | "refuse";

export function DemandesBenevoleContent({
  requests,
}: {
  requests: Request[];
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [actionType, setActionType] = useState<ActionType>("accept");
  const [note, setNote] = useState("");
  const [filter, setFilter] = useState<"en_attente" | "all">("en_attente");

  const filtered =
    filter === "en_attente"
      ? requests.filter((r) => r.status === "en_attente")
      : requests;

  function openDialog(request: Request, action: ActionType) {
    setSelectedRequest(request);
    setActionType(action);
    setNote("");
    setDialogOpen(true);
  }

  function handleConfirm() {
    if (!selectedRequest) return;
    startTransition(async () => {
      try {
        if (actionType === "accept") {
          await acceptAppointmentRequest(selectedRequest.id, note || undefined);
          toast.success("Demande acceptée !");
        } else {
          await refuseAppointmentRequest(selectedRequest.id, note || undefined);
          toast.success("Demande refusée.");
        }
        setDialogOpen(false);
        router.refresh();
      } catch {
        toast.error("Erreur lors du traitement.");
      }
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Demandes de rendez-vous
        </h1>
        <p className="text-muted-foreground mt-1">
          Consultez et répondez aux demandes de rendez-vous des parents.
        </p>
      </div>

      <div className="flex gap-2">
        <Button
          variant={filter === "en_attente" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("en_attente")}
        >
          <Inbox className="h-4 w-4 mr-1" />
          En attente
          {requests.filter((r) => r.status === "en_attente").length > 0 && (
            <Badge variant="secondary" className="ml-2 px-1.5 py-0 text-xs">
              {requests.filter((r) => r.status === "en_attente").length}
            </Badge>
          )}
        </Button>
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
        >
          Toutes
        </Button>
      </div>

      {filtered.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Inbox className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">
              {filter === "en_attente"
                ? "Aucune demande en attente."
                : "Aucune demande de rendez-vous."}
            </p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {filtered.map((r) => (
          <RequestCard
            key={r.id}
            request={r}
            onAccept={() => openDialog(r, "accept")}
            onRefuse={() => openDialog(r, "refuse")}
            isPending={isPending}
          />
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>
              {actionType === "accept"
                ? "Accepter la demande"
                : "Refuser la demande"}
            </DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4 pt-2">
              <p className="text-sm text-muted-foreground">
                {actionType === "accept"
                  ? `Vous allez accepter la demande de ${selectedRequest.parentName}. Un email de confirmation lui sera envoyé.`
                  : `Vous allez refuser la demande de ${selectedRequest.parentName}. Un email d'information lui sera envoyé.`}
              </p>
              <div className="space-y-2">
                <Label>
                  {actionType === "accept"
                    ? "Message pour le parent (optionnel)"
                    : "Motif du refus (optionnel)"}
                </Label>
                <Textarea
                  placeholder={
                    actionType === "accept"
                      ? "Ex: Je vous contacterai lundi pour fixer un créneau..."
                      : "Ex: Je ne suis pas disponible cette semaine..."
                  }
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  className="flex-1"
                >
                  Annuler
                </Button>
                <Button
                  variant={actionType === "accept" ? "default" : "destructive"}
                  onClick={handleConfirm}
                  disabled={isPending}
                  className="flex-1"
                >
                  {isPending && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  {actionType === "accept" ? "Accepter" : "Refuser"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function RequestCard({
  request,
  onAccept,
  onRefuse,
  isPending,
}: {
  request: Request;
  onAccept: () => void;
  onRefuse: () => void;
  isPending?: boolean;
}) {
  const isPendingStatus = request.status === "en_attente";
  const isAccepted = request.status === "accepte";
  const isRefused = request.status === "refuse";
  const roleLabel =
    request.parentRole === "maman_demande" ? "Maman" : "Papa";
  const reasonLabel = request.reason
    ? REASON_LABELS[request.reason] || request.reason
    : null;

  return (
    <Card
      className={
        isAccepted
          ? "border-green-200 bg-green-50/50 dark:border-green-900 dark:bg-green-950/20"
          : isRefused
          ? "border-red-200 bg-red-50/30 dark:border-red-900 dark:bg-red-950/10"
          : undefined
      }
    >
      <CardContent className="py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-sm flex items-center gap-1">
                <User className="h-3.5 w-3.5" />
                {request.parentName}
              </span>
              <Badge variant="outline" className="text-xs">
                {roleLabel}
              </Badge>
              {request.type === "accompagnement_terrain" ? (
                <Badge variant="outline" className="gap-1">
                  <MapPin className="h-3 w-3" /> Terrain
                </Badge>
              ) : (
                <Badge variant="outline" className="gap-1">
                  <Phone className="h-3 w-3" /> Téléphonique
                </Badge>
              )}
              {reasonLabel && (
                <Badge variant="secondary" className="gap-1 text-xs">
                  <Tag className="h-3 w-3" />
                  {reasonLabel}
                </Badge>
              )}
              {isAccepted && (
                <Badge variant="default" className="gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Acceptée
                </Badge>
              )}
              {isRefused && (
                <Badge variant="destructive" className="gap-1">
                  <XCircle className="h-3 w-3" /> Refusée
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {new Date(request.createdAt).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              {request.preferredDate && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Souhaité le{" "}
                  {new Date(request.preferredDate).toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </span>
              )}
              {request.city && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {request.city}
                </span>
              )}
            </div>

            {request.location && (
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Navigation className="h-3.5 w-3.5" />
                {request.location}
              </p>
            )}

            {(request.parentPhone || request.parentEmail) && (
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                {request.parentPhone && (
                  <span className="flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5" />
                    {request.parentPhone}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" />
                  {request.parentEmail}
                </span>
              </div>
            )}

            {request.message && (
              <p className="text-sm flex items-start gap-1">
                <MessageCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                {request.message}
              </p>
            )}

            {isAccepted && request.volunteerName && (
              <p className="text-sm font-medium text-green-700 dark:text-green-400 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Prise en charge par {request.volunteerName}
              </p>
            )}

            {request.responseNote && (
              <p className="text-sm text-muted-foreground italic">
                Note : {request.responseNote}
              </p>
            )}
          </div>

          {isPendingStatus && (
            <div className="flex gap-2 shrink-0">
              <Button
                size="sm"
                onClick={onAccept}
                disabled={isPending}
                title="Accepter"
              >
                <CheckCircle2 className="h-4 w-4 mr-1" />
                Accepter
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onRefuse}
                disabled={isPending}
                title="Refuser"
              >
                <XCircle className="h-4 w-4 mr-1" />
                Refuser
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
