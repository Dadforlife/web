import { requireVolunteer } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { DashboardContent } from "./dashboard-content";

export default async function VolunteerDashboardPage() {
  const user = await requireVolunteer();

  const [profile, assignments, unresolvedAlerts, upcomingAppointments, unreadConversations] =
    await Promise.all([
      prisma.volunteerProfile.findUnique({
        where: { userId: user.id },
        select: {
          id: true,
          volunteerRole: true,
          bio: true,
          city: true,
          maxAssignments: true,
          isActive: true,
        },
      }),
      prisma.papaAssignment.findMany({
        where: {
          volunteer: { userId: user.id },
          status: "active",
        },
        select: {
          id: true,
          fatherId: true,
          startDate: true,
          notes: true,
          father: {
            select: {
              id: true,
              fullName: true,
              email: true,
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
        orderBy: { startDate: "desc" },
      }),
      prisma.volunteerAlert.findMany({
        where: {
          profile: { userId: user.id },
          isResolved: false,
        },
        select: {
          id: true,
          type: true,
          priority: true,
          title: true,
          description: true,
          createdAt: true,
          father: {
            select: { fullName: true },
          },
        },
        orderBy: [
          { priority: "asc" }, // critical first (alphabetically first)
          { createdAt: "desc" },
        ],
        take: 5,
      }),
      prisma.volunteerAppointment.findMany({
        where: {
          profile: { userId: user.id },
          status: "a_venir",
          scheduledAt: { gte: new Date() },
        },
        select: {
          id: true,
          type: true,
          scheduledAt: true,
          duration: true,
          location: true,
          notes: true,
          father: { select: { id: true, fullName: true } },
        },
        orderBy: { scheduledAt: "asc" },
        take: 5,
      }),
      prisma.privateConversation.count({
        where: {
          volunteerId: user.id,
          status: "open",
          messages: {
            some: {
              isRead: false,
              senderId: { not: user.id },
            },
          },
        },
      }),
    ]);

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Profil benevole en cours de creation. Veuillez patienter.
        </p>
      </div>
    );
  }

  // Serialize dates for client component
  const serializedAssignments = assignments.map((a) => ({
    ...a,
    startDate: a.startDate.toISOString(),
    father: {
      ...a.father,
      diagnostics: a.father.diagnostics.map((d) => ({
        ...d,
        scoreGlobal: Number(d.scoreGlobal),
        createdAt: d.createdAt.toISOString(),
      })),
    },
  }));

  const serializedAlerts = unresolvedAlerts.map((a) => ({
    ...a,
    createdAt: a.createdAt.toISOString(),
  }));

  const serializedAppointments = upcomingAppointments.map((a) => ({
    ...a,
    scheduledAt: a.scheduledAt.toISOString(),
  }));

  return (
    <DashboardContent
      profile={profile}
      assignments={serializedAssignments}
      alerts={serializedAlerts}
      upcomingAppointments={serializedAppointments}
      unreadConversations={unreadConversations}
      userName={user.fullName}
    />
  );
}
