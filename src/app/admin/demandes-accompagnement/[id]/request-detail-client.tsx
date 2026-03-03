"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  MapPin,
  Phone,
  Mail,
  Baby,
  FileText,
  Shield,
  Calendar,
  Save,
  Loader2,
  MessageSquarePlus,
  StickyNote,
} from "lucide-react";
import { updateRequestStatus, addAdminNote } from "../actions";
import type { AccompagnementRequestStatus } from "@prisma/client";
import type { AdminNote } from "../actions";

interface RequestData {
  id: string;
  status: string;
  notes: AdminNote[];
  fatherFirstName: string;
  fatherCity: string;
  fatherPhone: string;
  fatherEmail: string | null;
  motherPhone: string;
  situationDescription: string;
  enfantsData: { prenom: string; sexe: string }[] | null;
  user: { fullName: string; email: string };
  createdAt: string;
  updatedAt: string;
}

const STATUS_CONFIG: Record<
  string,
  { label: string; colorClass: string }
> = {
  pending: {
    label: "En attente",
    colorClass: "bg-orange-100 text-orange-700 border-orange-200",
  },
  reviewing: {
    label: "En cours d'analyse",
    colorClass: "bg-purple-100 text-purple-700 border-purple-200",
  },
  contacted: {
    label: "Père contacté",
    colorClass: "bg-blue-100 text-blue-700 border-blue-200",
  },
  active: {
    label: "Accompagnement actif",
    colorClass: "bg-green-100 text-green-700 border-green-200",
  },
  completed: {
    label: "Terminé",
    colorClass: "bg-gray-100 text-gray-700 border-gray-200",
  },
  rejected: {
    label: "Refusée",
    colorClass: "bg-red-100 text-red-700 border-red-200",
  },
};

function statusBadge(status: string) {
  const config = STATUS_CONFIG[status] ?? {
    label: status,
    colorClass: "",
  };
  return (
    <Badge variant="outline" className={config.colorClass}>
      {config.label}
    </Badge>
  );
}

function formatDate(isoStr: string) {
  return new Date(isoStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatNoteDate(isoStr: string) {
  return new Date(isoStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function RequestDetailClient({
  request,
  adminName,
}: {
  request: RequestData;
  adminName: string;
}) {
  const [status, setStatus] = useState(request.status);
  const [isStatusPending, startStatusTransition] = useTransition();
  const [statusSaved, setStatusSaved] = useState(false);

  const [newNote, setNewNote] = useState("");
  const [isNotePending, startNoteTransition] = useTransition();
  const [notes, setNotes] = useState<AdminNote[]>(request.notes);

  function handleStatusSave() {
    setStatusSaved(false);
    startStatusTransition(async () => {
      try {
        await updateRequestStatus(
          request.id,
          status as AccompagnementRequestStatus,
        );
        setStatusSaved(true);
        setTimeout(() => setStatusSaved(false), 3000);
      } catch (err) {
        console.error(err);
        alert("Erreur lors de la mise à jour du statut.");
      }
    });
  }

  function handleAddNote() {
    if (!newNote.trim()) return;
    startNoteTransition(async () => {
      try {
        const savedNote = await addAdminNote(request.id, newNote);
        setNotes((prev) => [...prev, savedNote]);
        setNewNote("");
      } catch (err) {
        console.error(err);
        alert("Erreur lors de l'ajout de la note.");
      }
    });
  }

  const enfants = request.enfantsData ?? [];

  return (
    <div className="space-y-6">
      {/* Statut actuel */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-muted-foreground">
          Statut actuel :
        </span>
        {statusBadge(request.status)}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Infos Maman */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="h-4 w-4 text-pink-500" />
              Informations Maman
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{request.user.fullName}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{request.user.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{request.motherPhone}</span>
            </div>
          </CardContent>
        </Card>

        {/* Infos Père */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="h-4 w-4 text-blue-500" />
              Informations Père
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{request.fatherFirstName}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{request.fatherCity}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{request.fatherPhone}</span>
            </div>
            {request.fatherEmail && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{request.fatherEmail}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enfants */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Baby className="h-4 w-4 text-green-500" />
              Enfant{enfants.length > 1 ? "s" : ""} ({enfants.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {enfants.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Aucune donnée sur les enfants.
              </p>
            ) : (
              <div className="space-y-2">
                {enfants.map((enfant, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-lg border px-3 py-2"
                  >
                    <span className="text-sm font-medium">
                      {enfant.prenom}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {enfant.sexe === "fille" ? "Fille" : "Garçon"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="h-4 w-4 text-orange-500" />
              Dates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm">
              <span className="text-muted-foreground">Créée le : </span>
              <span className="font-medium">
                {formatDate(request.createdAt)}
              </span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">
                Dernière mise à jour :{" "}
              </span>
              <span className="font-medium">
                {formatDate(request.updatedAt)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Description de la situation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-4 w-4 text-purple-500" />
            Description de la situation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {request.situationDescription}
          </p>
        </CardContent>
      </Card>

      {/* Section Admin — Statut */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Shield className="h-4 w-4 text-primary" />
            Changer le statut
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full sm:w-[280px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="reviewing">
                  En cours d&apos;analyse
                </SelectItem>
                <SelectItem value="contacted">Père contacté</SelectItem>
                <SelectItem value="active">Accompagnement actif</SelectItem>
                <SelectItem value="completed">Terminé</SelectItem>
                <SelectItem value="rejected">Refusée</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleStatusSave} disabled={isStatusPending}>
              {isStatusPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Enregistrer
            </Button>
            {statusSaved && (
              <span className="text-sm text-green-600 font-medium">
                Statut mis à jour !
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Section Admin — Notes */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <StickyNote className="h-4 w-4 text-primary" />
            Notes de suivi
            {notes.length > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {notes.length}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Historique des notes */}
          {notes.length > 0 ? (
            <div className="space-y-3">
              {notes.map((note, idx) => (
                <div
                  key={idx}
                  className="relative rounded-lg border bg-muted/30 p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-primary">
                      {note.author}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatNoteDate(note.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {note.content}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground py-2">
              Aucune note pour le moment.
            </p>
          )}

          {/* Ajout d'une nouvelle note */}
          <div className="border-t pt-4 space-y-3">
            <label className="text-sm font-medium">Ajouter une note</label>
            <Textarea
              placeholder="Écrivez une note de suivi…"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              rows={3}
            />
            <Button
              onClick={handleAddNote}
              disabled={isNotePending || !newNote.trim()}
              variant="outline"
            >
              {isNotePending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <MessageSquarePlus className="h-4 w-4 mr-2" />
              )}
              Ajouter la note
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
