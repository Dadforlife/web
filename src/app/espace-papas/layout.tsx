import { buildMetadata } from "@/lib/seo";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Sidebar } from "@/components/sidebar";

export const metadata = buildMetadata({
  title: "Espace Papas",
  description:
    "Forum d'échange entre pères : garde, relation avec la maman, éducation, moral, témoignages. Un espace bienveillant réservé aux papas inscrits.",
  path: "/espace-papas",
  noIndex: true,
});

export default async function EspacePapasLayout({
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

  if (!dbUser) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Sidebar
        user={{
          email: dbUser.email,
          fullName: dbUser.fullName,
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
  );
}
