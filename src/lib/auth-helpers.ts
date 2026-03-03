import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { User } from "@prisma/client";

export function hasRole(user: Pick<User, "roles">, role: string): boolean {
  return user.roles.includes(role);
}

/**
 * Get current authenticated user with their DB profile.
 * Returns null if not authenticated.
 */
export async function getCurrentUser(): Promise<User | null> {
  const session = await auth();
  if (!session?.user?.id) return null;

  return prisma.user.findUnique({
    where: { id: session.user.id },
  });
}

/**
 * Require authentication — returns user or throws redirect.
 */
export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/login");
  }
  return user;
}

/**
 * Require a specific role — returns user or redirects.
 */
export async function requireRole(role: string): Promise<User> {
  const user = await requireAuth();
  if (!hasRole(user, role)) {
    redirect("/dashboard");
  }
  return user;
}

/**
 * Require admin role — returns user or redirects.
 */
export async function requireAdmin(): Promise<User> {
  return requireRole("admin");
}

/**
 * Require volunteer role — returns user or redirects.
 */
export async function requireVolunteer(): Promise<User> {
  return requireRole("volunteer");
}

/**
 * Require volunteer or admin role — returns user or redirects.
 */
export async function requireVolunteerOrAdmin(): Promise<User> {
  const user = await requireAuth();
  if (!hasRole(user, "volunteer") && !hasRole(user, "admin")) {
    redirect("/dashboard");
  }
  return user;
}
