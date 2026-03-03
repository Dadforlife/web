import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft, FileBarChart } from "lucide-react";

export default async function AdminDiagnosticsPage() {
  let diagnostics: {
    id: string;
    userId: string;
    createdAt: Date;
    scoreGlobal: unknown;
    classification: string;
    planTitle: string;
    user: { email: string; fullName: string } | null;
  }[] = [];

  try {
    diagnostics = await prisma.diagnostic.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      select: {
        id: true,
        userId: true,
        createdAt: true,
        scoreGlobal: true,
        classification: true,
        planTitle: true,
        user: { select: { email: true, fullName: true } },
      },
    });
  } catch {
    // DB not ready
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center gap-4">
        <Link
          href="/admin"
          className="p-2 rounded-lg hover:bg-muted transition-colors"
          aria-label="Retour"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <FileBarChart className="h-7 w-7 text-primary" />
            Évaluations
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {diagnostics.length} évaluation(s)
          </p>
        </div>
      </div>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Liste des évaluations</CardTitle>
        </CardHeader>
        <CardContent>
          {diagnostics.length === 0 ? (
            <p className="text-muted-foreground py-6">Aucune évaluation.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Date</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Utilisateur</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Score</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Classification</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Plan</th>
                  </tr>
                </thead>
                <tbody>
                  {diagnostics.map((d) => (
                    <tr key={d.id} className="border-b border-border/60 hover:bg-muted/30">
                      <td className="py-3 px-2 text-muted-foreground">{formatDate(d.createdAt)}</td>
                      <td className="py-3 px-2">
                        {d.user
                          ? `${d.user.fullName || "—"} (${d.user.email})`
                          : d.userId.slice(0, 8) + "…"}
                      </td>
                      <td className="py-3 px-2 font-medium">{Number(d.scoreGlobal).toFixed(1)}</td>
                      <td className="py-3 px-2">{d.classification}</td>
                      <td className="py-3 px-2 text-muted-foreground max-w-[200px] truncate" title={d.planTitle}>
                        {d.planTitle || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
