import { Badge } from "@/components/ui/badge";
import { ProfessionalLevel } from "@prisma/client";

const LABELS: Record<ProfessionalLevel, string> = {
  reference: "Reference",
  valide: "Valide",
  expert: "Expert",
};

export function ProfessionalLevelBadge({
  level,
}: {
  level: ProfessionalLevel | null;
}) {
  if (!level) return <Badge variant="outline">Non defini</Badge>;

  if (level === "expert") {
    return (
      <Badge className="border-purple-200 bg-purple-50 text-purple-700">
        {LABELS[level]}
      </Badge>
    );
  }
  if (level === "valide") {
    return (
      <Badge className="border-green-200 bg-green-50 text-green-700">
        {LABELS[level]}
      </Badge>
    );
  }
  return (
    <Badge className="border-blue-200 bg-blue-50 text-blue-700">
      {LABELS[level]}
    </Badge>
  );
}

