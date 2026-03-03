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
  SelectItem,
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
  createAppointment,
  updateAppointmentStatus,
  deleteAppointment,
} from "../actions";
import {
  Plus,
  MapPin,
  Phone,
  CheckCircle2,
  XCircle,
  Trash2,
  CalendarCheck,
  User,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Appointment {
  id: string;
  type: string;
  scheduledAt: string;
  duration: number;
  status: string;
  location: string | null;
  notes: string | null;
  createdAt: string;
  father: { id: string; fullName: string };
}

const TYPE_CONFIG: Record<string, { label: string; icon: typeof MapPin; color: string }> = {
  accompagnement_terrain: {
    label: "Accompagnement terrain",
    icon: MapPin,
    color: "bg-blue-100 text-blue-700 border-blue-200",
  },
  telephonique: {
    label: "Telephonique",
    icon: Phone,
    color: "bg-purple-100 text-purple-700 border-purple-200",
  },
};

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  a_venir: { label: "A venir", color: "bg-blue-100 text-blue-700 border-blue-200" },
  termine: { label: "Termine", color: "bg-green-100 text-green-700 border-green-200" },
  annule: { label: "Annule", color: "bg-gray-100 text-gray-500 border-gray-200" },
};

export function AppointmentList({
  appointments,
  assignedPapas,
}: {
  appointments: Appointment[];
  assignedPapas: { id: string; fullName: string }[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [filter, setFilter] = useState<"a_venir" | "all" | "past">("a_venir");
  const [dialogOpen, setDialogOpen] = useState(false);

  // Form state
  const [formFatherId, setFormFatherId] = useState(assignedPapas[0]?.id || "");
  const [formType, setFormType] = useState<"accompagnement_terrain" | "telephonique">("accompagnement_terrain");
  const [formDate, setFormDate] = useState("");
  const [formTime, setFormTime] = useState("10:00");
  const [formDuration, setFormDuration] = useState("60");
  const [formLocation, setFormLocation] = useState("");
  const [formNotes, setFormNotes] = useState("");

  const now = new Date().toISOString();

  const filtered = appointments.filter((a) => {
    if (filter === "a_venir") return a.status === "a_venir" && a.scheduledAt >= now;
    if (filter === "past") return a.status !== "a_venir" || a.scheduledAt < now;
    return true;
  });

  function resetForm() {
    setFormFatherId(assignedPapas[0]?.id || "");
    setFormType("accompagnement_terrain");
    setFormDate("");
    setFormTime("10:00");
    setFormDuration("60");
    setFormLocation("");
    setFormNotes("");
  }

  function handleCreate() {
    if (!formFatherId || !formDate || !formTime) {
      toast.error("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const scheduledAt = `${formDate}T${formTime}:00`;

    startTransition(async () => {
      try {
        await createAppointment({
          fatherId: formFatherId,
          type: formType,
          scheduledAt,
          duration: parseInt(formDuration),
          location: formType === "accompagnement_terrain" ? formLocation.trim() || undefined : undefined,
          notes: formNotes.trim() || undefined,
        });
        toast.success("Rendez-vous cree");
        setDialogOpen(false);
        resetForm();
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Erreur.");
      }
    });
  }

  function handleStatusChange(id: string, status: "termine" | "annule") {
    startTransition(async () => {
      try {
        await updateAppointmentStatus(id, status);
        toast.success(status === "termine" ? "Rendez-vous termine" : "Rendez-vous annule");
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Erreur.");
      }
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      try {
        await deleteAppointment(id);
        toast.success("Rendez-vous supprime");
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Erreur.");
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* Actions bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex gap-2">
          {(["a_venir", "all", "past"] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f)}
            >
              {f === "a_venir" ? "A venir" : f === "all" ? "Tous" : "Passes"}
            </Button>
          ))}
        </div>

        {assignedPapas.length > 0 && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Nouveau RDV
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Planifier un rendez-vous</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Papa</Label>
                  <Select value={formFatherId} onValueChange={setFormFatherId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir un papa" />
                    </SelectTrigger>
                    <SelectContent>
                      {assignedPapas.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.fullName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Type de rendez-vous</Label>
                  <Select
                    value={formType}
                    onValueChange={(v) =>
                      setFormType(v as "accompagnement_terrain" | "telephonique")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="accompagnement_terrain">
                        Accompagnement terrain
                      </SelectItem>
                      <SelectItem value="telephonique">Telephonique</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={formDate}
                      onChange={(e) => setFormDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Heure</Label>
                    <Input
                      type="time"
                      value={formTime}
                      onChange={(e) => setFormTime(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Duree (minutes)</Label>
                  <Select value={formDuration} onValueChange={setFormDuration}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 min</SelectItem>
                      <SelectItem value="45">45 min</SelectItem>
                      <SelectItem value="60">1h</SelectItem>
                      <SelectItem value="90">1h30</SelectItem>
                      <SelectItem value="120">2h</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formType === "accompagnement_terrain" && (
                  <div className="space-y-2">
                    <Label>Lieu</Label>
                    <Input
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                      placeholder="Adresse ou point de rendez-vous"
                      maxLength={200}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Notes (optionnel)</Label>
                  <Textarea
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    rows={2}
                    placeholder="Objectif du RDV, sujet a aborder..."
                    maxLength={1000}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                    disabled={isPending}
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={handleCreate}
                    disabled={isPending || !formFatherId || !formDate || !formTime}
                  >
                    Creer le RDV
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Appointments list */}
      {filtered.length === 0 ? (
        <Card className="rounded-2xl">
          <CardContent className="py-12 text-center">
            <CalendarCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium">
              {filter === "a_venir"
                ? "Aucun rendez-vous a venir"
                : "Aucun rendez-vous"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {assignedPapas.length > 0
                ? "Planifiez un nouveau rendez-vous avec un de vos papas."
                : "Aucun papa assigne pour le moment."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((appointment) => {
            const typeConf = TYPE_CONFIG[appointment.type] || TYPE_CONFIG.accompagnement_terrain;
            const statusConf = STATUS_CONFIG[appointment.status] || STATUS_CONFIG.a_venir;
            const TypeIcon = typeConf.icon;
            const isUpcoming = appointment.status === "a_venir";
            const dateObj = new Date(appointment.scheduledAt);

            return (
              <Card
                key={appointment.id}
                className={`rounded-2xl ${!isUpcoming ? "opacity-60" : ""}`}
              >
                <CardContent className="pt-5 pb-4">
                  <div className="flex items-start gap-4">
                    {/* Date block */}
                    <div className="shrink-0 w-14 text-center">
                      <p className="text-2xl font-bold text-foreground leading-none">
                        {dateObj.getDate()}
                      </p>
                      <p className="text-xs text-muted-foreground uppercase mt-0.5">
                        {dateObj.toLocaleDateString("fr-FR", { month: "short" })}
                      </p>
                      <p className="text-xs text-primary font-medium mt-0.5">
                        {dateObj.toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className={`text-[10px] ${typeConf.color}`}>
                          <TypeIcon className="h-3 w-3 mr-1" />
                          {typeConf.label}
                        </Badge>
                        <Badge variant="outline" className={`text-[10px] ${statusConf.color}`}>
                          {statusConf.label}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-3 mt-2 text-sm">
                        <span className="flex items-center gap-1">
                          <User className="h-3.5 w-3.5 text-muted-foreground" />
                          {appointment.father.fullName}
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          {appointment.duration} min
                        </span>
                      </div>

                      {appointment.location && (
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {appointment.location}
                        </p>
                      )}

                      {appointment.notes && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {appointment.notes}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    {isUpcoming && (
                      <div className="flex gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                          onClick={() => handleStatusChange(appointment.id, "termine")}
                          disabled={isPending}
                          title="Marquer termine"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => handleStatusChange(appointment.id, "annule")}
                          disabled={isPending}
                          title="Annuler"
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => handleDelete(appointment.id)}
                          disabled={isPending}
                          title="Supprimer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
