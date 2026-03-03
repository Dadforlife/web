"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { addAvailability, deleteAvailability } from "../actions";
import { Plus, Trash2, Clock, CalendarDays } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Availability {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isRecurring: boolean;
  specificDate: string | null;
  label: string | null;
}

const DAY_LABELS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

export function AvailabilityGrid({
  availabilities,
}: {
  availabilities: Availability[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [dayOfWeek, setDayOfWeek] = useState("0");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("12:00");
  const [label, setLabel] = useState("");
  const [isRecurring, setIsRecurring] = useState(true);
  const [specificDate, setSpecificDate] = useState("");

  const recurring = availabilities.filter((a) => a.isRecurring);
  const punctual = availabilities.filter((a) => !a.isRecurring);

  function handleAdd() {
    if (startTime >= endTime) {
      toast.error("L'heure de fin doit etre apres l'heure de debut.");
      return;
    }

    startTransition(async () => {
      try {
        await addAvailability({
          dayOfWeek: parseInt(dayOfWeek),
          startTime,
          endTime,
          isRecurring,
          specificDate: !isRecurring && specificDate ? specificDate : undefined,
          label: label.trim() || undefined,
        });
        toast.success("Creneau ajoute");
        setShowForm(false);
        setLabel("");
        router.refresh();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Erreur lors de l'ajout."
        );
      }
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      try {
        await deleteAvailability(id);
        toast.success("Creneau supprime");
        router.refresh();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Erreur lors de la suppression."
        );
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* Add slot button */}
      <div className="flex justify-end">
        <Button onClick={() => setShowForm(!showForm)} variant={showForm ? "outline" : "default"}>
          <Plus className="h-4 w-4 mr-1" />
          {showForm ? "Annuler" : "Ajouter un creneau"}
        </Button>
      </div>

      {/* Add form */}
      {showForm && (
        <Card className="rounded-2xl border-primary/20">
          <CardHeader>
            <CardTitle className="text-base">Nouveau creneau</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={isRecurring ? "recurring" : "punctual"}
                  onValueChange={(v) => setIsRecurring(v === "recurring")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recurring">Recurrent (hebdomadaire)</SelectItem>
                    <SelectItem value="punctual">Ponctuel (date unique)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {isRecurring ? (
                <div className="space-y-2">
                  <Label>Jour de la semaine</Label>
                  <Select value={dayOfWeek} onValueChange={setDayOfWeek}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DAY_LABELS.map((day, i) => (
                        <SelectItem key={i} value={i.toString()}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={specificDate}
                    onChange={(e) => setSpecificDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label>Heure de debut</Label>
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Heure de fin</Label>
                <Input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Label (optionnel)</Label>
              <Input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Ex: RDV papa Martin, Permanence ecoute..."
                maxLength={100}
              />
            </div>

            <div className="flex justify-end">
              <Button onClick={handleAdd} disabled={isPending}>
                Ajouter le creneau
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weekly recurring grid */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Creneaux recurrents
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recurring.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              Aucun creneau recurrent defini.
            </p>
          ) : (
            <div className="space-y-1">
              {DAY_LABELS.map((day, dayIndex) => {
                const slots = recurring.filter((a) => a.dayOfWeek === dayIndex);
                if (slots.length === 0) return null;
                return (
                  <div key={dayIndex} className="flex items-start gap-3 py-2">
                    <span className="text-sm font-medium w-24 shrink-0 pt-1">{day}</span>
                    <div className="flex flex-wrap gap-2">
                      {slots.map((slot) => (
                        <div
                          key={slot.id}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/5 border border-primary/10 group"
                        >
                          <span className="text-sm">
                            {slot.startTime} - {slot.endTime}
                          </span>
                          {slot.label && (
                            <Badge variant="outline" className="text-[10px] ml-1">
                              {slot.label}
                            </Badge>
                          )}
                          <button
                            onClick={() => handleDelete(slot.id)}
                            disabled={isPending}
                            className="ml-1 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Supprimer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Punctual slots */}
      {punctual.length > 0 && (
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-amber-600" />
              Rendez-vous ponctuels
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {punctual.map((slot) => (
                <div
                  key={slot.id}
                  className="flex items-center justify-between py-2 px-3 rounded-lg bg-amber-50/50 border border-amber-100 group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">
                      {slot.specificDate
                        ? new Date(slot.specificDate).toLocaleDateString("fr-FR", {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                          })
                        : DAY_LABELS[slot.dayOfWeek]}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {slot.startTime} - {slot.endTime}
                    </span>
                    {slot.label && (
                      <Badge variant="outline" className="text-[10px]">
                        {slot.label}
                      </Badge>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(slot.id)}
                    disabled={isPending}
                    className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
