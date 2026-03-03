"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { togglePublish } from "./actions";

export function TogglePublishButton({
  id,
  isPublished,
}: {
  id: string;
  isPublished: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={isPending}
      title={isPublished ? "Dépublier" : "Publier"}
      onClick={() => {
        startTransition(() => togglePublish(id));
      }}
    >
      {isPublished ? (
        <EyeOff className="h-4 w-4" />
      ) : (
        <Eye className="h-4 w-4" />
      )}
    </Button>
  );
}
