"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Flag } from "lucide-react";

type ReportButtonProps = {
  discussionId?: string;
  messageId?: string;
  variant?: "ghost" | "outline";
  size?: "sm" | "xs" | "default";
  className?: string;
};

export function ReportButton({
  discussionId,
  messageId,
  variant = "ghost",
  size = "xs",
  className,
}: ReportButtonProps) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleReport = async () => {
    const reason = window.prompt(
      "Décrivez brièvement la raison de votre signalement (obligatoire) :"
    );
    if (reason === null || !reason.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reason: reason.trim(),
          ...(discussionId && { discussionId }),
          ...(messageId && { messageId }),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Erreur lors du signalement.");
        return;
      }
      setDone(true);
    } catch {
      alert("Erreur réseau. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <span className="text-xs text-muted-foreground">Signalement envoyé</span>
    );
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={className}
      onClick={handleReport}
      disabled={loading}
      aria-label="Signaler"
    >
      <Flag className="h-3.5 w-3.5" />
      <span className="sr-only sm:not-sr-only sm:ml-1">Signaler</span>
    </Button>
  );
}
