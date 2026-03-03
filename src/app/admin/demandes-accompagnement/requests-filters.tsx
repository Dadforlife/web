"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useTransition } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

export function RequestsFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const currentStatus = searchParams.get("status") || "all";
  const currentQ = searchParams.get("q") || "";

  function updateParams(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    startTransition(() => {
      router.push(`/admin/demandes-accompagnement?${params.toString()}`);
    });
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Rechercher maman, père, ville…"
          defaultValue={currentQ}
          onChange={(e) => {
            const val = e.target.value.trim();
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => updateParams("q", val), 400);
          }}
          className="pl-9"
        />
      </div>
      <Select
        value={currentStatus}
        onValueChange={(v) => updateParams("status", v)}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Filtrer par statut" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les statuts</SelectItem>
          <SelectItem value="pending">En attente</SelectItem>
          <SelectItem value="reviewing">En cours d&apos;analyse</SelectItem>
          <SelectItem value="contacted">Père contacté</SelectItem>
          <SelectItem value="active">Accompagnement actif</SelectItem>
          <SelectItem value="completed">Terminé</SelectItem>
          <SelectItem value="rejected">Refusée</SelectItem>
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
