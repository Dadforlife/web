"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function PaymentsFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const status = searchParams.get("status") ?? "";
  const type = searchParams.get("type") ?? "";

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
        router.push(`/admin/paiements?${params.toString()}`);
      });
    },
    [router, searchParams, startTransition]
  );

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Select
        value={status || "all"}
        onValueChange={(v) => updateParams({ status: v === "all" ? "" : v })}
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Statut" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les statuts</SelectItem>
          <SelectItem value="success">Réussi</SelectItem>
          <SelectItem value="failed">Échoué</SelectItem>
          <SelectItem value="refunded">Remboursé</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={type || "all"}
        onValueChange={(v) => updateParams({ type: v === "all" ? "" : v })}
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les types</SelectItem>
          <SelectItem value="subscription">Abonnement</SelectItem>
          <SelectItem value="donation">Don</SelectItem>
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
