"use client";

import { useActionState } from "react";
import { createMessage } from "../actions";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

type MessageFormProps = {
  discussionId: string;
};

export function MessageForm({ discussionId }: MessageFormProps) {
  const [state, formAction] = useActionState(
    async (_: { error?: string } | null, formData: FormData) => {
      return createMessage(formData);
    },
    null as { error?: string } | null
  );

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="discussionId" value={discussionId} />
      {state?.error && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {state.error}
        </div>
      )}
      <textarea
        name="content"
        required
        rows={4}
        maxLength={5_000}
        placeholder="Partagez votre expérience, un conseil ou simplement un mot de soutien…"
        className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y min-h-[120px]"
        aria-label="Votre réponse"
      />
      <div className="flex justify-end">
        <Button type="submit" className="gap-2">
          <Send className="h-4 w-4" />
          Publier ma réponse
        </Button>
      </div>
    </form>
  );
}
