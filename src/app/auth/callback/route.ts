import { NextResponse } from "next/server";

// Legacy callback — no longer used with Auth.js credentials flow.
// Redirects to login.
export async function GET(request: Request) {
  const { origin } = new URL(request.url);
  return NextResponse.redirect(`${origin}/auth/login`);
}
