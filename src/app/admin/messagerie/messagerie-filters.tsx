"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function MessagerieFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentStatus = searchParams.get("status") || "all";
  const currentAssigned = searchParams.get("assigned") || "all";

  function updateParams(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    startTransition(() => {
      router.push(`/admin/messagerie?${params.toString()}`);
    });
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Select
        value={currentStatus}
        onValueChange={(v) => updateParams("status", v)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filtrer par statut" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les statuts</SelectItem>
          <SelectItem value="open">Ouvertes</SelectItem>
          <SelectItem value="closed">Fermées</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={currentAssigned}
        onValueChange={(v) => updateParams("assigned", v)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Assignation" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toutes</SelectItem>
          <SelectItem value="assigned">Assignées</SelectItem>
          <SelectItem value="unassigned">Non assignées</SelectItem>
        </SelectContent>
      </Select>
      {isPending && (
        <span className="text-sm text-muted-foreground self-center">
          Chargement…
        </span>
      )}
    </div>
  );
}
