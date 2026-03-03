import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NavbarClient } from "./navbar-client";

export async function Navbar() {
  let user = null;

  try {
    const session = await auth();
    if (session?.user?.id) {
      const dbUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { email: true, fullName: true },
      });
      if (dbUser) {
        user = { email: dbUser.email, fullName: dbUser.fullName };
      }
    }
  } catch {
    // Auth not configured
  }

  return <NavbarClient user={user} />;
}
