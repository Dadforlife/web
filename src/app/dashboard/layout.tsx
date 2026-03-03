import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Sidebar } from "@/components/sidebar";
import { DashboardProvider } from "@/components/dashboard-provider";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const userId = session.user.id;

  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!dbUser) {
    redirect("/auth/login");
  }

  const { primaryRole, roles } = dbUser;

  // Only papa_aide needs to complete the diagnostic before accessing the dashboard
  if (primaryRole === "papa_aide" && !roles.includes("admin")) {
    const diagnosticCount = await prisma.diagnostic.count({
      where: { userId },
    });
    if (diagnosticCount === 0) {
      redirect("/diagnostic");
    }
  }

  let volunteerRole: string | undefined;
  if (roles.includes("volunteer")) {
    const profile = await prisma.volunteerProfile.findUnique({
      where: { userId },
      select: { volunteerRole: true },
    });
    volunteerRole = profile?.volunteerRole;
  }

  const enfants = await prisma.enfant.findMany({
    where: { userId },
    select: { id: true, prenom: true, sexe: true },
    orderBy: { createdAt: "asc" },
  });

  const dashboardUser = {
    email: dbUser.email,
    fullName: dbUser.fullName,
    phone: dbUser.phone ?? "",
    createdAt: dbUser.createdAt.toISOString(),
    primaryRole,
    roles,
    volunteerRole,
    enfants: enfants.map((e) => ({ id: e.id, prenom: e.prenom, sexe: e.sexe as "garcon" | "fille" })),
  };

  return (
    <DashboardProvider user={dashboardUser}>
      <div className="min-h-screen bg-muted/30">
        <Sidebar
          user={{
            email: dashboardUser.email,
            fullName: dashboardUser.fullName,
          }}
          primaryRole={primaryRole}
          roles={roles}
        />
        <div className="lg:pl-64 min-h-screen transition-all duration-300">
          <main className="p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </DashboardProvider>
  );
}
