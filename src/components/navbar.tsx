import { createClient } from "@/lib/supabase/server";
import { NavbarClient } from "./navbar-client";

export async function Navbar() {
  let user = null;

  try {
    const supabase = await createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    user = authUser;
  } catch {
    // Supabase pas configuré, on continue sans user
  }

  return (
    <NavbarClient
      user={
        user
          ? {
              email: user.email ?? "",
              fullName: user.user_metadata?.full_name ?? "",
            }
          : null
      }
    />
  );
}
