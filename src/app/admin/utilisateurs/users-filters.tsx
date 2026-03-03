"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

export function UsersFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const q = searchParams.get("q") ?? "";
  const role = searchParams.get("role") ?? "";
  const status = searchParams.get("status") ?? "";

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      }
      params.delete("page");
      startTransition(() => {
        router.push(`/admin/utilisateurs?${params.toString()}`);
      });
    },
    [router, searchParams, startTransition]
  );

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher par nom ou email…"
          defaultValue={q}
          className="pl-9"
          onChange={(e) => {
            const timer = setTimeout(() => {
              updateParams({ q: e.target.value });
            }, 400);
            return () => clearTimeout(timer);
          }}
        />
      </div>

      <Select
        value={role || "all"}
        onValueChange={(v) => updateParams({ role: v === "all" ? "" : v })}
      >
        <SelectTrigger className="w-full sm:w-[160px]">
          <SelectValue placeholder="Rôle" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les rôles</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="moderator">Modérateur</SelectItem>
          <SelectItem value="partner">Partenaire</SelectItem>
          <SelectItem value="volunteer">Bénévole</SelectItem>
          <SelectItem value="member">Membre</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={status || "all"}
        onValueChange={(v) => updateParams({ status: v === "all" ? "" : v })}
      >
        <SelectTrigger className="w-full sm:w-[160px]">
          <SelectValue placeholder="Statut" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les statuts</SelectItem>
          <SelectItem value="active">Actif</SelectItem>
          <SelectItem value="suspended">Suspendu</SelectItem>
          <SelectItem value="banned">Banni</SelectItem>
        </SelectContent>
      </Select>

      {isPending && (
        <div className="flex items-center">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}
    </div>
  );
}
