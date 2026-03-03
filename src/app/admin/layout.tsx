import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Sidebar } from "@/components/sidebar";
import { DashboardProvider } from "@/components/dashboard-provider";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!dbUser || !dbUser.roles.includes("admin")) {
    redirect("/dashboard");
  }

  const dashboardUser = {
    email: dbUser.email,
    fullName: dbUser.fullName,
    phone: dbUser.phone ?? "",
    createdAt: dbUser.createdAt.toISOString(),
    primaryRole: dbUser.primaryRole,
    roles: dbUser.roles,
    enfants: [],
  };

  return (
    <DashboardProvider user={dashboardUser}>
      <div className="min-h-screen bg-muted/30">
        <Sidebar
          user={{
            email: dashboardUser.email,
            fullName: dashboardUser.fullName,
          }}
          primaryRole={dbUser.primaryRole}
          roles={dbUser.roles}
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
