"use client";

import { useState, useTransition } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  createAppointmentRequest,
  cancelAppointmentRequest,
} from "./actions";
import {
  Plus,
  MapPin,
  Phone,
  Calendar,
  Clock,
  XCircle,
  CheckCircle2,
  Loader2,
  MessageCircle,
  User,
  Gavel,
  Shield,
  Users,
  Train,
  Truck,
  Heart,
  Brain,
  HelpCircle,
  Navigation,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
  volunteerName: string | null;
  createdAt: string;
}

const statusConfig: Record<
  string,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  en_attente: { label: "En attente", variant: "secondary" },
  accepte: { label: "Acceptée", variant: "default" },
  refuse: { label: "Refusée", variant: "destructive" },
  annule: { label: "Annulée", variant: "outline" },
};

const REASON_OPTIONS = [
  {
    group: "Judiciaire",
    items: [
      { value: "tribunal_jaf", label: "Tribunal (audience JAF)", icon: Gavel },
      { value: "commissariat", label: "Commissariat (plainte, main courante)", icon: Shield },
    ],
  },
  {
    group: "Quotidien",
    items: [
      { value: "passage_bras", label: "Passage de bras (échange de garde)", icon: Users },
      { value: "gare", label: "Gare", icon: Train },
      { value: "demenagement", label: "Déménagement", icon: Truck },
    ],
  },
  {
    group: "Social",
    items: [
      { value: "point_rencontre", label: "Point rencontre", icon: Heart },
      { value: "expertise_psy_sociale", label: "Expertise psy / sociale", icon: Brain },
    ],
  },
  {
    group: "Autre",
    items: [{ value: "autre", label: "Autre motif", icon: HelpCircle }],
  },
];

const REASON_LABELS: Record<string, string> = {};
REASON_OPTIONS.forEach((g) =>
  g.items.forEach((i) => {
    REASON_LABELS[i.value] = i.label;
  })
);

export function DemandeRdvContent({
  requests,
  userPhone,
  userCity,
}: {
  requests: Request[];
  userPhone: string | null;
  userCity: string | null;
  userName: string;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [type, setType] = useState<"accompagnement_terrain" | "telephonique">(
    "telephonique"
  );
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [city, setCity] = useState(userCity || "");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState(userPhone || "");
  const [preferredDate, setPreferredDate] = useState("");

  const isTerrain = type === "accompagnement_terrain";

  function resetForm() {
    setType("telephonique");
    setReason("");
    setMessage("");
    setCity(userCity || "");
    setLocation("");
    setPhone(userPhone || "");
    setPreferredDate("");
  }

  function handleSubmit() {
    if (isTerrain && !reason) {
      toast.error("Veuillez sélectionner un motif d'intervention.");
      return;
    }
    if (isTerrain && !city) {
      toast.error("Veuillez indiquer votre ville.");
      return;
    }
    if (!phone) {
      toast.error("Veuillez indiquer votre numéro de téléphone.");
      return;
    }

    startTransition(async () => {
      try {
        await createAppointmentRequest({
          type,
          reason: isTerrain ? reason || undefined : undefined,
          message: message || undefined,
          city: isTerrain ? city || undefined : undefined,
          location: isTerrain ? location || undefined : undefined,
          phone: phone || undefined,
          preferredDate: preferredDate || undefined,
        });
        toast.success("Demande envoyée avec succès !");
        setOpen(false);
        resetForm();
        router.refresh();
      } catch {
        toast.error("Erreur lors de l'envoi de la demande.");
      }
    });
  }

  function handleCancel(id: string) {
    startTransition(async () => {
      try {
        await cancelAppointmentRequest(id);
        toast.success("Demande annulée.");
        router.refresh();
      } catch {
        toast.error("Erreur lors de l'annulation.");
      }
    });
  }

  const pending = requests.filter((r) => r.status === "en_attente");
  const others = requests.filter((r) => r.status !== "en_attente");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Demande de rendez-vous
          </h1>
          <p className="text-muted-foreground mt-1">
            Demandez un accompagnement terrain ou un appel téléphonique avec un
            bénévole.
          </p>
        </div>
        <Dialog
          open={open}
          onOpenChange={(v) => {
            setOpen(v);
            if (v) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle demande
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Demander un rendez-vous</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              {/* Type de rendez-vous */}
              <div className="space-y-2">
                <Label>Type de rendez-vous</Label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setType("telephonique")}
                    className={`flex items-center gap-2 rounded-lg border p-3 text-sm font-medium transition-colors ${
                      !isTerrain
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <Phone className="h-4 w-4" />
                    Téléphonique
                  </button>
                  <button
                    type="button"
                    onClick={() => setType("accompagnement_terrain")}
                    className={`flex items-center gap-2 rounded-lg border p-3 text-sm font-medium transition-colors ${
                      isTerrain
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <MapPin className="h-4 w-4" />
                    Terrain
                  </button>
                </div>
              </div>

              {/* Téléphone (pré-rempli) */}
              <div className="space-y-2">
                <Label>
                  Téléphone <span className="text-destructive">*</span>
                </Label>
                <Input
                  type="tel"
                  placeholder="06 12 34 56 78"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                {userPhone && phone === userPhone && (
                  <p className="text-xs text-muted-foreground">
                    Pré-rempli depuis votre profil
                  </p>
                )}
              </div>

              {/* Motif d'intervention terrain */}
              {isTerrain && (
                <>
                  <div className="space-y-2">
                    <Label>
                      Motif de l&apos;intervention{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Select value={reason} onValueChange={setReason}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un motif..." />
                      </SelectTrigger>
                      <SelectContent>
                        {REASON_OPTIONS.map((group) => (
                          <SelectGroup key={group.group}>
                            <SelectLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
                              {group.group}
                            </SelectLabel>
                            {group.items.map((item) => (
                              <SelectItem key={item.value} value={item.value}>
                                <span className="flex items-center gap-2">
                                  <item.icon className="h-4 w-4 shrink-0" />
                                  {item.label}
                                </span>
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>
                      Ville <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      placeholder="Votre ville"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                    {userCity && city === userCity && (
                      <p className="text-xs text-muted-foreground">
                        Pré-rempli depuis vos informations
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>
                      Adresse précise / lieu{" "}
                      <span className="text-xs text-muted-foreground font-normal">
                        (optionnel)
                      </span>
                    </Label>
                    <Input
                      placeholder={
                        reason === "tribunal_jaf"
                          ? "Ex: Tribunal judiciaire de Paris, 29 rue de Cambrai"
                          : reason === "commissariat"
                          ? "Ex: Commissariat du 11e arrondissement"
                          : reason === "gare"
                          ? "Ex: Gare de Lyon, hall 1"
                          : "Adresse du lieu de rendez-vous"
                      }
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                </>
              )}

              {/* Date souhaitée */}
              <div className="space-y-2">
                <Label>
                  Date souhaitée{" "}
                  <span className="text-xs text-muted-foreground font-normal">
                    (optionnel)
                  </span>
                </Label>
                <Input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label>
                  {isTerrain ? "Détails supplémentaires" : "Message"}{" "}
                  <span className="text-xs text-muted-foreground font-normal">
                    (optionnel)
                  </span>
                </Label>
                <Textarea
                  placeholder={
                    isTerrain
                      ? "Décrivez brièvement la situation et vos besoins pour cette intervention..."
                      : "Décrivez brièvement votre situation ou le sujet de l'appel..."
                  }
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                />
              </div>

              <Button
                onClick={handleSubmit}
                disabled={isPending}
                className="w-full"
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                Envoyer la demande
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {requests.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">
              Vous n&apos;avez pas encore de demande de rendez-vous.
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Cliquez sur &quot;Nouvelle demande&quot; pour commencer.
            </p>
          </CardContent>
        </Card>
      )}

      {pending.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">En attente</h2>
          {pending.map((r) => (
            <RequestCard
              key={r.id}
              request={r}
              onCancel={handleCancel}
              isPending={isPending}
            />
          ))}
        </div>
      )}

      {others.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Historique</h2>
          {others.map((r) => (
            <RequestCard key={r.id} request={r} isPending={isPending} />
          ))}
        </div>
      )}
    </div>
  );
}

function RequestCard({
  request,
  onCancel,
  isPending,
}: {
  request: Request;
  onCancel?: (id: string) => void;
  isPending?: boolean;
}) {
  const config = statusConfig[request.status] || statusConfig.en_attente;
  const isAccepted = request.status === "accepte";
  const isPendingStatus = request.status === "en_attente";
  const reasonLabel = request.reason
    ? REASON_LABELS[request.reason] || request.reason
    : null;

  return (
    <Card
      className={
        isAccepted
          ? "border-green-200 bg-green-50/50 dark:border-green-900 dark:bg-green-950/20"
          : undefined
      }
    >
      <CardContent className="py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
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
                <Badge variant="outline" className="gap-1 text-xs">
                  {reasonLabel}
                </Badge>
              )}
              <Badge variant={config.variant}>{config.label}</Badge>
              <span className="text-xs text-muted-foreground">
                <Clock className="h-3 w-3 inline mr-1" />
                {new Date(request.createdAt).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>

            {request.preferredDate && (
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                Date souhaitée :{" "}
                {new Date(request.preferredDate).toLocaleDateString("fr-FR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </p>
            )}

            {request.city && (
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {request.city}
                {request.location && ` — ${request.location}`}
              </p>
            )}

            {!request.city && request.location && (
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Navigation className="h-3.5 w-3.5" />
                {request.location}
              </p>
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
                Acceptée par {request.volunteerName}
              </p>
            )}

            {request.responseNote && (
              <p className="text-sm text-muted-foreground italic flex items-start gap-1">
                <User className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                {request.responseNote}
              </p>
            )}
          </div>

          {isPendingStatus && onCancel && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onCancel(request.id)}
              disabled={isPending}
              title="Annuler la demande"
              className="text-muted-foreground hover:text-destructive shrink-0"
            >
              <XCircle className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
