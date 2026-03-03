"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface DiscussionsFiltersProps {
  currentStatus: string;
  currentSearch: string;
}

export function DiscussionsFilters({
  currentStatus,
  currentSearch,
}: DiscussionsFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "all") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/admin/discussions?${params.toString()}`);
    },
    [router, searchParams],
  );

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher par titre…"
          defaultValue={currentSearch}
          className="pl-9"
          onChange={(e) => {
            const timeout = setTimeout(() => {
              updateParams("q", e.target.value);
            }, 400);
            return () => clearTimeout(timeout);
          }}
        />
      </div>
      <Select
        defaultValue={currentStatus}
        onValueChange={(value) => updateParams("status", value)}
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Statut" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les statuts</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="flagged">Signalée</SelectItem>
          <SelectItem value="archived">Archivée</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
