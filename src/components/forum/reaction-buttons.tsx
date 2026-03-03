"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, ThumbsUp, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export type ReactionType = "soutenir" | "je-comprends" | "merci";

const CONFIG: Record<
  ReactionType,
  { label: string; icon: typeof Heart }
> = {
  soutenir: { label: "Soutenir", icon: Heart },
  "je-comprends": { label: "Je comprends", icon: ThumbsUp },
  merci: { label: "Merci pour ton partage", icon: Sparkles },
};

type Props = {
  discussionId: string;
  size?: "xs" | "sm" | "default" | "lg";
  className?: string;
};

export function ReactionButtons({ discussionId, size = "xs", className }: Props) {
  const [active, setActive] = useState<Set<ReactionType>>(new Set());

  const toggle = (type: ReactionType) => {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
    // TODO: persister via API si modèle DiscussionReaction ajouté
  };

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {(Object.keys(CONFIG) as ReactionType[]).map((type) => (
        <ReactionButton
          key={type}
          type={type}
          isActive={active.has(type)}
          onToggle={() => toggle(type)}
          size={size}
        />
      ))}
    </div>
  );
}

function ReactionButton({
  type,
  isActive,
  onToggle,
  size = "xs",
}: {
  type: ReactionType;
  isActive: boolean;
  onToggle: () => void;
  size?: "xs" | "sm" | "default" | "lg";
}) {
  const { label, icon: Icon } = CONFIG[type];

  return (
    <Button
      type="button"
      variant="ghost"
      size={size}
      onClick={onToggle}
      className={cn(
        "text-muted-foreground hover:text-primary",
        isActive && "text-primary"
      )}
      aria-label={label}
      aria-pressed={isActive}
    >
      <Icon
        className={cn("h-3.5 w-3.5", size === "sm" && "h-4 w-4", isActive && type === "soutenir" && "fill-current")}
      />
      <span className="sr-only sm:not-sr-only sm:ml-1">{label}</span>
    </Button>
  );
}
