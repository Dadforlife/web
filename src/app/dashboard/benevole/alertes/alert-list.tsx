"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { resolveAlert, createManualAlert } from "../actions";
import { CheckCircle2, Plus, AlertTriangle, User } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Alert {
  id: string;
  type: string;
  priority: string;
  title: string;
  description: string | null;
  isResolved: boolean;
  resolvedAt: string | null;
  createdAt: string;
  father: { id: string; fullName: string } | null;
}

const PRIORITY_COLORS: Record<string, string> = {
  critical: "bg-red-100 text-red-800 border-red-300",
  high: "bg-orange-100 text-orange-800 border-orange-300",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
  low: "bg-gray-100 text-gray-700 border-gray-300",
};

const PRIORITY_LABELS: Record<string, string> = {
  critical: "Critique",
  high: "Haute",
  medium: "Moyenne",
  low: "Basse",
};

const TYPE_LABELS: Record<string, string> = {
  diagnostic_critique: "Diagnostic",
  signalement_manuel: "Signalement",
  inactivite: "Inactivite",
};

export function AlertList({
  alerts,
  assignedPapas,
}: {
  alerts: Alert[];
  assignedPapas: { id: string; fullName: string }[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [filter, setFilter] = useState<"all" | "active" | "resolved">("active");
  const [dialogOpen, setDialogOpen] = useState(false);

  // Manual alert form
  const [alertFatherId, setAlertFatherId] = useState(assignedPapas[0]?.id || "");
  const [alertTitle, setAlertTitle] = useState("");
  const [alertDescription, setAlertDescription] = useState("");
  const [alertPriority, setAlertPriority] = useState<"low" | "medium" | "high" | "critical">("medium");

  const filtered = alerts.filter((a) => {
    if (filter === "active") return !a.isResolved;
    if (filter === "resolved") return a.isResolved;
    return true;
  });

  // Sort: unresolved first, then by priority order
  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  const sorted = [...filtered].sort((a, b) => {
    if (a.isResolved !== b.isResolved) return a.isResolved ? 1 : -1;
    const pa = priorityOrder[a.priority as keyof typeof priorityOrder] ?? 4;
    const pb = priorityOrder[b.priority as keyof typeof priorityOrder] ?? 4;
    return pa - pb;
  });

  function handleResolve(id: string) {
    startTransition(async () => {
      try {
        await resolveAlert(id);
        toast.success("Alerte resolue");
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Erreur.");
      }
    });
  }

  function handleCreateAlert() {
    if (!alertFatherId || alertTitle.trim().length < 3) {
      toast.error("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    startTransition(async () => {
      try {
        await createManualAlert({
          fatherId: alertFatherId,
          title: alertTitle.trim(),
          description: alertDescription.trim() || undefined,
          priority: alertPriority,
        });
        toast.success("Signalement cree");
        setDialogOpen(false);
        setAlertTitle("");
        setAlertDescription("");
        setAlertPriority("medium");
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
          {(["active", "all", "resolved"] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f)}
            >
              {f === "active" ? "Non resolues" : f === "all" ? "Toutes" : "Resolues"}
            </Button>
          ))}
        </div>

        {assignedPapas.length > 0 && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Signaler une situation
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Nouveau signalement</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Papa concerne</Label>
                  <Select value={alertFatherId} onValueChange={setAlertFatherId}>
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
                  <Label>Priorite</Label>
                  <Select
                    value={alertPriority}
                    onValueChange={(v) =>
                      setAlertPriority(v as "low" | "medium" | "high" | "critical")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Basse</SelectItem>
                      <SelectItem value="medium">Moyenne</SelectItem>
                      <SelectItem value="high">Haute</SelectItem>
                      <SelectItem value="critical">Critique</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Titre</Label>
                  <Input
                    value={alertTitle}
                    onChange={(e) => setAlertTitle(e.target.value)}
                    placeholder="Decrivez brievement la situation..."
                    maxLength={200}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Description (optionnel)</Label>
                  <Textarea
                    value={alertDescription}
                    onChange={(e) => setAlertDescription(e.target.value)}
                    rows={3}
                    placeholder="Details supplementaires..."
                    maxLength={2000}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={isPending}>
                    Annuler
                  </Button>
                  <Button
                    onClick={handleCreateAlert}
                    disabled={isPending || alertTitle.trim().length < 3 || !alertFatherId}
                  >
                    Creer le signalement
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Alerts list */}
      {sorted.length === 0 ? (
        <Card className="rounded-2xl">
          <CardContent className="py-12 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <p className="text-lg font-medium">
              {filter === "active" ? "Aucune alerte active" : "Aucune alerte"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Tout est sous controle.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {sorted.map((alert) => (
            <Card
              key={alert.id}
              className={`rounded-2xl ${alert.isResolved ? "opacity-60" : ""}`}
            >
              <CardContent className="pt-5 pb-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle
                    className={`h-5 w-5 shrink-0 mt-0.5 ${
                      alert.isResolved
                        ? "text-muted-foreground"
                        : alert.priority === "critical"
                        ? "text-red-600"
                        : alert.priority === "high"
                        ? "text-orange-500"
                        : "text-yellow-500"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${PRIORITY_COLORS[alert.priority] || ""}`}
                      >
                        {PRIORITY_LABELS[alert.priority] || alert.priority}
                      </Badge>
                      <Badge variant="outline" className="text-[10px]">
                        {TYPE_LABELS[alert.type] || alert.type}
                      </Badge>
                      {alert.isResolved && (
                        <Badge variant="outline" className="text-[10px] bg-green-50 text-green-700 border-green-200">
                          Resolu
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm font-medium mt-1.5">{alert.title}</p>
                    {alert.description && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {alert.description}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      {alert.father && (
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {alert.father.fullName}
                        </span>
                      )}
                      <span>
                        {new Date(alert.createdAt).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {alert.resolvedAt && (
                        <span className="text-green-600">
                          Resolu le{" "}
                          {new Date(alert.resolvedAt).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "short",
                          })}
                        </span>
                      )}
                    </div>
                  </div>

                  {!alert.isResolved && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleResolve(alert.id)}
                      disabled={isPending}
                      className="shrink-0"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Resoudre
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
