import { SignJWT, jwtVerify } from "jose";
import { auth } from "@/lib/auth";
import { NextRequest } from "next/server";

const SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || "fallback-secret"
);

const TOKEN_EXPIRY = "30d";

interface MobileTokenPayload {
  sub: string;
  email: string;
  fullName: string;
  primaryRole: string;
  roles: string[];
}

interface MobileSession {
  user: {
    id: string;
    email: string;
    name?: string | null;
    primaryRole: string;
    roles: string[];
  };
}

/**
 * Sign a JWT token for mobile clients.
 */
export async function signMobileToken(
  user: MobileTokenPayload
): Promise<string> {
  return new SignJWT({
    email: user.email,
    fullName: user.fullName,
    primaryRole: user.primaryRole,
    roles: user.roles,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.sub)
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(SECRET);
}

/**
 * Verify a mobile JWT token and return the payload.
 */
export async function verifyMobileToken(
  token: string
): Promise<MobileTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    if (!payload.sub) return null;
    return {
      sub: payload.sub,
      email: payload.email as string,
      fullName: (payload.fullName as string) || "",
      primaryRole: payload.primaryRole as string,
      roles: payload.roles as string[],
    };
  } catch {
    return null;
  }
}

/**
 * Authenticate a request from either web (NextAuth cookies) or mobile (Bearer token).
 * Returns a session-like object compatible with existing route handlers.
 */
export async function authFromRequest(
  request: NextRequest
): Promise<MobileSession | null> {
  // 1. Try NextAuth session (web clients with cookies)
  const session = await auth();
  if (session?.user?.id) {
    return session as MobileSession;
  }

  // 2. Try Bearer token (mobile clients)
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.slice(7);
  const payload = await verifyMobileToken(token);
  if (!payload) return null;

  return {
    user: {
      id: payload.sub,
      email: payload.email,
      name: payload.fullName,
      primaryRole: payload.primaryRole,
      roles: payload.roles,
    },
  };
}
