import { requireVolunteer } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/admin/page-header";
import Link from "next/link";
import { Users, Mail, AlertTriangle, Calendar } from "lucide-react";

function classificationBadge(classification: string) {
  switch (classification) {
    case "critique":
      return "bg-red-100 text-red-700 border-red-200";
    case "élevé":
    case "eleve":
      return "bg-orange-100 text-orange-700 border-orange-200";
    case "modéré":
    case "modere":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    default:
      return "bg-green-100 text-green-700 border-green-200";
  }
}

export default async function VolunteerPapasPage() {
  const user = await requireVolunteer();

  const profile = await prisma.volunteerProfile.findUnique({
    where: { userId: user.id },
    select: { id: true },
  });

  if (!profile) {
    return <p className="text-muted-foreground">Profil introuvable.</p>;
  }

  const assignments = await prisma.papaAssignment.findMany({
    where: { volunteerId: profile.id },
    select: {
      id: true,
      fatherId: true,
      status: true,
      startDate: true,
      endDate: true,
      notes: true,
      father: {
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          lastActiveAt: true,
          diagnostics: {
            orderBy: { createdAt: "desc" },
            take: 1,
            select: {
              scoreGlobal: true,
              classification: true,
              createdAt: true,
            },
          },
        },
      },
    },
    orderBy: [{ status: "asc" }, { startDate: "desc" }],
  });

  const activeAssignments = assignments.filter((a) => a.status === "active");
  const completedAssignments = assignments.filter((a) => a.status !== "active");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mes papas"
        description={`${activeAssignments.length} assignation${activeAssignments.length !== 1 ? "s" : ""} active${activeAssignments.length !== 1 ? "s" : ""}`}
        icon={Users}
        backHref="/dashboard/benevole"
      />

      {assignments.length === 0 ? (
        <Card className="rounded-2xl">
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium">Aucun papa assigne</p>
            <p className="text-sm text-muted-foreground mt-1">
              Les assignations sont gerees par l&apos;equipe administrative.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Active assignments */}
          {activeAssignments.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-foreground">
                Assignations actives ({activeAssignments.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeAssignments.map((assignment) => {
                  const latestDiag = assignment.father.diagnostics[0];
                  return (
                    <Card key={assignment.id} className="rounded-2xl">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">
                            {assignment.father.fullName}
                          </CardTitle>
                          <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                            Actif
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-xs text-muted-foreground">Email</p>
                            <p className="truncate">{assignment.father.email}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Telephone</p>
                            <p>{assignment.father.phone || "Non renseigne"}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Assigne depuis</p>
                            <p>
                              {new Date(assignment.startDate).toLocaleDateString("fr-FR", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Dernier diagnostic</p>
                            {latestDiag ? (
                              <div className="flex items-center gap-1.5">
                                <Badge
                                  variant="outline"
                                  className={`text-[10px] ${classificationBadge(latestDiag.classification)}`}
                                >
                                  {latestDiag.classification}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  ({Number(latestDiag.scoreGlobal).toFixed(1)}/10)
                                </span>
                              </div>
                            ) : (
                              <p className="text-muted-foreground">Aucun</p>
                            )}
                          </div>
                        </div>

                        {assignment.notes && (
                          <div className="pt-2 border-t">
                            <p className="text-xs text-muted-foreground">Notes</p>
                            <p className="text-sm mt-0.5">{assignment.notes}</p>
                          </div>
                        )}

                        <div className="flex gap-2 pt-2">
                          <Link href="/dashboard/messagerie" className="flex-1">
                            <Button variant="outline" size="sm" className="w-full">
                              <Mail className="h-4 w-4 mr-1" />
                              Message
                            </Button>
                          </Link>
                          <Link href="/dashboard/benevole/alertes" className="flex-1">
                            <Button variant="outline" size="sm" className="w-full">
                              <AlertTriangle className="h-4 w-4 mr-1" />
                              Signaler
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Completed assignments */}
          {completedAssignments.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-muted-foreground">
                Historique ({completedAssignments.length})
              </h2>
              <div className="space-y-2">
                {completedAssignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="flex items-center justify-between p-3 rounded-xl border bg-muted/30"
                  >
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {assignment.father.fullName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(assignment.startDate).toLocaleDateString("fr-FR")}
                        {assignment.endDate &&
                          ` — ${new Date(assignment.endDate).toLocaleDateString("fr-FR")}`}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-muted-foreground">
                      {assignment.status === "completed" ? "Termine" : "En pause"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
