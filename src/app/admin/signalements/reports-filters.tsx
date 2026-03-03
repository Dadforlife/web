"use client";

import { useRouter, usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ReportsFiltersProps {
  currentStatus?: string;
}

export function ReportsFilters({ currentStatus }: ReportsFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();

  function handleStatusChange(value: string) {
    const params = new URLSearchParams();
    if (value !== "all") {
      params.set("status", value);
    }
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  return (
    <Select value={currentStatus ?? "all"} onValueChange={handleStatusChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Filtrer par statut" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Tous les statuts</SelectItem>
        <SelectItem value="pending">En attente</SelectItem>
        <SelectItem value="warning">Avertissement</SelectItem>
        <SelectItem value="suspended">Suspendu</SelectItem>
        <SelectItem value="dismissed">Rejeté</SelectItem>
      </SelectContent>
    </Select>
  );
}
