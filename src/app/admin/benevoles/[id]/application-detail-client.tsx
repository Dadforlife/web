"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  updateApplicationStatus,
  deleteApplication,
  addAdminNote,
  sendPrivateMessageFromApplication,
} from "../actions";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Clock,
  FileText,
  Briefcase,
  CheckCircle2,
  XCircle,
  PhoneCall,
  Trash2,
  Save,
  MessageSquarePlus,
} from "lucide-react";
import { toast } from "sonner";
import type { VolunteerRole } from "@prisma/client";

const VOLUNTEER_ROLE_LABELS: Record<VolunteerRole, string> = {
  accompagnateur_terrain: "Accompagnateur terrain",
  ecoute_soutien: "Ecoute & soutien",
  expertise_metier: "Expertise metier",
};

interface ApplicationData {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  city: string;
  availability: string;
  motivation: string;
  experience: string | null;
  status: string;
  adminNotes: string | null;
  reviewedBy: { fullName: string; email: string } | null;
  reviewedAt: string | null;
  createdAt: string;
}

const STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  contacted: "Contacté",
  accepted: "Accepté",
  rejected: "Refusé",
};

function statusBadgeClass(status: string) {
  switch (status) {
    case "pending":
      return "bg-orange-100 text-orange-700 border-orange-200";
    case "contacted":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "accepted":
      return "bg-green-100 text-green-700 border-green-200";
    case "rejected":
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "";
  }
}

export function ApplicationDetailClient({
  application,
}: {
  application: ApplicationData;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [notes, setNotes] = useState(application.adminNotes || "");
  const [selectedVolunteerRole, setSelectedVolunteerRole] =
    useState<VolunteerRole>("accompagnateur_terrain");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);
  const [messageSubject, setMessageSubject] = useState(
    `Candidature benevole - ${application.fullName}`
  );
  const [messageContent, setMessageContent] = useState("");

  function handleStatusChange(status: "pending" | "contacted" | "accepted" | "rejected") {
    startTransition(async () => {
      await updateApplicationStatus(
        application.id,
        status,
        notes || undefined,
        status === "accepted" ? selectedVolunteerRole : undefined,
      );
      router.refresh();
    });
  }

  function handleSaveNotes() {
    startTransition(async () => {
      await addAdminNote(application.id, notes);
      router.refresh();
    });
  }

  async function handleDelete() {
    setDeleteLoading(true);
    await deleteApplication(application.id);
    router.push("/admin/benevoles");
  }

  function handleSendPrivateMessage() {
    startTransition(async () => {
      try {
        const result = await sendPrivateMessageFromApplication(
          application.id,
          messageSubject,
          messageContent
        );
        toast.success("Message prive envoye");
        setMessageOpen(false);
        setMessageContent("");
        router.push(`/admin/messagerie/${result.conversationId}`);
        router.refresh();
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Impossible d'envoyer le message prive.";
        toast.error(message);
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* Informations du candidat */}
      <Card className="rounded-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Informations du candidat</CardTitle>
            <Badge className={statusBadgeClass(application.status)}>
              {STATUS_LABELS[application.status] || application.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Nom complet</p>
                <p className="font-medium">{application.fullName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <a
                  href={`mailto:${application.email}`}
                  className="font-medium text-primary hover:underline"
                >
                  {application.email}
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Téléphone</p>
                <p className="font-medium">{application.phone || "Non renseigné"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Ville</p>
                <p className="font-medium">{application.city}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Disponibilité</p>
                <p className="font-medium">{application.availability}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Motivation */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Motivation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap break-words [overflow-wrap:anywhere] text-sm leading-relaxed">
            {application.motivation}
          </p>
        </CardContent>
      </Card>

      {/* Expérience */}
      {application.experience && (
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              Expérience
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap break-words [overflow-wrap:anywhere] text-sm leading-relaxed">
              {application.experience}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Résolution précédente */}
      {application.reviewedBy && application.reviewedAt && (
        <Card className="rounded-2xl border-green-200 bg-green-50/50">
          <CardContent className="pt-6">
            <p className="text-sm text-green-800">
              <span className="font-medium">Traité par</span>{" "}
              {application.reviewedBy.fullName} le{" "}
              {new Date(application.reviewedAt).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Notes admin */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg">Notes admin</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Label htmlFor="adminNotes">Notes internes (non visibles par le candidat)</Label>
          <Textarea
            id="adminNotes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            placeholder="Ajouter des notes sur cette candidature…"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveNotes}
            disabled={isPending}
          >
            <Save className="h-4 w-4 mr-1" />
            Enregistrer les notes
          </Button>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg">Décision</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Volunteer role selector — visible when about to accept */}
          {application.status !== "accepted" && (
            <div className="mb-4 space-y-2">
              <Label>Role benevole (attribue a l&apos;acceptation)</Label>
              <Select
                value={selectedVolunteerRole}
                onValueChange={(v) => setSelectedVolunteerRole(v as VolunteerRole)}
              >
                <SelectTrigger className="w-full sm:w-72">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.entries(VOLUNTEER_ROLE_LABELS) as [VolunteerRole, string][]).map(
                    ([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            {application.status !== "contacted" && (
              <Button
                variant="outline"
                onClick={() => handleStatusChange("contacted")}
                disabled={isPending}
              >
                <PhoneCall className="h-4 w-4 mr-1" />
                Marquer comme contacté
              </Button>
            )}
            {application.status !== "accepted" && (
              <Button
                onClick={() => handleStatusChange("accepted")}
                disabled={isPending}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircle2 className="h-4 w-4 mr-1" />
                Accepter la candidature
              </Button>
            )}
            {application.status !== "rejected" && (
              <Button
                variant="destructive"
                onClick={() => handleStatusChange("rejected")}
                disabled={isPending}
              >
                <XCircle className="h-4 w-4 mr-1" />
                Refuser la candidature
              </Button>
            )}
            {application.status !== "pending" && (
              <Button
                variant="outline"
                onClick={() => handleStatusChange("pending")}
                disabled={isPending}
              >
                Remettre en attente
              </Button>
            )}
            <Dialog open={messageOpen} onOpenChange={setMessageOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <MessageSquarePlus className="h-4 w-4 mr-1" />
                  Envoyer un message prive
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                  <DialogTitle>Contacter le candidat en prive</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="private-subject">Sujet</Label>
                    <Input
                      id="private-subject"
                      value={messageSubject}
                      onChange={(e) => setMessageSubject(e.target.value)}
                      maxLength={200}
                      placeholder="Sujet du message"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="private-content">Message</Label>
                    <Textarea
                      id="private-content"
                      value={messageContent}
                      onChange={(e) => setMessageContent(e.target.value)}
                      rows={6}
                      maxLength={5000}
                      placeholder="Ecrivez votre message au candidat..."
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Le message sera envoye dans la messagerie privee du papa.
                  </p>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setMessageOpen(false)}
                      disabled={isPending}
                    >
                      Annuler
                    </Button>
                    <Button
                      type="button"
                      onClick={handleSendPrivateMessage}
                      disabled={
                        isPending ||
                        messageSubject.trim().length < 3 ||
                        messageContent.trim().length < 3
                      }
                    >
                      Envoyer le message
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button
              variant="ghost"
              className="text-destructive hover:text-destructive"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Supprimer
            </Button>
          </div>
          {isPending && (
            <p className="text-sm text-muted-foreground mt-2">Mise à jour en cours…</p>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Supprimer cette candidature"
        description="Cette action est irréversible. La candidature sera définitivement supprimée."
        confirmLabel="Supprimer"
        variant="destructive"
        loading={deleteLoading}
        onConfirm={handleDelete}
      />
    </div>
  );
}
