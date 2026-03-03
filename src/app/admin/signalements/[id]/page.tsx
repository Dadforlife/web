import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, User, FileText, MessageCircle, CheckCircle } from "lucide-react";
import { ReportActionsClient } from "./report-actions-client";

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  pending: {
    label: "En attente",
    className: "bg-orange-100 text-orange-800 border-orange-200",
  },
  warning: {
    label: "Avertissement",
    className: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  suspended: {
    label: "Suspendu",
    className: "bg-red-100 text-red-800 border-red-200",
  },
  dismissed: {
    label: "Rejeté",
    className: "bg-gray-100 text-gray-600 border-gray-200",
  },
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminSignalementDetailPage({ params }: PageProps) {
  const { id } = await params;

  const report = await prisma.report.findUnique({
    where: { id },
    include: {
      reporter: { select: { id: true, email: true, fullName: true } },
      resolvedBy: { select: { email: true, fullName: true } },
      discussion: {
        select: {
          id: true,
          title: true,
          content: true,
          author: { select: { id: true, email: true, fullName: true } },
        },
      },
      message: {
        select: {
          id: true,
          content: true,
          author: { select: { id: true, email: true, fullName: true } },
        },
      },
    },
  });

  if (!report) notFound();

  const statusConfig = STATUS_CONFIG[report.status] ?? STATUS_CONFIG.pending;
  const isPending = report.status === "pending";
  const contentAuthor = report.discussion?.author ?? report.message?.author;

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Détails du signalement"
        icon={AlertTriangle}
        backHref="/admin/signalements"
      />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Report info */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              Signalement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Raison
              </p>
              <p className="mt-1 text-sm">{report.reason}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Statut
              </p>
              <Badge className={`mt-1 ${statusConfig.className}`}>
                {statusConfig.label}
              </Badge>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Date du signalement
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {report.createdAt.toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Reporter info */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="h-4 w-4 text-blue-500" />
              Signalé par
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Nom
              </p>
              <p className="mt-1 text-sm">{report.reporter.fullName || "—"}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Email
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {report.reporter.email}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reported content */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            {report.discussion ? (
              <FileText className="h-4 w-4 text-violet-500" />
            ) : (
              <MessageCircle className="h-4 w-4 text-violet-500" />
            )}
            Contenu signalé
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {report.discussion ? (
            <>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Titre de la discussion
                </p>
                <p className="mt-1 text-sm font-medium">
                  {report.discussion.title}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Contenu
                </p>
                <div className="mt-1 rounded-lg bg-muted/50 p-4 text-sm whitespace-pre-wrap">
                  {report.discussion.content}
                </div>
              </div>
            </>
          ) : report.message ? (
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Message
              </p>
              <div className="mt-1 rounded-lg bg-muted/50 p-4 text-sm whitespace-pre-wrap">
                {report.message.content}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Le contenu signalé n&apos;est plus disponible.
            </p>
          )}

          {contentAuthor && (
            <div className="border-t pt-4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Auteur du contenu
              </p>
              <p className="mt-1 text-sm">
                {contentAuthor.fullName || "—"}{" "}
                <span className="text-muted-foreground">
                  ({contentAuthor.email})
                </span>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resolution section */}
      {!isPending && report.resolvedAt ? (
        <Card className="rounded-2xl border-green-200 dark:border-green-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Résolution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Décision
              </p>
              <Badge className={`mt-1 ${statusConfig.className}`}>
                {statusConfig.label}
              </Badge>
            </div>
            {report.resolution && (
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Commentaire
                </p>
                <p className="mt-1 text-sm">{report.resolution}</p>
              </div>
            )}
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Traité par
              </p>
              <p className="mt-1 text-sm">
                {report.resolvedBy?.fullName || report.resolvedBy?.email || "—"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Date de résolution
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {report.resolvedAt.toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <ReportActionsClient
              reportId={report.id}
              userId={contentAuthor?.id}
              hasDiscussion={!!report.discussion}
              hasMessage={!!report.message}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
