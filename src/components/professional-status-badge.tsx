import { Badge } from "@/components/ui/badge";
import { ProfessionalStatus } from "@prisma/client";

const LABELS: Record<ProfessionalStatus, string> = {
  en_attente: "En attente",
  en_verification: "En verification",
  valide: "Valide",
  refuse: "Refuse",
  suspendu: "Suspendu",
};

export function ProfessionalStatusBadge({
  status,
}: {
  status: ProfessionalStatus | null;
}) {
  if (!status) return <Badge variant="outline">Non defini</Badge>;
  if (status === "valide") {
    return (
      <Badge className="border-green-200 bg-green-50 text-green-700">
        {LABELS[status]}
      </Badge>
    );
  }
  if (status === "refuse" || status === "suspendu") {
    return (
      <Badge className="border-red-200 bg-red-50 text-red-700">
        {LABELS[status]}
      </Badge>
    );
  }
  if (status === "en_verification") {
    return (
      <Badge className="border-orange-200 bg-orange-50 text-orange-700">
        {LABELS[status]}
      </Badge>
    );
  }
  return (
    <Badge className="border-slate-200 bg-slate-50 text-slate-700">
      {LABELS[status]}
    </Badge>
  );
}

