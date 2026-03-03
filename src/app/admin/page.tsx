import { prisma } from "@/lib/prisma";
import { StatsCard } from "@/components/admin/stats-card";
import { BarChart } from "@/components/admin/bar-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import {
  Users,
  UserPlus,
  MessageCircle,
  AlertTriangle,
  CreditCard,
  Ban,
  Activity,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  let stats = {
    totalUsers: 0,
    newUsers7d: 0,
    newUsers30d: 0,
    activeDiscussions: 0,
    pendingReports: 0,
    paymentsThisMonth: 0,
    paymentsTotal: 0,
    blockedUsers: 0,
    activeUsers: 0,
    engagementRate: "0",
  };

  let registrationData: { label: string; value: number }[] = [];
  let recentReports: { id: string; reason: string; createdAt: Date; status: string }[] = [];
  let recentUsers: { id: string; fullName: string; email: string; createdAt: Date }[] = [];

  try {
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalUsers,
      newUsers7d,
      newUsers30d,
      activeDiscussions,
      pendingReports,
      paymentsThisMonth,
      blockedUsers,
      activeUsers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.discussion.count({ where: { status: "active" } }),
      prisma.report.count({ where: { status: "pending" } }),
      prisma.payment.aggregate({
        where: { createdAt: { gte: monthStart }, status: "success" },
        _sum: { amount: true },
      }),
      prisma.user.count({ where: { status: { in: ["suspended", "banned"] } } }),
      prisma.user.count({
        where: {
          lastActiveAt: { gte: thirtyDaysAgo },
          status: "active",
        },
      }),
    ]);

    const rate = totalUsers > 0 ? ((activeUsers / totalUsers) * 100).toFixed(1) : "0";

    stats = {
      totalUsers,
      newUsers7d,
      newUsers30d,
      activeDiscussions,
      pendingReports,
      paymentsThisMonth: (paymentsThisMonth._sum.amount ?? 0) / 100,
      paymentsTotal: (paymentsThisMonth._sum.amount ?? 0) / 100,
      blockedUsers,
      activeUsers,
      engagementRate: rate,
    };

    // Build registration chart for last 14 days
    const chartDays = 14;
    const dayLabels: string[] = [];
    const dayMap = new Map<string, number>();
    for (let i = chartDays - 1; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().slice(5, 10);
      dayLabels.push(key);
      dayMap.set(key, 0);
    }

    const recentRegistrations = await prisma.user.findMany({
      where: { createdAt: { gte: new Date(now.getTime() - chartDays * 24 * 60 * 60 * 1000) } },
      select: { createdAt: true },
    });

    for (const u of recentRegistrations) {
      const key = u.createdAt.toISOString().slice(5, 10);
      if (dayMap.has(key)) {
        dayMap.set(key, (dayMap.get(key) ?? 0) + 1);
      }
    }

    registrationData = dayLabels.map((label) => ({
      label,
      value: dayMap.get(label) ?? 0,
    }));

    [recentReports, recentUsers] = await Promise.all([
      prisma.report.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, reason: true, createdAt: true, status: true },
      }),
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, fullName: true, email: true, createdAt: true },
      }),
    ]);
  } catch {
    // DB not ready
  }

  return (
    <div className="space-y-8 max-w-7xl">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight flex items-center gap-2">
          <ShieldCheck className="h-8 w-8 text-primary" />
          Administration
        </h1>
        <p className="text-muted-foreground mt-1">
          Vue d&apos;ensemble de la plateforme Papa pour la vie
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Utilisateurs"
          value={stats.totalUsers}
          icon={Users}
          description="Comptes inscrits"
          trend={{ value: stats.newUsers7d, label: "cette semaine" }}
        />
        <StatsCard
          title="Nouveaux (30j)"
          value={stats.newUsers30d}
          icon={UserPlus}
          iconColor="text-green-600"
          borderColor="border-t-green-500"
        />
        <StatsCard
          title="Discussions actives"
          value={stats.activeDiscussions}
          icon={MessageCircle}
          iconColor="text-blue-600"
          borderColor="border-t-blue-500"
        />
        <StatsCard
          title="Signalements"
          value={stats.pendingReports}
          icon={AlertTriangle}
          iconColor="text-orange-600"
          borderColor="border-t-orange-500"
          description="En attente de traitement"
        />
        <StatsCard
          title="Paiements (mois)"
          value={`${stats.paymentsThisMonth.toFixed(2)} €`}
          icon={CreditCard}
          iconColor="text-emerald-600"
          borderColor="border-t-emerald-500"
        />
        <StatsCard
          title="Utilisateurs bloqués"
          value={stats.blockedUsers}
          icon={Ban}
          iconColor="text-red-600"
          borderColor="border-t-red-500"
        />
        <StatsCard
          title="Taux d'engagement"
          value={`${stats.engagementRate}%`}
          icon={Activity}
          iconColor="text-violet-600"
          borderColor="border-t-violet-500"
          description="Actifs / Total (30j)"
        />
        <StatsCard
          title="Utilisateurs actifs"
          value={stats.activeUsers}
          icon={Users}
          iconColor="text-teal-600"
          borderColor="border-t-teal-500"
          description="Actifs sur 30 jours"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">Inscriptions (14 derniers jours)</CardTitle>
          </CardHeader>
          <CardContent>
            {registrationData.length > 0 ? (
              <BarChart data={registrationData} height={160} />
            ) : (
              <p className="text-sm text-muted-foreground py-4">Aucune donnée.</p>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Derniers signalements</CardTitle>
            <Link
              href="/admin/signalements"
              className="text-sm text-primary hover:underline inline-flex items-center gap-1"
            >
              Tout voir <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </CardHeader>
          <CardContent>
            {recentReports.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">Aucun signalement.</p>
            ) : (
              <ul className="space-y-2">
                {recentReports.map((r) => (
                  <li
                    key={r.id}
                    className="flex items-center justify-between py-2 px-3 rounded-lg border bg-muted/30 text-sm"
                  >
                    <span className="truncate max-w-[60%]">{r.reason}</span>
                    <span className={
                      r.status === "pending"
                        ? "text-orange-600 font-medium"
                        : "text-muted-foreground"
                    }>
                      {r.status === "pending" ? "En attente" : "Traité"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Dernières inscriptions</CardTitle>
          <Link
            href="/admin/utilisateurs"
            className="text-sm text-primary hover:underline inline-flex items-center gap-1"
          >
            Tout voir <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </CardHeader>
        <CardContent>
          {recentUsers.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">Aucun utilisateur.</p>
          ) : (
            <ul className="space-y-2">
              {recentUsers.map((u) => (
                <li
                  key={u.id}
                  className="flex items-center justify-between py-2 px-3 rounded-lg border bg-muted/30 text-sm"
                >
                  <div>
                    <span className="font-medium">{u.fullName || "—"}</span>
                    <span className="text-muted-foreground ml-2">{u.email}</span>
                  </div>
                  <span className="text-muted-foreground text-xs">
                    {u.createdAt.toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
