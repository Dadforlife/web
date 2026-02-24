import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { DashboardProvider } from "@/components/dashboard-provider";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user = null;
  let supabase = null;

  try {
    supabase = await createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    user = authUser;
  } catch {
    // Supabase pas configuré
  }

  // Rediriger si non connecté
  if (!user) {
    redirect("/auth/login");
  }

  // Vérifier que l'utilisateur a complété un diagnostic
  if (supabase) {
    try {
      const { data: diagnostics } = await supabase
        .from("diagnostics")
        .select("id")
        .eq("user_id", user.id)
        .limit(1);

      if (!diagnostics || diagnostics.length === 0) {
        redirect("/diagnostic");
      }
    } catch {
      // En cas d'erreur, ne pas bloquer l'accès au dashboard
    }
  }

  const dashboardUser = {
    email: user.email ?? "",
    fullName: user.user_metadata?.full_name ?? "",
    phone: user.user_metadata?.phone ?? "",
    createdAt: user.created_at ?? "",
  };

  return (
    <DashboardProvider user={dashboardUser}>
      <div className="min-h-screen bg-muted/30">
        <Sidebar
          user={{
            email: dashboardUser.email,
            fullName: dashboardUser.fullName,
          }}
        />

        {/* Contenu principal */}
        <div className="lg:pl-64 min-h-screen transition-all duration-300">
          <main className="p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </DashboardProvider>
  );
}
