"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export function LogoutToast() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get("deconnexion") === "1") {
      toast.success("Vous avez été déconnecté avec succès. À bientôt !");

      // Nettoyer l'URL sans recharger la page
      const url = new URL(window.location.href);
      url.searchParams.delete("deconnexion");
      router.replace(url.pathname, { scroll: false });
    }
  }, [searchParams, router]);

  return null;
}
